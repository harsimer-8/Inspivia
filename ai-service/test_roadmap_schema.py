
from uuid import uuid4

from app.schemas.roadmap import (
    RoadmapRequest,
    RoadmapResponse,
)

request_id = uuid4()

# Test a valid roadmap request
request = RoadmapRequest(
    request_id=request_id,
    student={
        "student_id": uuid4(),
        "interests": ["Artificial Intelligence"],
        "skills": [
            {"name": "Python", "level": "BEGINNER"}
        ],
    },
    domain="AI/ML",
    duration_weeks=12,
    hours_per_week=8,
)

print("Request validation: PASSED")

# Test a valid roadmap response
response = RoadmapResponse(
    request_id=request_id,
    title="AI/ML Learning Roadmap",
    summary="A 12-week beginner-friendly learning plan.",
    steps=[
        {
            "position": 1,
            "title": "Python Foundations",
            "description": "Strengthen Python programming fundamentals.",
            "estimated_weeks": 3,
            "skills": ["Python", "Problem Solving"],
            "resources": [
                {
                    "title": "Python Documentation",
                    "url": "https://docs.python.org/3/",
                    "type": "DOCS",
                }
            ],
        }
    ],
    disclaimer="This roadmap is AI-generated guidance.",
)

print("Response validation: PASSED")
print("Roadmap title:", response.title)
print("Number of steps:", len(response.steps))
