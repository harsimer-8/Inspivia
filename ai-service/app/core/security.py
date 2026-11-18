
import os
import hmac

from dotenv import load_dotenv
from fastapi import Header, HTTPException

load_dotenv()

SERVICE_KEY = os.getenv("AI_SERVICE_API_KEY")


def verify_service_key(
    x_service_key: str | None = Header(
        default=None,
        alias="X-Service-Key"
    )
):
    if not SERVICE_KEY:
        raise HTTPException(
            status_code=500,
            detail={
                "code": "CONFIGURATION_ERROR",
                "message": "AI service authentication is not configured."
            }
        )

    if not x_service_key or not hmac.compare_digest(
        x_service_key, SERVICE_KEY
    ):
        raise HTTPException(
            status_code=401,
            detail={
                "code": "UNAUTHORIZED",
                "message": "Invalid or missing service key."
            }
        )
