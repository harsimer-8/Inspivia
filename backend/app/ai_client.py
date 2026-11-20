from __future__ import annotations

import logging
from typing import TypeVar

import httpx
from pydantic import BaseModel, ValidationError

from app.ai_contract import (
    ChatRequest,
    ChatResponse,
    HealthResponse,
    ProjectRecommendationRequest,
    ProjectRecommendationResponse,
    RoadmapRequest,
    RoadmapResponse,
)

logger = logging.getLogger(__name__)
ResponseT = TypeVar("ResponseT", bound=BaseModel)


class AiGatewayError(Exception):
    def __init__(self, status_code: int, message: str):
        self.status_code = status_code
        self.message = message
        super().__init__(message)


class AiServiceClient:
    def __init__(self, client: httpx.AsyncClient):
        self.client = client

    async def chat(self, request: ChatRequest) -> ChatResponse:
        return await self._post("/api/v1/ai/chat", request, ChatResponse)

    async def roadmap(self, request: RoadmapRequest) -> RoadmapResponse:
        return await self._post("/api/v1/ai/roadmap", request, RoadmapResponse)

    async def recommend_projects(
        self, request: ProjectRecommendationRequest
    ) -> ProjectRecommendationResponse:
        return await self._post(
            "/api/v1/ai/project-recommendations", request, ProjectRecommendationResponse
        )

    async def health(self) -> tuple[bool, str | None]:
        try:
            response = await self.client.get("/health")
            response.raise_for_status()
            health = HealthResponse.model_validate(response.json())
            if health.status and health.status.lower() == "ok":
                return True, health.version
        except (httpx.HTTPError, ValueError, ValidationError):
            logger.warning("AI health check failed")
        return False, None

    async def _post(self, path: str, payload: BaseModel, response_model: type[ResponseT]) -> ResponseT:
        request_id = payload.request_id
        try:
            response = await self.client.post(
                path,
                headers={"X-Request-Id": str(request_id)},
                json=payload.model_dump(mode="json"),
            )
        except httpx.TimeoutException:
            logger.warning("AI service timed out path=%s request_id=%s", path, request_id)
            raise AiGatewayError(503, "AI service is unreachable or timed out") from None
        except httpx.RequestError:
            logger.warning("AI service is unreachable path=%s request_id=%s", path, request_id)
            raise AiGatewayError(503, "AI service is unreachable or timed out") from None

        if response.status_code >= 500 or response.status_code == 429:
            logger.warning("AI service unavailable status=%s path=%s request_id=%s", response.status_code, path, request_id)
            raise AiGatewayError(503, f"AI service is unavailable ({response.status_code})")
        if response.is_error:
            logger.warning("AI service rejected request status=%s path=%s request_id=%s", response.status_code, path, request_id)
            raise AiGatewayError(502, f"AI service rejected the request ({response.status_code})")

        try:
            parsed = response_model.model_validate(response.json())
        except (ValueError, ValidationError):
            logger.warning("AI service returned an invalid response path=%s request_id=%s", path, request_id)
            raise AiGatewayError(502, "AI service returned an unreadable or invalid response") from None
        if parsed.request_id != request_id:
            raise AiGatewayError(502, "AI response request_id does not match the request")
        return parsed
