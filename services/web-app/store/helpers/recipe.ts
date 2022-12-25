import { DecimalPlaces, roundToDecimal } from "@common/numeric";
import type { NutrientName } from "@common/nutrients";
import { mapDictionary } from "@common/object";
import { unwrap } from "@common/types";
import type { Direction, DirectionPart, Food, Ingredient, IngredientProduct, Recipe } from "@common/typings";
import { WeightUnit } from "@common/units";
import { getPercentMultiplier, nutrientSum } from "@common/utils";
import type {
    RecipeDirection, RecipeDirectionPartComment, RecipeDirectionPartIngredient,
    RecipeIngredient, RecipeIngredientProduct, RecipePageStore,
} from "@store/types/recipe";



function convertRecipeDirectionPartIntoDirectionPart(
    recipeDirectionPart: RecipeDirectionPartComment | RecipeDirectionPartIngredient,
    ingredients: RecipeIngredient[],
    directionPartIndex: number,
): DirectionPart {

    const directionPartIngredient = recipeDirectionPart as RecipeDirectionPartIngredient;
    const ingredientId = directionPartIngredient.ingredientId;

    let ingredientAmount;

    if (ingredientId) {
        const ingredient = unwrap(
            ingredients.find((_ingredient) => _ingredient.id === ingredientId),
            "ingredients.find((_ingredient) => _ingredient.id === ingredientId)",
        );

        const ingredientProduct = getRecipeIngredientProduct(ingredient);

        ingredientAmount = directionPartIngredient.ingredientAmount / ingredientProduct.amount;
    }

    return {
        step_number: directionPartIndex,
        direction_part_type: recipeDirectionPart.type,
        comment_text: (recipeDirectionPart as RecipeDirectionPartComment).commentText,
        ingredient_id: ingredientId,
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

export function convertFoodToIngredientProduct(food: Food): IngredientProduct {
    return {
        product_id: food.id,
        is_recipe: false,
        name: food.name,
        amount: 100,
        unit: WeightUnit.g,
        density: food.density,
        nutrients: food.nutrients,
    };
}

export function convertRecipeToIngredientProduct(recipe: Recipe): IngredientProduct {
    return {
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
            const { nutrients, amount } = getIngredientProduct(ingredient);
            const multiplier = getPercentMultiplier(amount);
            return mapDictionary(nutrients, (_key, value) => roundToDecimal(value * multiplier, DecimalPlaces.Two));
        });

    return nutrientSum(productNutrients);
}

export function getRecipeServingSizeFromIngredients(ingredients: Ingredient[]): number {
    return ingredients.reduce((sum, ingredient) => (sum + getIngredientProduct(ingredient).amount), 0);
}

export function getIngredientProduct(ingredient: Ingredient): IngredientProduct {
    return unwrap(ingredient.products[ingredient.product_id], `ingredient.products["${ingredient.product_id}"]`);
}
export function getRecipeIngredientProduct(ingredient: RecipeIngredient): RecipeIngredientProduct {
    return unwrap(ingredient.products[ingredient.product_id], `ingredient.products["${ingredient.product_id}"]`);
}
