# INSPIVIA — Complete Backend Plan (aligned to Product & Development Plan v1.0 and the supplied frontend)

Status legend: ✅ done and verified · 🟡 implemented, not integration-tested · ⬜ not started

## 0. Ownership
| Part | Owner | Backend's relationship |
|---|---|---|
| Next.js frontend | frontend developer | Consumes `/api/v1`; backend never edits it |
| FastAPI AI service (Gemini, prompts, RAG, validation) | AI developer | Spring calls it through `ai/` client; contract in `contracts/ai-service.openapi.yaml` |
| Python FastAPI backend + PostgreSQL | **you** | This plan |

**Where the PDF and your confirmed decision differ:** the PDF lists "Spring AI + pgvector". Gemini, prompts, and AI generation belong to the separate AI service. The Python backend owns auth, data access, and PostgreSQL; RAG/embeddings/vector search belong to the AI service.

## 1. Release mapping (PDF §13 → backend)
| Release | Backend scope | Status |
|---|---|---|
| R2 Accounts & core | Auth, JWT/refresh rotation, email verification, password reset, roles, student profile, domain catalog | ⬜ (schema ✅) |
| R3 Mentorship | Mentor profiles/expertise/availability/capacity, **automatic assignment**, waitlist, admin override + audit, mentor dashboard | ⬜ (schema ✅) |
| R4 Student workspace | Dashboard, roadmap storage/progress, student projects, saved resources, portfolio basics | ⬜ (schema ✅) |
| R5 AI Mentor | Chat/roadmap/project-recommendation endpoints calling the AI service | 🟡 Python client and PostgreSQL-backed student context/conversation stores implemented; backend tests pass, live service integration not run |
| R6 Feedback (+RAG on Python side) | Typed feedback, issue reports, admin review | ⬜ (schema ✅) |
| R7 Ecosystem | Opportunities, teams, analytics | ⬜ (schema ✅) |

MVP (PDF §14) = R2 + R3 + basic dashboards + feedback + contact. Build order follows that.

## 2. Automatic mentor assignment (core rule, PDF §5.1–5.2)
Trigger: student sets/changes domain after onboarding (or admin runs "retry waitlist").
1. Eligible mentors: `users.status=ACTIVE`, approved application, `accepting_mentees=true`, supports the domain via `mentor_expertise`, has ≥1 `mentor_availability` slot, and `active mentees < max_mentees`.
2. Rank: (a) fewest active mentees ÷ capacity, (b) number of the student's selected skills covered by `mentor_expertise.skill_id`, (c) years of experience, (d) oldest last assignment (fairness tiebreak).
3. Create `mentorships(status=ACTIVE, origin=AUTO)` in one transaction with a **row lock on the mentor** so two simultaneous students cannot exceed capacity; the DB also enforces one ACTIVE mentorship per student.
4. No eligible mentor → `match_waitlist(WAITING)`, student sees "pending match", gets a notification when matched. A scheduled job retries the waitlist (FIFO) when capacity/availability changes and every few minutes.
5. Never assign an unsuitable mentor (PDF §16). Reassignment: student files `reassignment_requests`; admin approves (old mentorship → `REASSIGNED`, new one `reassigned_from` set) or overrides directly (`origin=ADMIN`); every action writes `audit_logs`.

Auth rules (PDF §11): a student sees only their own data and their mentor's public profile; a mentor sees only students with an ACTIVE mentorship to them; admin actions are audited. Anonymous feedback hides the author from the reviewed mentor, never from admins.

## 3. Final API (all under `/api/v1`, JSON, RFC 7807 errors)
**Auth** `POST /auth/register/student`, `/auth/register/mentor`, `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/verify-email`, `/auth/resend-verification`, `/auth/forgot-password`, `/auth/reset-password`, `GET /auth/me`
**Public** `GET /domains`, `GET /skills`, `POST /contact`, `GET /contact/categories`, `GET /announcements`, `GET /mentors` (approved only, public fields)
**Student** `GET/PUT /students/me`, `PUT /students/me/domain` (triggers matching), `GET /students/me/dashboard`, `GET /students/me/mentor`, `POST /students/me/mentor/reassignment-requests`, `GET /students/me/roadmaps`, `PATCH /students/me/roadmaps/{id}/steps/{stepId}`, `GET/POST/PUT /students/me/projects`, `GET/PUT /students/me/consents/ai-chat-history`, `DELETE /students/me/ai/conversations/{id}`
**Mentor** `GET/PUT /mentors/me`, `PUT /mentors/me/domains`, `PUT /mentors/me/availability`, `GET /mentors/me/students`, `GET /mentors/me/students/{studentId}` (progress, roadmaps, projects), `POST /mentorships/{id}/guidance`, `POST /mentorships/{id}/sessions`, `PATCH /sessions/{id}`
**Catalogue** `GET /projects`, `GET /projects/{id}`, `POST/PUT /projects` (ADMIN/MENTOR), `POST /projects/{id}/enroll`, `GET /projects/{id}/progress`, task submissions + review
**Resources & opportunities** `GET /resources`, `GET /opportunities`, `POST/DELETE /bookmarks`, `GET /bookmarks`; admin CRUD `/admin/resources`, `/admin/opportunities`
**Feedback** `POST /feedback` (MENTOR, LEARNING, PLATFORM, ISSUE); admin `GET /admin/feedback`, `PATCH /admin/feedback/{id}`
**Teams (R7)** `GET/POST /teams`, `POST /teams/{id}/join`
**AI** `POST /ai/chat`, `POST /ai/roadmap`, `POST /ai/project-recommendations`, `GET /ai/status` (roadmap save and chat history only with consent)
**Admin** `GET /admin/dashboard` (counts, match rate, avg time-to-assignment, waitlist size, feedback open), `/admin/users` (+status), `/admin/mentors/pending|{id}/approve|reject|suspend`, `/admin/mentorships` + `POST /admin/mentorships/{id}/reassign`, `/admin/waitlist`, `/admin/inquiries`, `/admin/announcements`, `/admin/audit-logs`

## 4. Frontend contract (current frontend + what the frontend developer needs)
- Existing contact form → `POST /contact` `{name,email,category,message}`; categories from `GET /contact/categories`. Backend categories are student-platform ones, so the form's four agency chips need replacing by the frontend owner.
- Auth: refresh token in `HttpOnly` cookie (`/api/v1/auth`), access token returned in JSON, kept in memory. Frontend should call through a same-origin Next rewrite or use `credentials: 'include'` (CORS allows configured origins with credentials).
- Pages the frontend needs for this API: register (student/mentor), login, verify-email, forgot/reset password, student onboarding + dashboard, mentor dashboard, admin portal, AI Mentor chat, roadmap, projects, resources/opportunities, feedback. OpenAPI JSON at `/v3/api-docs` is the type source.
- Frontend placeholders (agency clients, fake team, fake stats) are not backed by data; `GET /public/stats` returns real counts only.

## 5. Database (✅ verified on PostgreSQL 16)
V1 core (28 tables) → V2 reference domains (8) → V3 plan alignment (40 tables total): automatic assignment columns, waitlist, reassignment requests, mentor guidance, audit log, typed feedback, student projects, resources, opportunities, bookmarks, teams, consents, announcements. Constraint behaviour tested: case-insensitive unique email, one pending mentor application, valid availability window, one ACTIVE mentorship per student, one waiting entry per student, mentor feedback needs mentorship+rating, bookmark needs exactly one target.
Mapping to PDF tables: `roles`→`users.role`; `mentor_assignments`→`mentorships`; `mentor_domains`→`mentor_expertise`; `roadmap_tasks`→`roadmap_steps`; `conversations`/`chat_messages`→`ai_conversations`/`ai_messages`; `knowledge/embeddings` → AI service.

## 6. Build and test plan (what "done" will mean)
| Step | Work | Proof required |
|---|---|---|
| 1 | Security, JWT, auth flows, exception handling, mail | `python -m pytest`: unit + API + PostgreSQL integration tests green |
| 2 | Profiles, domains/skills, student onboarding | tests green |
| 3 | Mentor module + matching engine + waitlist + admin override | concurrency test (capacity never exceeded), no-match test |
| 4 | Projects, roadmaps, student projects, guidance, sessions | tests green |
| 5 | Feedback, contact, resources, opportunities, bookmarks, teams, admin dashboard | tests green |
| 6 | AI layer wiring against a mock FastAPI | contract tests green |
| 7 | Docker compose up, Swagger reachable, end-to-end scripted journey (register → verify → domain → assigned mentor → AI call via mock → feedback) | script output captured |

The backend has been ported to Python FastAPI. Its unit tests run with `python -m pytest`; integration work requiring a live PostgreSQL instance and the external AI service remains to be verified.
