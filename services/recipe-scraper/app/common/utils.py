import re
import html
from typing import Iterable
from bs4 import PageElement, Tag
from spacy.tokens import Doc, Span, Token


def get_text(element: Tag | PageElement) -> str:
    raw_text = element.get_text(strip=True)
    raw_text_unescaped = html.unescape(raw_text)
    return re.sub(r"\s+", " ", raw_text_unescaped.replace("\xa0|\n|\t", " "))

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
