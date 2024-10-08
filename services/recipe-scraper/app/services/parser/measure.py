from __future__ import annotations  # solution to the self-mention inside the class
import re
from enum import Enum

from spacy.tokens import Span

from app.services.parser import ADJ_UNITS, DASH_SYMBOLS, MULTIPLICATION_SYMBOLS, TEMPERATURE_UNITS, TIME_UNITS, UNITS, VULGAR_FRACTIONS_DICT
from app.services.parser.matcher import MatcherPatternType


# weight / volume / temperature / time
class MeasureType(Enum):
    DEFAULT = 1
    TEMPERATURE = 2
    TIME = 3


class Measure:
    def __init__(self, type: MeasureType, amount: float, unit: str) -> None:
        self.type = type
        self.amount = amount
        self.unit = unit
    
    def __repr__(self) -> str:
        return f"{{ type: {self.type}, amount: {self.amount}, unit: {self.unit} }}"

    def __lt__(self, other: Measure) -> bool:
        """
        comparison function that returns result based on how useful units are
        """

        match self.type:

            case MeasureType.DEFAULT:
                last_unit = len(UNITS)
                self_value = last_unit if self.unit == None else UNITS.index(self.unit)
                other_value = last_unit if other.unit == None else UNITS.index(other.unit)
                return self_value < other_value

            case MeasureType.TEMPERATURE:
                last_unit = len(TEMPERATURE_UNITS)
                self_value = last_unit if self.unit == None else TEMPERATURE_UNITS.index(self.unit)
                other_value = last_unit if other.unit == None else TEMPERATURE_UNITS.index(other.unit)
                return self_value < other_value

            case MeasureType.TIME:
                last_unit = len(TIME_UNITS)
                self_value = last_unit if self.unit == None else TIME_UNITS.index(self.unit)
                other_value = last_unit if other.unit == None else TIME_UNITS.index(other.unit)
                return self_value < other_value

            case _:
                return False

    @staticmethod
    def get_amount_from_multi(amount: str) -> float:
        """
        should work with following strings `1x2`, `1½x2½`, `1x2½`, `1½x2`, `½x½`, `½x1½`
        """
        amount_arr = re.split(r'|'.join(map(re.escape, MULTIPLICATION_SYMBOLS)), amount)
        amount_p1 = amount_arr[0]
        amount_p2 = amount_arr[1]

        for fraction, value in VULGAR_FRACTIONS_DICT.items():
            amount_p1 = amount_p1.replace(fraction, f"+{value}")

        for fraction, value in VULGAR_FRACTIONS_DICT.items():
            amount_p2 = amount_p2.replace(fraction, f"+{value}")

        number_p1 = sum(map(float, filter(None, amount_p1.split("+"))))
        number_p2 = sum(map(float, filter(None, amount_p2.split("+"))))

        return number_p2 * number_p1

    @staticmethod
    def get_amount_from_range(amount: str) -> float:
        """
        should work with following strings `1-2`, `1½-2½`, `1-2½`, `1½-2`, `½-½`, `½-1½`
        """
        amount_arr = re.split(r'|'.join(map(re.escape, DASH_SYMBOLS)), amount)
        amount_p1 = amount_arr[0]
        amount_p2 = amount_arr[1]

        for fraction, value in VULGAR_FRACTIONS_DICT.items():
            amount_p1 = amount_p1.replace(fraction, f"+{value}")

        for fraction, value in VULGAR_FRACTIONS_DICT.items():
            amount_p2 = amount_p2.replace(fraction, f"+{value}")

        number_p1 = sum(map(float, filter(None, amount_p1.split("+"))))
        number_p2 = sum(map(float, filter(None, amount_p2.split("+"))))

        return number_p1 + ( ( number_p2 - number_p1 ) / 2 )

    @staticmethod
    def get_amount_from(amount: str) -> float:
        """
        should work with following strings `12`, `12½`, `½`
        """
        for fraction, value in VULGAR_FRACTIONS_DICT.items():
            amount = amount.replace(fraction, f"+{value}")

        return sum(map(float, filter(None, amount.split("+"))))

    @staticmethod
    def get_measure_from_match(measure: Span) -> Measure:

        match measure.label_:

            # INGREDIENT MEASURE

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

            # TIME

            case MatcherPatternType.TIME_MEASURE.name:
                range_amount: Span = Span(measure.doc, measure.start, measure.end - 1, "AMOUNT")
                unit: Span = Span(measure.doc, measure.end - 1, measure.end, "UNIT")
                return Measure(MeasureType.TIME, Measure.get_amount_from(range_amount.text), unit.text.lower())

            # TEMPERATURE

            case MatcherPatternType.TEMPERATURE_MEASURE.name:
                range_amount: Span = Span(measure.doc, measure.start, measure.end - 1, "AMOUNT")
                unit: Span = Span(measure.doc, measure.end - 1, measure.end, "UNIT")
                return Measure(MeasureType.TEMPERATURE, Measure.get_amount_from(range_amount.text), unit.text.lower())

            # OTHER

            case _:
                return None
