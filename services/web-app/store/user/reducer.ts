import { UserMenuItem } from "@common/utils";

import type { UserActionTypes, UserStore } from "./types";
import * as types from "./types";



const initialState: UserStore = {
    selectedMenuItem: UserMenuItem.Diary,

    favoriteRecipes: [],
    customRecipes: [],

    favoriteFoods: [],
    customFoods: [],

    isLoaded: false,
    errorMessage: null,
};


export default function searchPageReducer(state = initialState, action: UserActionTypes): UserStore {

    switch (action.type) {

        case types.USER_UPDATE_MENU_ITEM: {
            return {
                ...state,
                selectedMenuItem: action.payload,
            };
        }

        case types.USER_RECIPES_FETCH_REQUEST: {
            return {
                ...state,

                isLoaded: false,
                errorMessage: null,

                favoriteRecipes: [],
                customRecipes: [],
            };
        }

        case types.USER_RECIPES_FETCH_SUCCESS: {
            return {
                ...state,

                isLoaded: true,
                errorMessage: null,

                favoriteRecipes: action.payload.favoriteRecipes,
                customRecipes: action.payload.customRecipes,
            };
        }

        case types.USER_RECIPES_FETCH_ERROR: {
            return {
                ...state,

                isLoaded: true,
                errorMessage: action.payload as string,

                favoriteRecipes: [],
                customRecipes: [],
            };
        }

        case types.USER_FOODS_FETCH_REQUEST: {
            return {
                ...state,

                isLoaded: false,
                errorMessage: null,

                favoriteFoods: [],
                customFoods: [],
            };
        }

        case types.USER_FOODS_FETCH_SUCCESS: {
            return {
                ...state,

                isLoaded: true,
                errorMessage: null,

                favoriteFoods: action.payload.favoriteFoods,
                customFoods: action.payload.customFoods,
            };
        }

        case types.USER_FOODS_FETCH_ERROR: {
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
