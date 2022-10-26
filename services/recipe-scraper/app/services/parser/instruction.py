from typing import Iterable
import spacy

from spacy.matcher import Matcher
from spacy.tokens import Span, Token, Doc
from spacy.util import filter_spans
from app.common.types import Instruction, InstructionIngredient
from app.common.utils import POS_TO_FILTER, filter_ingredient_doc_by_pos, get_ingredient_label
from app.services.parser.measure import Measure


################################################################################
# Matcher setup
################################################################################

def get_ingredient_matcher(nlp: spacy.Language, ingredients: list[Doc | list[Token]]) -> Matcher:

    matcher = Matcher(nlp.vocab)

    for index, ingredient_tokens in enumerate(ingredients):
        ingredient_pattern = [ { "LEMMA": token.lemma_, "OP": "?" } for token in ingredient_tokens ]
        matcher.add(get_ingredient_label(index), [ ingredient_pattern ])
            
    return matcher

################################################################################
# Ingredients mentions from instructions
################################################################################

def get_ingredient_name_from_mentions(ingredient_list: Iterable[str]) -> str:
    """
    Parameters
    ----------
    ingredient_list : Iterable[str]
        A set of all representations found for the same ingredient

    Returns
    -------
    str
        A string, which was joined from a list of most full and unique representation parts
    """

    result: list[str] = []

    for item in ingredient_list:
        not_found = True

        for index, item_result in enumerate(result):
            if item in item_result:
                not_found = False
            elif item_result in item:
                not_found = False
                result[index] = item

        if not_found:
            result.append(item)

    return ' '.join(set(result))

def get_ingredients_from_instructions(ingredient_matcher: Matcher, instructions: list[Doc | list[Token]]) -> dict[str, InstructionIngredient]:
    ingredient_metadata: dict[str, InstructionIngredient] = {}
    ingredient_mentions: dict[str, set[Span]] = {}

    # identify ingredients in instructions
    for index, instruction in enumerate(instructions):

        ingredient_matches = ingredient_matcher(instruction)
        ingredient_spans = filter_spans([ Span(instruction, start, end, label=match_id) for match_id, start, end in ingredient_matches ])

        for ingredient_match_span in ingredient_spans:

            if ingredient_match_span.label_ in ingredient_metadata:
                ingredient_mentions[ingredient_match_span.label_].add(ingredient_match_span)
                ingredient_metadata[ingredient_match_span.label_]["instructions"].add(index)
            else:
                ingredient_mentions[ingredient_match_span.label_] = set([ ingredient_match_span ])
                ingredient_metadata[ingredient_match_span.label_] = {
                    "label": ingredient_match_span.label_,
                    "instructions": set([ index ]),
                }


    # get average ingredient representation text from instructions
    for (key, value) in ingredient_mentions.items():
        ingredient_metadata[key]["mentioned_name"] = get_ingredient_name_from_mentions(map(lambda s: s.text, value))


    return ingredient_metadata

################################################################################
# Process instructions & ingredients
################################################################################

def get_ingredient_docs(nlp: spacy.Language, ingredients: Iterable[str]) -> list[list[Token]]:
    """
    - Appends `.` to each ingredient line, so it'll fix tagger identification
    - Creates SpaCy docs from each ingredient line text
    - Filters docs by meaningless POS (like punctuation or conjunctions)
    """
    ingredient_docs = nlp.pipe(map(lambda line: f"{line}." if line[-1] == "." else line, ingredients))
    ingredient_docs = [ filter_ingredient_doc_by_pos(ingredient_doc, POS_TO_FILTER) for ingredient_doc in ingredient_docs ]
    
    return ingredient_docs



def get_instruction_docs(nlp: spacy.Language, instructions: Iterable[str]) -> list[Doc]:
    """
    - Creates SpaCy docs from each instruction line text
    - ...
    """
    return nlp.pipe(instructions)


################################################################################
# Public
################################################################################

def get_instruction_ingredients(
    nlp: spacy.Language,
    instructions: Iterable[str],
    ingredients: Iterable[str],
) -> dict[str, InstructionIngredient]:

    instruction_docs = get_instruction_docs(nlp, instructions)
    ingredient_docs = get_ingredient_docs(nlp, ingredients)

    ingredient_matcher = get_ingredient_matcher(nlp, ingredient_docs)

    return get_ingredients_from_instructions(ingredient_matcher, instruction_docs)

def process_instruction_text(nlp: spacy.Language, measure_matcher: Matcher, text: str) -> Instruction:

    doc = nlp(text)

    measure_matches = measure_matcher(doc)
    measure_spans = filter_spans([ Span(doc, start, end, label=match_id) for match_id, start, end in measure_matches ])
    measures = list(filter(None, [ Measure.get_measure_from_match(measure) for measure in measure_spans ]))

    return {
        "text": text,
        "measures": [ { "amount": measure.amount, "unit": measure.unit } for measure in measures ],
        # "ingredients": [],
    }

