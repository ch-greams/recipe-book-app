import { IngredientsFetchRequestedAction, INGREDIENTS_FETCH_REQUESTED } from "./types";



export function requestIngredients(): IngredientsFetchRequestedAction {
    return {
        type: INGREDIENTS_FETCH_REQUESTED,
    };
}
