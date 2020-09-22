import {
    RECIPE_ITEM_UPDATE_NAME,
    RecipeItemActionTypes
} from "./types";



export function updateRecipeName(name: string): RecipeItemActionTypes {
    return {
        type: RECIPE_ITEM_UPDATE_NAME,
        payload: name,
    };
}
