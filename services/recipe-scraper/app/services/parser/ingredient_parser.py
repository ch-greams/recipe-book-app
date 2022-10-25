import re
import spacy

from functools import reduce
from spacy.tokens import Span
from spacy.matcher import Matcher
from spacy.util import filter_spans, compile_suffix_regex, compile_infix_regex
from spacy.attrs import ORTH
from app.common.types import Ingredient
from app.common.utils import POS_TO_FILTER, filter_ingredient_doc_by_indices, filter_ingredient_doc_by_pos, reduce_spans_to_indices

from app.services.parser import ADJ_UNITS, UNITS, VULGAR_FRACTIONS, DASH_SYMBOLS, OTHER_SYMBOLS
from app.services.parser.matcher import PATTERNS, MatcherPatternType
from app.services.parser.measure import Measure, MeasureType


################################################################################
# Update tokenizer
################################################################################

def get_after_number_regex(suffixes: list[str]) -> str:
    return f"(?<=[0-9])(?:{ '|'.join(map(re.escape, suffixes)) })"

def update_tokenizer(nlp: spacy.Language) -> spacy.Language:

    nlp.tokenizer.add_special_case("fl oz", [ { ORTH: "fl oz" } ])

    suffixes = nlp.Defaults.suffixes + [ get_after_number_regex(UNITS + VULGAR_FRACTIONS + ["cm"]) ]
    suffix_regex = compile_suffix_regex(suffixes)
    nlp.tokenizer.suffix_search = suffix_regex.search

    # NOTE: Adding all MULTIPLICATION_SYMBOLS will cause unexpected word split
    infixes = nlp.Defaults.infixes + VULGAR_FRACTIONS + DASH_SYMBOLS + OTHER_SYMBOLS
    infix_regex = compile_infix_regex(infixes)
    nlp.tokenizer.infix_finditer = infix_regex.finditer

    return nlp

################################################################################
# Matcher setup
################################################################################

def get_matcher(nlp: spacy.Language) -> Matcher:

    matcher = Matcher(nlp.vocab)

    for (pattern_type, pattern) in PATTERNS.items():
        matcher.add(pattern_type.name, pattern)
    
    return matcher

################################################################################
# Measure from match
################################################################################

def get_measure_from_match(measure: Span) -> Measure:

    match measure.label_:

        case MatcherPatternType.RANGE_MEASURE.name:
            with_adj = measure[-2].text in ADJ_UNITS
            range_amount: Span = Span(measure.doc, measure.start, measure.end - (2 if with_adj else 1), "AMOUNT")
            unit: Span = Span(measure.doc, measure.end - 1, measure.end, "UNIT")
            return Measure(MeasureType.DEFAULT, Measure.get_amount_from_range(range_amount.text), unit.text)

        case MatcherPatternType.MULTI_MEASURE.name:
            with_adj = measure[-2].text in ADJ_UNITS
            multi_amount: Span = Span(measure.doc, measure.start, measure.end - (2 if with_adj else 1), "AMOUNT")
            unit: Span = Span(measure.doc, measure.end - 1, measure.end, "UNIT")
            return Measure(MeasureType.DEFAULT, Measure.get_amount_from_multi(multi_amount.text), unit.text)

        case MatcherPatternType.RANGE_MEASURE_WITHOUT_UNIT.name:
            range_amount: Span = Span(measure.doc, measure.start, measure.end, "AMOUNT")
            return Measure(MeasureType.DEFAULT, Measure.get_amount_from_range(range_amount.text), None)

        case MatcherPatternType.MULTI_MEASURE_WITHOUT_UNIT.name:
            multi_amount: Span = Span(measure.doc, measure.start, measure.end, "AMOUNT")
            return Measure(MeasureType.DEFAULT, Measure.get_amount_from_multi(multi_amount.text), None)

        case MatcherPatternType.MEASURE.name:
            with_adj = measure[-2].text in ADJ_UNITS
            amount: Span = Span(measure.doc, measure.start, measure.end - (2 if with_adj else 1), "AMOUNT")
            unit: Span = Span(measure.doc, measure.end - 1, measure.end, "UNIT")
            return Measure(MeasureType.DEFAULT, Measure.get_amount_from(amount.text), unit.text)

        case MatcherPatternType.UNIT_MEASURE.name:
            unit: Span = Span(measure.doc, measure.start, measure.end, "UNIT")
            return Measure(MeasureType.DEFAULT, None, unit.text)

        case MatcherPatternType.AMOUNT_MEASURE.name:
            amount: Span = Span(measure.doc, measure.start, measure.end, "AMOUNT")
            return Measure(MeasureType.DEFAULT, Measure.get_amount_from(amount.text), None)

        # case MatcherPatternType.PRODUCT.name:
        #     product: Span = Span(measure.doc, measure.start, measure.end, "PRODUCT")
        #     return [ product ]

        case _:
            return None

################################################################################
# Process ingredient
################################################################################

def process_ingredient_text(nlp: spacy.Language, matcher: Matcher, text: str) -> Ingredient:

    doc = nlp(text)

    matches = matcher(doc)
    match_spans = filter_spans([ Span(doc, start, end, label=match_id) for match_id, start, end in matches ])

    indices_to_remove = set( reduce(reduce_spans_to_indices, match_spans, []) )
    ingredient = filter_ingredient_doc_by_indices(doc, indices_to_remove)
    ingredient = filter_ingredient_doc_by_pos(ingredient, POS_TO_FILTER)

    name = " ".join([ token.text for token in ingredient ])

    measures = list(filter(None, [ get_measure_from_match(measure) for measure in match_spans ]))
    measure = sorted(measures)[0] if len(measures) > 0 else None

    return {
        "text": text,
        "amount": None if measure == None else measure.amount,
        "unit": None if measure == None else measure.unit,
        "name": name,
    }
