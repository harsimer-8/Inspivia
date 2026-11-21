# 05 — Frontend ↔ Backend integration

Status: frontend integration is implemented against the backend auth + student-profile API (backend commit `eb4b0f7`).

## Request flow

```
Browser ──(same-origin /api/*, HttpOnly cookies)──▶ Next.js route handlers (Vercel)
        ──(Bearer JWT, server-to-server)──────────▶ FastAPI backend (Render) ──▶ Quaithe ──▶ Gemini
```

- The browser never sees a JWT or refresh token. Both live in HttpOnly, Secure (prod), SameSite=Lax cookies
  (`inspivia_access`, `inspivia_refresh`).
- Only the server-side code in `frontend/src/lib/server/` talks to the backend. All URLs come from `BACKEND_API_URL`.
- Expired access tokens are renewed transparently once per request (`lib/server/proxy.ts`).
- The frontend holds no Gemini or AI-service secret.

## Implemented backend routes the frontend uses

| Frontend route | Backend | Notes |
|---|---|---|
| `POST /api/ai-companion` | `POST /api/v1/ai/chat` | body `{message (≤4000), conversationId?}` → `{conversationId, reply, suggestedFollowUps, disclaimer}`; STUDENT role only |

## Backend contract used (confirmed against `backend/app/auth.py`, commit eb4b0f7)

All of it is confined to `frontend/src/lib/server/authContract.ts`.

| Frontend route | Backend call | Notes |
|---|---|---|
| `POST /api/auth/register` | `POST /auth/register/student` `{fullName,email,password,college,degree,currentYear}` | 201; account is `PENDING_VERIFICATION`, so the user is NOT signed in; 409 `EMAIL_ALREADY_EXISTS` |
| `POST /api/auth/login` | `POST /auth/login` `{email,password}` → `{accessToken,refreshToken}` | 401 `INVALID_CREDENTIALS`, 403 `EMAIL_NOT_VERIFIED`; tokens go into HttpOnly cookies, never to the browser |
| (internal, on 401/expiry) | `POST /auth/refresh` `{refreshToken}` | rotated; reuse revokes the family |
| `POST /api/auth/logout` | `POST /auth/logout` `{refreshToken}` | 204; cookies cleared even if the backend is unreachable |
| `GET /api/auth/me` | `GET /auth/me` + `GET /students/me` | merged into `{id,email,name,role,course,year,enrolledTrack}` |
| `POST /api/auth/verify-email` | `POST /auth/verify-email` `{token}` / `POST /auth/resend-verification` `{email}` | token 20-256 chars |
| `POST /api/auth/reset-password` | `POST /auth/forgot-password` `{email}` / `POST /auth/reset-password` `{token,newPassword}` | generic response whether or not the account exists |
| `POST /api/ai-companion` | `POST /ai/chat` `{message (<=4000), conversationId?}` | STUDENT role only |

Backend errors (`{detail:{code,message}}`, validation problem JSON, plain `{detail}`) are normalised to `{error, code, fieldErrors?}`.

**Open items**
- *Track mapping:* the register form's track dropdown is kept but **not sent**. Send `selectedDomain` (a slug such as `web-development`)
  only once the frontend labels are mapped to domain slugs. Until then the dashboard shows "Not selected yet".
- *Profile editing:* `PUT /students/me` is not wired up; the profile page's bio/links are local-only. Note that PUT without
  `selectedDomain` sets the stored domain to null, so the frontend must always send the current domain when it starts using PUT.
- The dashboard shows the domain slug as a label (`ai-ml` → "AI ML") because the API returns only the slug.

## Environment variables (Vercel, all server-only)

| Name | Required | Purpose |
|---|---|---|
| `BACKEND_API_URL` | yes | e.g. `https://inspivia-backend.onrender.com` — no trailing slash, no `/api/v1` |
| `BACKEND_TIMEOUT_MS` | no (15000) | timeout for auth calls |
| `BACKEND_AI_TIMEOUT_MS` | no (45000) | timeout for AI chat |

Do **not** set `GEMINI_API_KEY` or `AI_SERVICE_API_KEY` on Vercel. In production a missing `BACKEND_API_URL` makes calls fail with 503.

## Deployment

1. Backend (Render): implement the endpoints above; set `CORS_ALLOWED_ORIGINS` to the Vercel origin (only needed for direct browser access),
   `FRONTEND_BASE_URL` to the Vercel URL so emailed verify/reset links point to `/auth/verify-email?token=` and `/auth/reset-password?token=`.
2. Vercel: import the repo, set **Root Directory = `frontend`**, framework Next.js, add `BACKEND_API_URL`, deploy.
   `/api/ai-companion` sets `maxDuration = 60`; Vercel Hobby allows up to 60s.
3. Render free instances sleep; first request after idle can exceed the 15s auth timeout — retry or use a paid/always-on instance.
4. Smoke test: register → email link → sign in → `/dashboard` → AI companion message → sign out.

## Test status

- `tsc`, `next lint`, `next build`: pass (build verified with Google Fonts mocked; the sandbox had no access to Google Fonts).
- 41-check end-to-end test, frontend (`next start`) against the REAL backend app, JWT middleware, `AuthService` and `/auth/*` + `/students/me` routes
  (in-memory SQLite, as in `backend/tests/test_auth.py`; AI service and SMTP stubbed). Covers register, duplicate, unverified login, verify/resend,
  login, cookie flags, profile merge, AI chat, refresh rotation, replay detection, password reset, logout.
- **Not tested:** PostgreSQL/Neon (SQLite ignores `FOR UPDATE`, so refresh concurrency is untested), real SMTP, Quaithe, Gemini, Vercel, a browser.

## Remaining blockers

- Agree the track → domain-slug mapping.
- Dashboard overview, roadmap, projects, mentors and sessions pages still show static demo content (no backend routes for them); profile edits are not persisted.
- The AI track selector is cosmetic: the chat contract has no track field (context is built server-side).
- Refresh de-duplication is per serverless instance; simultaneous multi-tab refreshes across instances can still trip reuse detection and sign the user out.
