from __future__ import annotations

import os
from dataclasses import dataclass

from sqlalchemy import URL


def _duration_seconds(value: str, default: int) -> int:
    """Parse common ISO-8601 durations used by the Spring configuration."""
    if not value:
        return default
    value = value.upper()
    if value.startswith("PT") and value.endswith("S"):
        return int(value[2:-1])
    if value.startswith("PT") and value.endswith("M"):
        return int(value[2:-1]) * 60
    if value.startswith("PT") and value.endswith("H"):
        return int(value[2:-1]) * 3600
    if value.startswith("P") and value.endswith("D"):
        return int(value[1:-1]) * 86400
    raise ValueError("Duration must use ISO-8601 seconds, minutes, hours, or days")


@dataclass(frozen=True)
class Settings:
    db_host: str = "localhost"
    db_port: int = 5432
    db_name: str = "inspivia"
    db_username: str = "inspivia"
    db_password: str = ""
    jwt_secret: str = ""
    jwt_access_ttl_seconds: int = 900
    jwt_refresh_ttl_seconds: int = 1_209_600
    ai_service_base_url: str = "http://localhost:8000"
    ai_service_api_key: str = ""
    ai_connect_timeout_seconds: float = 2.0
    ai_read_timeout_seconds: float = 30.0
    ai_max_history_messages: int = 10
    mail_host: str = "localhost"
    mail_port: int = 1025
    mail_username: str = ""
    mail_password: str = ""
    mail_from: str = "no-reply@inspivia.local"
    frontend_base_url: str = "http://localhost:3000"
    cors_allowed_origins: tuple[str, ...] = ("http://localhost:3000",)
    server_port: int = 8080
    auto_migrate: bool = True

    @classmethod
    def from_env(cls) -> Settings:
        origins = os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:3000")
        return cls(
            db_host=os.getenv("DB_HOST", "localhost"),
            db_port=int(os.getenv("DB_PORT", "5432")),
            db_name=os.getenv("DB_NAME", "inspivia"),
            db_username=os.getenv("DB_USERNAME", "inspivia"),
            db_password=os.getenv("DB_PASSWORD", ""),
            jwt_secret=os.getenv("JWT_SECRET", ""),
            jwt_access_ttl_seconds=_duration_seconds(os.getenv("JWT_ACCESS_TTL", ""), 900),
            jwt_refresh_ttl_seconds=_duration_seconds(os.getenv("JWT_REFRESH_TTL", ""), 1_209_600),
            ai_service_base_url=os.getenv("AI_SERVICE_BASE_URL", "http://localhost:8000"),
            ai_service_api_key=os.getenv("AI_SERVICE_API_KEY", ""),
            ai_connect_timeout_seconds=float(os.getenv("AI_CONNECT_TIMEOUT", "2")),
            ai_read_timeout_seconds=float(os.getenv("AI_READ_TIMEOUT", "30")),
            ai_max_history_messages=int(os.getenv("AI_MAX_HISTORY_MESSAGES", "10")),
            mail_host=os.getenv("MAIL_HOST", "localhost"),
            mail_port=int(os.getenv("MAIL_PORT", "1025")),
            mail_username=os.getenv("MAIL_USERNAME", ""),
            mail_password=os.getenv("MAIL_PASSWORD", ""),
            mail_from=os.getenv("MAIL_FROM", "no-reply@inspivia.local"),
            frontend_base_url=os.getenv("FRONTEND_BASE_URL", "http://localhost:3000"),
            cors_allowed_origins=tuple(origin.strip() for origin in origins.split(",") if origin.strip()),
            server_port=int(os.getenv("SERVER_PORT", "8080")),
            auto_migrate=os.getenv("AUTO_MIGRATE", "true").lower() in {"true", "1", "yes"},
        )

    def database_url(self) -> URL:
        """Build a properly escaped PostgreSQL URL from the standard DB_* variables."""
        return URL.create(
            "postgresql+psycopg",
            username=self.db_username,
            password=self.db_password,
            host=self.db_host,
            port=self.db_port,
            database=self.db_name,
        )

    def validate_runtime(self) -> None:
        if len(self.jwt_secret.encode("utf-8")) < 32:
            raise RuntimeError("JWT_SECRET must be configured and contain at least 32 bytes")
        if not self.ai_service_api_key.strip():
            raise RuntimeError("AI_SERVICE_API_KEY must be configured")
        if not 0 <= self.ai_max_history_messages <= 20:
            raise RuntimeError("AI_MAX_HISTORY_MESSAGES must be between 0 and 20")
