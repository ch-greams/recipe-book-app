import re
import html
from typing import Iterable
from bs4 import PageElement, Tag
from spacy.tokens import Doc, Token


def get_text(element: Tag | PageElement) -> str:
    raw_text = element.get_text(strip=True)
    raw_text_unescaped = html.unescape(raw_text)
    return re.sub(r"\s+", " ", raw_text_unescaped.replace("\xa0|\n|\t", " "))


def filter_ingredient_doc_by_pos(ingredient_doc: Doc | list[Token], pos: list[str]) -> list[Token]:
    return list(filter(lambda token: token.pos_ not in pos, ingredient_doc))

def filter_ingredient_doc_by_indices(ingredient_doc: Doc | list[Token], indices: Iterable[int]) -> list[Token]:
    return list(filter(lambda token: token.i not in indices, ingredient_doc))
