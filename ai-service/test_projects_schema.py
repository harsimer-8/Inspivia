from uuid import uuid4

from app.schemas.projects import (
    ProjectRecommendationRequest,
    ProjectRecommendationResponse
)

request = ProjectRecommendationRequest(
    request_id=uuid4(),
    student={
        "student_id": uuid4(),
        "interests": ["AI", "Machine Learning"],
        "skills": [
            {"name": "Python", "level": "BEGINNER"}
        ]
    },
    domain="Artificial Intelligence",
    difficulty="BEGINNER",
    count=2,
    exclude_titles=[]
)

response = ProjectRecommendationResponse(
    request_id=request.request_id,
    projects=[
        {
            "title": "AI Study Planner",
            "description": "Build a planner that helps students organise their study schedules.",
            "difficulty": "BEGINNER",
            "technologies": ["Python", "FastAPI"],
            "estimated_hours": 30,
            "milestones": [
                {
                    "position": 1,
                    "title": "Planning",
                    "description": "Define the project requirements."
                },
                {
                    "position": 2,
                    "title": "Development",
                    "description": "Build the application."
                }
            ],
            "rationale": "A practical beginner project that introduces backend development."
        }
    ],
    disclaimer="AI-generated recommendations should be independently evaluated."
)

print("Request validation successful!")
print("Response validation successful!")
print(response.model_dump_json(indent=2))