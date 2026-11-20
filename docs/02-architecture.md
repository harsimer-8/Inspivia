# INSPIVIA — Stage 2: Architecture

> **Implementation update:** the backend runtime is Python/FastAPI (`backend/`), and the separate Python AI service (`ai-service/`) owns Gemini and prompts. Both communicate over HTTP using the shared contract. PostgreSQL migrations remain unchanged. Auth and non-AI product routes listed below are still planned, not implemented. See `03-ai-integration.md` and `contracts/ai-service.openapi.yaml` for the current AI contract.

## 1. System overview

```
Browser ──► Next.js 14 (frontend/)  ──REST/JSON──►  FastAPI (backend/)  ──REST + API key──►  FastAPI (ai-service/) ──► LLM provider
                                                        │
                                                    PostgreSQL 16 (Flyway)         SMTP (MailHog in dev)
```
- Three independently deployable services; the backend touches PostgreSQL, while the AI service is stateless and has no database credentials.
- **The backend is the source of truth.** Each AI request carries the context needed by the AI service, which returns a structured suggestion.
- The backend persists AI conversation history; generated recommendations remain proposals until a student explicitly saves them.

## 2. Key decisions (and why)

1. **Modular monolith** for the backend (`backend/app`), not microservices. The only real service boundary is AI, because its scaling profile differs.
2. **Tokens.** Access JWT (15 min, HS256 with ≥256-bit secret from env, claims: `sub`, `role`, `jti`). Refresh token is an opaque random 256-bit value, **stored hashed (SHA-256)** in `refresh_tokens` with `family_id`; rotated on every use. Reuse of a rotated token revokes the entire family (theft detection).
3. **Where the browser keeps them.** Access token in memory only; refresh token in an `HttpOnly; Secure; SameSite=Lax` cookie scoped to `/api/v1/auth`. Next.js rewrites `/api/v1/*` to the backend so the browser sees a single origin (no third-party cookie problems), while CORS stays locked to configured origins for direct/non-proxied use. Frontend and backend remain independently deployable.
4. **Backend→AI service auth.** Shared service key in `X-Service-Key` (constant-time compare) over the private Docker network; the AI service is not published publicly. Backend timeouts (connect 2s, read 30s).
5. **Mentor discovery is planned deterministic backend logic** (approved + active + available + capacity, filtered by domain/skills). No AI involved (see 03-ai-integration.md §5); this route is not implemented yet.
6. **AI output is advisory and proposal-only.** The backend validates responses against the contract and does not persist recommendations without an explicit student action.
7. **Rate limiting**: an in-memory limiter exists in the backend; apply and validate endpoint-specific production limits before exposing new routes.
8. **IDs** are UUIDs (v4) in the API; internal PKs `uuid` too, to avoid enumeration. Timestamps `timestamptz`.
9. **Errors** use RFC 7807 `application/problem+json` with `errors[]` per-field details.
10. **Pagination**: `page`, `size` (max 50), `sort`; response `{content, page, size, totalElements, totalPages}`.

## 3. Database schema (PostgreSQL, Flyway `V1…`)

Common audit columns on all tables: `created_at`, `updated_at`, (and `created_by` where relevant). Soft-delete only on `users` (`status`).

**Identity**
- `users` (id, email UNIQUE citext, password_hash, full_name, role, status[PENDING_VERIFICATION|ACTIVE|SUSPENDED|REJECTED], email_verified_at, last_login_at)
- `refresh_tokens` (id, user_id FK CASCADE, token_hash UNIQUE, family_id, expires_at, revoked_at, replaced_by, user_agent, ip) idx(user_id), idx(family_id)
- `email_verification_tokens`, `password_reset_tokens` (id, user_id FK CASCADE, token_hash UNIQUE, expires_at, used_at). *Not in your entity list but required.*

**Profiles**
- `student_profiles` (user_id PK/FK 1:1, college, degree, current_year CHECK 1–8, career_goals, selected_domain_id FK)
- `mentor_profiles` (user_id PK/FK 1:1, title, organization, years_experience CHECK ≥0, bio, linkedin_url, max_mentees, accepting_mentees)
- `mentor_applications` (id, mentor_user_id FK, status[PENDING|APPROVED|REJECTED], reviewed_by FK users, review_note, reviewed_at) partial UNIQUE (mentor_user_id) WHERE status='PENDING'

**Taxonomy**
- `domains` (id, slug UNIQUE, name, description, active)
- `skills` (id, slug UNIQUE, name, domain_id FK nullable)
- `user_skills` (user_id, skill_id, level[BEGINNER|INTERMEDIATE|ADVANCED]) PK(user_id, skill_id)
- `student_interests` (student_id, domain_id) PK both
- `mentor_expertise` (mentor_id, domain_id, skill_id nullable) UNIQUE
- `mentor_availability` (id, mentor_id, day_of_week CHECK 1–7, start_time, end_time, timezone) CHECK(start<end)

**Mentorship**
- `mentorships` (id, student_id, mentor_id, status[REQUESTED|ACTIVE|DECLINED|COMPLETED|CANCELLED], started_at, ended_at) partial UNIQUE (student_id, mentor_id) WHERE status IN ('REQUESTED','ACTIVE')
- `mentorship_sessions` (id, mentorship_id FK, scheduled_at, duration_min, meeting_url, status[SCHEDULED|COMPLETED|CANCELLED|NO_SHOW], notes)
- `feedback` (id, mentorship_id/session_id/project_id nullable with CHECK exactly-one-subject, author_id, direction[STUDENT_TO_MENTOR|MENTOR_TO_STUDENT|MENTOR_REVIEW], rating 1–5, comment) UNIQUE per (subject, author)

**Projects**
- `projects` (id, slug UNIQUE, title, description, domain_id, difficulty[BEGINNER|INTERMEDIATE|ADVANCED], status[DRAFT|PUBLISHED|ARCHIVED], created_by, est_hours)
- `project_technologies` (project_id, name) ; `project_milestones` (id, project_id, position, title, description) UNIQUE(project_id, position)
- `project_tasks` (id, milestone_id, position, title, description)
- `project_enrollments` (id, project_id, student_id, status[ACTIVE|COMPLETED|DROPPED], progress_pct computed in service, enrolled_at, completed_at) UNIQUE(project_id, student_id)
- `task_submissions` (id, task_id, enrollment_id, content, link_url, status[SUBMITTED|CHANGES_REQUESTED|APPROVED], reviewer_id, review_comment, submitted_at) idx(enrollment_id)

**Roadmaps**
- `roadmaps` (id, student_id, domain_id, title, status[ACTIVE|ARCHIVED], generated_by[AI|MENTOR|MANUAL], version)
- `roadmap_steps` (id, roadmap_id, position, title, description, resource_urls jsonb, status[TODO|IN_PROGRESS|DONE], completed_at) UNIQUE(roadmap_id, position)

**Platform**
- `contact_inquiries` (id, name, email, category, message, status[NEW|IN_PROGRESS|RESOLVED|SPAM], assigned_to, ip_hash, created_at)
- `notifications` (id, user_id, type, title, body, read_at) idx(user_id, read_at)
- `ai_conversations` (id, user_id, title, created_at) ; `ai_messages` (id, conversation_id FK CASCADE, role[USER|ASSISTANT], content, created_at) idx(conversation_id, created_at)

Cascades: deleting a user cascades tokens/profile/conversations; **never** cascades to mentorship/feedback history (those restrict; users are suspended, not deleted).

## 4. API surface (refined from your proposal)

Same groups as your brief under `/api/v1`, with these refinements:
- `POST /auth/register/student` and `/auth/register/mentor` (different payloads) instead of one polymorphic `register`; plus `POST /auth/verify-email`, `POST /auth/resend-verification`.
- `GET /contact/categories` (public), `POST /contact`; admin: `GET /admin/inquiries`, `PATCH /admin/inquiries/{id}`.
- Mentorship: `POST /mentorships` (student requests), `PATCH /mentorships/{id}/accept|decline`, `GET/POST /mentorships/{id}/sessions`.
- Tasks: `POST /tasks/{id}/submissions`, `PATCH /submissions/{id}/review`.
- Drop `POST /mentors/apply` (see assumption #2); mentor approval lives under `/admin/mentors/{id}/approve|reject|suspend`.
- Public: `GET /public/stats`, `GET /domains`, `GET /skills`.
- Admin user management: `PATCH /admin/users/{id}/status`.
- AI endpoints (frontend-facing): `POST /ai/chat`, `/ai/roadmap`, `/ai/project-recommendations`, `GET /ai/status` (admin). `/ai/domain-recommendations` and `/ai/mentor-recommendations` are removed from AI scope. Spring builds the context server-side from the authenticated user, so clients cannot inject another student's data.

## 5. Spring ↔ FastAPI contract
Superseded: see `contracts/ai-service.openapi.yaml` and `docs/03-ai-integration.md`.

## 6. Delivery plan (matches your stages)

| Stage | Deliverable | Verification |
|---|---|---|
| 3 | Python backend runtime, migrations, auth, users, RBAC | Backend unit tests; auth routes still pending |
| 4 | Students, mentors, projects, mentorship, roadmap, feedback, contact | API/service tests; routes still pending |
| 5 | Backend AI integration layer. AI service is built against the shared contract | Backend tests against mocked/external AI client |
| 6 | Next.js API client, auth, contact wiring, new pages | `next build` + typecheck |
| 7 | Dockerfiles, Compose, README | `docker compose config`, full-stack smoke test |

Honesty note: I will only call an endpoint "done" after tests for it pass in this sandbox. If something cannot be run here (for example Testcontainers needs a Docker daemon), I will say so explicitly instead of claiming it passed.
