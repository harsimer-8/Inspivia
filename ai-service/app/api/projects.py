import json
from uuid import UUID

from fastapi import APIRouter, Depends, Header
from fastapi.responses import JSONResponse
from pydantic import ValidationError

from app.core.security import verify_service_key
from app.gemini_service import ask_gemini_json
from app.prompts.project_prompts import build_project_prompt
from app.schemas.projects import (
    ProjectRecommendationRequest,
    ProjectRecommendationResponse,
)
from app.gemini_service import GeminiRateLimitError

router = APIRouter()


@router.post(
    "/project-recommendations",
    response_model=ProjectRecommendationResponse
)
def generate_project_recommendations(
    request: ProjectRecommendationRequest,
    x_request_id: UUID = Header(..., alias="X-Request-Id"),
    _: None = Depends(verify_service_key)
):
    # Check that the header and body contain the same request ID.
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

    prompt = build_project_prompt(request)

    try:
        raw_response = ask_gemini_json(prompt)

        projects_data = json.loads(raw_response)

        # The application, not Gemini, supplies the request ID.
        projects_data["request_id"] = str(request.request_id)

        recommendations = ProjectRecommendationResponse.model_validate(
            projects_data
        )

        # Ensure Gemini returned exactly the requested number of projects.
        if len(recommendations.projects) != request.count:
            raise ValueError(
                "Generated project count does not match the request."
            )

        # Ensure excluded projects are not recommended again.
        excluded = {
            title.strip().casefold()
            for title in request.exclude_titles
        }

        generated_titles = {
            project.title.strip().casefold()
            for project in recommendations.projects
        }

        if excluded.intersection(generated_titles):
            raise ValueError(
                "Generated recommendations contain an excluded project."
            )

        return recommendations
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
    except (json.JSONDecodeError, ValidationError, ValueError) as error:
        print(f"Invalid Gemini project response: {error}")

        return JSONResponse(
            status_code=502,
            content={
                "error": {
                    "code": "INVALID_MODEL_RESPONSE",
                    "message": (
                        "The AI mentor generated invalid project "
                        "recommendations. Please try again."
                    )
                }
            }
        )

    except Exception as error:
        print(f"Gemini project recommendation API error: {error}")

        return JSONResponse(
            status_code=502,
            content={
                "error": {
                    "code": "UPSTREAM_MODEL_ERROR",
                    "message": (
                        "The AI mentor is temporarily unavailable. "
                        "Please try again."
                    )
                }
            }
        )