from fastapi import APIRouter
from urllib.parse import urlparse
from app.services.scraper import SCRAPERS
from pydantic import BaseModel


router = APIRouter(
    prefix="/api/v1/recipe",
    responses={ 404: { "description": "Not found!" } }
)


class Recipe(BaseModel):
    title: str
    time: str
    yields: str
    ingredients: list[str]
    instructions: list[str]


@router.post("/parse", response_model=Recipe)
async def scrape_recipe(url: str):
    """
    Parse recipe from a provided `url` (like `https://www.jamieoliver.com/recipes/fruit-recipes/buckwheat-crepes-with-poached-apple-pear/`)
    """
    hostname = urlparse(url).hostname.replace("www.", "")

    page_scraper = SCRAPERS[hostname](url)

    return {
        "title": page_scraper.title(),
        "time": page_scraper.time(),
        "yields": page_scraper.yields(),
        "ingredients": page_scraper.ingredients(),
        "instructions": page_scraper.instructions(),
    }
