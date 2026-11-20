# INSPIVIA backend

The backend is a Python 3.11+ FastAPI application. Run it from this directory with
`pip install -r requirements.txt` followed by
`uvicorn app.main:app --host 0.0.0.0 --port 8080`, or build the supplied Dockerfile.
Run its test suite from this directory with `python -m pytest -q`.

Configure PostgreSQL with `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, and
`DB_PASSWORD`. The SQLAlchemy URL is composed from these values, so credentials are
escaped correctly. `AUTO_MIGRATE` defaults to `true`; startup applies the unchanged
Flyway SQL scripts from `src/main/resources/db/migration` and records them in
`flyway_schema_history`. Set `JWT_SECRET` to at least 32 bytes and configure
`AI_SERVICE_API_KEY`; the latter is sent only to `AI_SERVICE_BASE_URL` as
`X-Service-Key`. The JWT and AI timeout/history settings retain their existing
`JWT_ACCESS_TTL`, `JWT_REFRESH_TTL`, `AI_CONNECT_TIMEOUT`, `AI_READ_TIMEOUT`, and
`AI_MAX_HISTORY_MESSAGES` environment variable names. Optional SMTP delivery uses
`MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM`, and
`FRONTEND_BASE_URL`.

Implemented HTTP behavior is limited to the four existing AI routes and the existing
actuator health/info routes. The chat/context and conversation-store adapters read and
write the migration-backed student, taxonomy, project-enrollment, `ai_conversations`,
and `ai_messages` tables. Core tables are reflected from the migrated PostgreSQL
schema and exposed to internal code through allow-listed, parameterized CRUD
repositories. JWT signing/verification, role checks, CORS, and the in-memory rate
limiter are represented in Python.

No auth, mentorship, catalogue, or other planned business routes are implemented;
their database entities/repositories were scaffolding, not working HTTP functionality,
so those routes are intentionally not fabricated. Existing migrations remain at their
original path and are not rewritten.
