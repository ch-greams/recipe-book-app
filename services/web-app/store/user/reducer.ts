import type { UserActionTypes, UserStore } from "./types";
import {
    FOODS_FETCH_ERROR,
    FOODS_FETCH_REQUEST,
    FOODS_FETCH_SUCCESS,
    RECIPES_FETCH_ERROR,
    RECIPES_FETCH_REQUEST,
    RECIPES_FETCH_SUCCESS,
} from "./types";


const initialState: UserStore = {

    favoriteRecipes: [],
    customRecipes: [],

    favoriteFoods: [],
    customFoods: [],

    isLoaded: false,
    errorMessage: null,
};


export default function searchPageReducer(state = initialState, action: UserActionTypes): UserStore {

    switch (action.type) {

        case RECIPES_FETCH_REQUEST: {
            return {
                ...state,

                isLoaded: false,
                errorMessage: null,

                favoriteRecipes: [],
                customRecipes: [],
            };
        }

        case RECIPES_FETCH_SUCCESS: {
            return {
                ...state,

                isLoaded: true,
                errorMessage: null,

                favoriteRecipes: action.payload.favoriteRecipes,
                customRecipes: action.payload.customRecipes,
            };
        }

        case RECIPES_FETCH_ERROR: {
            return {
                ...state,

                isLoaded: true,
                errorMessage: action.payload as string,

                favoriteRecipes: [],
                customRecipes: [],
            };
        }

        case FOODS_FETCH_REQUEST: {
            return {
                ...state,

                isLoaded: false,
                errorMessage: null,

                favoriteFoods: [],
                customFoods: [],
            };
        }

        case FOODS_FETCH_SUCCESS: {
            return {
                ...state,

                isLoaded: true,
                errorMessage: null,

                favoriteFoods: action.payload.favoriteFoods,
                customFoods: action.payload.customFoods,
            };
        }

        case FOODS_FETCH_ERROR: {
            return {
                ...state,

                isLoaded: true,
                errorMessage: action.payload as string,

                favoriteFoods: [],
                customFoods: [],
            };
        }

        default:
            return state;
    }
}
