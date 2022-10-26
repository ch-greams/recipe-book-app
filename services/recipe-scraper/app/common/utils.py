import re
import html
import spacy

from typing import Iterable
from bs4 import PageElement, Tag
from spacy.tokens import Doc, Span, Token
from spacy.attrs import ORTH
from spacy.util import compile_infix_regex, compile_suffix_regex

from app.services.parser import DASH_SYMBOLS, OTHER_SYMBOLS, TEMPERATURE_UNITS, TIME_UNITS, UNITS, VULGAR_FRACTIONS


def get_text(element: Tag | PageElement) -> str:
    raw_text = element.get_text(strip=True)
    raw_text_unescaped = html.unescape(raw_text)
    return re.sub(r"\s+", " ", raw_text_unescaped.replace("\xa0|\n|\t", " "))

def get_after_number_regex(suffixes: list[str]) -> str:
    return f"(?<=[0-9])(?:{ '|'.join(map(re.escape, suffixes)) })"

def get_ingredient_label(index: int) -> str:
    return f"INGREDIENT_{index}"

################################################################################
# SPACY HELPERS
################################################################################

POS_TO_FILTER: list[str] = [
    "PUNCT",    # punctuation ( ., (, ), ?, etc.. )
    "NUM",      # numeral ( 1, 2017, one, seventy-seven, IV, MMXIV, etc.. )
    "DET",      # determiner ( a, an, the, etc.. )
    "ADP",      # adposition ( in, to, during, etc.. )
    "CONJ",     # conjunction ( and, or, but, etc.. )
    "CCONJ",    # coordinating conjunction ( and, or, but, etc.. )
    "SYM",      # symbol
    "PART",     # particle
]

def filter_ingredient_doc_by_pos(ingredient_doc: Doc | list[Token], pos: list[str]) -> list[Token]:
    return list(filter(lambda token: token.pos_ not in pos, ingredient_doc))

def filter_ingredient_doc_by_indices(ingredient_doc: Doc | list[Token], indices: Iterable[int]) -> list[Token]:
    return list(filter(lambda token: token.i not in indices, ingredient_doc))

def reduce_spans_to_indices(acc: list[int], cur_span: Span) -> list[int]:
    return acc + list(range(cur_span.start, cur_span.end))

def update_tokenizer(nlp: spacy.Language) -> spacy.Language:

    nlp.tokenizer.add_special_case("fl oz", [ { ORTH: "fl oz" } ])
    nlp.tokenizer.add_special_case("°F", [ { ORTH: "°F" } ])
    nlp.tokenizer.add_special_case("°C", [ { ORTH: "°C" } ])

    suffixes = nlp.Defaults.suffixes + [ get_after_number_regex(UNITS + TEMPERATURE_UNITS + TIME_UNITS + VULGAR_FRACTIONS + ["cm"]) ]
    suffix_regex = compile_suffix_regex(suffixes)
    nlp.tokenizer.suffix_search = suffix_regex.search

    # NOTE: Adding all MULTIPLICATION_SYMBOLS will cause unexpected word split
    infixes = nlp.Defaults.infixes + VULGAR_FRACTIONS + DASH_SYMBOLS + OTHER_SYMBOLS
    infix_regex = compile_infix_regex(infixes)
    nlp.tokenizer.infix_finditer = infix_regex.finditer

    return nlp
