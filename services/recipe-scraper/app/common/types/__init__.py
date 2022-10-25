from pydantic import BaseModel


class Ingredient(BaseModel):
    text: str
    amount: float | None
    unit: str | None
    name: str | None

class Recipe(BaseModel):
    title: str
    time: str
    yields: str
    ingredients: list[Ingredient]
    instructions: list[str]
