
import spacy
from app.common.types import Ingredient, Instruction, InstructionIngredient, Recipe
from app.common.utils import get_ingredient_label, update_tokenizer
from app.services.parser.ingredient import process_ingredient_text
from app.services.parser.instruction import get_instruction_ingredients, process_instruction_text
from app.services.parser.matcher import INGREDIENT_PATTERNS, INSTRUCTION_PATTERNS, get_matcher
from app.services.scraper.page_scraper import PageScraper




nlp = spacy.load("en_core_web_sm")
nlp = update_tokenizer(nlp)
ingredient_measure_matcher = get_matcher(nlp, INGREDIENT_PATTERNS)
instruction_measure_matcher = get_matcher(nlp, INSTRUCTION_PATTERNS)




def parse_recipe(page_scraper: PageScraper) -> Recipe:

    ingredients: list[str] = page_scraper.ingredients()
    instructions: list[str] = page_scraper.instructions()

    instruction_ingredients: dict[str, InstructionIngredient] = get_instruction_ingredients(nlp, instructions, ingredients)

    ingredients: list[Ingredient] = [
        process_ingredient_text(nlp, ingredient_measure_matcher, text, instruction_ingredients.get(get_ingredient_label(i))) for i, text in enumerate(ingredients)
    ]
    print("ingredients")
    print(ingredients)

    instructions: list[Instruction] = [
        process_instruction_text(nlp, instruction_measure_matcher, text) for text in instructions
    ]
    print("instructions")
    print(instructions)

    return {
        "title": page_scraper.title(),
        "time": page_scraper.time(),
        "yields": page_scraper.yields(),
        "ingredients": ingredients,
        "instructions": instructions,
    }

