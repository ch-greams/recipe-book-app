from pydantic import BaseModel


class Measure(BaseModel):
    amount: float | None
    unit: str | None

class Ingredient(BaseModel):
    text: str
    measure: Measure
    name: str | None

class Recipe(BaseModel):
    title: str
    time: str
    yields: str
    ingredients: list[Ingredient]
    instructions: list[str]
