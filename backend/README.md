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
`MAIL_HOST`, `MAIL_PORT`, `MAIL_USE_TLS`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_FROM`, and
`FRONTEND_BASE_URL`.

## Authentication

Implemented endpoints are under `/api/v1`:

- `POST /auth/register/student` creates a pending student profile and emails a verification link.
- `POST /auth/verify-email`, `/auth/resend-verification`, `/auth/login`, `/auth/refresh`, `/auth/logout`,
  `/auth/forgot-password`, and `/auth/reset-password` manage account verification and sessions.
- `GET /auth/me` returns the authenticated user; `GET/PUT /students/me` reads or updates degree,
  year, and selected domain (use a seeded domain slug such as `web-development`).

Passwords are limited to 8–128 characters and stored as PBKDF2-SHA256 hashes. Refresh tokens are
rotated, stored only as SHA-256 hashes, and reuse revokes the token family. Login/refresh return
both tokens in JSON for the trusted Next.js server-to-server call. The Next.js server must store
them in HttpOnly cookies and must not expose them to browser JavaScript.

Set `FRONTEND_BASE_URL` to the deployed frontend origin. Verification and reset emails link to
`/auth/verify-email?token=...` and `/auth/reset-password?token=...`, respectively. Track labels
such as “Applied AI” are not currently mapped to database domains; send a domain slug via
`selectedDomain` once the frontend has an agreed mapping.

### Brevo SMTP

For Brevo transactional SMTP, set these backend environment variables (locally in an ignored
`.env`, or in the deployment's secret/environment settings):

```env
MAIL_HOST=smtp-relay.brevo.com
MAIL_PORT=587
MAIL_USE_TLS=true
MAIL_USERNAME=<Brevo SMTP login>
MAIL_PASSWORD=<Brevo SMTP key, not the API key>
MAIL_FROM=<sender address verified in Brevo>
```

In Brevo, verify the sender address (preferably authenticate the sending domain with its
provided DNS records) and ensure the transactional email feature/account is enabled. Keep
credentials out of Git and chat. The backend now requires STARTTLS for authenticated SMTP and
returns `503 EMAIL_DELIVERY_FAILED` if the provider refuses a message. The automated test suite
mocks SMTP; a real send must be verified with credentials and a verified sender in the provider
account.

Implemented HTTP behavior includes student authentication and profile routes, the four
AI routes, and actuator health/info. Other planned mentorship, catalogue, and business
routes remain unimplemented; their database entities/repositories were scaffolding, so
those routes are intentionally not fabricated. Existing migrations remain unchanged.
