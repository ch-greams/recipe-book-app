import type { IngredientsFetchRequestedAction } from "./types";
import { INGREDIENTS_FETCH_REQUEST } from "./types";



export function requestIngredients(): IngredientsFetchRequestedAction {
    return {
        type: INGREDIENTS_FETCH_REQUEST,
    };
}
