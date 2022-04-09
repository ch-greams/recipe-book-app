import type { FoodShort, RecipeShort } from "@common/typings";


export interface UserStore {
    favoriteRecipes: RecipeShort[];
    customRecipes: RecipeShort[];

    favoriteFoods: FoodShort[];
    customFoods: FoodShort[];


    isLoaded: boolean;
    errorMessage?: Option<string>;
}



export const RECIPES_FETCH_REQUEST = "RECIPES_FETCH_REQUEST";
export const RECIPES_FETCH_SUCCESS = "RECIPES_FETCH_SUCCESS";
export const RECIPES_FETCH_ERROR = "RECIPES_FETCH_ERROR";

export const FOODS_FETCH_REQUEST = "FOODS_FETCH_REQUEST";
export const FOODS_FETCH_SUCCESS = "FOODS_FETCH_SUCCESS";
export const FOODS_FETCH_ERROR = "FOODS_FETCH_ERROR";



export interface RecipesFetchRequestedAction {
    type: typeof RECIPES_FETCH_REQUEST;
}

export interface RecipesFetchSuccessAction {
    type: typeof RECIPES_FETCH_SUCCESS;
    payload: { favoriteRecipes: RecipeShort[], customRecipes: RecipeShort[] };
}

interface RecipesFetchErrorAction {
    type: typeof RECIPES_FETCH_ERROR;
    payload: string;
}

export interface FoodsFetchRequestedAction {
    type: typeof FOODS_FETCH_REQUEST;
}

export interface FoodsFetchSuccessAction {
    type: typeof FOODS_FETCH_SUCCESS;
    payload: { favoriteFoods: FoodShort[], customFoods: FoodShort[] };
}

interface FoodsFetchErrorAction {
    type: typeof FOODS_FETCH_ERROR;
    payload: string;
}


export type UserActionTypes = (
    RecipesFetchRequestedAction | RecipesFetchSuccessAction | RecipesFetchErrorAction |
    FoodsFetchRequestedAction | FoodsFetchSuccessAction | FoodsFetchErrorAction
);
