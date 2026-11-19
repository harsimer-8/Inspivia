from uuid import UUID
from enum import Enum
from typing import Annotated
from pydantic import BaseModel, Field, StringConstraints, model_validator, field_validator
from urllib.parse import urlparse


from app.schemas.chat import BaseSchema, StudentContext


Short = Annotated[
    str,
    StringConstraints(
        min_length=1,
        max_length=80,
        strip_whitespace=True
    )
]


class ResourceType(str, Enum):
    ARTICLE = "ARTICLE"
    VIDEO = "VIDEO"
    COURSE = "COURSE"
    BOOK = "BOOK"
    DOCS = "DOCS"
    OTHER = "OTHER"


class RoadmapRequest(BaseSchema):
    request_id: UUID
    student: StudentContext
    domain: Short
    duration_weeks: int = Field(ge=4, le=52)
    hours_per_week: int = Field(ge=1, le=40)


class Resource(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    url: str = Field(max_length=500)
    type: ResourceType

    @field_validator("url")
    @classmethod
    def validate_http_url(cls, value: str) -> str:
        parsed = urlparse(value)

        if parsed.scheme not in {"http", "https"} or not parsed.netloc:
            raise ValueError("Resource URL must be an absolute HTTP(S) URL.")

        return value


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
    def positions_are_contiguous(self):
        expected = list(range(1, len(self.steps) + 1))
        actual = [step.position for step in self.steps]

        if actual != expected:
            raise ValueError("step positions must be 1..n in order")

        return self
