
UNITS: list[str] = [
    "g",
    "gram",
    "kg",
    "oz",
    "ml",
    "cup",
    "cups",
    "tablespoon",
    "tablespoons",
    "teaspoon",
    "teaspoons",
    "fl oz",
    "pinch",
    "dash",
    "sprig",
    "sprigs",
    "clove",
    "cloves",
]

TEMPERATURE_UNITS: list[str] = [ "°f", "°c", "f", "c" ]
TIME_UNITS: list[str] = [ "second", "seconds", "sec", "s", "minute", "minutes", "min", "m", "hour", "hours", "h" ]

ADJ_UNITS: list[str] = [ "heaped", "heaping" ]
VULGAR_FRACTIONS_DICT: dict[str, str] = {
    "¼": "0.25",
    "½": "0.5",
    "¾": "0.75",
    "⅐": "0.14",
    "⅑": "0.11",
    "⅒": "0.1",
    "⅓": "0.33",
    "⅔": "0.66",
    "⅕": "0.2",
    "⅖": "0.4",
    "⅗": "0.6",
    "⅘": "0.8",
    "⅙": "0.16",
    "⅚": "0.83",
    "⅛": "0.125",
    "⅜": "0.375",
    "⅝": "0.625",
    "⅞": "0.875",
}

VULGAR_FRACTIONS: list[str] = list(VULGAR_FRACTIONS_DICT.keys())

DASH_SYMBOLS: list[str] = [ "\u2012", "\u2013", "\u2014", "\u2015", "-" ]
MULTIPLICATION_SYMBOLS: list[str] = [ "x", "X", "*" ]

OTHER_SYMBOLS: list[str] = [ "/" ]
