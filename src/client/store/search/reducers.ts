import {
    INGREDIENTS_FETCH_ERROR,
    INGREDIENTS_FETCH_REQUESTED,
    INGREDIENTS_FETCH_SUCCESS,
    SearchPageActionTypes,
    SearchPageStore,
} from "./types";


const initialState: SearchPageStore = {

    isLoaded: false,
    errorMessage: null,

    ingredients: [],
};


export default function searchPageReducer(state = initialState, action: SearchPageActionTypes): SearchPageStore {

    switch (action.type) {

        case INGREDIENTS_FETCH_REQUESTED: {
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
