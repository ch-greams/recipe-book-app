import { DecimalPlaces, roundToDecimal } from "@common/numeric";
import { NutrientName } from "@common/nutrients";
import { mapDictionary } from "@common/object";
import { isSome, unwrap, unwrapOr } from "@common/types";
import type { Food, Ingredient, Instruction, InstructionIngredient, Recipe } from "@common/typings";
import { WeightUnit } from "@common/units";
import { getTemporaryId } from "@common/utils";

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
        density: recipePage.density,
        serving_size: recipePage.servingSize,
        ingredients: recipePage.ingredients,
        instructions: recipePage.instructions
            .map((instruction, index) =>
                convertRecipeInstructionIntoInstruction(instruction, recipePage.ingredients, index),
            ),
        is_private: recipePage.isPrivate,
        nutrients: recipePage.nutrients,
    };
}

export function convertFoodToIngredient(food: Food, slotNumber: number, isAlternative: boolean, isRecipe: boolean): Ingredient {
    return {
        id: getTemporaryId(),
        slot_number: slotNumber,
        is_alternative: isAlternative,
        food_id: food.id,
        is_recipe: isRecipe,
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
