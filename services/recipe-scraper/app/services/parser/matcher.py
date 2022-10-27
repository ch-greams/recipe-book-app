import spacy

from enum import Enum
from typing import Any
from spacy.matcher import Matcher
from app.services.parser import ADJ_UNITS, DASH_SYMBOLS, MULTIPLICATION_SYMBOLS, TEMPERATURE_UNITS, TIME_UNITS, UNITS, VULGAR_FRACTIONS


MatcherPattern = list[ list[dict[str, Any]] ]



RANGE_MEASURE_PATTERN: MatcherPattern = [
    # 1-2g || 1½-2½g || 1-2½g || 1½-2g
    [
        { "TEXT": { "REGEX": "\d*\.?\d+" } },
        { "LOWER": { "IN": VULGAR_FRACTIONS }, "OP": "?" },

        { "LOWER": { "IN": DASH_SYMBOLS } },

        { "TEXT": { "REGEX": "\d*\.?\d+" } },
        { "LOWER": { "IN": VULGAR_FRACTIONS }, "OP": "?" },

        { "LOWER": { "IN": ADJ_UNITS }, "OP": "?" },
        { "LEMMA": { "IN": UNITS } },
    ],
    # ½-½g || ½-1½g
    [
        { "LOWER": { "IN": VULGAR_FRACTIONS } },

        { "LOWER": { "IN": DASH_SYMBOLS } },

        { "TEXT": { "REGEX": "\d*\.?\d+" }, "OP": "?" },
        { "LOWER": { "IN": VULGAR_FRACTIONS } },

        { "LOWER": { "IN": ADJ_UNITS }, "OP": "?" },
        { "LEMMA": { "IN": UNITS } },
    ],
]

MULTI_MEASURE_PATTERN: MatcherPattern = [
    # 1x2g || 1½x2½g || 1x2½g || 1½x2g
    [
        { "TEXT": { "REGEX": "\d*\.?\d+" } },
        { "LOWER": { "IN": VULGAR_FRACTIONS }, "OP": "?" },

        { "LOWER": { "IN": MULTIPLICATION_SYMBOLS } },

        { "TEXT": { "REGEX": "\d*\.?\d+" } },
        { "LOWER": { "IN": VULGAR_FRACTIONS }, "OP": "?" },

        { "LOWER": { "IN": ADJ_UNITS }, "OP": "?" },
        { "LEMMA": { "IN": UNITS } },
    ],
    # ½x½g || ½x1½g
    [
        { "LOWER": { "IN": VULGAR_FRACTIONS } },

        { "LOWER": { "IN": MULTIPLICATION_SYMBOLS } },

        { "TEXT": { "REGEX": "\d*\.?\d+" }, "OP": "?" },
        { "LOWER": { "IN": VULGAR_FRACTIONS } },

        { "LOWER": { "IN": ADJ_UNITS }, "OP": "?" },
        { "LEMMA": { "IN": UNITS } },
    ],
]

RANGE_MEASURE_WITHOUT_UNIT_PATTERN: MatcherPattern = [
    # 1-2 || 1½-2½ || 1-2½ || 1½-2
    [
        { "TEXT": { "REGEX": "\d*\.?\d+" } },
        { "LOWER": { "IN": VULGAR_FRACTIONS }, "OP": "?" },

        { "LOWER": { "IN": DASH_SYMBOLS } },

        { "TEXT": { "REGEX": "\d*\.?\d+" } },
        { "LOWER": { "IN": VULGAR_FRACTIONS }, "OP": "?" },
    ],
    # ½-½ || ½-1½
    [
        { "LOWER": { "IN": VULGAR_FRACTIONS } },

        { "LOWER": { "IN": DASH_SYMBOLS } },

        { "TEXT": { "REGEX": "\d*\.?\d+" }, "OP": "?" },
        { "LOWER": { "IN": VULGAR_FRACTIONS } },
    ],
]

MULTI_MEASURE_WITHOUT_UNIT_PATTERN: MatcherPattern = [
    # 1x2 || 1½x2½ || 1x2½ || 1½x2
    [
        { "TEXT": { "REGEX": "\d*\.?\d+" } },
        { "LOWER": { "IN": VULGAR_FRACTIONS }, "OP": "?" },

        { "LOWER": { "IN": MULTIPLICATION_SYMBOLS } },

        { "TEXT": { "REGEX": "\d*\.?\d+" } },
        { "LOWER": { "IN": VULGAR_FRACTIONS }, "OP": "?" },
    ],
    # ½x½ || ½x1½
    [
        { "LOWER": { "IN": VULGAR_FRACTIONS } },

        { "LOWER": { "IN": MULTIPLICATION_SYMBOLS } },

        { "TEXT": { "REGEX": "\d*\.?\d+" }, "OP": "?" },
        { "LOWER": { "IN": VULGAR_FRACTIONS } },
    ],
]

MEASURE_PATTERN: MatcherPattern = [
    # 1g || 1½g
    [
        { "TEXT": { "REGEX": "\d*\.?\d+" } },
        { "LOWER": { "IN": VULGAR_FRACTIONS }, "OP": "?" },

        { "LOWER": { "IN": ADJ_UNITS }, "OP": "?" },
        { "LEMMA": { "IN": UNITS } },
    ],
    # ½g
    [
        { "LOWER": { "IN": VULGAR_FRACTIONS } },

        { "LOWER": { "IN": ADJ_UNITS }, "OP": "?" },
        { "LEMMA": { "IN": UNITS } },
    ],
]

UNIT_MEASURE_PATTERN: MatcherPattern = [
    # g || ml || ...
    [ { "LEMMA": { "IN": UNITS } } ],
]

AMOUNT_MEASURE_PATTERN: MatcherPattern = [
    # 12 || 12½
    [
        { "TEXT": { "REGEX": "\d*\.?\d+" } },
        { "LOWER": { "IN": VULGAR_FRACTIONS }, "OP": "?" },
    ],
    # ½
    [
        { "LOWER": { "IN": VULGAR_FRACTIONS } },
    ],
]

PRODUCT_PATTERN: MatcherPattern = [
    [
        { "LOWER": "extra", "OP": "?" },
        { "LOWER": "virgin", "OP": "?" },
        { "LOWER": { "IN": [ "olive", "sesame", "sunflower", "peanut", "vegetable" ] } },
        { "LOWER": "oil" },
    ],
    [
        { "LOWER": "chipotle", "OP": "?" },
        { "LOWER": { "IN": [ "chilli", "tabasco" ] } },
        { "LOWER": "sauce" },
    ],
    [
        { "LOWER": "sea" },
        { "LOWER": "salt" },
    ],
    [
        { "LOWER": "black" },
        { "LOWER": "pepper" },
    ],
    [
        { "LOWER": "unsalted" },
        { "LOWER": "butter" },
    ],
    [
        { "LOWER": "lemon" },
        { "LOWER": "juice" },
    ],
    [
        { "LOWER": "runny" },
        { "LOWER": "honey" },
    ],
    [
        { "LOWER": "natural" },
        { "LOWER": "yoghurt" },
    ],
    [
        { "LOWER": "red" },
        { "LOWER": "wine" },
        { "LOWER": "vinegar" },
    ],
    [
        { "LOWER": "dried" },
        { "LOWER": "chilli" },
        { "LOWER": "flakes" },
    ],
]

# add range? with dashes or `to`
TEMPERATURE_MEASURE_PATTERN: MatcherPattern = [
    # 36½C || 400°F
    [
        { "TEXT": { "REGEX": "\d*\.?\d+" } },
        { "LOWER": { "IN": VULGAR_FRACTIONS }, "OP": "?" },

        { "LEMMA": { "IN": TEMPERATURE_UNITS } },
    ],
    # ½C
    [
        { "LOWER": { "IN": VULGAR_FRACTIONS } },

        { "LEMMA": { "IN": TEMPERATURE_UNITS } },
    ],
]

# add range? with dashes or `to`
TIME_MEASURE_PATTERN: MatcherPattern = [
    # 3½min || 60sec
    [
        { "TEXT": { "REGEX": "\d*\.?\d+" } },
        { "LOWER": { "IN": VULGAR_FRACTIONS }, "OP": "?" },

        { "LEMMA": { "IN": TIME_UNITS } },
    ],
    # ½h
    [
        { "LOWER": { "IN": VULGAR_FRACTIONS } },

        { "LEMMA": { "IN": TIME_UNITS } },
    ],
]

class MatcherPatternType(Enum):
    RANGE_MEASURE               = "RANGE_MEASURE"
    MULTI_MEASURE               = "MULTI_MEASURE"
    RANGE_MEASURE_WITHOUT_UNIT  = "RANGE_MEASURE_WITHOUT_UNIT"
    MULTI_MEASURE_WITHOUT_UNIT  = "MULTI_MEASURE_WITHOUT_UNIT"
    MEASURE                     = "MEASURE"
    UNIT_MEASURE                = "UNIT_MEASURE"
    AMOUNT_MEASURE              = "AMOUNT_MEASURE"
    PRODUCT                     = "PRODUCT"
    TEMPERATURE_MEASURE         = "TEMPERATURE_MEASURE"
    TIME_MEASURE                = "TIME_MEASURE"

INGREDIENT_PATTERNS: dict[MatcherPatternType, MatcherPattern] = {
    MatcherPatternType.RANGE_MEASURE:               RANGE_MEASURE_PATTERN,
    MatcherPatternType.MULTI_MEASURE:               MULTI_MEASURE_PATTERN,
    MatcherPatternType.RANGE_MEASURE_WITHOUT_UNIT:  RANGE_MEASURE_WITHOUT_UNIT_PATTERN,
    MatcherPatternType.MULTI_MEASURE_WITHOUT_UNIT:  MULTI_MEASURE_WITHOUT_UNIT_PATTERN,
    MatcherPatternType.MEASURE:                     MEASURE_PATTERN,
    MatcherPatternType.UNIT_MEASURE:                UNIT_MEASURE_PATTERN,
    MatcherPatternType.AMOUNT_MEASURE:              AMOUNT_MEASURE_PATTERN,
    # MatcherPatternType.PRODUCT:                     PRODUCT_PATTERN,
}

INSTRUCTION_PATTERNS: dict[MatcherPatternType, MatcherPattern] = {
    MatcherPatternType.TEMPERATURE_MEASURE:     TEMPERATURE_MEASURE_PATTERN,
    MatcherPatternType.TIME_MEASURE:            TIME_MEASURE_PATTERN,
}

def get_matcher(nlp: spacy.Language, patterns: dict[MatcherPatternType, MatcherPattern]) -> Matcher:

    matcher = Matcher(nlp.vocab)

    for (pattern_type, pattern) in patterns.items():
        matcher.add(pattern_type.name, pattern)
    
    return matcher
