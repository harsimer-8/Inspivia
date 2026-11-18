# INSPIVIA Backend

The current package contains database migrations, configuration, Docker setup, API documentation, and the Spring AI integration client. Authentication and the remaining domain modules are not implemented yet, so this package is not a runnable MVP.

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

Set the exact same value as `AI_SERVICE_API_KEY` in the Python FastAPI service environment. Set `GEMINI_API_KEY` only in the FastAPI service.

- Spring sends `AI_SERVICE_API_KEY` in the `X-Service-Key` header.
- Use `http://ai-service:8000` only when FastAPI is another service in the same Docker Compose network.
- Use `http://host.docker.internal:8000` when FastAPI runs directly on the Windows host.
- The Python service must validate `/api/v1/*` requests against `X-Service-Key`.
- `GET /health` is intentionally unauthenticated.

## Local commands

Once Maven dependencies are available and the missing backend implementations exist:

```bash
cd inspivia
cp .env.example .env
# Fill in .env, especially DB_PASSWORD, JWT_SECRET, and AI_SERVICE_API_KEY.
docker compose up --build
```

Without Docker:

```bash
cd inspivia/backend
mvn test
mvn spring-boot:run
```

Swagger UI is available at `http://localhost:8080/swagger-ui.html`.

## Integration contract

The authoritative internal contract is `contracts/ai-service.openapi.yaml`. Python request and response JSON use snake_case, while frontend-facing Spring responses use camelCase. The `X-Request-Id` UUID and the JSON `request_id` must match.
