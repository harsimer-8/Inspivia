from __future__ import annotations

import uuid
from datetime import datetime, timezone

from starlette.concurrency import run_in_threadpool

from app.ai_client import AiServiceClient
from app.ai_contract import (
    ChatRequest,
    ChatResponse,
    Level,
    ProjectRecommendationRequest,
    ProjectRecommendationResponse,
    RoadmapRequest,
    RoadmapResponse,
)
from app.ai_store import SqlAiConversationStore, SqlStudentContextProvider
from app.config import Settings


class AiApplicationService:
    def __init__(
        self,
        client: AiServiceClient,
        students: SqlStudentContextProvider,
        conversations: SqlAiConversationStore,
        settings: Settings,
    ):
        self.client = client
        self.students = students
        self.conversations = conversations
        self.settings = settings

    async def chat(
        self, user_id: uuid.UUID, conversation_id: uuid.UUID | None, message: str
    ) -> tuple[uuid.UUID, ChatResponse]:
        conversation_id = await run_in_threadpool(
            self.conversations.resolve_or_create, user_id, conversation_id
        )
        history = await run_in_threadpool(
            self.conversations.recent_turns,
            conversation_id,
            self.settings.ai_max_history_messages,
        )
        student = await run_in_threadpool(self.students.for_user, user_id)
        request = ChatRequest(
            request_id=uuid.uuid4(),
            student=student,
            history=history,
            message=message.strip(),
            locale="en",
        )
        response = await self.client.chat(request)
        await run_in_threadpool(
            self.conversations.append_exchange, conversation_id, request.message, response.reply
        )
        return conversation_id, response

    async def roadmap(
        self, user_id: uuid.UUID, domain: str, duration_weeks: int, hours_per_week: int
    ) -> tuple[RoadmapResponse, datetime]:
        student = await run_in_threadpool(self.students.for_user, user_id)
        request = RoadmapRequest(
            request_id=uuid.uuid4(),
            student=student,
            domain=domain.strip(),
            duration_weeks=duration_weeks,
            hours_per_week=hours_per_week,
        )
        return await self.client.roadmap(request), datetime.now(timezone.utc)

    async def recommend_projects(
        self,
        user_id: uuid.UUID,
        domain: str | None,
        difficulty: Level | None,
        count: int | None,
    ) -> tuple[ProjectRecommendationResponse, datetime]:
        student = await run_in_threadpool(self.students.for_user, user_id)
        enrolled = await run_in_threadpool(self.students.enrolled_project_titles, user_id)
        request = ProjectRecommendationRequest(
            request_id=uuid.uuid4(),
            student=student,
            domain=domain.strip() if domain and domain.strip() else student.selected_domain,
            difficulty=difficulty,
            count=count if count is not None else 3,
            exclude_titles=enrolled[:20],
        )
        return await self.client.recommend_projects(request), datetime.now(timezone.utc)
