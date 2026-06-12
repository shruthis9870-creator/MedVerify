from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from typing import Any

from app.services.alert_service import alert_service
from app.services.auth_service import auth_service
from app.services.redis_service import redis_client


SPECIALTY_RULES: list[dict[str, Any]] = [
    {
        "specialty": "Cardiology",
        "keywords": ["chest", "heart", "cardiac", "bp", "blood pressure", "palpitation"],
        "red_flags": ["chest pain", "shortness of breath", "radiating pain"],
    },
    {
        "specialty": "Neurology",
        "keywords": ["head", "seizure", "stroke", "faint", "confusion", "dizzy", "migraine"],
        "red_flags": ["seizure", "loss of consciousness", "weakness on one side"],
    },
    {
        "specialty": "Pulmonology",
        "keywords": ["cough", "breath", "asthma", "wheezing", "oxygen", "lung"],
        "red_flags": ["difficulty breathing", "low oxygen", "blue lips"],
    },
    {
        "specialty": "Gastroenterology",
        "keywords": ["stomach", "abdomen", "vomit", "nausea", "diarrhea", "gastric"],
        "red_flags": ["blood in vomit", "severe abdominal pain"],
    },
    {
        "specialty": "Orthopedics",
        "keywords": ["fracture", "joint", "bone", "back pain", "injury", "swelling"],
        "red_flags": ["open fracture", "loss of movement"],
    },
    {
        "specialty": "Dermatology",
        "keywords": ["rash", "skin", "itch", "allergy", "burn", "hives"],
        "red_flags": ["spreading rash", "facial swelling"],
    },
    {
        "specialty": "Psychiatry",
        "keywords": ["anxiety", "panic", "depression", "sleep", "stress", "self harm"],
        "red_flags": ["self harm", "suicidal", "violent thoughts"],
    },
    {
        "specialty": "General Medicine",
        "keywords": ["fever", "infection", "pain", "fatigue", "weakness", "cold"],
        "red_flags": ["high fever", "dehydration"],
    },
]

SPECIALTY_ALIASES = {
    "cardiologist": "Cardiology",
    "cardiology": "Cardiology",
    "neurologist": "Neurology",
    "neurology": "Neurology",
    "pulmonologist": "Pulmonology",
    "pulmonology": "Pulmonology",
    "gastroenterologist": "Gastroenterology",
    "gastroenterology": "Gastroenterology",
    "orthopedic": "Orthopedics",
    "orthopedics": "Orthopedics",
    "dermatologist": "Dermatology",
    "dermatology": "Dermatology",
    "psychiatrist": "Psychiatry",
    "psychiatry": "Psychiatry",
    "emergency": "Emergency Medicine",
    "emergency medicine": "Emergency Medicine",
    "general physician": "General Medicine",
    "general medicine": "General Medicine",
}

DEFAULT_DOCTOR_CAPACITY = 8


class RoutingService:
    REDIS_KEY = "routing_assignments"

    def _loads(self, raw: str | bytes | None) -> dict[str, Any] | None:
        if not raw:
            return None

        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            return None

    def _save_assignment(self, assignment: dict[str, Any]) -> None:
        redis_client.hset(
            self.REDIS_KEY,
            assignment["assignment_id"],
            json.dumps(assignment),
        )

    def _saved_assignments(self) -> dict[str, dict[str, Any]]:
        saved: dict[str, dict[str, Any]] = {}

        for raw in redis_client.hvals(self.REDIS_KEY):
            assignment = self._loads(raw)

            if assignment and assignment.get("assignment_id"):
                saved[assignment["assignment_id"]] = assignment

        return saved

    def _canonical_specialty(self, value: str | None) -> str:
        normalized = str(value or "General Medicine").strip().lower()
        return SPECIALTY_ALIASES.get(normalized, str(value or "General Medicine").strip())

    def _registered_doctors(self) -> list[dict[str, Any]]:
        doctors: list[dict[str, Any]] = []

        for doctor in auth_service.list_doctors():
            specialty = self._canonical_specialty(doctor.get("specialty"))
            doctors.append(
                {
                    "id": doctor["userId"],
                    "name": doctor["name"],
                    "email": doctor.get("email"),
                    "phone": doctor.get("phone"),
                    "specialty": specialty,
                    "profile_specialty": doctor.get("specialty"),
                    "unit": specialty,
                    "shift": "Registered",
                    "capacity": DEFAULT_DOCTOR_CAPACITY,
                    "status": "Available" if doctor.get("verified") else "Pending Verification",
                }
            )

        return doctors

    def _alert_patient_id(self, alert: dict[str, Any]) -> str:
        return str(alert.get("patient_id") or alert.get("user_id") or "unknown")

    def _patient_name(self, patient_id: str, payload: dict[str, Any]) -> str:
        if payload.get("patient_name"):
            return str(payload["patient_name"])

        if payload.get("name"):
            return str(payload["name"])

        digits = re.sub(r"\D", "", patient_id)
        return f"Patient {digits[-4:]}" if digits else patient_id

    def _group_alerts_by_patient(self, alerts: list[dict[str, Any]]) -> list[dict[str, Any]]:
        patients: dict[str, dict[str, Any]] = {}

        for alert in alerts:
            patient_id = self._alert_patient_id(alert)
            payload = alert.get("payload", {}) or {}
            patient = patients.setdefault(
                patient_id,
                {
                    "patient_id": patient_id,
                    "patient_name": self._patient_name(patient_id, payload),
                    "phone": str(patient_id).replace("whatsapp:", ""),
                    "symptoms": [],
                    "reasons": [],
                    "severities": [],
                    "reports": [],
                    "alert_ids": [],
                    "created_at": alert.get("created_at"),
                    "recommended_actions": [],
                },
            )

            symptom = payload.get("main_symptom") or payload.get("symptom") or payload.get("report_raw")
            if symptom:
                patient["symptoms"].append(str(symptom))

            reason = alert.get("reason") or payload.get("reason")
            if reason:
                patient["reasons"].append(str(reason))

            if alert.get("severity"):
                patient["severities"].append(str(alert["severity"]).upper())

            action = payload.get("recommended_action") or payload.get("action")
            if action:
                patient["recommended_actions"].append(str(action))

            reports = payload.get("reports") or []
            if isinstance(reports, list):
                patient["reports"].extend(reports)

            patient["alert_ids"].append(alert.get("alert_id") or alert.get("id"))
            patient["created_at"] = max(
                [value for value in [patient.get("created_at"), alert.get("created_at")] if value],
                default=patient.get("created_at"),
            )

        return list(patients.values())

    def _match_specialty(self, clinical_text: str, severities: list[str]) -> dict[str, Any]:
        normalized = clinical_text.lower()
        matches: list[dict[str, Any]] = []

        for rule in SPECIALTY_RULES:
            keyword_hits = [keyword for keyword in rule["keywords"] if keyword in normalized]
            red_flag_hits = [flag for flag in rule["red_flags"] if flag in normalized]

            if keyword_hits or red_flag_hits:
                matches.append(
                    {
                        "specialty": rule["specialty"],
                        "keyword_hits": keyword_hits,
                        "red_flag_hits": red_flag_hits,
                        "score": len(keyword_hits) + (2 * len(red_flag_hits)),
                    }
                )

        if not matches:
            matches.append(
                {
                    "specialty": "General Medicine",
                    "keyword_hits": [],
                    "red_flag_hits": [],
                    "score": 1,
                }
            )

        matched = sorted(matches, key=lambda item: item["score"], reverse=True)[0]

        if {"HIGH", "CRITICAL"} & set(severities) and matched["red_flag_hits"]:
            matched["specialty"] = "Emergency Medicine"

        return matched

    def _priority(self, severities: list[str], red_flag_hits: list[str]) -> str:
        normalized = set(severities)

        if "CRITICAL" in normalized or "HIGH" in normalized or red_flag_hits:
            return "Critical"

        if "MEDIUM" in normalized or "MODERATE" in normalized:
            return "Urgent"

        return "Routine"

    def _choose_doctor(
        self,
        specialty: str,
        doctors: list[dict[str, Any]],
        doctor_load: dict[str, int],
    ) -> dict[str, Any] | None:
        if not doctors:
            return None

        requested_specialty = self._canonical_specialty(specialty)
        candidates = [
            doctor
            for doctor in doctors
            if self._canonical_specialty(doctor["specialty"]) == requested_specialty
        ]

        if not candidates:
            candidates = [
                doctor
                for doctor in doctors
                if self._canonical_specialty(doctor["specialty"]) == "General Medicine"
            ]

        if not candidates:
            candidates = doctors

        return sorted(
            candidates,
            key=lambda doctor: (
                doctor_load.get(doctor["id"], 0) / doctor["capacity"],
                doctor_load.get(doctor["id"], 0),
                doctor["name"],
            ),
        )[0]

    def list_assignments(self) -> dict[str, Any]:
        alerts = alert_service.list_active_alerts()
        patients = self._group_alerts_by_patient(alerts)
        saved = self._saved_assignments()
        doctors = self._registered_doctors()
        doctor_load: dict[str, int] = {doctor["id"]: 0 for doctor in doctors}
        assignments: list[dict[str, Any]] = []

        for patient in patients:
            assignment_id = f"route-{patient['patient_id']}"
            saved_assignment = saved.get(assignment_id, {})
            clinical_text = " ".join(
                patient["symptoms"] + patient["reasons"] + patient["recommended_actions"]
            )
            match = self._match_specialty(clinical_text, patient["severities"])
            doctor = self._choose_doctor(match["specialty"], doctors, doctor_load)

            if doctor:
                doctor_load[doctor["id"]] += 1

            priority = self._priority(patient["severities"], match["red_flag_hits"])
            confidence = min(98, 68 + (match["score"] * 8) + (8 if priority == "Critical" else 0))
            symptoms = list(dict.fromkeys(patient["symptoms"] or patient["reasons"]))

            assignment = {
                "assignment_id": assignment_id,
                "patient_id": patient["patient_id"],
                "patient_name": patient["patient_name"],
                "phone": patient["phone"],
                "symptoms": symptoms,
                "severity": priority,
                "specialty": match["specialty"],
                "doctor_id": doctor["id"] if doctor else None,
                "doctor_name": doctor["name"] if doctor else "No registered doctor available",
                "doctor_unit": doctor["unit"] if doctor else match["specialty"],
                "doctor_shift": doctor["shift"] if doctor else "Unassigned",
                "confidence": confidence,
                "status": saved_assignment.get("status", "Assigned" if doctor else "Unassigned"),
                "reason": self._reason(match, priority),
                "recommended_action": (
                    patient["recommended_actions"][0]
                    if patient["recommended_actions"]
                    else "Review triage details and contact the patient if symptoms are escalating."
                ),
                "alert_ids": [alert_id for alert_id in patient["alert_ids"] if alert_id],
                "reports": patient["reports"],
                "created_at": patient["created_at"],
                "updated_at": datetime.now(timezone.utc).isoformat(),
            }
            assignments.append(assignment)
            self._save_assignment(assignment)

        assignments.sort(
            key=lambda item: (
                {"Critical": 0, "Urgent": 1, "Routine": 2}.get(item["severity"], 3),
                item.get("created_at") or "",
            )
        )

        return {
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "assignments": assignments,
            "doctors": self.doctor_capacity(assignments, doctors),
            "summary": self.summary(assignments),
            "rules": SPECIALTY_RULES,
        }

    def _reason(self, match: dict[str, Any], priority: str) -> str:
        evidence = match["red_flag_hits"] or match["keyword_hits"]

        if evidence:
            return (
                f"{priority} route matched {match['specialty']} from "
                f"{', '.join(evidence[:3])}."
            )

        return f"{priority} route assigned to {match['specialty']} for primary clinical triage."

    def doctor_capacity(
        self,
        assignments: list[dict[str, Any]],
        doctors: list[dict[str, Any]],
    ) -> list[dict[str, Any]]:
        load: dict[str, int] = {doctor["id"]: 0 for doctor in doctors}

        for assignment in assignments:
            if assignment.get("doctor_id") and assignment.get("status") != "Closed":
                load[assignment["doctor_id"]] = load.get(assignment["doctor_id"], 0) + 1

        return [
            {
                **doctor,
                "assigned": load.get(doctor["id"], 0),
                "available_slots": max(doctor["capacity"] - load.get(doctor["id"], 0), 0),
            }
            for doctor in doctors
        ]

    def summary(self, assignments: list[dict[str, Any]]) -> dict[str, Any]:
        routed = len(assignments)
        critical = len([item for item in assignments if item["severity"] == "Critical"])
        urgent = len([item for item in assignments if item["severity"] == "Urgent"])
        specialties = sorted({item["specialty"] for item in assignments})
        avg_confidence = round(
            sum(item["confidence"] for item in assignments) / routed,
            1,
        ) if routed else 0

        return {
            "routed_patients": routed,
            "critical_routes": critical,
            "urgent_routes": urgent,
            "specialties": specialties,
            "avg_confidence": avg_confidence,
        }

    def update_status(self, assignment_id: str, status: str) -> dict[str, Any] | None:
        raw = redis_client.hget(self.REDIS_KEY, assignment_id)
        assignment = self._loads(raw)

        if assignment is None:
            return None

        assignment["status"] = status
        assignment["updated_at"] = datetime.now(timezone.utc).isoformat()
        self._save_assignment(assignment)

        return assignment


routing_service = RoutingService()
