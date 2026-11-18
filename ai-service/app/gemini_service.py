import os
from dotenv import load_dotenv
from google import genai
from google.genai import types

#load variables from .env
load_dotenv()

#Read the api key
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is not set in the environment variables")

#create gemini client
client= genai.Client(api_key=api_key)

def ask_gemini(prompt: str) -> str:
    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=prompt
    )

    return response.text


def ask_gemini_json(prompt: str) -> str:
    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json"
        )
    )

    if not response.text:
        raise ValueError("Gemini returned an empty response.")

    return response.text

