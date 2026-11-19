from pydantic import ValidationError
from app.schemas.roadmap import Resource

valid_url = "https://docs.python.org"

resource = Resource(
    title="Python Documentation",
    url=valid_url,
    type="DOCS"
)

print("Valid URL accepted:", resource.url)

invalid_urls = [
    "/resources/python",
    "javascript:alert(1)"
]

for url in invalid_urls:
    try:
        Resource(title="Test", url=url, type="DOCS")
        print("ERROR: Invalid URL was accepted:", url)
    except ValidationError:
        print("Invalid URL rejected:", url)