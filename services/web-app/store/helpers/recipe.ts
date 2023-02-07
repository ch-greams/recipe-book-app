import { DecimalPlaces, roundToDecimal } from "@common/numeric";
import { NutrientName } from "@common/nutrients";
import { mapDictionary } from "@common/object";
import { isSome, unwrap, unwrapOr } from "@common/types";
import type { Direction, DirectionPart, Food, Ingredient, Recipe } from "@common/typings";
import { WeightUnit } from "@common/units";
import { getTemporaryId } from "@common/utils";

import type {
    RecipeDirection, RecipeDirectionPartComment, RecipeDirectionPartIngredient, RecipeIngredient, RecipePageStore,
} from "../types/recipe";

import { getNutrientMultiplierFromAmount } from "./food";



function convertRecipeDirectionPartIntoDirectionPart(
    recipeDirectionPart: RecipeDirectionPartComment | RecipeDirectionPartIngredient,
    ingredients: RecipeIngredient[],
    directionPartIndex: number,
): DirectionPart {

    const directionPartIngredient = recipeDirectionPart as RecipeDirectionPartIngredient;
    const ingredientNumber = directionPartIngredient.ingredientNumber;

    let ingredientAmount;

    if (ingredientNumber) {
        const ingredient = unwrap(
            ingredients.find((_ingredient) => _ingredient.slot_number === ingredientNumber),
            "ingredients.find((_ingredient) => _ingredient.id === ingredientId)",
        );

        ingredientAmount = directionPartIngredient.ingredientAmount / ingredient.amount;
    }

    return {
        step_number: directionPartIndex,
        direction_part_type: recipeDirectionPart.type,
        comment_text: (recipeDirectionPart as RecipeDirectionPartComment).commentText,
        ingredient_number: ingredientNumber,
        ingredient_amount: ingredientAmount,
    };
}

function convertRecipeDirectionIntoDirection(
    recipeDirection: RecipeDirection,
    ingredients: RecipeIngredient[],
    directionIndex: number,
): Direction {

    const directionParts = recipeDirection.steps
        .map((directionPart, index) => convertRecipeDirectionPartIntoDirectionPart(directionPart, ingredients, index));

    return {
        id: recipeDirection.id,
        step_number: directionIndex,
        name: recipeDirection.name,
        duration_value: recipeDirection.durationValue,
        duration_unit: recipeDirection.durationUnit,
        temperature_value: recipeDirection.temperatureValue,
        temperature_unit: recipeDirection.temperatureUnit,
        steps: directionParts,
    };
}

export function convertRecipePageIntoRecipe(recipePage: RecipePageStore): Recipe {

    const directions = recipePage.directions
        .map((direction, index) => convertRecipeDirectionIntoDirection(direction, recipePage.ingredients, index));

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
        directions: directions,
        is_private: recipePage.isPrivate,
    };
}

// TODO: RBA-221 should merge convert to ingredient functions
export function convertFoodToIngredient(food: Food, slotNumber: number, isAlternative: boolean): Ingredient {
    return {
        id: getTemporaryId(),
        slot_number: slotNumber,
        is_alternative: isAlternative,
        product_id: food.id,
        is_recipe: false,
        name: food.name,
        amount: 100,
        unit: WeightUnit.g,
        density: food.density,
        nutrients: food.nutrients,
    };
}

// TODO: RBA-221 should merge convert to ingredient functions
export function convertRecipeToIngredient(recipe: Recipe, slotNumber: number, isAlternative: boolean): Ingredient {
    return {
        id: getTemporaryId(),
        slot_number: slotNumber,
        is_alternative: isAlternative,
        product_id: recipe.id,
        is_recipe: true,
        name: recipe.name,
        amount: 100,
        unit: WeightUnit.g,
        density: recipe.density,
        nutrients: getRecipeNutrientsFromIngredients(recipe.ingredients),
    };
}

/**
 * Calculate nutrient values for a recipe based on a currently selected ingredients
 */
export function getRecipeNutrientsFromIngredients(ingredients: Ingredient[]): Dictionary<NutrientName, number> {

    const productNutrients: Dictionary<NutrientName, number>[] = ingredients
        .map((ingredient) => {
            const multiplier = getNutrientMultiplierFromAmount(ingredient.amount);
            return mapDictionary(ingredient.nutrients, (_key, value) => roundToDecimal(value * multiplier, DecimalPlaces.Two));
        });

    return nutrientSum(productNutrients);
}

export function getRecipeServingSizeFromIngredients(ingredients: Ingredient[]): number {
    return ingredients.reduce((sum, ingredient) => (sum + ingredient.amount), 0);
}

export function nutrientSum(productNutrients: Dictionary<NutrientName, number>[]): Dictionary<NutrientName, number> {

    return Object.values(NutrientName).reduce((acc: Dictionary<NutrientName, number>, nutrientType) => {

        const nutrientValue = productNutrients.reduce(
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
