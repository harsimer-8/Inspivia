from __future__ import annotations

import uuid
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException
from sqlalchemy import Engine, text

from app.ai_contract import ChatRole, ChatTurn, StudentContext


class SqlStudentContextProvider:
    """Builds only the student fields permitted by the AI service contract."""

    def __init__(self, engine: Engine):
        self.engine = engine

    def for_user(self, user_id: uuid.UUID) -> StudentContext:
        with self.engine.connect() as connection:
            row = connection.execute(
                text(
                    """
                    SELECT u.full_name, sp.degree, sp.current_year, sp.career_goals,
                           selected.name AS selected_domain
                    FROM users u
                    LEFT JOIN student_profiles sp ON sp.user_id = u.id
                    LEFT JOIN domains selected ON selected.id = sp.selected_domain_id
                    WHERE u.id = :user_id AND u.role = 'STUDENT'
                    """
                ),
                {"user_id": user_id},
            ).mappings().one_or_none()
            if row is None:
                raise HTTPException(status_code=404, detail="Student not found")
            if row["degree"] is None:
                raise HTTPException(status_code=409, detail="Student profile is not available")
            interests = connection.execute(
                text(
                    """
                    SELECT d.name FROM student_interests i
                    JOIN domains d ON d.id = i.domain_id
                    WHERE i.student_id = :user_id ORDER BY d.name LIMIT 20
                    """
                ),
                {"user_id": user_id},
            ).scalars().all()
            skill_rows = connection.execute(
                text(
                    """
                    SELECT s.name, us.level FROM user_skills us
                    JOIN skills s ON s.id = us.skill_id
                    WHERE us.user_id = :user_id ORDER BY s.name LIMIT 40
                    """
                ),
                {"user_id": user_id},
            ).mappings().all()

        name = (row["full_name"] or "").split()
        return StudentContext(
            student_id=user_id,
            first_name=name[0][:80] if name else None,
            degree=row["degree"],
            current_year=row["current_year"],
            interests=[value[:80] for value in interests],
            skills=[{"name": skill["name"][:80], "level": skill["level"]} for skill in skill_rows],
            career_goals=row["career_goals"],
            selected_domain=row["selected_domain"][:80] if row["selected_domain"] else None,
        )

    def enrolled_project_titles(self, user_id: uuid.UUID) -> list[str]:
        with self.engine.connect() as connection:
            return connection.execute(
                text(
                    """
                    SELECT DISTINCT title FROM (
                        SELECT p.title AS title
                        FROM project_enrollments e JOIN projects p ON p.id = e.project_id
                        WHERE e.student_id = :user_id AND e.status = 'ACTIVE'
                        UNION
                        SELECT title FROM student_projects
                        WHERE student_id = :user_id AND status IN ('PLANNED','IN_PROGRESS')
                    ) enrolled
                    ORDER BY title LIMIT 40
                    """
                ),
                {"user_id": user_id},
            ).scalars().all()


class SqlAiConversationStore:
    def __init__(self, engine: Engine):
        self.engine = engine

    def resolve_or_create(self, user_id: uuid.UUID, conversation_id: uuid.UUID | None) -> uuid.UUID:
        if conversation_id is not None:
            with self.engine.connect() as connection:
                exists = connection.execute(
                    text(
                        "SELECT 1 FROM ai_conversations WHERE id = :id AND user_id = :user_id"
                    ),
                    {"id": conversation_id, "user_id": user_id},
                ).scalar_one_or_none()
            if exists is None:
                raise HTTPException(status_code=404, detail="AI conversation not found")
            return conversation_id
        conversation_id = uuid.uuid4()
        with self.engine.begin() as connection:
            connection.execute(
                text("INSERT INTO ai_conversations (id, user_id) VALUES (:id, :user_id)"),
                {"id": conversation_id, "user_id": user_id},
            )
        return conversation_id

    def recent_turns(self, conversation_id: uuid.UUID, limit: int) -> list[ChatTurn]:
        if limit <= 0:
            return []
        with self.engine.connect() as connection:
            rows = connection.execute(
                text(
                    """
                    SELECT role, content FROM ai_messages
                    WHERE conversation_id = :conversation_id
                    ORDER BY created_at DESC, id DESC LIMIT :limit
                    """
                ),
                {"conversation_id": conversation_id, "limit": limit},
            ).mappings().all()
        return [ChatTurn(role=ChatRole(row["role"]), content=row["content"]) for row in reversed(rows)]

    def append_exchange(self, conversation_id: uuid.UUID, user_message: str, assistant_reply: str) -> None:
        now = datetime.now(timezone.utc)
        assistant_at = now + timedelta(microseconds=1)
        with self.engine.begin() as connection:
            connection.execute(
                text(
                    """
                    INSERT INTO ai_messages (conversation_id, role, content, created_at)
                    VALUES (:conversation_id, 'USER', :user_message, :user_created_at),
                           (:conversation_id, 'ASSISTANT', :assistant_reply, :assistant_created_at)
                    """
                ),
                {
                    "conversation_id": conversation_id,
                    "user_message": user_message,
                    "assistant_reply": assistant_reply,
                    "user_created_at": now,
                    "assistant_created_at": assistant_at,
                },
            )
            connection.execute(
                text(
                    "UPDATE ai_conversations SET updated_at = :updated_at WHERE id = :conversation_id"
                ),
                {"updated_at": assistant_at, "conversation_id": conversation_id},
            )
