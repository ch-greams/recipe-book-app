import spacy

from functools import reduce
from spacy.tokens import Span
from spacy.matcher import Matcher
from spacy.util import filter_spans
from app.common.types import Ingredient, InstructionIngredient
from app.common.utils import POS_TO_FILTER, filter_ingredient_doc_by_indices, filter_ingredient_doc_by_pos, reduce_spans_to_indices

from app.services.parser.measure import Measure

################################################################################
# Process ingredient
################################################################################

def process_ingredient_text(
    nlp: spacy.Language,
    measure_matcher: Matcher,
    text: str,
    instruction_ingredient: InstructionIngredient | None,
) -> Ingredient:

    doc = nlp(text)

    matches = measure_matcher(doc)
    match_spans = filter_spans([ Span(doc, start, end, label=match_id) for match_id, start, end in matches ])

    indices_to_remove = set( reduce(reduce_spans_to_indices, match_spans, []) )
    ingredient = filter_ingredient_doc_by_indices(doc, indices_to_remove)
    ingredient = filter_ingredient_doc_by_pos(ingredient, POS_TO_FILTER)

    name = " ".join([ token.text for token in ingredient ])

    measures = list(filter(None, [ Measure.get_measure_from_match(measure) for measure in match_spans ]))
    measure = sorted(measures)[0] if len(measures) > 0 else None

    return {
        "text": text,
        "amount": measure.amount if measure != None else None,
        "unit": measure.unit if measure != None else None,
        "name": name,
        "mentioned_name": instruction_ingredient["mentioned_name"] if instruction_ingredient != None else None,
        "instructions": instruction_ingredient["instructions"] if instruction_ingredient != None else set([]),
    }
