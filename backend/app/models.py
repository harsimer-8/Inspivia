from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from sqlalchemy import MetaData
from sqlalchemy.engine import RowMapping


@dataclass(frozen=True)
class SchemaModel:
    """A runtime model bound to a migration-owned PostgreSQL table."""

    name: str
    table: Any

    @classmethod
    def from_metadata(cls, metadata: MetaData, name: str) -> SchemaModel:
        try:
            return cls(name, metadata.tables[f"public.{name}"])
        except KeyError:
            try:
                return cls(name, metadata.tables[name])
            except KeyError:
                raise RuntimeError(f"Required database table '{name}' is missing; apply migrations") from None


@dataclass(frozen=True)
class UserRecord:
    id: Any
    email: str
    password_hash: str
    full_name: str
    role: str
    status: str


def mapping_dict(row: RowMapping) -> dict[str, Any]:
    """Convert SQLAlchemy rows to plain values without exposing ORM internals."""
    return dict(row)


MIGRATION_OWNED_TABLES = frozenset(
    {
        "users", "refresh_tokens", "email_verification_tokens", "password_reset_tokens",
        "domains", "skills", "student_profiles", "student_interests", "mentor_profiles",
        "mentor_applications", "user_skills", "mentor_expertise", "mentor_availability",
        "mentorships", "mentorship_sessions", "projects", "project_technologies",
        "project_milestones", "project_tasks", "project_enrollments", "task_submissions",
        "roadmaps", "roadmap_steps", "feedback", "contact_inquiries", "notifications",
        "ai_conversations", "ai_messages", "match_waitlist", "reassignment_requests",
        "mentor_guidance", "audit_logs", "student_projects", "resources", "opportunities",
        "bookmarks", "teams", "team_members", "user_consents", "announcements",
    }
)
