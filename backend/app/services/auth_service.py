from __future__ import annotations

import hashlib
import hmac
import json
import secrets
from datetime import datetime, timedelta, timezone
from typing import Any, Literal
from uuid import uuid4

from twilio.rest import Client

from app.core.config import settings
from app.services.redis_service import redis_client


UserRole = Literal["doctor", "patient", "admin"]


class AuthService:
    USERS_KEY = "auth:users"
    EMAIL_INDEX_KEY = "auth:index:email"
    PHONE_INDEX_KEY = "auth:index:phone"
    TOKEN_PREFIX = "auth:token:"
    OTP_PREFIX = "auth:otp:"
    TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60
    OTP_TTL_SECONDS = 5 * 60
    MAX_ADMIN_ACCOUNTS = 6

    def _now(self) -> datetime:
        return datetime.now(timezone.utc)

    def _normalize_email(self, email: str) -> str:
        return email.strip().lower()

    def _normalize_phone(self, phone: str | None) -> str:
        digits = "".join(char for char in str(phone or "") if char.isdigit())
        return f"+{digits}" if digits else ""

    def _patient_id(self, phone: str | None) -> str:
        normalized_phone = self._normalize_phone(phone)
        return f"whatsapp:{normalized_phone}" if normalized_phone else f"patient:{uuid4()}"

    def _hash_password(self, password: str, salt: str | None = None) -> str:
        salt = salt or secrets.token_hex(16)
        digest = hashlib.pbkdf2_hmac(
            "sha256",
            password.encode("utf-8"),
            salt.encode("utf-8"),
            100_000,
        ).hex()
        return f"{salt}${digest}"

    def _verify_password(self, password: str, password_hash: str) -> bool:
        try:
            salt, expected_digest = password_hash.split("$", 1)
        except ValueError:
            return False

        actual_digest = self._hash_password(password, salt).split("$", 1)[1]
        return hmac.compare_digest(actual_digest, expected_digest)

    def _loads(self, raw: str | bytes | None) -> dict[str, Any] | None:
        if not raw:
            return None

        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            return None

    def _save_user(self, user: dict[str, Any]) -> None:
        redis_client.hset(self.USERS_KEY, user["user_id"], json.dumps(user))
        redis_client.hset(self.EMAIL_INDEX_KEY, user["email"], user["user_id"])

        if user.get("phone"):
            redis_client.hset(self.PHONE_INDEX_KEY, user["phone"], user["user_id"])

    def _delete_user(self, user: dict[str, Any]) -> None:
        redis_client.hdel(self.USERS_KEY, user["user_id"])
        redis_client.hdel(self.EMAIL_INDEX_KEY, user["email"])

        if user.get("phone"):
            redis_client.hdel(self.PHONE_INDEX_KEY, user["phone"])

    def _configured_admin_emails(self) -> set[str]:
        emails = {
            self._normalize_email(email)
            for email in settings.admin_allowed_emails.replace(";", ",").split(",")
            if self._normalize_email(email)
        }

        if len(emails) > self.MAX_ADMIN_ACCOUNTS:
            raise ValueError(f"Admin access is limited to {self.MAX_ADMIN_ACCOUNTS} configured accounts.")

        return emails

    def _configured_admin_bootstrap_users(self) -> list[dict[str, str]]:
        raw = settings.admin_bootstrap_users.strip()

        if not raw:
            return []

        try:
            parsed = json.loads(raw)
        except json.JSONDecodeError as exc:
            raise ValueError("ADMIN_BOOTSTRAP_USERS must be valid JSON.") from exc

        if not isinstance(parsed, list):
            raise ValueError("ADMIN_BOOTSTRAP_USERS must be a JSON list.")

        if len(parsed) > self.MAX_ADMIN_ACCOUNTS:
            raise ValueError(f"Admin access is limited to {self.MAX_ADMIN_ACCOUNTS} configured accounts.")

        admins: list[dict[str, str]] = []

        for item in parsed:
            if not isinstance(item, dict):
                raise ValueError("Each admin bootstrap entry must be an object.")

            email = self._normalize_email(str(item.get("email", "")))
            password = str(item.get("password", ""))
            name = str(item.get("name") or email)

            if not email or not password:
                raise ValueError("Each admin bootstrap entry requires email and password.")

            admins.append(
                {
                    "email": email,
                    "password": password,
                    "name": name.strip() or email,
                }
            )

        return admins

    def _ensure_configured_admins(self) -> None:
        allowed_emails = self._configured_admin_emails()

        for admin in self._configured_admin_bootstrap_users():
            if admin["email"] not in allowed_emails:
                raise ValueError("Bootstrap admin email is not in ADMIN_ALLOWED_EMAILS.")

            user_id = redis_client.hget(self.EMAIL_INDEX_KEY, admin["email"])
            existing = self._get_user(user_id) if user_id else None

            if existing and existing.get("role") != "admin":
                raise ValueError("Configured admin email already belongs to a non-admin account.")

            user = {
                **(existing or {}),
                "user_id": existing.get("user_id") if existing else f"admin:{uuid4()}",
                "role": "admin",
                "name": admin["name"],
                "email": admin["email"],
                "phone": None,
                "password_hash": self._hash_password(admin["password"]),
                "patient_id": None,
                "specialty": "Administration",
                "provisioned_by": "env",
                "verified": True,
                "created_at": existing.get("created_at") if existing else self._now().isoformat(),
            }

            self._save_user(user)

    def _get_user(self, user_id: str) -> dict[str, Any] | None:
        return self._loads(redis_client.hget(self.USERS_KEY, user_id))

    def _public_user(self, user: dict[str, Any]) -> dict[str, Any]:
        return {
            "userId": user["user_id"],
            "role": user["role"],
            "name": user["name"],
            "email": user["email"],
            "phone": user.get("phone"),
            "patientId": user.get("patient_id"),
            "specialty": user.get("specialty"),
            "verified": user.get("verified", False),
            "createdAt": user.get("created_at"),
        }

    def _create_session(self, user_id: str) -> str:
        token = secrets.token_urlsafe(32)
        redis_client.set(
            f"{self.TOKEN_PREFIX}{token}",
            user_id,
            ex=self.TOKEN_TTL_SECONDS,
        )
        return token

    def signup(
        self,
        role: UserRole,
        name: str,
        email: str,
        password: str,
        phone: str | None = None,
        specialty: str | None = None,
    ) -> dict[str, Any]:
        if role == "admin":
            raise ValueError("Admin accounts must be provisioned by configuration.")

        normalized_email = self._normalize_email(email)
        normalized_phone = self._normalize_phone(phone)

        if not name.strip() or not normalized_email or not password:
            raise ValueError("Name, email, and password are required.")

        if not normalized_phone:
            raise ValueError("Phone number is required for OTP verification.")

        if redis_client.hget(self.EMAIL_INDEX_KEY, normalized_email):
            raise ValueError("An account already exists for this email.")

        if normalized_phone and redis_client.hget(self.PHONE_INDEX_KEY, normalized_phone):
            raise ValueError("An account already exists for this phone number.")

        user_id = str(uuid4())
        user = {
            "user_id": user_id,
            "role": role,
            "name": name.strip(),
            "email": normalized_email,
            "phone": normalized_phone,
            "password_hash": self._hash_password(password),
            "patient_id": self._patient_id(normalized_phone) if role == "patient" else None,
            "specialty": specialty or ("General Physician" if role == "doctor" else None),
            "verified": False,
            "created_at": self._now().isoformat(),
        }

        self._save_user(user)

        try:
            otp_status = self.request_otp(role, normalized_phone)
        except Exception:
            self._delete_user(user)
            raise

        return {
            "user": self._public_user(user),
            "verification_required": True,
            "otp": otp_status,
        }

    def login(self, role: UserRole, email: str, password: str) -> dict[str, Any]:
        normalized_email = self._normalize_email(email)

        if role == "admin":
            self._ensure_configured_admins()

            if normalized_email not in self._configured_admin_emails():
                raise ValueError("Invalid email or password for this portal.")

        user_id = redis_client.hget(self.EMAIL_INDEX_KEY, normalized_email)
        user = self._get_user(user_id) if user_id else None

        if not user or user.get("role") != role:
            raise ValueError("Invalid email or password for this portal.")

        if role == "admin" and user.get("provisioned_by") != "env":
            raise ValueError("Invalid email or password for this portal.")

        if not self._verify_password(password, user.get("password_hash", "")):
            raise ValueError("Invalid email or password for this portal.")

        if not user.get("verified"):
            raise ValueError("Account is not verified. Please login with OTP to verify your phone number.")

        return {
            "token": self._create_session(user["user_id"]),
            "user": self._public_user(user),
        }

    def _send_twilio_otp(self, phone: str, otp: str) -> bool:
        if not (settings.twilio_account_sid and settings.twilio_auth_token):
            return False

        from_number = settings.twilio_phone_number
        to_number = phone

        if not from_number and settings.twilio_whatsapp_from:
            from_number = settings.twilio_whatsapp_from
            to_number = f"whatsapp:{phone}"

        if not from_number:
            return False

        client = Client(settings.twilio_account_sid, settings.twilio_auth_token)

        try:
            client.messages.create(
                body=f"Your MedVerify OTP is {otp}. It expires in 5 minutes.",
                from_=from_number,
                to=to_number,
            )
            return True
        except Exception as exc:
            print(f"TWILIO OTP SEND FAILED: {exc}")
            return False

    def request_otp(self, role: UserRole, phone: str) -> dict[str, Any]:
        normalized_phone = self._normalize_phone(phone)

        if not normalized_phone:
            raise ValueError("Phone number is required.")

        user_id = redis_client.hget(self.PHONE_INDEX_KEY, normalized_phone)
        user = self._get_user(user_id) if user_id else None

        if not user or user.get("role") != role:
            raise ValueError("No registered user found for this phone number and role.")

        otp = f"{secrets.randbelow(1_000_000):06d}"
        payload = {
            "otp": otp,
            "role": role,
            "phone": normalized_phone,
            "user_id": user["user_id"],
            "expires_at": (self._now() + timedelta(seconds=self.OTP_TTL_SECONDS)).isoformat(),
        }

        redis_client.set(
            f"{self.OTP_PREFIX}{role}:{normalized_phone}",
            json.dumps(payload),
            ex=self.OTP_TTL_SECONDS,
        )

        sent = self._send_twilio_otp(normalized_phone, otp)

        if not sent:
            if settings.allow_dev_otp:
                print(f"DEV OTP for {role} {normalized_phone}: {otp}")
                return {
                    "sent": False,
                    "delivery": "development",
                    "dev_otp": otp,
                    "message": "Twilio delivery is disabled. Use this development OTP for local testing.",
                }

            redis_client.delete(f"{self.OTP_PREFIX}{role}:{normalized_phone}")
            raise ValueError("Unable to deliver OTP. Please check SMS/WhatsApp delivery configuration and try again.")

        return {
            "sent": True,
            "delivery": "twilio",
        }

    def verify_otp(self, role: UserRole, phone: str, otp: str) -> dict[str, Any]:
        normalized_phone = self._normalize_phone(phone)
        raw = redis_client.get(f"{self.OTP_PREFIX}{role}:{normalized_phone}")
        payload = self._loads(raw)

        if not payload:
            raise ValueError("OTP expired or was not requested.")

        expires_at = datetime.fromisoformat(payload["expires_at"])

        if self._now() > expires_at:
            raise ValueError("OTP expired. Please request a new OTP.")

        if payload.get("otp") != otp.strip():
            raise ValueError("Invalid OTP.")

        user = self._get_user(payload["user_id"])

        if not user or user.get("role") != role:
            raise ValueError("No registered user found for this OTP.")

        user["verified"] = True
        self._save_user(user)
        redis_client.delete(f"{self.OTP_PREFIX}{role}:{normalized_phone}")

        return {
            "token": self._create_session(user["user_id"]),
            "user": self._public_user(user),
        }

    def me(self, token: str) -> dict[str, Any] | None:
        user_id = redis_client.get(f"{self.TOKEN_PREFIX}{token}")
        user = self._get_user(user_id) if user_id else None

        if user and user.get("role") == "admin":
            try:
                allowed_emails = self._configured_admin_emails()
            except ValueError:
                return None

            if user.get("email") not in allowed_emails or user.get("provisioned_by") != "env":
                return None

        return self._public_user(user) if user else None

    def list_doctors(self) -> list[dict[str, Any]]:
        doctors: list[dict[str, Any]] = []

        for raw in redis_client.hvals(self.USERS_KEY):
            user = self._loads(raw)

            if not user or user.get("role") != "doctor":
                continue

            doctors.append(self._public_user(user))

        return sorted(doctors, key=lambda doctor: doctor.get("name") or "")

    def list_patients(self) -> list[dict[str, Any]]:
        patients: list[dict[str, Any]] = []

        for raw in redis_client.hvals(self.USERS_KEY):
            user = self._loads(raw)

            if not user or user.get("role") != "patient":
                continue

            patients.append(self._public_user(user))

        return sorted(patients, key=lambda patient: patient.get("name") or "")


auth_service = AuthService()
