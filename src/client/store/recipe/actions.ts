import {
    Direction,
    IngredientDefault,
    RECIPE_ITEM_REMOVE_DIRECTION,
    RECIPE_ITEM_REMOVE_SUBDIRECTION,
    RECIPE_ITEM_TOGGLE_DIRECTION_OPEN,
    RECIPE_ITEM_UPDATE_BRAND,
    RECIPE_ITEM_UPDATE_DESCRIPTION,
    RECIPE_ITEM_UPDATE_DIRECTIONS,
    RECIPE_ITEM_UPDATE_INGREDIENTS,
    RECIPE_ITEM_UPDATE_NAME,
    RECIPE_ITEM_UPDATE_NEW_DIRECTION,
    RECIPE_ITEM_UPDATE_SUBTITLE,
    RemoveDirectionAction,
    RemoveSubDirectionAction,
    ToggleDirectionOpenAction,
    UpdateBrandAction,
    UpdateDescriptionAction,
    UpdateDirectionsAction,
    UpdateIngredientsAction,
    UpdateNameAction,
    UpdateNewDirectionAction,
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

export function updateDirections(directions: Direction[]): UpdateDirectionsAction {
    return {
        type: RECIPE_ITEM_UPDATE_DIRECTIONS,
        payload: directions,
    };
}

export function updateNewDirection(direction: Direction): UpdateNewDirectionAction {
    return {
        type: RECIPE_ITEM_UPDATE_NEW_DIRECTION,
        payload: direction,
    };
}


export function removeDirection(directionIndex: number): RemoveDirectionAction {
    return {
        type: RECIPE_ITEM_REMOVE_DIRECTION,
        payload: directionIndex,
    };
}

export function toggleDirectionOpen(directionIndex: number): ToggleDirectionOpenAction {
    return {
        type: RECIPE_ITEM_TOGGLE_DIRECTION_OPEN,
        payload: directionIndex,
    };
}

export function removeSubDirection(directionIndex: number, subDirectionIndex: number): RemoveSubDirectionAction {
    return {
        type: RECIPE_ITEM_REMOVE_SUBDIRECTION,
        payload: { directionIndex, subDirectionIndex },
    };
}
