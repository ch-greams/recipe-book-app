import type { ProductShort } from "@common/typings";


export interface SearchPageStore {
    isLoaded: boolean;
    errorMessage?: Option<string>;

    searchInput: string;
    products: ProductShort[];
}


export const SEARCH_CLEAR= "SEARCH_CLEAR";

export const SEARCH_PRODUCTS_FETCH_REQUEST = "SEARCH_PRODUCTS_FETCH_REQUEST";
export const SEARCH_PRODUCTS_FETCH_SUCCESS = "SEARCH_PRODUCTS_FETCH_SUCCESS";
export const SEARCH_PRODUCTS_FETCH_ERROR = "SEARCH_PRODUCTS_FETCH_ERROR";


export interface SearchClearAction {
    type: typeof SEARCH_CLEAR;
}

export interface SearchProductsFetchRequestedAction {
    type: typeof SEARCH_PRODUCTS_FETCH_REQUEST;
    payload: string;
}

interface SearchProductsFetchSuccessAction {
    type: typeof SEARCH_PRODUCTS_FETCH_SUCCESS;
    payload: ProductShort[];
}

interface SearchProductsFetchErrorAction {
    type: typeof SEARCH_PRODUCTS_FETCH_ERROR;
    payload: string;
}


export type SearchPageActionTypes = (
    SearchClearAction | SearchProductsFetchRequestedAction |
    SearchProductsFetchSuccessAction | SearchProductsFetchErrorAction
);
