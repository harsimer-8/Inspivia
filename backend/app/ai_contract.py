from __future__ import annotations

from enum import Enum
from typing import Annotated
from urllib.parse import urlparse
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, model_validator


class ContractModel(BaseModel):
    model_config = ConfigDict(extra="ignore", populate_by_name=True)


class Level(str, Enum):
    BEGINNER = "BEGINNER"
    INTERMEDIATE = "INTERMEDIATE"
    ADVANCED = "ADVANCED"


class ChatRole(str, Enum):
    USER = "USER"
    ASSISTANT = "ASSISTANT"


class ResourceType(str, Enum):
    ARTICLE = "ARTICLE"
    VIDEO = "VIDEO"
    COURSE = "COURSE"
    BOOK = "BOOK"
    DOCS = "DOCS"
    OTHER = "OTHER"


class SkillLevel(ContractModel):
    name: Annotated[str, Field(min_length=1, max_length=80)]
    level: Level


class StudentContext(ContractModel):
    student_id: UUID
    first_name: str | None = Field(default=None, max_length=80)
    degree: str | None = Field(default=None, max_length=120)
    current_year: int | None = Field(default=None, ge=1, le=8)
    interests: list[Annotated[str, Field(min_length=1, max_length=80)]] = Field(max_length=20)
    skills: list[SkillLevel] = Field(max_length=40)
    career_goals: str | None = Field(default=None, max_length=2000)
    selected_domain: str | None = Field(default=None, max_length=80)


class ChatTurn(ContractModel):
    role: ChatRole
    content: Annotated[str, Field(min_length=1, max_length=8000)]


class ChatRequest(ContractModel):
    request_id: UUID
    student: StudentContext
    history: list[ChatTurn] = Field(max_length=20)
    message: Annotated[str, Field(min_length=1, max_length=4000)]
    locale: Annotated[str, Field(min_length=1, max_length=10)]


class ChatResponse(ContractModel):
    request_id: UUID
    reply: Annotated[str, Field(min_length=1, max_length=8000)]
    suggested_follow_ups: list[Annotated[str, Field(min_length=1, max_length=200)]] = Field(max_length=4)
    disclaimer: Annotated[str, Field(min_length=1, max_length=500)]


class RoadmapRequest(ContractModel):
    request_id: UUID
    student: StudentContext
    domain: Annotated[str, Field(min_length=1, max_length=80)]
    duration_weeks: int = Field(ge=4, le=52)
    hours_per_week: int = Field(ge=1, le=40)


class Resource(ContractModel):
    title: Annotated[str, Field(min_length=1, max_length=200)]
    url: Annotated[str, Field(min_length=1, max_length=500)]
    type: ResourceType


class RoadmapStep(ContractModel):
    position: int = Field(ge=1)
    title: Annotated[str, Field(min_length=1, max_length=200)]
    description: Annotated[str, Field(min_length=1, max_length=2000)]
    estimated_weeks: int = Field(ge=1, le=52, alias="estimatedWeeks")
    skills: list[Annotated[str, Field(min_length=1, max_length=80)]] = Field(max_length=10)
    resources: list[Resource] = Field(max_length=6)


class RoadmapResponse(ContractModel):
    request_id: UUID
    title: Annotated[str, Field(min_length=1, max_length=200)]
    summary: Annotated[str, Field(min_length=1, max_length=2000)]
    steps: list[RoadmapStep] = Field(min_length=1, max_length=20)
    disclaimer: Annotated[str, Field(min_length=1, max_length=500)]

    @model_validator(mode="after")
    def contiguous_positions(self) -> RoadmapResponse:
        if [step.position for step in self.steps] != list(range(1, len(self.steps) + 1)):
            raise ValueError("Roadmap step positions must be contiguous from 1")
        for step in self.steps:
            step.resources = [resource for resource in step.resources if is_http_url(resource.url)]
        return self


class ProjectRecommendationRequest(ContractModel):
    request_id: UUID
    student: StudentContext
    domain: str | None = Field(default=None, max_length=80)
    difficulty: Level | None = None
    count: int = Field(ge=1, le=5)
    exclude_titles: list[Annotated[str, Field(max_length=200)]] = Field(max_length=20)


class Milestone(ContractModel):
    position: int = Field(ge=1)
    title: Annotated[str, Field(min_length=1, max_length=200)]
    description: Annotated[str, Field(min_length=1, max_length=1000)]


class ProjectIdea(ContractModel):
    title: Annotated[str, Field(min_length=1, max_length=200)]
    description: Annotated[str, Field(min_length=1, max_length=3000)]
    difficulty: Level
    technologies: list[Annotated[str, Field(min_length=1, max_length=60)]] = Field(min_length=1, max_length=12)
    estimated_hours: int = Field(ge=1, le=1000, alias="estimatedHours")
    milestones: list[Milestone] = Field(min_length=1, max_length=10)
    rationale: Annotated[str, Field(min_length=1, max_length=1000)]

    @model_validator(mode="after")
    def contiguous_milestones(self) -> ProjectIdea:
        if [item.position for item in self.milestones] != list(range(1, len(self.milestones) + 1)):
            raise ValueError("Milestone positions must be contiguous from 1")
        return self


class ProjectRecommendationResponse(ContractModel):
    request_id: UUID
    projects: list[ProjectIdea] = Field(min_length=1, max_length=5)
    disclaimer: Annotated[str, Field(min_length=1, max_length=500)]


class HealthResponse(ContractModel):
    status: str | None = None
    service: str | None = None
    version: str | None = None


def is_http_url(value: str) -> bool:
    if any(character.isspace() or ord(character) < 32 for character in value):
        return False
    parsed = urlparse(value.strip())
    if parsed.scheme.lower() not in {"http", "https"} or not parsed.hostname:
        return False
    try:
        parsed.port
    except ValueError:
        return False
    return True


class FrontendModel(BaseModel):
    model_config = ConfigDict(extra="ignore", populate_by_name=True)


class ChatInput(FrontendModel):
    conversation_id: UUID | None = Field(default=None, alias="conversationId")
    message: Annotated[str, Field(min_length=1, max_length=4000)]

    @model_validator(mode="after")
    def message_not_blank(self) -> ChatInput:
        if not self.message.strip():
            raise ValueError("message must not be blank")
        return self


class ChatOutput(FrontendModel):
    conversation_id: UUID = Field(alias="conversationId")
    reply: str
    suggested_follow_ups: list[str] = Field(alias="suggestedFollowUps")
    disclaimer: str


class RoadmapInput(FrontendModel):
    domain: Annotated[str, Field(min_length=1, max_length=80)]
    duration_weeks: int = Field(ge=4, le=52, alias="durationWeeks")
    hours_per_week: int = Field(ge=1, le=40, alias="hoursPerWeek")

    @model_validator(mode="after")
    def domain_not_blank(self) -> RoadmapInput:
        if not self.domain.strip():
            raise ValueError("domain must not be blank")
        return self


class RoadmapOutput(FrontendModel):
    title: str
    summary: str
    steps: list[RoadmapStep]
    disclaimer: str
    generated_at: str = Field(alias="generatedAt")


class RecommendationsInput(FrontendModel):
    domain: str | None = Field(default=None, max_length=80)
    difficulty: Level | None = None
    count: int | None = Field(default=None, ge=1, le=5)


class RecommendationsOutput(FrontendModel):
    projects: list[ProjectIdea]
    disclaimer: str
    generated_at: str = Field(alias="generatedAt")
