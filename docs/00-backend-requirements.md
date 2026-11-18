# INSPIVIA — Backend Requirements (derived from the supplied frontend and your briefs)

Scope: **backend only**. The frontend ZIP was read, not changed (the copy in `inspivia/frontend/` is byte-identical to the upload). Full frontend findings are in `01-frontend-audit.md`.

## What the frontend actually requires today
- One form: `ContactUs.tsx` → name, email, category chip, message. Needs `POST /api/v1/contact` and a categories list. Categories are currently agency services; backend ships neutral categories (`GENERAL, STUDENT_SUPPORT, MENTOR_ONBOARDING, PARTNERSHIP, TECHNICAL_ISSUE, FEEDBACK`) which the frontend owner will wire in.
- No auth, dashboards or data fetching exist yet. Backend is built to the product briefs; the frontend owner will consume it.
- Placeholder data (fake clients, team, partners, stats) is **not** reproduced in the database.

## Module scope
Auth & RBAC · users/profiles · students · mentors (+applications, expertise, availability) · projects/milestones/tasks/enrollment/submissions/reviews · mentorships & sessions · feedback · roadmap storage & progress · contact · notifications · admin · AI integration client.

## Decisions carried forward
See `02-architecture.md`. Where the later brief supersedes it: **AI endpoints in FastAPI are `/api/v1/ai/{chat,roadmap,project-recommendations}` + `/health`; domain and mentor recommendation are NOT AI-service features.** Mentor discovery is implemented in Java as a filter/search over expertise and availability (database queries, no model, no prompts).

## Endpoint list (final, refined from the brief)
Auth: `register/student`, `register/mentor`, `login`, `refresh`, `logout`, `verify-email`, `resend-verification`, `forgot-password`, `reset-password`, `GET me`.
Students: `GET/PUT /students/me`, `/students/me/{dashboard,mentors,projects,roadmaps}`; roadmap step progress `PATCH /students/me/roadmaps/{id}/steps/{stepId}`.
Mentors: `GET /mentors` (filters: domain, skill, availability), `GET /mentors/{id}`, `PUT /mentors/me`, `GET /mentors/me/students`, availability CRUD. `POST /mentors/apply` is kept as **re-application** after a rejection (initial application is created at mentor registration).
Projects: catalogue, detail, enroll, progress, task submissions, review; create/update by ADMIN or approved MENTOR.
Mentorship: `POST/GET /mentorships`, `GET /mentorships/{id}`, accept/decline, sessions, feedback.
Contact: `POST /contact`, `GET /contact/categories`. Admin: dashboard, users, mentor approval/rejection/suspension, inquiries (list, update status), projects, mentorships.
AI: three endpoints + status; see `03-ai-integration.md` and `contracts/ai-service.openapi.yaml` (authoritative).

## Open questions that affect code
1. Should students be blocked from mentorship requests until email is verified? (Assumed yes.)
2. Email sender address/domain and SMTP provider for production.
3. Under-18 students: parental-consent requirements.
4. Admin bootstrap uses `ADMIN_EMAIL`/`ADMIN_PASSWORD` env vars on first start.
