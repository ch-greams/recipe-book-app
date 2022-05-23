import type { AppState } from "..";

import type { SearchPageActionTypes, SearchPageStore } from "./types";
import { SEARCH_CLEAR } from "./types";
import {
    SEARCH_PRODUCTS_FETCH_ERROR,
    SEARCH_PRODUCTS_FETCH_REQUEST,
    SEARCH_PRODUCTS_FETCH_SUCCESS,
} from "./types";


const initialState: SearchPageStore = {

    isLoaded: true,
    errorMessage: null,

    searchInput: "",
    products: [],
};

export function extractState(globalState: AppState): SearchPageStore {
    return (globalState?.searchPage || initialState);
}

export default function searchPageReducer(state = initialState, action: SearchPageActionTypes): SearchPageStore {

    switch (action.type) {

        case SEARCH_CLEAR: {
            return {
                ...state,
                isLoaded: true,
                errorMessage: null,

                searchInput: "",
                products: [],
            };
        }

        case SEARCH_PRODUCTS_FETCH_REQUEST: {
            const { payload: filter } = action;

            return {
                ...state,
                isLoaded: false,
                errorMessage: null,

                searchInput: filter,
                products: [],
            };
        }

        case SEARCH_PRODUCTS_FETCH_SUCCESS: {
            return {
                ...state,
                isLoaded: true,
                errorMessage: null,
                products: action.payload,
            };
        }

        case SEARCH_PRODUCTS_FETCH_ERROR: {
            return {
                ...state,
                isLoaded: true,
                errorMessage: action.payload as string,
                products: [],
            };
        }

        default:
            return state;
    }
}
