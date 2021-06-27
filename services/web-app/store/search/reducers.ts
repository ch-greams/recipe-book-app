import type {
    SearchPageActionTypes,
    SearchPageStore } from "./types";
import {
    INGREDIENTS_FETCH_ERROR,
    INGREDIENTS_FETCH_REQUEST,
    INGREDIENTS_FETCH_SUCCESS,
} from "./types";


const initialState: SearchPageStore = {

    isLoaded: false,
    errorMessage: null,

    ingredients: [],
};


export default function searchPageReducer(state = initialState, action: SearchPageActionTypes): SearchPageStore {

    switch (action.type) {

        case INGREDIENTS_FETCH_REQUEST: {
            return {
                ...state,
                isLoaded: false,
                errorMessage: null,
                ingredients: [],
            };
        }

        case INGREDIENTS_FETCH_SUCCESS: {
            return {
                ...state,
                isLoaded: true,
                errorMessage: null,
                ingredients: action.payload,
            };
        }

        case INGREDIENTS_FETCH_ERROR: {
            return {
                ...state,
                isLoaded: true,
                errorMessage: action.payload as string,
                ingredients: [],
            };
        }

        default:
            return state;
    }
}
