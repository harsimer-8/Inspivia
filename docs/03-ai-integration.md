# INSPIVIA — AI Integration (Spring Boot side) and shared contract

Status: **contract and Java integration layer written. Not compiled or run** (see "Verification status").

## 1. Ownership (confirmed decision)

| Spring Boot (this repo, `backend/`) | Python FastAPI (separate team member, `ai-service/` or its own repo) |
|---|---|
| AuthN/AuthZ, rate limiting, user & profile data, PostgreSQL | Gemini integration and credentials |
| Builds the request payload from the DB | Prompt engineering, response generation |
| HTTP client, timeouts, error mapping | Structured JSON validation (Pydantic) |
| Validates + sanitises the response, shapes the frontend response | Stateless: no DB access, no writes to INSPIVIA data |
| Stores chat history in PostgreSQL | |

Flow: `Frontend → Spring Boot (auth, context) → FastAPI → Gemini → FastAPI → Spring Boot (validate) → Frontend`.
Not used anywhere: Spring AI, a Gemini SDK in Java, prompts in Java.

## 2. Shared contract (single source of truth)

- `contracts/ai-service.openapi.yaml` is **authoritative**.
- `contracts/python/schemas.py` are reference Pydantic v2 models for the Python developer (checked: parse, validate and reject non-contiguous positions). No AI logic in them.
- `backend/.../ai/contract/AiContract.java` is the Java mirror (records + Bean Validation).

| Method & path (FastAPI) | Request | Response |
|---|---|---|
| `GET /health` | none (no key needed) | `{status:"ok", service, version}` |
| `POST /api/v1/ai/chat` | `ChatRequest` | `ChatResponse` |
| `POST /api/v1/ai/roadmap` | `RoadmapRequest` | `RoadmapResponse` |
| `POST /api/v1/ai/project-recommendations` | `ProjectRecommendationRequest` | `ProjectRecommendationResponse` |

Shared secret setup:

```env
# Spring backend (.env)
AI_SERVICE_BASE_URL=http://host.docker.internal:8000  # AI service on Windows host
AI_SERVICE_API_KEY=<the same generated secret>

# FastAPI AI service (its own .env)
AI_SERVICE_API_KEY=<the same generated secret>
GEMINI_API_KEY=<Gemini credential>
```

Generate the shared secret once, for example with `openssl rand -hex 32`, and never set Gemini credentials in the Spring backend. Spring sends the shared secret in `X-Service-Key`; the FastAPI service must compare it in constant time. A 401/403 response means the two `AI_SERVICE_API_KEY` values differ or the Python service is not reading the variable.

Conventions the Python side must follow:
1. Header `X-Service-Key` required on `/api/v1/*` (compare in constant time). `X-Request-Id` is sent; the same UUID is in the body as `request_id` and **must be echoed** (Spring rejects mismatches).
2. snake_case JSON. Extra response fields are tolerated; missing fields, unknown enum values, out-of-range values or non-contiguous `position`s → Spring returns 502 to the frontend.
3. Every generative response includes `disclaimer`; wording must be advisory, never a guarantee.
4. Errors: `{"error":{"code","message"}}`. Use 429 for provider rate limiting, 5xx for Gemini failures. Spring maps 429/5xx → 503 and other 4xx → 502.
5. Timeouts: Spring waits up to 30 s (read) and 2 s (connect). Target < 20 s per call.
6. Spring sends **no email, password, token or other identifiers** beyond an opaque `student_id`; chat history is capped (default 10 turns, max 20).
7. Resource URLs should be absolute https; Spring drops anything that is not http(s).

## 3. Frontend-facing endpoints (Spring Boot)

All require a valid access JWT with role `STUDENT`; `GET /status` requires `ADMIN`. Errors are RFC 7807 with a `code`.

| Endpoint | Body | Success | Failure |
|---|---|---|---|
| `POST /api/v1/ai/chat` | `{conversationId?, message}` | `{conversationId, reply, suggestedFollowUps[], disclaimer}` | 400 validation, 404 `CONVERSATION_NOT_FOUND`, 503 `AI_UNAVAILABLE` (+`Retry-After`), 502 `AI_INVALID_RESPONSE` |
| `POST /api/v1/ai/roadmap` | `{domain, durationWeeks 4–52, hoursPerWeek 1–40}` | `{title, summary, steps[], disclaimer, generatedAt}` | same |
| `POST /api/v1/ai/project-recommendations` | `{domain?, difficulty?, count? 1–5}` | `{projects[], disclaimer, generatedAt}` | same |
| `GET /api/v1/ai/status` | – | `{available, version}` | – |

Roadmap and project results are **proposals**. Saving a roadmap or enrolling in a project is a separate explicit Spring endpoint (Stage 4), so AI output never silently becomes core data.

## 4. Java layer layout (`com.inspivia.ai`)

```
config/    AiServiceProperties (env-bound, validated), AiClientConfig (RestClient, timeouts, X-Service-Key, snake_case mapper private to this client)
contract/  AiContract              shared DTOs (mirror of the OpenAPI file)
client/    AiServiceClient (port), RestAiServiceClient (HTTP), AiResponsePolicy (request_id echo, position checks, URL sanitising)
service/   AiGatewayService        orchestration; ports StudentContextProvider, AiConversationStore
web/       AiController, AiApi (frontend DTOs), AiExceptionHandler (503 / 502 / 404)
exception/ AiServiceUnavailableException, AiInvalidResponseException, AiConversationNotFoundException
```
Decisions:
- **Ports, not entities.** `StudentContextProvider` and `AiConversationStore` are interfaces, implemented in Stage 4 over PostgreSQL. The AI layer therefore never depends on JPA and the Python service can be connected without touching the rest of the backend. Until Stage 4 supplies them the application context will not start, by design (no in-memory substitute for the database).
- **No DB transaction across the HTTP call.** A slow model must not hold a connection. The user message and reply are saved together only after a valid reply.
- **Fail closed.** Anything off-contract is rejected rather than "repaired", except dropping non-http(s) links.
- **No retries yet.** Generation calls are not idempotent in cost; add a single retry on connect failure and a circuit breaker (Resilience4j) if load testing shows a need.
- Rate limiting for these endpoints is added with the Stage 3 security work (they cost money).

## 5. Removed from AI scope

Your update lists only chat, roadmap and project recommendations for Python. That drops two items from the original brief:
- **AI domain recommendation**
- **AI mentor recommendation/matching**

I have not rebuilt them in Java as AI logic, per "do not duplicate AI business logic". Mentor discovery will be plain, deterministic Spring filtering (domain, skills, availability, approval status), which is normal business logic. If you want AI-ranked mentor or domain suggestions, say so and I'll add them to the contract as new endpoints for the Python developer.

## 6. Verification status (honest)

| Item | Status |
|---|---|
| OpenAPI file | Parsed successfully with a YAML parser |
| Pydantic reference schemas | Imported and exercised with pydantic; sample payload accepted, non-contiguous roadmap rejected |
| Java sources | Syntax-checked with `javac`: **no syntax errors**; only "package does not exist" errors because Maven Central is not reachable from this sandbox |
| `RestAiServiceClientTest` (11 tests: key + request-id headers, snake_case parsing, 500, 429, read timeout, connection refused, bad JSON, missing field, request-id mismatch, unknown enum, URL sanitising, position gap) | **Written, not executed** |
| Controller/handler/gateway | **Written, not executed**; no test yet (needs the Stage 3 security setup) |

To run on your machine: `cd backend && mvn -q test`. Please send me any failure output and I'll fix it.

## 7. Local development without the Python service

Until the teammate's service exists, either run the Python developer's skeleton from `contracts/python/schemas.py`, or let me add a small canned-response stub that satisfies the contract so you can exercise the frontend end to end. I haven't added one, to avoid duplicating their work unasked.
