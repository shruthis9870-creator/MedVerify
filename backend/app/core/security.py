from __future__ import annotations

from collections.abc import Callable
from typing import Any

from fastapi import Header, HTTPException, status

from app.services.auth_service import auth_service


def get_current_user(authorization: str | None = Header(default=None)) -> dict[str, Any]:
    scheme, _, token = (authorization or "").partition(" ")

    if scheme.lower() != "bearer" or not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing bearer token.",
        )

    user = auth_service.me(token)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token.",
        )

    return user


def require_roles(*allowed_roles: str) -> Callable[[dict[str, Any]], dict[str, Any]]:
    def dependency(
        authorization: str | None = Header(default=None),
    ) -> dict[str, Any]:
        user = get_current_user(authorization)

        if user.get("role") not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this resource.",
            )

        return user

    return dependency
