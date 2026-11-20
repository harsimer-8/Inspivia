# INSPIVIA — Backend AI integration and shared contract

Status: The contract remains authoritative. The backend integration is implemented in Python under `backend/app/`; see the backend README for configuration and tests.

## 1. Ownership (confirmed decision)

| Python FastAPI backend (this repo, `backend/`) | Python AI service (`ai-service/` or its own repo) |
|---|---|
| AuthN/AuthZ, rate limiting, user & profile data, PostgreSQL | Gemini integration and credentials |
| Builds the request payload from the DB | Prompt engineering, response generation |
| HTTP client, timeouts, error mapping | Structured JSON validation (Pydantic) |
| Validates + sanitises the response, shapes the frontend response | Stateless: no DB access, no writes to INSPIVIA data |
| Stores chat history in PostgreSQL | |

Flow: `Frontend → FastAPI backend (auth, context) → FastAPI AI service → Gemini → FastAPI AI service → backend (validate) → Frontend`.
Gemini credentials and prompts belong only in the AI service.

## 2. Shared contract (single source of truth)

- `contracts/ai-service.openapi.yaml` is **authoritative**.
- `contracts/python/schemas.py` are reference Pydantic v2 models for the Python developer (checked: parse, validate and reject non-contiguous positions). No AI logic in them.
- `backend/app/ai_contract.py` contains the backend's validated Python contract models.

| Method & path (FastAPI) | Request | Response |
|---|---|---|
| `GET /health` | none (no key needed) | `{status:"ok", service, version}` |
| `POST /api/v1/ai/chat` | `ChatRequest` | `ChatResponse` |
| `POST /api/v1/ai/roadmap` | `RoadmapRequest` | `RoadmapResponse` |
| `POST /api/v1/ai/project-recommendations` | `ProjectRecommendationRequest` | `ProjectRecommendationResponse` |

Shared secret setup:

```env
# Backend (.env)
AI_SERVICE_BASE_URL=http://host.docker.internal:8000  # AI service on Windows host
AI_SERVICE_API_KEY=<the same generated secret>

# FastAPI AI service (its own .env)
AI_SERVICE_API_KEY=<the same generated secret>
GEMINI_API_KEY=<Gemini credential>
```

Generate the shared secret once, for example with `openssl rand -hex 32`, and never set Gemini credentials in the backend. The backend sends the shared secret in `X-Service-Key`; the AI service must compare it in constant time. A 401/403 response means the two `AI_SERVICE_API_KEY` values differ or the AI service is not reading the variable.

Conventions the Python side must follow:
1. Header `X-Service-Key` required on `/api/v1/*` (compare in constant time). `X-Request-Id` is sent; the same UUID is in the body as `request_id` and **must be echoed** (the backend rejects mismatches).
2. snake_case JSON. Extra response fields are tolerated; missing fields, unknown enum values, out-of-range values or non-contiguous `position`s → the backend returns 502 to the frontend.
3. Every generative response includes `disclaimer`; wording must be advisory, never a guarantee.
4. Errors: `{"error":{"code","message"}}`. Use 429 for provider rate limiting, 5xx for Gemini failures. The backend maps 429/5xx → 503 and other 4xx → 502.
5. Timeouts: the backend waits up to 30 s (read) and 2 s (connect). Target < 20 s per call.
6. The backend sends **no email, password, token or other identifiers** beyond an opaque `student_id`; chat history is capped (default 10 turns, max 20).
7. Resource URLs should be absolute https; the backend drops anything that is not http(s).

## 3. Frontend-facing endpoints (Python backend)

All require a valid access JWT with role `STUDENT`; `GET /status` requires `ADMIN`. Errors are RFC 7807 with a `code`.

| Endpoint | Body | Success | Failure |
|---|---|---|---|
| `POST /api/v1/ai/chat` | `{conversationId?, message}` | `{conversationId, reply, suggestedFollowUps[], disclaimer}` | 400 validation, 404 `CONVERSATION_NOT_FOUND`, 503 `AI_UNAVAILABLE` (+`Retry-After`), 502 `AI_INVALID_RESPONSE` |
| `POST /api/v1/ai/roadmap` | `{domain, durationWeeks 4–52, hoursPerWeek 1–40}` | `{title, summary, steps[], disclaimer, generatedAt}` | same |
| `POST /api/v1/ai/project-recommendations` | `{domain?, difficulty?, count? 1–5}` | `{projects[], disclaimer, generatedAt}` | same |
| `GET /api/v1/ai/status` | – | `{available, version}` | – |

Roadmap and project results are **proposals**. Saving a roadmap or enrolling in a project will require a separate explicit backend endpoint, so AI output never silently becomes core data.

## 4. Python layer layout (`backend/app`)

```
config.py       environment-backed configuration and validation
ai_contract.py  validated request/response models
ai_client.py    HTTP client, request ID checks and response validation
ai_service.py   orchestration; uses SQL-backed student context and conversation storage
ai_store.py     PostgreSQL-backed student context and conversation adapters
main.py         authenticated frontend endpoints and error handling
```
Decisions:
- **SQL-backed stores.** Student context and conversation history are read and written in PostgreSQL. The AI service remains stateless.
- **No DB transaction across the HTTP call.** A slow model must not hold a connection. The user message and reply are saved together only after a valid reply.
- **Fail closed.** Anything off-contract is rejected rather than "repaired", except dropping non-http(s) links.
- **No retries yet.** Generation calls are not idempotent in cost; add a single retry on connect failure and a circuit breaker (Resilience4j) if load testing shows a need.
- Endpoint-specific rate limits should be validated before production exposure (these requests incur model cost).

## 5. Removed from AI scope

Your update lists only chat, roadmap and project recommendations for Python. That drops two items from the original brief:
- **AI domain recommendation**
- **AI mentor recommendation/matching**

Mentor discovery is intended as plain, deterministic backend filtering (domain, skills, availability, approval status), not AI logic. That business feature is not implemented yet.

## 6. Verification status (honest)

| Item | Status |
|---|---|
| OpenAPI file | Parsed successfully with a YAML parser |
| Pydantic reference schemas | Imported and exercised with pydantic; sample payload accepted, non-contiguous roadmap rejected |
| Backend Python tests | `python -m pytest backend/tests -q`: 15 passed |
| Database startup/migrations | Not exercised against a live PostgreSQL server in this environment |

To run tests: `cd backend && python -m pytest -q`.

## 7. Local development without the Python service

The AI service is in `ai-service/`; use its documented configuration and mock the HTTP client in backend tests for isolated testing.
