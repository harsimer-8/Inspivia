from typing import Annotated, Optional
from uuid import UUID

from pydantic import Field, StringConstraints, model_validator

from app.schemas.chat import BaseSchema, Level, StudentContext


Short = Annotated[
    str,
    StringConstraints(
        min_length=1,
        max_length=80,
        strip_whitespace=True
    )
]


class ProjectRecommendationRequest(BaseSchema):
    request_id: UUID
    student: StudentContext
    domain: Optional[str] = Field(default=None, max_length=80)
    difficulty: Optional[Level] = None
    count: int = Field(ge=1, le=5)
    exclude_titles: list[
        Annotated[str, StringConstraints(max_length=200)]
    ] = Field(max_length=20)


class Milestone(BaseSchema):
    position: int = Field(ge=1)
    title: str = Field(min_length=1, max_length=200)
    description: str = Field(min_length=1, max_length=1000)


class ProjectIdea(BaseSchema):
    title: str = Field(min_length=1, max_length=200)
    description: str = Field(min_length=1, max_length=3000)
    difficulty: Level
    technologies: list[Annotated[str, StringConstraints(min_length=1, max_length=60)]] = Field(min_length=1, max_length=12)
    estimated_hours: int = Field(ge=1, le=1000)
    milestones: list[Milestone] = Field(min_length=1, max_length=10)
    rationale: str = Field(min_length=1, max_length=1000)

    @model_validator(mode="after")
    def milestone_positions_are_contiguous(self):
        expected = list(range(1, len(self.milestones) + 1))
        actual = [milestone.position for milestone in self.milestones]

        if actual != expected:
            raise ValueError("milestone positions must be 1..n in order")

        return self


class ProjectRecommendationResponse(BaseSchema):
    request_id: UUID
    projects: list[ProjectIdea] = Field(min_length=1, max_length=5)
    disclaimer: str = Field(min_length=1, max_length=500)