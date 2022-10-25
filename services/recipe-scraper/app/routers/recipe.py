from fastapi import APIRouter
from urllib.parse import urlparse

import spacy
from app.common.types import Recipe
from app.services.parser.ingredient_parser import get_matcher, process_ingredient_text, update_tokenizer
from app.services.scraper import SCRAPERS


router = APIRouter(
    prefix="/api/v1/recipe",
    responses={ 404: { "description": "Not found!" } }
)


nlp = spacy.load("en_core_web_sm")
nlp = update_tokenizer(nlp)
matcher = get_matcher(nlp)

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
        "ingredients": list(map(lambda text: process_ingredient_text(nlp, matcher, text), page_scraper.ingredients())),
        "instructions": page_scraper.instructions(),
    }
