import { INGREDIENTS_FETCH_REQUESTED,IngredientsFetchRequestedAction } from "./types";



export function requestIngredients(): IngredientsFetchRequestedAction {
    return {
        type: INGREDIENTS_FETCH_REQUESTED,
    };
}
