
from uuid import UUID

from fastapi import APIRouter, Header, Depends
from fastapi.responses import JSONResponse

from app.schemas.chat import ChatRequest, ChatResponse
from app.prompts.chat_prompts import build_chat_prompt
from app.gemini_service import ask_gemini
from app.core.security import verify_service_key
from app.gemini_service import GeminiRateLimitError


router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
def chat(
    request: ChatRequest,
    x_request_id: UUID = Header(..., alias="X-Request-Id"),
    _: None = Depends(verify_service_key)
):
    # Ensure the header and body contain the same request ID
    if x_request_id != request.request_id:
        return JSONResponse(
            status_code=400,
            content={
                "error": {
                    "code": "REQUEST_ID_MISMATCH",
                    "message": "Request ID header does not match request body."
                }
            }
        )

    # Build Quaithe's prompt using the student's context
    prompt = build_chat_prompt(request)

    try:
        response = ask_gemini(prompt)

    except GeminiRateLimitError:
        return JSONResponse(
            status_code=429,
            content={
                "error": {
                    "code": "MODEL_RATE_LIMITED",
                    "message": "The AI service is receiving too many requests. Please try again shortly."
                }
            }
        )
    except Exception as error:
        print(f"Gemini API error: {error}")

        return JSONResponse(
            status_code=502,
            content={
                "error": {
                    "code": "UPSTREAM_MODEL_ERROR",
                    "message": "The AI mentor is temporarily unavailable. Please try again."
                }
            }
        )

    # Return the exact structure expected by Spring Boot
    return ChatResponse(
        request_id=request.request_id,
        reply=response,
        suggested_follow_ups=[],
        disclaimer="AI-generated guidance is advisory and should be independently evaluated."
    )

