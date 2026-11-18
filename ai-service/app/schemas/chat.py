
from enum import Enum
from typing import Optional, Annotated
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, StringConstraints


Short = Annotated[
    str,
    StringConstraints(
        min_length=1,
        max_length=80,
        strip_whitespace=True
    )
]

class Level(str, Enum):
    BEGINNER = "BEGINNER"
    INTERMEDIATE = "INTERMEDIATE"
    ADVANCED = "ADVANCED"


class Role(str, Enum):
    USER = "USER"
    ASSISTANT = "ASSISTANT"


class BaseSchema(BaseModel):
    model_config = ConfigDict(extra="ignore")


class SkillLevel(BaseSchema):
    name: Short
    level: Level


class StudentContext(BaseSchema):
    student_id: UUID
    first_name: Optional[str] = Field(default=None, max_length=80)
    degree: Optional[str] = Field(default=None, max_length=120)
    current_year: Optional[int] = Field(default=None, ge=1, le=8)
    interests: list[Short] = Field(max_length=20)
    skills: list[SkillLevel] = Field(max_length=40)
    career_goals: Optional[str] = Field(default=None, max_length=2000)
    selected_domain: Optional[str] = Field(default=None, max_length=80)


class ChatTurn(BaseSchema):
    role: Role
    content: str = Field(min_length=1, max_length=8000)


class ChatRequest(BaseSchema):
    request_id: UUID
    student: StudentContext
    history: list[ChatTurn] = Field(max_length=20)
    message: str = Field(min_length=1, max_length=4000)
    locale: str = Field(default="en", max_length=10)


class ChatResponse(BaseModel):
    request_id: UUID
    reply: str = Field(min_length=1, max_length=8000)
    suggested_follow_ups: list[str] = Field(max_length=4)
    disclaimer: str = Field(min_length=1, max_length=500)
