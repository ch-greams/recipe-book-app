import { DecimalPlaces, roundToDecimal } from "@common/numeric";
import { NutrientName } from "@common/nutrients";
import { mapDictionary } from "@common/object";
import { isSome, unwrap, unwrapOr } from "@common/types";
import type { Food, Ingredient, Instruction, InstructionIngredient, Recipe } from "@common/typings";
import type * as typings from "@common/typings";
import { convertCelsiusToFahrenheit, convertFromMetric, convertFromSeconds, TemperatureUnit, WeightUnit } from "@common/units";
import { getTemporaryId } from "@common/utils";

import type * as types from "../types/recipe";
import type {
    RecipeIngredient, RecipeInstruction, RecipeInstructionIngredient, RecipePageStore,
} from "../types/recipe";

import { getNutrientMultiplierFromAmount } from "./food";



function convertRecipeInstructionIngredientIntoInstructionIngredient(
    recipeInstructionIngredient: RecipeInstructionIngredient,
    ingredients: RecipeIngredient[],
): InstructionIngredient {

    const ingredientSlotNumber = recipeInstructionIngredient.ingredientSlotNumber;

    const ingredient = unwrap(
        ingredients.find((_ingredient) => _ingredient.slot_number === ingredientSlotNumber),
        "ingredients.find((_ingredient) => _ingredient.slot_number === ingredientSlotNumber)",
    );

    return {
        ingredient_slot_number: ingredientSlotNumber,
        ingredient_percentage: recipeInstructionIngredient.ingredientAmount / ingredient.amount,
    };
}

function convertRecipeInstructionIntoInstruction(
    recipeInstruction: RecipeInstruction,
    ingredients: RecipeIngredient[],
    instructionIndex: number,
): Instruction {

    return {
        id: recipeInstruction.id,
        step_number: instructionIndex,
        description: recipeInstruction.description,
        duration_value: recipeInstruction.durationValue,
        duration_unit: recipeInstruction.durationUnit,
        temperature_value: recipeInstruction.temperatureValue,
        temperature_unit: recipeInstruction.temperatureUnit,
        ingredients: recipeInstruction.ingredients
            .map((instructionIngredient) =>
                convertRecipeInstructionIngredientIntoInstructionIngredient(instructionIngredient, ingredients),
            ),
    };
}

export function convertRecipePageIntoRecipe(recipePage: RecipePageStore): Recipe {
    return {
        id: recipePage.id,
        name: recipePage.name,
        brand: recipePage.brand,
        description: recipePage.description,
        custom_units: recipePage.customUnits,
        type: recipePage.type,
        is_recipe: recipePage.isRecipe,
        density: recipePage.density,
        serving_size: recipePage.servingSize,
        is_private: recipePage.isPrivate,
        nutrients: recipePage.nutrients,
        ingredients: recipePage.ingredients,
        instructions: recipePage.instructions
            .map((instruction, index) =>
                convertRecipeInstructionIntoInstruction(instruction, recipePage.ingredients, index),
            ),
    };
}

export function convertFoodToIngredient(food: Food, slotNumber: number, isAlternative: boolean): Ingredient {
    return {
        id: getTemporaryId(),
        slot_number: slotNumber,
        is_alternative: isAlternative,
        food_id: food.id,
        is_recipe: food.is_recipe,
        name: food.name,
        amount: 100,
        unit: WeightUnit.g,
        density: food.density,
        nutrients: food.nutrients,
    };
}

/**
 * Calculate nutrient values for a recipe based on a currently selected ingredients
 */
export function getRecipeNutrientsFromIngredients(ingredients: Ingredient[]): Dictionary<NutrientName, number> {

    const foodNutrients: Dictionary<NutrientName, number>[] = ingredients
        .map((ingredient) => {
            const multiplier = getNutrientMultiplierFromAmount(ingredient.amount);
            return mapDictionary(ingredient.nutrients, (_key, value) => roundToDecimal(value * multiplier, DecimalPlaces.Two));
        });

    return nutrientSum(foodNutrients);
}

export function getRecipeServingSizeFromIngredients(ingredients: Ingredient[]): number {
    return ingredients.reduce((sum, ingredient) => (sum + ingredient.amount), 0);
}

export function nutrientSum(foodNutrients: Dictionary<NutrientName, number>[]): Dictionary<NutrientName, number> {

    return Object.values(NutrientName).reduce((acc: Dictionary<NutrientName, number>, nutrientType) => {

        const nutrientValue = foodNutrients.reduce(
            (sum: Option<number>, ingredient) => {
                const value = ingredient[nutrientType];
                return ( isSome(value) ? unwrapOr(sum, 0) + value : sum );
            },
            null,
        );

        return {
            ...acc,
            [nutrientType]: (
                isSome(nutrientValue)
                    ? roundToDecimal(nutrientValue, DecimalPlaces.Two)
                    : null
            ),
        };
    }, {});
}


export function convertIngredients(ingredients: typings.Ingredient[]): types.RecipeIngredient[] {

    return ingredients.map((ingredient) => {

        const amountInCurrentUnits = convertFromMetric(ingredient.amount, ingredient.unit, [], ingredient.density);
        const amountInput = roundToDecimal(amountInCurrentUnits, DecimalPlaces.Two);

        return {
            ...ingredient,

            amountInput: String(amountInput),

            isOpen: false,
            isMarked: false,

            alternativeNutrients: {},
        };
    });
}

export function convertInstructionIngredient(
    instructionIngredient: typings.InstructionIngredient,
    ingredients: typings.Ingredient[],
): types.RecipeInstructionIngredient {

    const MAX_INGREDIENT_PERCENT = 1;

    const ingredientSlotNumber = unwrap(
        instructionIngredient.ingredient_slot_number,
        "instructionIngredient.ingredient_slot_number",
    );
    const ingredient = unwrap(
        ingredients.find((i) => i.slot_number === ingredientSlotNumber),
        "ingredients.find((i) => i.slot_number === ingredientSlotNumber)",
    );

    const ingredientAmount = ingredient.amount * unwrapOr(instructionIngredient.ingredient_percentage, MAX_INGREDIENT_PERCENT);

    const amountInCurrentUnits = convertFromMetric(ingredientAmount, ingredient.unit, [], ingredient.density);
    const ingredientAmountInput = roundToDecimal(amountInCurrentUnits, DecimalPlaces.Two);

    return {
        ingredientSlotNumber: ingredientSlotNumber,

        ingredientAmount: ingredientAmount,
        ingredientAmountInput: String(ingredientAmountInput),

        ingredientName: ingredient.name,
        ingredientUnit: ingredient.unit,

        ingredientDensity: ingredient.density,
    };
}

export function convertInstructions(instructions: typings.Instruction[], ingredients: typings.Ingredient[]): types.RecipeInstruction[] {

    return instructions.map((instruction) => ({
        id: instruction.id,

        stepNumber: instruction.step_number,
        description: instruction.description,

        durationValue: instruction.duration_value,
        durationUnit: instruction.duration_unit,
        durationValueInput: (
            instruction.duration_value
                ? String( roundToDecimal(
                    convertFromSeconds(instruction.duration_value, instruction.duration_unit),
                    DecimalPlaces.Two,
                ) )
                : ""
        ),

        temperatureValue: instruction.temperature_value,
        temperatureUnit: instruction.temperature_unit,
        temperatureValueInput: (
            instruction.temperature_value
                ? String( roundToDecimal(
                    instruction.temperature_unit === TemperatureUnit.F
                        ? convertCelsiusToFahrenheit(instruction.temperature_value)
                        : instruction.temperature_value,
                    DecimalPlaces.Two,
                ) )
                : ""
        ),

        isOpen: true,
        isMarked: false,

        ingredients: instruction.ingredients.map((step) => convertInstructionIngredient(step, ingredients)),
    }));
}

export function getNewStepNumber(last: Option<number>): number {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    return (last || -1) + 1;
}
