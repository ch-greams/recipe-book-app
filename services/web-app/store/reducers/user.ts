import { createReducer } from "@reduxjs/toolkit";

import { UserMenuItem } from "@common/utils";

import { changeMenuItem, fetchFoods, fetchRecipes } from "../actions/user";
import type { UserStore } from "../types/user";



const initialState: UserStore = {
    userId: 1,
    userName: "Andrei Khvalko",

    selectedMenuItem: UserMenuItem.Journal,

    favoriteRecipes: [],
    customRecipes: [],

    favoriteFoods: [],
    customFoods: [],

    isLoaded: false,
    errorMessage: null,
};

const reducer = createReducer(initialState, (builder) => {
    builder
        .addCase(changeMenuItem, (state, action) => {
            state.selectedMenuItem = action.payload;
        })
        .addCase(fetchRecipes.pending, (state) => {
            state.isLoaded = false;
            state.errorMessage = null;
            state.favoriteRecipes = [];
            state.customRecipes = [];
        })
        .addCase(fetchRecipes.fulfilled, (state, action) => {
            const { favoriteRecipes, customRecipes } = action.payload;
            state.isLoaded = true;
            state.errorMessage = null;
            state.favoriteRecipes = favoriteRecipes;
            state.customRecipes = customRecipes;
        })
        .addCase(fetchRecipes.rejected, (state, action) => {
            const message = action.payload?.message;
            state.isLoaded = true;
            state.errorMessage = message;
            state.favoriteRecipes = [];
            state.customRecipes = [];
        })
        .addCase(fetchFoods.pending, (state) => {
            state.isLoaded = false;
            state.errorMessage = null;
            state.favoriteFoods = [];
            state.customFoods = [];
        })
        .addCase(fetchFoods.fulfilled, (state, action) => {
            const { favoriteFoods, customFoods } = action.payload;
            state.isLoaded = true;
            state.errorMessage = null;
            state.favoriteFoods = favoriteFoods;
            state.customFoods = customFoods;
        })
        .addCase(fetchFoods.rejected, (state, action) => {
            const message = action.payload?.message;
            state.isLoaded = true;
            state.errorMessage = message;
            state.favoriteFoods = [];
            state.customFoods = [];
        });
});

export default reducer;
