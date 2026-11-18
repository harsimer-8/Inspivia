"""Reference Pydantic v2 models for the INSPIVIA AI contract (contracts/ai-service.openapi.yaml).

For the FastAPI developer: these mirror the Java DTOs field-for-field. Copy them into
ai-service/app/schemas/ or import them as-is. This file contains NO AI logic.
The OpenAPI file is authoritative if the two ever disagree; please report the mismatch.
"""
from __future__ import annotations

from enum import Enum
from typing import Annotated, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, StringConstraints, model_validator

Short = Annotated[str, StringConstraints(min_length=1, max_length=80, strip_whitespace=True)]


class Level(str, Enum):
    BEGINNER = "BEGINNER"
    INTERMEDIATE = "INTERMEDIATE"
    ADVANCED = "ADVANCED"


class Role(str, Enum):
    USER = "USER"
    ASSISTANT = "ASSISTANT"


class ResourceType(str, Enum):
    ARTICLE = "ARTICLE"
    VIDEO = "VIDEO"
    COURSE = "COURSE"
    BOOK = "BOOK"
    DOCS = "DOCS"
    OTHER = "OTHER"


class _Base(BaseModel):
    # Requests: be lenient about additive fields from Spring; responses: be exact.
    model_config = ConfigDict(extra="ignore")


class SkillLevel(_Base):
    name: Short
    level: Level


class StudentContext(_Base):
    student_id: UUID
    first_name: Optional[str] = Field(default=None, max_length=80)
    degree: Optional[str] = Field(default=None, max_length=120)
    current_year: Optional[int] = Field(default=None, ge=1, le=8)
    interests: list[Short] = Field(max_length=20)
    skills: list[SkillLevel] = Field(max_length=40)
    career_goals: Optional[str] = Field(default=None, max_length=2000)
    selected_domain: Optional[str] = Field(default=None, max_length=80)


class ChatTurn(_Base):
    role: Role
    content: str = Field(min_length=1, max_length=8000)


class ChatRequest(_Base):
    request_id: UUID
    student: StudentContext
    history: list[ChatTurn] = Field(max_length=20)
    message: str = Field(min_length=1, max_length=4000)
    locale: str = Field(default="en", max_length=10)


class ChatResponse(BaseModel):
    request_id: UUID
    reply: str = Field(min_length=1, max_length=8000)
    suggested_follow_ups: list[Annotated[str, StringConstraints(min_length=1, max_length=200)]] = Field(max_length=4)
    disclaimer: str = Field(min_length=1, max_length=500)


class RoadmapRequest(_Base):
    request_id: UUID
    student: StudentContext
    domain: Short
    duration_weeks: int = Field(ge=4, le=52)
    hours_per_week: int = Field(ge=1, le=40)


class Resource(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    url: str = Field(max_length=500)
    type: ResourceType


class RoadmapStep(BaseModel):
    position: int = Field(ge=1)
    title: str = Field(min_length=1, max_length=200)
    description: str = Field(min_length=1, max_length=2000)
    estimated_weeks: int = Field(ge=1, le=52)
    skills: list[Short] = Field(max_length=10)
    resources: list[Resource] = Field(max_length=6)


class RoadmapResponse(BaseModel):
    request_id: UUID
    title: str = Field(min_length=1, max_length=200)
    summary: str = Field(min_length=1, max_length=2000)
    steps: list[RoadmapStep] = Field(min_length=1, max_length=20)
    disclaimer: str = Field(min_length=1, max_length=500)

    @model_validator(mode="after")
    def positions_are_contiguous(self) -> "RoadmapResponse":
        if [s.position for s in self.steps] != list(range(1, len(self.steps) + 1)):
            raise ValueError("step positions must be 1..n in order")
        return self


class ProjectRecommendationRequest(_Base):
    request_id: UUID
    student: StudentContext
    domain: Optional[str] = Field(default=None, max_length=80)
    difficulty: Optional[Level] = None
    count: int = Field(ge=1, le=5)
    exclude_titles: list[Annotated[str, StringConstraints(max_length=200)]] = Field(max_length=20)


class Milestone(BaseModel):
    position: int = Field(ge=1)
    title: str = Field(min_length=1, max_length=200)
    description: str = Field(min_length=1, max_length=1000)


class ProjectIdea(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str = Field(min_length=1, max_length=3000)
    difficulty: Level
    technologies: list[Annotated[str, StringConstraints(min_length=1, max_length=60)]] = Field(min_length=1, max_length=12)
    estimated_hours: int = Field(ge=1, le=1000)
    milestones: list[Milestone] = Field(min_length=1, max_length=10)
    rationale: str = Field(min_length=1, max_length=1000)

    @model_validator(mode="after")
    def milestones_are_contiguous(self) -> "ProjectIdea":
        if [m.position for m in self.milestones] != list(range(1, len(self.milestones) + 1)):
            raise ValueError("milestone positions must be 1..n in order")
        return self


class ProjectRecommendationResponse(BaseModel):
    request_id: UUID
    projects: list[ProjectIdea] = Field(min_length=1, max_length=5)
    disclaimer: str = Field(min_length=1, max_length=500)


class HealthResponse(BaseModel):
    status: str = "ok"
    service: Optional[str] = None
    version: Optional[str] = None


class ErrorBody(BaseModel):
    code: str
    message: str


class ErrorResponse(BaseModel):
    error: ErrorBody
