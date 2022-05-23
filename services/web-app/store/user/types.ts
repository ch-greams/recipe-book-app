import type { FoodShort, RecipeShort } from "@common/typings";
import type { UserMenuItem } from "@common/utils";


export interface UserStore {
    userId: number;
    userName: string;

    selectedMenuItem: UserMenuItem;

    favoriteRecipes: RecipeShort[];
    customRecipes: RecipeShort[];

    favoriteFoods: FoodShort[];
    customFoods: FoodShort[];


    isLoaded: boolean;
    errorMessage?: Option<string>;
}


export const USER_UPDATE_MENU_ITEM = "USER_UPDATE_MENU_ITEM";

export const USER_RECIPES_FETCH_REQUEST = "USER_RECIPES_FETCH_REQUEST";
export const USER_RECIPES_FETCH_SUCCESS = "USER_RECIPES_FETCH_SUCCESS";
export const USER_RECIPES_FETCH_ERROR = "USER_RECIPES_FETCH_ERROR";

export const USER_FOODS_FETCH_REQUEST = "USER_FOODS_FETCH_REQUEST";
export const USER_FOODS_FETCH_SUCCESS = "USER_FOODS_FETCH_SUCCESS";
export const USER_FOODS_FETCH_ERROR = "USER_FOODS_FETCH_ERROR";



export interface UserUpdateMenuItem {
    type: typeof USER_UPDATE_MENU_ITEM;
    payload: UserMenuItem;
}

export interface UserRecipesFetchRequestedAction {
    type: typeof USER_RECIPES_FETCH_REQUEST;
}

export interface UserRecipesFetchSuccessAction {
    type: typeof USER_RECIPES_FETCH_SUCCESS;
    payload: { favoriteRecipes: RecipeShort[], customRecipes: RecipeShort[] };
}

interface UserRecipesFetchErrorAction {
    type: typeof USER_RECIPES_FETCH_ERROR;
    payload: string;
}

export interface UserFoodsFetchRequestedAction {
    type: typeof USER_FOODS_FETCH_REQUEST;
}

export interface UserFoodsFetchSuccessAction {
    type: typeof USER_FOODS_FETCH_SUCCESS;
    payload: { favoriteFoods: FoodShort[], customFoods: FoodShort[] };
}

interface UserFoodsFetchErrorAction {
    type: typeof USER_FOODS_FETCH_ERROR;
    payload: string;
}


export type UserActionTypes = (
    UserUpdateMenuItem |
    UserRecipesFetchRequestedAction | UserRecipesFetchSuccessAction | UserRecipesFetchErrorAction |
    UserFoodsFetchRequestedAction | UserFoodsFetchSuccessAction | UserFoodsFetchErrorAction
);
