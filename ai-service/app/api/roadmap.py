
import json
from uuid import UUID

from fastapi import APIRouter, Depends, Header
from fastapi.responses import JSONResponse
from pydantic import ValidationError

from app.core.security import verify_service_key
from app.gemini_service import ask_gemini_json
from app.prompts.roadmap_prompts import build_roadmap_prompt
from app.schemas.roadmap import RoadmapRequest, RoadmapResponse
from app.gemini_service import GeminiRateLimitError


router = APIRouter()


@router.post("/roadmap", response_model=RoadmapResponse)
def generate_roadmap(
    request: RoadmapRequest,
    x_request_id: UUID = Header(..., alias="X-Request-Id"),
    _: None = Depends(verify_service_key)
):
    # Verify that the header and body contain the same request ID.
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

    prompt = build_roadmap_prompt(request)

    try:
        # Ask Gemini to generate structured JSON.
        raw_response = ask_gemini_json(prompt)

        # Convert the JSON string into a Python dictionary.
        roadmap_data = json.loads(raw_response)

        # Add the request ID and validate the complete response.
        roadmap_data["request_id"] = str(request.request_id)

        roadmap = RoadmapResponse.model_validate(roadmap_data)

        # Ensure the roadmap covers the requested duration.
        total_weeks = sum(
            step.estimated_weeks for step in roadmap.steps
        )

        if total_weeks != request.duration_weeks:
            raise ValueError("Generated roadmap duration does not match the request.")

        return roadmap

    except (json.JSONDecodeError, ValidationError, ValueError) as error:
        print(f"Invalid Gemini roadmap response: {error}")
        return JSONResponse(
            status_code=502,
            content={
                "error": {
                    "code": "INVALID_MODEL_RESPONSE",
                    "message": "The AI mentor generated an invalid roadmap. Please try again."
                }
            }
        )

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
        print(f"Gemini roadmap API error: {error}")
        return JSONResponse(
            status_code=502,
            content={
                "error": {
                    "code": "UPSTREAM_MODEL_ERROR",
                    "message": "The AI mentor is temporarily unavailable. Please try again."
                }
            }
        )
