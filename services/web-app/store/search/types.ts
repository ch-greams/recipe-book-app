import type { IngredientProduct } from "@common/typings";


// FIXME: Not really a page (should be a part of RBA-12 rework)
export interface SearchPageStore {
    isLoaded: boolean;
    errorMessage?: Option<string>;
    ingredients: IngredientProduct[];
}


export const INGREDIENTS_FETCH_REQUEST = "INGREDIENTS_FETCH_REQUEST";
export const INGREDIENTS_FETCH_SUCCESS = "INGREDIENTS_FETCH_SUCCESS";
export const INGREDIENTS_FETCH_ERROR = "INGREDIENTS_FETCH_ERROR";



export interface IngredientsFetchRequestedAction {
    type: typeof INGREDIENTS_FETCH_REQUEST;
}

interface IngredientsFetchSuccessAction {
    type: typeof INGREDIENTS_FETCH_SUCCESS;
    payload: IngredientProduct[];
}

interface IngredientsFetchErrorAction {
    type: typeof INGREDIENTS_FETCH_ERROR;
    payload: string;
}


export type SearchPageActionTypes = (
    IngredientsFetchRequestedAction | IngredientsFetchSuccessAction | IngredientsFetchErrorAction
);
