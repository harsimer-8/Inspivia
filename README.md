# INSPIVIA Backend

The backend runtime is implemented in Python with FastAPI. PostgreSQL migrations and the API contracts remain unchanged. Some of the product modules described in the planning documents are not implemented yet.

## Frontend

The Next.js frontend is in `frontend/`. From that directory, install its dependencies with `npm install` and start the development server with `npm run dev`. Copy `frontend/.env.example` to `frontend/.env.local` and set `BACKEND_API_URL`. See `docs/05-frontend-integration.md` for the integration contract and deployment steps.

## AI shared-secret setup

Generate one secret:

```bash
openssl rand -hex 32
```

Copy `.env.example` to `.env`, then set:

```env
AI_SERVICE_API_KEY=<generated secret>
AI_SERVICE_BASE_URL=http://host.docker.internal:8000
```

Set the exact same value as `AI_SERVICE_API_KEY` in the Python AI service environment. Set `GEMINI_API_KEY` only in the AI service.

- The backend sends `AI_SERVICE_API_KEY` in the `X-Service-Key` header.
- Use `http://ai-service:8000` only when FastAPI is another service in the same Docker Compose network.
- Use `http://host.docker.internal:8000` when FastAPI runs directly on the Windows host.
- The Python service must validate `/api/v1/*` requests against `X-Service-Key`.
- `GET /health` is intentionally unauthenticated.

## Local commands

With Docker installed:

```bash
cd inspivia
cp .env.example .env
# Fill in .env, especially DB_PASSWORD, JWT_SECRET, and AI_SERVICE_API_KEY.
docker compose up --build
```

To run without Docker, install the Python backend dependencies and start the FastAPI app from `backend/`:

```bash
cd backend
python -m pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8080
```

Interactive API documentation is available at `http://localhost:8080/docs`.

## Integration contract

The authoritative internal AI contract is `contracts/ai-service.openapi.yaml`. Python request and response JSON use snake_case; the frontend-facing API keeps its existing field names. The `X-Request-Id` UUID and the JSON `request_id` must match.
