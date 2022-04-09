import type { FoodsFetchRequestedAction, RecipesFetchRequestedAction } from "./types";
import { FOODS_FETCH_REQUEST, RECIPES_FETCH_REQUEST } from "./types";



export function requestRecipes(): RecipesFetchRequestedAction {
    return {
        type: RECIPES_FETCH_REQUEST,
    };
}

export function requestFoods(): FoodsFetchRequestedAction {
    return {
        type: FOODS_FETCH_REQUEST,
    };
}
