from __future__ import annotations

import logging
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import AsyncIterator

import httpx
from fastapi import Depends, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy import text

from app.auth import AuthService, router as auth_router
from app.ai_client import AiGatewayError, AiServiceClient
from app.ai_contract import (
    ChatInput,
    ChatOutput,
    RecommendationsInput,
    RecommendationsOutput,
    RoadmapInput,
    RoadmapOutput,
)
from app.ai_service import AiApplicationService
from app.ai_store import SqlAiConversationStore, SqlStudentContextProvider
from app.config import Settings
from app.db import build_engine, reflect_schema, run_migrations, session_factory
from app.email_service import EmailDeliveryError, EmailService
from app.repositories import RepositoryRegistry
from app.security import UserPrincipal, authenticate_header, bearer_principal, require_role

logger = logging.getLogger(__name__)


def _is_public(method: str, path: str) -> bool:
    if path.startswith(("/docs", "/redoc", "/openapi.json", "/swagger-ui", "/v3/api-docs")):
        return True
    if path in {"/actuator/health", "/actuator/info"}:
        return True
    if path.startswith("/api/v1/auth/register/") or path in {
        "/api/v1/auth/login",
        "/api/v1/auth/refresh",
        "/api/v1/auth/verify-email",
        "/api/v1/auth/resend-verification",
        "/api/v1/auth/forgot-password",
        "/api/v1/auth/reset-password",
    }:
        return True
    if method == "GET" and path.startswith(
        ("/api/v1/domains/", "/api/v1/skills/", "/api/v1/public/", "/api/v1/projects/")
    ):
        return True
    return (
        method == "POST" and path == "/api/v1/contact"
    ) or (
        method == "GET" and path in {
            "/api/v1/contact/categories", "/api/v1/mentors"
        }
    ) or (
        method == "GET" and path.startswith("/api/v1/mentors/")
    )


def create_app(
    settings: Settings | None = None,
    *,
    migration_path: Path | None = None,
    auto_start: bool = True,
) -> FastAPI:
    configuration = settings or Settings.from_env()

    @asynccontextmanager
    async def lifespan(app: FastAPI) -> AsyncIterator[None]:
        if not auto_start:
            yield
            return
        configuration.validate_runtime()
        engine = build_engine(configuration)
        try:
            if configuration.auto_migrate:
                run_migrations(engine, migration_path)
            else:
                with engine.connect() as connection:
                    connection.exec_driver_sql("SELECT 1")
            metadata = reflect_schema(engine)
            app.state.engine = engine
            app.state.session_factory = session_factory(engine)
            app.state.repositories = RepositoryRegistry(engine, metadata)
            app.state.auth_service = AuthService(engine, metadata, configuration, EmailService(configuration))
            http_client = httpx.AsyncClient(
                base_url=configuration.ai_service_base_url.rstrip("/"),
                headers={
                    "X-Service-Key": configuration.ai_service_api_key,
                    "Accept": "application/json",
                },
                timeout=httpx.Timeout(
                    configuration.ai_read_timeout_seconds,
                    connect=configuration.ai_connect_timeout_seconds,
                ),
            )
            app.state.ai_service = AiApplicationService(
                AiServiceClient(http_client),
                SqlStudentContextProvider(engine),
                SqlAiConversationStore(engine),
                configuration,
            )
            app.state.http_client = http_client
            yield
        finally:
            if hasattr(app.state, "http_client"):
                await app.state.http_client.aclose()
            engine.dispose()

    app = FastAPI(title="INSPIVIA Backend", version="0.1.0", lifespan=lifespan)
    app.state.settings = configuration
    app.include_router(auth_router)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=list(configuration.cors_allowed_origins),
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["*"],
        allow_credentials=True,
        max_age=3600,
    )

    @app.middleware("http")
    async def jwt_security(request: Request, call_next):
        if request.method == "OPTIONS" or _is_public(request.method, request.url.path):
            return await call_next(request)
        principal = authenticate_header(configuration, request.headers.get("Authorization"))
        if principal is None:
            return JSONResponse(
                status_code=401,
                content={"detail": "Authentication required"},
                headers={"WWW-Authenticate": "Bearer"},
            )
        request.state.principal = principal
        return await call_next(request)

    @app.exception_handler(AiGatewayError)
    async def ai_error_handler(_: Request, error: AiGatewayError) -> JSONResponse:
        return JSONResponse(status_code=error.status_code, content={"detail": error.message})

    @app.exception_handler(EmailDeliveryError)
    async def email_error_handler(_request: Request, _error: EmailDeliveryError) -> JSONResponse:
        return JSONResponse(
            status_code=503,
            content={
                "type": "urn:inspivia:error:email",
                "title": "EMAIL_DELIVERY_FAILED",
                "status": 503,
                "detail": "Transactional email could not be sent. Please retry.",
                "code": "EMAIL_DELIVERY_FAILED",
                "timestamp": datetime.now(timezone.utc).isoformat(),
            },
        )

    @app.exception_handler(RequestValidationError)
    async def validation_error_handler(_: Request, error: RequestValidationError) -> JSONResponse:
        errors = [
            {
                "field": ".".join(str(part) for part in item.get("loc", ())[1:]),
                "message": "Invalid value",
            }
            for item in error.errors()
        ]
        return JSONResponse(
            status_code=400,
            content={
                "type": "urn:inspivia:error:validation",
                "title": "VALIDATION_ERROR",
                "status": 400,
                "detail": "Validation failed",
                "code": "VALIDATION_ERROR",
                "errors": errors,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            },
        )

    @app.exception_handler(Exception)
    async def internal_error_handler(request: Request, error: Exception) -> JSONResponse:
        logger.error(
            "Unhandled backend error path=%s type=%s", request.url.path, type(error).__name__
        )
        return JSONResponse(
            status_code=500,
            content={
                "type": "urn:inspivia:error:internal",
                "title": "INTERNAL_ERROR",
                "status": 500,
                "detail": "An internal error occurred",
                "code": "INTERNAL_ERROR",
                "timestamp": datetime.now(timezone.utc).isoformat(),
            },
        )

    @app.get("/actuator/health")
    async def health(request: Request) -> JSONResponse:
        engine = getattr(request.app.state, "engine", None)
        if engine is None:
            return JSONResponse(status_code=503, content={"status": "DOWN"})
        try:
            with engine.connect() as connection:
                connection.execute(text("SELECT 1"))
        except Exception as error:
            logger.warning("Database health check failed (%s)", type(error).__name__)
            return JSONResponse(status_code=503, content={"status": "DOWN"})
        return JSONResponse(status_code=200, content={"status": "UP"})

    @app.get("/actuator/info")
    async def info() -> dict[str, object]:
        return {"app": {"name": "inspivia-backend", "version": "0.1.0"}}

    @app.post("/api/v1/ai/chat", response_model=ChatOutput)
    async def chat(
        payload: ChatInput,
        request: Request,
        principal: UserPrincipal = Depends(bearer_principal),
    ) -> ChatOutput:
        require_role(principal, "STUDENT")
        conversation_id, response = await request.app.state.ai_service.chat(
            principal.user_id, payload.conversation_id, payload.message
        )
        return ChatOutput(
            conversation_id=conversation_id,
            reply=response.reply,
            suggested_follow_ups=response.suggested_follow_ups,
            disclaimer=response.disclaimer,
        )

    @app.post("/api/v1/ai/roadmap", response_model=RoadmapOutput)
    async def roadmap(
        payload: RoadmapInput,
        request: Request,
        principal: UserPrincipal = Depends(bearer_principal),
    ) -> RoadmapOutput:
        require_role(principal, "STUDENT")
        response, generated_at = await request.app.state.ai_service.roadmap(
            principal.user_id, payload.domain, payload.duration_weeks, payload.hours_per_week
        )
        return RoadmapOutput(
            title=response.title,
            summary=response.summary,
            steps=response.steps,
            disclaimer=response.disclaimer,
            generated_at=generated_at.isoformat(),
        )

    @app.post("/api/v1/ai/project-recommendations", response_model=RecommendationsOutput)
    async def recommendations(
        payload: RecommendationsInput,
        request: Request,
        principal: UserPrincipal = Depends(bearer_principal),
    ) -> RecommendationsOutput:
        require_role(principal, "STUDENT")
        response, generated_at = await request.app.state.ai_service.recommend_projects(
            principal.user_id, payload.domain, payload.difficulty, payload.count
        )
        return RecommendationsOutput(
            projects=response.projects,
            disclaimer=response.disclaimer,
            generated_at=generated_at.isoformat(),
        )

    @app.get("/api/v1/ai/status")
    async def ai_status(
        request: Request,
        principal: UserPrincipal = Depends(bearer_principal),
    ) -> dict[str, object]:
        require_role(principal, "ADMIN")
        available, version = await request.app.state.ai_service.client.health()
        return {"available": available, "version": version}

    return app


app = create_app()
