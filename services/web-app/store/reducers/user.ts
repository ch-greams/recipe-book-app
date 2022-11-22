import { createReducer } from "@reduxjs/toolkit";

import { UserMenuItem } from "@common/utils";

import { changeMenuItem, deleteCustomProduct, fetchProducts } from "../actions/user";
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
        .addCase(fetchProducts.pending, (state) => {
            state.isLoaded = false;
            state.errorMessage = null;
            state.favoriteFoods = [];
            state.customFoods = [];
            state.favoriteRecipes = [];
            state.customRecipes = [];
        })
        .addCase(fetchProducts.fulfilled, (state, action) => {
            const { favoriteFoods, customFoods, favoriteRecipes, customRecipes } = action.payload;
            state.isLoaded = true;
            state.errorMessage = null;
            state.favoriteFoods = favoriteFoods;
            state.customFoods = customFoods;
            state.favoriteRecipes = favoriteRecipes;
            state.customRecipes = customRecipes;
        })
        .addCase(fetchProducts.rejected, (state, action) => {
            const message = action.payload?.message;
            state.isLoaded = true;
            state.errorMessage = message;
            state.favoriteFoods = [];
            state.customFoods = [];
            state.favoriteRecipes = [];
            state.customRecipes = [];
        })
        .addCase(deleteCustomProduct.pending, (state) => {
            state.isLoaded = false;
            state.errorMessage = null;
        })
        .addCase(deleteCustomProduct.fulfilled, (state, action) => {
            const { arg: productId } = action.meta;
            state.isLoaded = true;
            state.errorMessage = null;
            state.customFoods = state.customFoods.filter((food) => food.id !== productId);
            state.customRecipes = state.customRecipes.filter((Recipe) => Recipe.id !== productId);
        })
        .addCase(deleteCustomProduct.rejected, (state, action) => {
            const message = action.payload?.message;
            state.isLoaded = true;
            state.errorMessage = message;
        });
});

export default reducer;
