from fastapi import APIRouter
from urllib.parse import urlparse

from app.common.types import Recipe
from app.services.parser.recipe_parser import parse_recipe
from app.services.scraper import SCRAPERS
from app.services.scraper.page_scraper import PageScraper


router = APIRouter(
    prefix="/api/v1/recipe",
    responses={ 404: { "description": "Not found!" } }
)


@router.post("/parse", response_model=Recipe)
async def scrape_recipe(url: str):
    """
    Parse recipe from a provided `url` (like `https://www.jamieoliver.com/recipes/fruit-recipes/buckwheat-crepes-with-poached-apple-pear/`)
    """
    hostname = urlparse(url).hostname.replace("www.", "")

    page_scraper: PageScraper = SCRAPERS[hostname](url)

    return parse_recipe(page_scraper)
