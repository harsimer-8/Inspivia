from __future__ import annotations

import base64
import hashlib
import hmac
import logging
import secrets
import uuid
from datetime import datetime, timedelta, timezone
from typing import Annotated, Any

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from pydantic import AliasChoices, BaseModel, ConfigDict, Field, StringConstraints, field_validator
from sqlalchemy import Engine, func, insert, select, update
from sqlalchemy.exc import IntegrityError

from app.config import Settings
from app.email_service import EmailService
from app.security import UserPrincipal, bearer_principal, generate_access_token, require_role

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1")
_PASSWORD_ITERATIONS = 600_000
_VERIFICATION_TTL = timedelta(hours=24)
_PASSWORD_RESET_TTL = timedelta(hours=1)
_EMAIL = StringConstraints(strip_whitespace=True, min_length=3, max_length=254, pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
_PASSWORD = StringConstraints(min_length=8, max_length=128)


class RegisterStudentInput(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    full_name: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=120)] = Field(alias="fullName")
    email: Annotated[str, _EMAIL]
    password: Annotated[str, _PASSWORD]
    college: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=200)]
    degree: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=120)]
    current_year: int = Field(alias="currentYear", validation_alias=AliasChoices("currentYear", "year"), ge=1, le=8)


class EmailInput(BaseModel):
    email: Annotated[str, _EMAIL]

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        return value.strip().lower()


class TokenInput(BaseModel):
    token: Annotated[str, StringConstraints(min_length=20, max_length=256)]


class ResetPasswordInput(TokenInput):
    new_password: Annotated[str, _PASSWORD] = Field(alias="newPassword")


class LoginInput(EmailInput):
    password: Annotated[str, StringConstraints(min_length=1, max_length=128)]


class RefreshInput(BaseModel):
    refresh_token: Annotated[str, StringConstraints(min_length=32, max_length=256)] = Field(alias="refreshToken")


class StudentProfileInput(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    degree: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=120)]
    current_year: int = Field(alias="currentYear", validation_alias=AliasChoices("currentYear", "year"), ge=1, le=8)
    selected_domain: Annotated[str | None, StringConstraints(strip_whitespace=True, min_length=1, max_length=80)] = Field(
        default=None, alias="selectedDomain"
    )


def _password_hash(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, _PASSWORD_ITERATIONS)
    salt_text = base64.urlsafe_b64encode(salt).decode("ascii").rstrip("=")
    digest_text = base64.urlsafe_b64encode(digest).decode("ascii").rstrip("=")
    return f"pbkdf2_sha256${_PASSWORD_ITERATIONS}${salt_text}${digest_text}"


def _password_matches(password: str, stored: str) -> bool:
    try:
        algorithm, rounds, salt_hex, digest_hex = stored.split("$", 3)
        if algorithm != "pbkdf2_sha256":
            return False
        salt = base64.urlsafe_b64decode(salt_hex + "=" * (-len(salt_hex) % 4))
        digest = base64.urlsafe_b64decode(digest_hex + "=" * (-len(digest_hex) % 4))
        candidate = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, int(rounds))
        return hmac.compare_digest(candidate, digest)
    except (ValueError, TypeError):
        return False


def _hash_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def _aware(value: datetime) -> datetime:
    return value.replace(tzinfo=timezone.utc) if value.tzinfo is None else value


class AuthService:
    def __init__(self, engine: Engine, metadata: Any, settings: Settings, mail: EmailService):
        self.engine = engine
        self.settings = settings
        self.mail = mail
        self.users = metadata.tables["public.users"] if "public.users" in metadata.tables else metadata.tables["users"]
        self.profiles = metadata.tables["public.student_profiles"] if "public.student_profiles" in metadata.tables else metadata.tables["student_profiles"]
        self.refresh_tokens = metadata.tables["public.refresh_tokens"] if "public.refresh_tokens" in metadata.tables else metadata.tables["refresh_tokens"]
        self.verification_tokens = metadata.tables["public.email_verification_tokens"] if "public.email_verification_tokens" in metadata.tables else metadata.tables["email_verification_tokens"]
        self.reset_tokens = metadata.tables["public.password_reset_tokens"] if "public.password_reset_tokens" in metadata.tables else metadata.tables["password_reset_tokens"]
        self.domains = metadata.tables.get("public.domains", metadata.tables.get("domains"))

    def register_student(self, payload: RegisterStudentInput) -> None:
        email = payload.email.strip().lower()
        user_id, raw_token = uuid.uuid4(), secrets.token_urlsafe(32)
        now = datetime.now(timezone.utc)
        try:
            with self.engine.begin() as connection:
                exists = connection.execute(
                    select(self.users.c.id).where(func.lower(self.users.c.email) == email)
                ).first()
                if exists:
                    raise HTTPException(status_code=409, detail={"code": "EMAIL_ALREADY_EXISTS", "message": "An account with this email already exists"})
                connection.execute(
                    insert(self.users).values(
                        id=user_id, email=email, password_hash=_password_hash(payload.password),
                        full_name=payload.full_name, role="STUDENT",
                        status="PENDING_VERIFICATION", created_at=now, updated_at=now,
                    )
                )
                connection.execute(
                    insert(self.profiles).values(
                        user_id=user_id, college=payload.college, degree=payload.degree,
                        current_year=payload.current_year, created_at=now, updated_at=now,
                    )
                )
                connection.execute(
                    insert(self.verification_tokens).values(
                        id=uuid.uuid4(), user_id=user_id, token_hash=_hash_token(raw_token),
                        expires_at=now + _VERIFICATION_TTL, created_at=now,
                    )
                )
        except IntegrityError:
            raise HTTPException(status_code=409, detail={"code": "EMAIL_ALREADY_EXISTS", "message": "An account with this email already exists"}) from None
        self.mail.send_verification_email(email, raw_token)

    def login(self, payload: LoginInput) -> dict[str, str]:
        with self.engine.connect() as connection:
            user = connection.execute(
                select(self.users).where(func.lower(self.users.c.email) == payload.email)
            ).mappings().one_or_none()
        if user is None or not _password_matches(payload.password, user["password_hash"]):
            raise HTTPException(status_code=401, detail={"code": "INVALID_CREDENTIALS", "message": "Email or password is incorrect"})
        if user["status"] != "ACTIVE" or user["email_verified_at"] is None:
            raise HTTPException(status_code=403, detail={"code": "EMAIL_NOT_VERIFIED", "message": "Verify your email before signing in"})
        now = datetime.now(timezone.utc)
        refresh_token = secrets.token_urlsafe(48)
        family_id, token_id = uuid.uuid4(), uuid.uuid4()
        with self.engine.begin() as connection:
            connection.execute(
                update(self.users).where(self.users.c.id == user["id"]).values(last_login_at=now, updated_at=now)
            )
            connection.execute(
                insert(self.refresh_tokens).values(
                    id=token_id, user_id=user["id"], token_hash=_hash_token(refresh_token),
                    family_id=family_id, expires_at=now + timedelta(seconds=self.settings.jwt_refresh_ttl_seconds),
                    created_at=now,
                )
            )
        return self._token_response(user, refresh_token)

    def refresh(self, raw_token: str) -> dict[str, str]:
        now = datetime.now(timezone.utc)
        token_hash = _hash_token(raw_token)
        replayed = False
        response: dict[str, str] | None = None
        with self.engine.begin() as connection:
            token = connection.execute(
                select(self.refresh_tokens).where(self.refresh_tokens.c.token_hash == token_hash).with_for_update()
            ).mappings().one_or_none()
            if token is None:
                raise HTTPException(status_code=401, detail={"code": "INVALID_REFRESH_TOKEN", "message": "Refresh token is invalid or expired"})
            if token["revoked_at"] is not None or token["replaced_by"] is not None:
                connection.execute(
                    update(self.refresh_tokens).where(
                        self.refresh_tokens.c.family_id == token["family_id"],
                        self.refresh_tokens.c.revoked_at.is_(None),
                    ).values(revoked_at=now)
                )
                replayed = True
            elif _aware(token["expires_at"]) <= now:
                raise HTTPException(status_code=401, detail={"code": "INVALID_REFRESH_TOKEN", "message": "Refresh token is invalid or expired"})
            else:
                user = connection.execute(
                    select(self.users).where(self.users.c.id == token["user_id"]).with_for_update()
                ).mappings().one_or_none()
                if user is None or user["status"] != "ACTIVE" or user["email_verified_at"] is None:
                    connection.execute(
                        update(self.refresh_tokens).where(
                            self.refresh_tokens.c.family_id == token["family_id"],
                            self.refresh_tokens.c.revoked_at.is_(None),
                        ).values(revoked_at=now)
                    )
                    replayed = True
                else:
                    replacement, replacement_id = secrets.token_urlsafe(48), uuid.uuid4()
                    connection.execute(
                        insert(self.refresh_tokens).values(
                            id=replacement_id, user_id=token["user_id"], token_hash=_hash_token(replacement),
                            family_id=token["family_id"],
                            expires_at=now + timedelta(seconds=self.settings.jwt_refresh_ttl_seconds),
                            created_at=now,
                        )
                    )
                    connection.execute(
                        update(self.refresh_tokens).where(self.refresh_tokens.c.id == token["id"]).values(
                            replaced_by=replacement_id, revoked_at=now
                        )
                    )
                    response = self._token_response(user, replacement)
        if replayed:
            raise HTTPException(status_code=401, detail={"code": "REFRESH_TOKEN_REUSED", "message": "Refresh token reuse detected; sign in again"})
        if response is None:
            raise HTTPException(status_code=401, detail={"code": "INVALID_REFRESH_TOKEN", "message": "Refresh token is invalid or expired"})
        return response

    def logout(self, raw_token: str) -> None:
        now = datetime.now(timezone.utc)
        with self.engine.begin() as connection:
            token = connection.execute(
                select(self.refresh_tokens.c.family_id).where(
                    self.refresh_tokens.c.token_hash == _hash_token(raw_token)
                ).with_for_update()
            ).first()
            if token:
                connection.execute(
                    update(self.refresh_tokens).where(
                        self.refresh_tokens.c.family_id == token.family_id,
                        self.refresh_tokens.c.revoked_at.is_(None),
                    ).values(revoked_at=now)
                )

    def verify_email(self, raw_token: str) -> None:
        now = datetime.now(timezone.utc)
        with self.engine.begin() as connection:
            token = connection.execute(
                select(self.verification_tokens).where(
                    self.verification_tokens.c.token_hash == _hash_token(raw_token)
                ).with_for_update()
            ).mappings().one_or_none()
            if token is None or token["used_at"] is not None or _aware(token["expires_at"]) <= now:
                raise HTTPException(status_code=400, detail={"code": "INVALID_VERIFICATION_TOKEN", "message": "Verification token is invalid or expired"})
            user = connection.execute(
                select(self.users).where(self.users.c.id == token["user_id"]).with_for_update()
            ).mappings().one_or_none()
            if user is None or user["status"] != "PENDING_VERIFICATION":
                raise HTTPException(status_code=400, detail={"code": "INVALID_VERIFICATION_TOKEN", "message": "Verification token is invalid or expired"})
            connection.execute(
                update(self.verification_tokens).where(self.verification_tokens.c.id == token["id"]).values(used_at=now)
            )
            connection.execute(
                update(self.users).where(self.users.c.id == user["id"]).values(
                    status="ACTIVE", email_verified_at=now, updated_at=now
                )
            )

    def resend_verification(self, email: str) -> None:
        self._send_action_email(email, self.verification_tokens, _VERIFICATION_TTL, self.mail.send_verification_email, "PENDING_VERIFICATION")

    def forgot_password(self, email: str) -> None:
        self._send_action_email(email, self.reset_tokens, _PASSWORD_RESET_TTL, self.mail.send_password_reset_email, None)

    def _send_action_email(self, email: str, table: Any, ttl: timedelta, sender: Any, required_status: str | None) -> None:
        raw_token = secrets.token_urlsafe(32)
        now = datetime.now(timezone.utc)
        with self.engine.begin() as connection:
            user = connection.execute(
                select(self.users).where(func.lower(self.users.c.email) == email)
            ).mappings().one_or_none()
            if user is None or (required_status is not None and user["status"] != required_status):
                return
            connection.execute(
                update(table).where(table.c.user_id == user["id"], table.c.used_at.is_(None)).values(used_at=now)
            )
            connection.execute(
                insert(table).values(
                    id=uuid.uuid4(), user_id=user["id"], token_hash=_hash_token(raw_token),
                    expires_at=now + ttl, created_at=now,
                )
            )
        sender(user["email"], raw_token)

    def reset_password(self, raw_token: str, new_password: str) -> None:
        now = datetime.now(timezone.utc)
        with self.engine.begin() as connection:
            token = connection.execute(
                select(self.reset_tokens).where(self.reset_tokens.c.token_hash == _hash_token(raw_token)).with_for_update()
            ).mappings().one_or_none()
            if token is None or token["used_at"] is not None or _aware(token["expires_at"]) <= now:
                raise HTTPException(status_code=400, detail={"code": "INVALID_RESET_TOKEN", "message": "Reset token is invalid or expired"})
            connection.execute(
                update(self.reset_tokens).where(
                    self.reset_tokens.c.user_id == token["user_id"],
                    self.reset_tokens.c.used_at.is_(None),
                ).values(used_at=now)
            )
            connection.execute(
                update(self.users).where(self.users.c.id == token["user_id"]).values(
                    password_hash=_password_hash(new_password), updated_at=now
                )
            )
            connection.execute(
                update(self.refresh_tokens).where(
                    self.refresh_tokens.c.user_id == token["user_id"],
                    self.refresh_tokens.c.revoked_at.is_(None),
                ).values(revoked_at=now)
            )

    def get_student(self, user_id: uuid.UUID) -> dict[str, Any]:
        with self.engine.connect() as connection:
            profile = connection.execute(
                select(self.profiles).where(self.profiles.c.user_id == user_id)
            ).mappings().one_or_none()
            if profile is None:
                raise HTTPException(status_code=404, detail={"code": "STUDENT_PROFILE_NOT_FOUND", "message": "Student profile was not found"})
            domain_slug = None
            domain_id = profile["selected_domain_id"]
            if domain_id is not None and self.domains is not None:
                domain_slug = connection.execute(
                    select(self.domains.c.slug).where(self.domains.c.id == domain_id)
                ).scalar_one_or_none()
        return {
            "college": profile["college"],
            "degree": profile["degree"],
            "currentYear": profile["current_year"],
            "selectedDomain": domain_slug,
        }

    def update_student(self, user_id: uuid.UUID, payload: StudentProfileInput) -> dict[str, Any]:
        domain_id = None
        if payload.selected_domain is not None:
            if self.domains is None:
                raise HTTPException(status_code=503, detail={"code": "DOMAIN_CATALOG_UNAVAILABLE", "message": "Domain catalog is unavailable"})
            with self.engine.connect() as connection:
                domain_id = connection.execute(
                    select(self.domains.c.id).where(
                        self.domains.c.slug == payload.selected_domain, self.domains.c.active.is_(True)
                    )
                ).scalar_one_or_none()
            if domain_id is None:
                raise HTTPException(status_code=400, detail={"code": "INVALID_DOMAIN", "message": "Selected domain is not available"})
        with self.engine.begin() as connection:
            result = connection.execute(
                update(self.profiles).where(self.profiles.c.user_id == user_id).values(
                    degree=payload.degree, current_year=payload.current_year,
                    selected_domain_id=domain_id, updated_at=datetime.now(timezone.utc),
                )
            )
            if result.rowcount != 1:
                raise HTTPException(status_code=404, detail={"code": "STUDENT_PROFILE_NOT_FOUND", "message": "Student profile was not found"})
        return self.get_student(user_id)

    def current_user(self, principal: UserPrincipal) -> dict[str, Any]:
        with self.engine.connect() as connection:
            user = connection.execute(
                select(self.users).where(self.users.c.id == principal.user_id)
            ).mappings().one_or_none()
        if user is None or user["status"] != "ACTIVE":
            raise HTTPException(status_code=401, detail={"code": "UNAUTHORIZED", "message": "Account is not active"})
        return {"id": str(user["id"]), "email": user["email"], "fullName": user["full_name"], "role": user["role"]}

    def _token_response(self, user: Any, refresh_token: str) -> dict[str, str]:
        return {
            "accessToken": generate_access_token(
                self.settings, uuid.UUID(str(user["id"])), user["email"], user["role"]
            ),
            "refreshToken": refresh_token,
        }


def _service(request: Request) -> AuthService:
    service = getattr(request.app.state, "auth_service", None)
    if service is None:
        raise HTTPException(status_code=503, detail={"code": "AUTH_UNAVAILABLE", "message": "Authentication service is unavailable"})
    return service


@router.post("/auth/register/student", status_code=status.HTTP_201_CREATED)
def register_student(payload: RegisterStudentInput, service: AuthService = Depends(_service)) -> dict[str, str]:
    service.register_student(payload)
    return {"message": "Registration successful. Check your email to verify your account."}


@router.post("/auth/login")
def login(payload: LoginInput, service: AuthService = Depends(_service)) -> dict[str, str]:
    return service.login(payload)


@router.post("/auth/refresh")
def refresh(payload: RefreshInput, service: AuthService = Depends(_service)) -> dict[str, str]:
    return service.refresh(payload.refresh_token)


@router.post("/auth/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(payload: RefreshInput, service: AuthService = Depends(_service)) -> Response:
    service.logout(payload.refresh_token)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/auth/me")
def me(principal: UserPrincipal = Depends(bearer_principal), service: AuthService = Depends(_service)) -> dict[str, Any]:
    return service.current_user(principal)


@router.post("/auth/verify-email")
def verify_email(payload: TokenInput, service: AuthService = Depends(_service)) -> dict[str, str]:
    service.verify_email(payload.token)
    return {"message": "Email verified"}


@router.post("/auth/resend-verification", status_code=status.HTTP_202_ACCEPTED)
def resend_verification(payload: EmailInput, service: AuthService = Depends(_service)) -> dict[str, str]:
    service.resend_verification(payload.email)
    return {"message": "If the account can be verified, a verification email has been sent."}


@router.post("/auth/forgot-password", status_code=status.HTTP_202_ACCEPTED)
def forgot_password(payload: EmailInput, service: AuthService = Depends(_service)) -> dict[str, str]:
    service.forgot_password(payload.email)
    return {"message": "If the account exists, a password reset email has been sent."}


@router.post("/auth/reset-password")
def reset_password(payload: ResetPasswordInput, service: AuthService = Depends(_service)) -> dict[str, str]:
    service.reset_password(payload.token, payload.new_password)
    return {"message": "Password reset successful"}


@router.get("/students/me")
def get_student_profile(
    principal: UserPrincipal = Depends(bearer_principal),
    service: AuthService = Depends(_service),
) -> dict[str, Any]:
    require_role(principal, "STUDENT")
    return service.get_student(principal.user_id)


@router.put("/students/me")
def update_student_profile(
    payload: StudentProfileInput,
    principal: UserPrincipal = Depends(bearer_principal),
    service: AuthService = Depends(_service),
) -> dict[str, Any]:
    require_role(principal, "STUDENT")
    return service.update_student(principal.user_id, payload)
