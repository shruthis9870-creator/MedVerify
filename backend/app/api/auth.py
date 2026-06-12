from __future__ import annotations

from typing import Literal

from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel, Field

from app.services.auth_service import auth_service


SignupRole = Literal["doctor", "patient"]
LoginRole = Literal["doctor", "patient", "admin"]

router = APIRouter(prefix="/auth", tags=["auth"])


class SignupRequest(BaseModel):
    role: SignupRole
    name: str = Field(min_length=1)
    email: str = Field(min_length=3)
    password: str = Field(min_length=6)
    phone: str | None = None
    specialty: str | None = None


class LoginRequest(BaseModel):
    role: LoginRole
    email: str = Field(min_length=3)
    password: str


class OtpRequest(BaseModel):
    role: SignupRole
    phone: str


class OtpVerifyRequest(BaseModel):
    role: SignupRole
    phone: str
    otp: str


def _bad_request(exc: Exception) -> HTTPException:
    return HTTPException(
        status_code=400,
        detail=str(exc),
    )


@router.post("/signup")
def signup(payload: SignupRequest):
    try:
        return auth_service.signup(
            role=payload.role,
            name=payload.name,
            email=str(payload.email),
            password=payload.password,
            phone=payload.phone,
            specialty=payload.specialty,
        )
    except ValueError as exc:
        raise _bad_request(exc) from exc


@router.post("/login")
def login(payload: LoginRequest):
    try:
        return auth_service.login(
            role=payload.role,
            email=str(payload.email),
            password=payload.password,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=401,
            detail=str(exc),
        ) from exc


@router.post("/otp/request")
def request_otp(payload: OtpRequest):
    try:
        return auth_service.request_otp(
            role=payload.role,
            phone=payload.phone,
        )
    except ValueError as exc:
        raise _bad_request(exc) from exc


@router.post("/otp/verify")
def verify_otp(payload: OtpVerifyRequest):
    try:
        return auth_service.verify_otp(
            role=payload.role,
            phone=payload.phone,
            otp=payload.otp,
        )
    except ValueError as exc:
        raise HTTPException(
            status_code=401,
            detail=str(exc),
        ) from exc


@router.get("/me")
def me(authorization: str | None = Header(default=None)):
    scheme, _, token = (authorization or "").partition(" ")

    if scheme.lower() != "bearer" or not token:
        raise HTTPException(
            status_code=401,
            detail="Missing bearer token.",
        )

    user = auth_service.me(token)

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token.",
        )

    return {
        "user": user,
    }
