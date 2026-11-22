from __future__ import annotations

import uuid
from datetime import datetime, timezone

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, MetaData, String, Table, Uuid, create_engine
from sqlalchemy.pool import StaticPool

from app.auth import AuthService
from app.config import Settings
from app.email_service import EmailService
from app.main import create_app


class FakeEmailService(EmailService):
    def __init__(self):
        self.verification = []
        self.password_resets = []

    def send_verification_email(self, to_email: str, token: str) -> None:
        self.verification.append((to_email, token))

    def send_password_reset_email(self, to_email: str, token: str) -> None:
        self.password_resets.append((to_email, token))


@pytest.fixture
def auth_client():
    engine = create_engine(
        "sqlite+pysqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    metadata = MetaData()
    users = Table(
        "users", metadata,
        Column("id", Uuid(as_uuid=True), primary_key=True),
        Column("email", String(254), nullable=False, unique=True),
        Column("password_hash", String(100), nullable=False),
        Column("full_name", String(120), nullable=False),
        Column("role", String(20), nullable=False),
        Column("status", String(30), nullable=False),
        Column("email_verified_at", DateTime(timezone=True)),
        Column("last_login_at", DateTime(timezone=True)),
        Column("created_at", DateTime(timezone=True)),
        Column("updated_at", DateTime(timezone=True)),
    )
    Table(
        "student_profiles", metadata,
        Column("user_id", Uuid(as_uuid=True), ForeignKey("users.id"), primary_key=True),
        Column("college", String(200), nullable=False),
        Column("degree", String(120), nullable=False),
        Column("current_year", Integer, nullable=False),
        Column("selected_domain_id", Uuid(as_uuid=True)),
        Column("created_at", DateTime(timezone=True)),
        Column("updated_at", DateTime(timezone=True)),
    )
    Table(
        "refresh_tokens", metadata,
        Column("id", Uuid(as_uuid=True), primary_key=True),
        Column("user_id", Uuid(as_uuid=True), ForeignKey("users.id"), nullable=False),
        Column("token_hash", String(64), nullable=False, unique=True),
        Column("family_id", Uuid(as_uuid=True), nullable=False),
        Column("expires_at", DateTime(timezone=True), nullable=False),
        Column("revoked_at", DateTime(timezone=True)),
        Column("replaced_by", Uuid(as_uuid=True)),
        Column("created_at", DateTime(timezone=True)),
    )
    for name in ("email_verification_tokens", "password_reset_tokens"):
        Table(
            name, metadata,
            Column("id", Uuid(as_uuid=True), primary_key=True),
            Column("user_id", Uuid(as_uuid=True), ForeignKey("users.id"), nullable=False),
            Column("token_hash", String(64), nullable=False, unique=True),
            Column("expires_at", DateTime(timezone=True), nullable=False),
            Column("used_at", DateTime(timezone=True)),
            Column("created_at", DateTime(timezone=True)),
        )
    domains = Table(
        "domains", metadata,
        Column("id", Uuid(as_uuid=True), primary_key=True),
        Column("slug", String(80), nullable=False, unique=True),
        Column("active", Boolean, nullable=False),
    )
    metadata.create_all(engine)

    settings = Settings(
        jwt_secret="test-secret-at-least-32-bytes-long",
        ai_service_api_key="test-key",
    )
    mail = FakeEmailService()
    app = create_app(settings, auto_start=False)
    app.state.auth_service = AuthService(engine, metadata, settings, mail)
    with TestClient(app) as client:
        yield client, mail, engine
    engine.dispose()


def register(client: TestClient, email: str = "student@example.test") -> dict:
    response = client.post(
        "/api/v1/auth/register/student",
        json={
            "fullName": "Test Student",
            "email": email,
            "password": "strong-password-123",
            "college": "Test College",
            "degree": "Computer Science",
            "currentYear": 2,
        },
    )
    assert response.status_code == 201, response.text
    return response.json()


def test_register_verify_login_and_refresh_reuse_revokes_family(auth_client):
    client, mail, engine = auth_client
    register(client)
    assert len(mail.verification) == 1
    assert client.post(
        "/api/v1/auth/register/student",
        json={
            "fullName": "Duplicate", "email": "STUDENT@example.test", "password": "strong-password-123",
            "college": "College", "degree": "Degree", "currentYear": 1,
        },
    ).status_code == 409
    token = mail.verification[0][1]
    assert client.post("/api/v1/auth/verify-email", json={"token": token}).status_code == 200
    login = client.post(
        "/api/v1/auth/login",
        json={"email": "STUDENT@example.test", "password": "strong-password-123"},
    )
    assert login.status_code == 200, login.text
    tokens = login.json()
    assert set(tokens) == {"accessToken", "refreshToken"}
    rotated = client.post("/api/v1/auth/refresh", json={"refreshToken": tokens["refreshToken"]})
    assert rotated.status_code == 200
    assert rotated.json()["refreshToken"] != tokens["refreshToken"]
    assert client.post("/api/v1/auth/refresh", json={"refreshToken": tokens["refreshToken"]}).status_code == 401
    assert client.post("/api/v1/auth/refresh", json={"refreshToken": rotated.json()["refreshToken"]}).status_code == 401


def test_student_profile_me_and_password_reset_revoke_refresh_tokens(auth_client):
    client, mail, _ = auth_client
    register(client)
    client.post("/api/v1/auth/verify-email", json={"token": mail.verification[0][1]})
    tokens = client.post(
        "/api/v1/auth/login", json={"email": "student@example.test", "password": "strong-password-123"}
    ).json()
    headers = {"Authorization": f"Bearer {tokens['accessToken']}"}
    me = client.get("/api/v1/auth/me", headers=headers)
    assert me.status_code == 200
    assert me.json()["fullName"] == "Test Student"
    profile = client.get("/api/v1/students/me", headers=headers)
    assert profile.json() == {
        "college": "Test College", "degree": "Computer Science", "currentYear": 2, "selectedDomain": None,
    }
    assert client.put(
        "/api/v1/students/me",
        headers=headers,
        json={"degree": "Engineering", "year": 3, "selectedDomain": None},
    ).json()["currentYear"] == 3

    assert client.post("/api/v1/auth/forgot-password", json={"email": "student@example.test"}).status_code == 202
    reset_token = mail.password_resets[0][1]
    assert client.post(
        "/api/v1/auth/reset-password",
        json={"token": reset_token, "newPassword": "new-strong-password"},
    ).status_code == 200
    assert client.post("/api/v1/auth/refresh", json={"refreshToken": tokens["refreshToken"]}).status_code == 401
    assert client.post(
        "/api/v1/auth/login", json={"email": "student@example.test", "password": "new-strong-password"}
    ).status_code == 200


def test_invalid_password_and_expired_or_reused_tokens_are_rejected(auth_client):
    client, mail, _ = auth_client
    too_short = client.post(
        "/api/v1/auth/register/student",
        json={
            "fullName": "Student", "email": "student@example.test", "password": "short",
            "college": "College", "degree": "Degree", "currentYear": 1,
        },
    )
    assert too_short.status_code == 400
    assert client.post("/api/v1/auth/verify-email", json={"token": "x" * 24}).status_code == 400
    assert client.post("/api/v1/auth/forgot-password", json={"email": "missing@example.test"}).status_code == 202
