import { INGREDIENTS_FETCH_REQUEST, IngredientsFetchRequestedAction } from "./types";



export function requestIngredients(): IngredientsFetchRequestedAction {
    return {
        type: INGREDIENTS_FETCH_REQUEST,
    };
}
