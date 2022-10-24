import re
import html
from bs4 import PageElement, Tag


def get_text(element: Tag | PageElement) -> str:
    raw_text = element.get_text(strip=True)
    raw_text_unescaped = html.unescape(raw_text)
    return re.sub(r"\s+", " ", raw_text_unescaped.replace("\xa0|\n|\t", " "))
