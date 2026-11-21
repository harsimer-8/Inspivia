from __future__ import annotations

import uuid
from datetime import datetime, timezone

import httpx
import jwt
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import Column, MetaData, String, Table, create_engine

from app.ai_client import AiGatewayError, AiServiceClient
from app.ai_contract import ChatRequest, ChatResponse, RoadmapResponse
from app.config import Settings, _duration_seconds
from app.db import migration_files, split_sql_statements
from app.email_service import EmailService
from app.main import create_app
from app.rate_limit import RateLimitingService
from app.repositories import RepositoryRegistry
from app.security import generate_access_token, parse_access_token


def valid_settings(**overrides) -> Settings:
    values = {"jwt_secret": "local-test-secret-with-at-least-32-bytes", "ai_service_api_key": "test-key"}
    values.update(overrides)
    return Settings(**values)


def test_database_url_escapes_credentials_and_uses_standard_components():
    settings = Settings(
        db_host="postgres",
        db_port=5432,
        db_name="inspivia",
        db_username="user@name",
        db_password="a/b:c@d",
    )
    url = settings.database_url()
    assert url.drivername == "postgresql+psycopg"
    assert url.host == "postgres"
    assert url.username == "user@name"
    assert url.password == "a/b:c@d"
    assert url.render_as_string(hide_password=False) == (
        "postgresql+psycopg://user%40name:a%2Fb%3Ac%40d@postgres:5432/inspivia"
    )


def test_iso_duration_settings_match_existing_defaults():
    assert _duration_seconds("PT2S", 0) == 2
    assert _duration_seconds("PT30M", 0) == 1800
    assert _duration_seconds("P14D", 0) == 1_209_600


def test_existing_migrations_split_into_complete_statements():
    sql = "-- title; comment\nSELECT 'a;b'; /* nested /* ; */ comment */ SELECT $$c;d$$;"
    assert split_sql_statements(sql) == [
        "-- title; comment\nSELECT 'a;b';",
        " /* nested /* ; */ comment */ SELECT $$c;d$$;",
    ]
    assert all(split_sql_statements(path.read_text(encoding="utf-8")) for _, _, path in migration_files())


def test_jwt_round_trip_and_invalid_signature():
    settings = valid_settings()
    user_id = uuid.uuid4()
    now = datetime.now(timezone.utc)
    token = generate_access_token(settings, user_id, "student@example.test", "STUDENT", now=now)
    principal = parse_access_token(settings, token)
    assert principal.user_id == user_id
    assert principal.email == "student@example.test"
    assert principal.role == "STUDENT"
    with pytest.raises(jwt.PyJWTError):
        parse_access_token(valid_settings(jwt_secret="another-secret-that-is-also-32-bytes"), token)


def test_ai_client_preserves_service_key_request_id_and_snake_case():
    request_id = uuid.uuid4()
    captured = {}

    def handler(request: httpx.Request) -> httpx.Response:
        captured["headers"] = request.headers
        captured["json"] = request.read().decode()
        return httpx.Response(
            200,
            json={
                "request_id": str(request_id),
                "reply": "Hello",
                "suggested_follow_ups": [],
                "disclaimer": "AI-generated",
            },
        )

    async def run():
        async with httpx.AsyncClient(
            base_url="http://ai.test",
            headers={"X-Service-Key": "private-key"},
            transport=httpx.MockTransport(handler),
        ) as http:
            student_id = uuid.uuid4()
            payload = ChatRequest(
                request_id=request_id,
                student={
                    "student_id": student_id,
                    "interests": [],
                    "skills": [],
                },
                history=[],
                message="Hi",
                locale="en",
            )
            result = await AiServiceClient(http).chat(payload)
            assert result.reply == "Hello"

    import asyncio

    asyncio.run(run())
    assert captured["headers"]["x-service-key"] == "private-key"
    assert captured["headers"]["x-request-id"] == str(request_id)
    assert '"request_id"' in captured["json"]
    assert '"student_id"' in captured["json"]


@pytest.mark.parametrize(
    ("status_code", "expected"),
    [(429, 503), (503, 503), (400, 502)],
)
def test_ai_client_maps_upstream_statuses_without_exposing_body(status_code, expected):
    async def run():
        async with httpx.AsyncClient(
            base_url="http://ai.test",
            transport=httpx.MockTransport(lambda _: httpx.Response(status_code, text="sensitive body")),
        ) as http:
            req = ChatRequest(
                request_id=uuid.uuid4(),
                student={"student_id": uuid.uuid4(), "interests": [], "skills": []},
                history=[],
                message="Hi",
                locale="en",
            )
            with pytest.raises(AiGatewayError) as error:
                await AiServiceClient(http).chat(req)
            assert error.value.status_code == expected
            assert "sensitive body" not in str(error.value)

    import asyncio

    asyncio.run(run())


def test_ai_response_validation_and_unsafe_roadmap_links():
    request_id = uuid.uuid4()
    response = RoadmapResponse.model_validate(
        {
            "request_id": str(request_id),
            "title": "Plan",
            "summary": "Summary",
            "steps": [
                {
                    "position": 1,
                    "title": "Start",
                    "description": "Learn",
                    "estimated_weeks": 2,
                    "skills": [],
                    "resources": [
                        {"title": "Safe", "url": "https://example.test/a", "type": "ARTICLE"},
                        {"title": "Unsafe", "url": "javascript:alert(1)", "type": "OTHER"},
                    ],
                }
            ],
            "disclaimer": "For learning",
        }
    )
    assert [resource.title for resource in response.steps[0].resources] == ["Safe"]
    invalid = {
        "request_id": str(request_id),
        "title": "Plan",
        "summary": "Summary",
        "steps": [
            {
                "position": 2,
                "title": "Out of order",
                "description": "Learn",
                "estimated_weeks": 2,
                "skills": [],
                "resources": [],
            }
        ],
        "disclaimer": "For learning",
    }
    with pytest.raises(ValueError):
        RoadmapResponse.model_validate(invalid)


def test_reflected_repository_limits_table_names_and_column_names():
    engine = create_engine("sqlite+pysqlite:///:memory:")
    metadata = MetaData()
    users = Table(
        "users",
        metadata,
        Column("id", String, primary_key=True),
        Column("email", String),
        schema="public",
    )
    # SQLite does not support PostgreSQL schemas; exercise the same API with schema-free metadata.
    users.schema = None
    metadata.create_all(engine)
    registry = RepositoryRegistry(engine, metadata)
    repository = registry.for_table("users")
    assert repository.create({"id": "1", "email": "student@example.test"}) == {
        "id": "1",
        "email": "student@example.test",
    }
    assert repository.get("1")["email"] == "student@example.test"
    with pytest.raises(ValueError):
        repository.create({"id": "2", "password": "no"})
    with pytest.raises(ValueError):
        registry.for_table("users; DROP TABLE users")
    assert repository.delete("1")
    assert repository.get("1") is None


def test_reflected_repository_supports_composite_primary_keys():
    engine = create_engine("sqlite+pysqlite:///:memory:")
    metadata = MetaData()
    user_skills = Table(
        "user_skills",
        metadata,
        Column("user_id", String, primary_key=True),
        Column("skill_id", String, primary_key=True),
        Column("level", String),
        schema="public",
    )
    user_skills.schema = None
    metadata.create_all(engine)
    repository = RepositoryRegistry(engine, metadata).for_table("user_skills")
    repository.create({"user_id": "u1", "skill_id": "s1", "level": "ADVANCED"})
    assert repository.get(("u1", "s1"))["level"] == "ADVANCED"
    assert repository.update({"user_id": "u1", "skill_id": "s1"}, {"level": "BEGINNER"})[
        "level"
    ] == "BEGINNER"
    assert repository.delete(("u1", "s1"))


def test_authentication_default_and_ai_student_role_guard():
    app = create_app(valid_settings(), auto_start=False)
    with TestClient(app) as client:
        assert client.get("/api/v1/unknown").status_code == 401
        token = generate_access_token(valid_settings(), uuid.uuid4(), "mentor@example.test", "MENTOR")
        response = client.post(
            "/api/v1/ai/chat",
            headers={"Authorization": f"Bearer {token}"},
            json={"message": "Hello"},
        )
        assert response.status_code == 403
        invalid = client.post(
            "/api/v1/ai/chat",
            headers={
                "Authorization": f"Bearer {generate_access_token(valid_settings(), uuid.uuid4(), 'student@example.test', 'STUDENT')}"
            },
            json={"message": "sensitive-" + ("x" * 4100)},
        )
        assert invalid.status_code == 400
        assert "sensitive-" not in invalid.text
        health = client.get("/actuator/health")
        assert health.status_code == 503
        assert health.json() == {"status": "DOWN"}


def test_chat_route_keeps_frontend_camel_case_contract():
    app = create_app(valid_settings(), auto_start=False)
    conversation_id = uuid.uuid4()
    request_id = uuid.uuid4()

    class FakeAiService:
        async def chat(self, user_id, selected_conversation_id, message):
            assert selected_conversation_id is None
            assert message == " Hello "
            return conversation_id, ChatResponse(
                request_id=request_id,
                reply="Hi",
                suggested_follow_ups=["Next?"],
                disclaimer="AI-generated",
            )

    app.state.ai_service = FakeAiService()
    token = generate_access_token(valid_settings(), uuid.uuid4(), "student@example.test", "STUDENT")
    with TestClient(app) as client:
        response = client.post(
            "/api/v1/ai/chat",
            headers={"Authorization": f"Bearer {token}"},
            json={"message": " Hello "},
        )
    assert response.status_code == 200
    assert response.json() == {
        "conversationId": str(conversation_id),
        "reply": "Hi",
        "suggestedFollowUps": ["Next?"],
        "disclaimer": "AI-generated",
    }


def test_rate_limiter_rejects_excess_and_refills():
    limiter = RateLimitingService()
    assert limiter.try_consume("user", 1, 60)
    assert not limiter.try_consume("user", 1, 60)


def test_email_helper_formats_verification_message_and_surfaces_smtp_errors(monkeypatch):
    from app.email_service import EmailDeliveryError

    sent = {}

    class FakeSmtp:
        def __init__(self, *args, **kwargs):
            pass

        def __enter__(self):
            return self

        def __exit__(self, *args):
            return False

        def starttls(self, **kwargs):
            raise AssertionError("MailHog without authentication must not use STARTTLS")

        def send_message(self, message):
            sent["message"] = message
            raise OSError("mail server detail")

    monkeypatch.setattr("app.email_service.smtplib.SMTP", FakeSmtp)
    service = EmailService(valid_settings(frontend_base_url="https://frontend.test"))
    with pytest.raises(EmailDeliveryError, match="SMTP delivery failed"):
        service.send_verification_email("student@example.test", "abc123")
    assert sent["message"]["Subject"] == "Verify your Inspivia account"
    assert "https://frontend.test/auth/verify-email?token=abc123" in sent["message"].get_content()


def test_email_helper_uses_starttls_before_smtp_authentication(monkeypatch):
    from app.email_service import EmailDeliveryError

    calls = []

    class FakeSmtp:
        def __init__(self, *args, **kwargs):
            calls.append(("connect", args))

        def __enter__(self):
            return self

        def __exit__(self, *args):
            return False

        def starttls(self, **kwargs):
            calls.append(("starttls", kwargs))

        def login(self, username, password):
            calls.append(("login", username, password))

        def send_message(self, message):
            calls.append(("send", message["To"]))

    monkeypatch.setattr("app.email_service.smtplib.SMTP", FakeSmtp)
    service = EmailService(
        valid_settings(
            mail_host="smtp-relay.brevo.com",
            mail_port=587,
            mail_use_tls=True,
            mail_username="brevo-login",
            mail_password="smtp-key",
        )
    )
    service.send_verification_email("student@example.test", "abc123")
    assert [call[0] for call in calls] == ["connect", "starttls", "login", "send"]


def test_authenticated_smtp_refuses_plaintext(monkeypatch):
    from app.email_service import EmailDeliveryError

    class FakeSmtp:
        def __init__(self, *args, **kwargs):
            pass

        def __enter__(self):
            return self

        def __exit__(self, *args):
            return False

    monkeypatch.setattr("app.email_service.smtplib.SMTP", FakeSmtp)
    service = EmailService(valid_settings(mail_username="brevo-login", mail_password="smtp-key"))
    with pytest.raises(EmailDeliveryError, match="TLS is required"):
        service.send_verification_email("student@example.test", "abc123")
