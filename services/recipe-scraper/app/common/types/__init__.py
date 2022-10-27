from pydantic import BaseModel


class Ingredient(BaseModel):
    text: str
    amount: float | None
    unit: str | None
    name: str
    mentioned_name: str | None
    instructions: set[int]

class InstructionIngredient(BaseModel):
    label: str
    mentioned_name: str | None
    # matches: set[Span]
    instructions: set[int]

class Measure(BaseModel):
    amount: float | None
    unit: str | None

class Instruction(BaseModel):
    text: str
    measures: list[Measure]
    # ingredients: list[int]

class Recipe(BaseModel):
    title: str
    time: str
    yields: str
    ingredients: list[Ingredient]
    instructions: list[Instruction]
