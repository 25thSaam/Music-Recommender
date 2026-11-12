# Useful Docs: https://pydantic.dev/docs/ai/models/google/

from pydantic_ai import Agent
from pydantic_ai.models.google import GoogleModel
from pydantic_ai.providers.google import GoogleProvider

from config import settings # this import isn't being resolved

provider = GoogleProvider(api_key=)