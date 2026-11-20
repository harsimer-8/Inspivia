from __future__ import annotations

import logging
import uuid
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone

import jwt
from fastapi import HTTPException, Request, status

from app.config import Settings

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class UserPrincipal:
    user_id: uuid.UUID
    email: str
    role: str


def generate_access_token(
    settings: Settings,
    user_id: uuid.UUID,
    email: str,
    role: str,
    *,
    now: datetime | None = None,
) -> str:
    issued = now or datetime.now(timezone.utc)
    return jwt.encode(
        {
            "sub": str(user_id),
            "email": email,
            "role": role,
            "jti": str(uuid.uuid4()),
            "iat": issued,
            "exp": issued + timedelta(seconds=settings.jwt_access_ttl_seconds),
        },
        settings.jwt_secret,
        algorithm="HS256",
    )


def parse_access_token(settings: Settings, token: str) -> UserPrincipal:
    payload = jwt.decode(token, settings.jwt_secret, algorithms=["HS256"])
    return UserPrincipal(
        user_id=uuid.UUID(payload["sub"]),
        email=str(payload["email"]),
        role=str(payload["role"]),
    )


def bearer_principal(request: Request) -> UserPrincipal:
    principal = getattr(request.state, "principal", None)
    if principal is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
    return principal


def require_role(principal: UserPrincipal, role: str) -> None:
    if principal.role != role:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access is denied")


def authenticate_header(settings: Settings, authorization: str | None) -> UserPrincipal | None:
    if not authorization:
        return None
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        return None
    try:
        return parse_access_token(settings, token)
    except (jwt.PyJWTError, ValueError, KeyError, TypeError):
        logger.info("Rejected invalid bearer token")
        return None
