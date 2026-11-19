from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from starlette.exceptions import HTTPException as StarletteHTTPException

from app.api.chat import router as chat_router
from app.api.roadmap import router as roadmap_router
from app.api.projects import router as projects_router

app = FastAPI(
    title="Inspivia AI Service",
    description= "AI-powered mentorship service for students",
    version="1.0.0"
)
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    detail = exc.detail

    if isinstance(detail, dict):
        error = detail
    else:
        error = {
            "code": "HTTP_ERROR",
            "message": str(detail)
        }

    return JSONResponse(
        status_code=exc.status_code,
        content={"error": error}
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "error": {
                "code": "INVALID_REQUEST",
                "message": "The request data is invalid or incomplete."
            }
        }
    )

app.include_router(chat_router,prefix="/api/v1/ai")
app.include_router(roadmap_router, prefix="/api/v1/ai")
app.include_router(projects_router, prefix="/api/v1/ai")

@app.get("/")
def home():
    return {"message": "Welcome to Inspivia AI!"}

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "inspivia-ai",
        "version": "1.0.0"
    }

'''if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)'''