# 05 — Frontend ↔ Backend integration

Status: frontend integration is implemented; **the backend auth endpoints it needs do not exist yet.**

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

## Backend endpoints REQUIRED but MISSING (contract assumed by the frontend)

All field names are **assumptions** (camelCase, matching the AI API). They live in
`frontend/src/lib/server/authContract.ts`; change that one file if the backend differs.

| Endpoint | Assumed request | Assumed response |
|---|---|---|
| `POST /api/v1/auth/register/student` | `{fullName, email, password, college, degree, currentYear (1-8)}` | 2xx; account created as `PENDING_VERIFICATION`; 409 if email exists |
| `POST /api/v1/auth/login` | `{email, password}` | `{accessToken, refreshToken}`; 401/403 for bad credentials or unverified |
| `POST /api/v1/auth/refresh` | `{refreshToken}` | `{accessToken, refreshToken}` (rotated; reuse revokes the family) |
| `POST /api/v1/auth/logout` | `{refreshToken}` + Bearer | 2xx |
| `GET /api/v1/auth/me` | Bearer | `{id, email, fullName, role}` |
| `POST /api/v1/auth/verify-email` | `{token}` | 2xx; 400/404/410 invalid or expired |
| `POST /api/v1/auth/resend-verification` | `{email}` | 2xx regardless of account existence |
| `POST /api/v1/auth/forgot-password` | `{email}` | 2xx regardless of account existence |
| `POST /api/v1/auth/reset-password` | `{token, newPassword}` | 2xx; 400/404/410 invalid or expired |
| `GET/PUT /api/v1/students/me` | Bearer | profile (degree, year, domain) — needed to show course/year/track on the dashboard |

**Deviation from docs/02-architecture.md:** that doc keeps the refresh token in a backend-set cookie and the access token in
browser memory. Because the Next.js server (not the browser) calls the backend, the frontend instead needs both tokens in the
JSON body and stores them in its own HttpOnly cookies. This also keeps JWTs out of client JavaScript.

**Open product decisions**
- `college` is NOT NULL in `student_profiles` but was not collected before; a required field was added to the register form.
- The frontend "track" values (Full-Stack, Applied AI, IoT, VLSI) do not map to the `domains` seed (web-development, ai-ml, …).
  The track is currently **not sent** to the backend.
- Password policy is 8–128 characters on the frontend; the backend should enforce its own.

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
- 29-check end-to-end test against the real backend app factory, JWT middleware and `/ai/chat` route (AI service stubbed, auth routes
  stubbed to the assumed contract) passes. **Not tested:** the real auth endpoints, Neon, Quaithe, Gemini, Vercel.

## Remaining blockers

- Backend auth + `students/me` endpoints (above).
- Dashboard overview, roadmap, projects, mentors and sessions pages still show static demo content; profile edits are not persisted.
- The AI track selector is cosmetic: the chat contract has no track field (context is built server-side).
- In-process refresh de-duplication is per serverless instance; refresh-token reuse detection can still trip on simultaneous multi-tab refreshes.
