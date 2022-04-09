import type { UserMenuItem } from "@common/utils";

import type { UserFoodsFetchRequestedAction, UserRecipesFetchRequestedAction, UserUpdateMenuItem } from "./types";
import * as types from "./types";


export function updateMenuItem(menuItem: UserMenuItem): UserUpdateMenuItem {
    return {
        type: types.USER_UPDATE_MENU_ITEM,
        payload: menuItem,
    };
}

export function requestRecipes(): UserRecipesFetchRequestedAction {
    return {
        type: types.USER_RECIPES_FETCH_REQUEST,
    };
}

export function requestFoods(): UserFoodsFetchRequestedAction {
    return {
        type: types.USER_FOODS_FETCH_REQUEST,
    };
}
