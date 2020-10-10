import {
    IngredientDefault,
    RECIPE_ITEM_UPDATE_BRAND,
    RECIPE_ITEM_UPDATE_DESCRIPTION,
    RECIPE_ITEM_UPDATE_INGREDIENTS,
    RECIPE_ITEM_UPDATE_NAME,
    RECIPE_ITEM_UPDATE_SUBTITLE,
    UpdateBrandAction,
    UpdateDescriptionAction,
    UpdateIngredientsAction,
    UpdateNameAction,
    UpdateSubtitleAction,
} from "./types";



export function updateName(name: string): UpdateNameAction {
    return {
        type: RECIPE_ITEM_UPDATE_NAME,
        payload: name,
    };
}

export function updateBrand(brand: string): UpdateBrandAction {
    return {
        type: RECIPE_ITEM_UPDATE_BRAND,
        payload: brand,
    };
}

export function updateSubtitle(subtitle: string): UpdateSubtitleAction {
    return {
        type: RECIPE_ITEM_UPDATE_SUBTITLE,
        payload: subtitle,
    };
}

export function updateDescription(description: string): UpdateDescriptionAction {
    return {
        type: RECIPE_ITEM_UPDATE_DESCRIPTION,
        payload: description,
    };
}

export function updateIngredients(ingredients: IngredientDefault[]): UpdateIngredientsAction {
    return {
        type: RECIPE_ITEM_UPDATE_INGREDIENTS,
        payload: ingredients,
    };
}
