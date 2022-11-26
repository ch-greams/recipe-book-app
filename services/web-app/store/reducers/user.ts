import { createReducer } from "@reduxjs/toolkit";

import { UserMenuItem } from "@common/utils";

import { changeMenuItem, deleteCustomProduct, deleteFavoriteProduct, fetchUserData } from "../actions/user";
import type { UserStore } from "../types/user";



const initialState: UserStore = {
    userId: 1,
    userName: "Andrei Khvalko",

    selectedMenuItem: UserMenuItem.Settings,

    favoriteRecipes: [],
    customRecipes: [],

    favoriteFoods: [],
    customFoods: [],

    nutrients: [],

    isLoaded: false,
    errorMessage: null,
};

const reducer = createReducer(initialState, (builder) => {
    builder
        .addCase(changeMenuItem, (state, action) => {
            state.selectedMenuItem = action.payload;
        })
        .addCase(fetchUserData.pending, (state) => {
            state.isLoaded = false;
            state.errorMessage = null;
            state.favoriteFoods = [];
            state.customFoods = [];
            state.favoriteRecipes = [];
            state.customRecipes = [];
            state.nutrients = [];
        })
        .addCase(fetchUserData.fulfilled, (state, action) => {
            const { favoriteFoods, customFoods, favoriteRecipes, customRecipes, nutrients } = action.payload;
            state.isLoaded = true;
            state.errorMessage = null;
            state.favoriteFoods = favoriteFoods;
            state.customFoods = customFoods;
            state.favoriteRecipes = favoriteRecipes;
            state.customRecipes = customRecipes;
            state.nutrients = nutrients.map((nutrient) => ({
                nutrientId: nutrient.nutrient_id,
                isFeatured: nutrient.is_featured,
                userDailyTargetAmount: nutrient.daily_target_amount,
                uiIndex: nutrient.ui_index,
                nutrientName: nutrient.nutrient_name,
                nutrientDailyTargetAmount: nutrient.nutrient_daily_value,
                nutrientUnit: nutrient.nutrient_unit,
                nutrientGroup: nutrient.nutrient_group,
                nutrientParentName: nutrient.nutrient_parent_name,
            }));
        })
        .addCase(fetchUserData.rejected, (state, action) => {
            const message = action.payload?.message;
            state.isLoaded = true;
            state.errorMessage = message;
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
            state.favoriteFoods = state.favoriteFoods.filter((food) => food.id !== productId);
            state.customRecipes = state.customRecipes.filter((recipe) => recipe.id !== productId);
            state.favoriteRecipes = state.favoriteRecipes.filter((recipe) => recipe.id !== productId);
        })
        .addCase(deleteCustomProduct.rejected, (state, action) => {
            const message = action.payload?.message;
            state.isLoaded = true;
            state.errorMessage = message;
        })
        .addCase(deleteFavoriteProduct.pending, (state) => {
            state.isLoaded = false;
            state.errorMessage = null;
        })
        .addCase(deleteFavoriteProduct.fulfilled, (state, action) => {
            const { arg: productId } = action.meta;
            state.isLoaded = true;
            state.errorMessage = null;
            state.favoriteFoods = state.favoriteFoods.filter((food) => food.id !== productId);
            state.favoriteRecipes = state.favoriteRecipes.filter((recipe) => recipe.id !== productId);
        })
        .addCase(deleteFavoriteProduct.rejected, (state, action) => {
            const message = action.payload?.message;
            state.isLoaded = true;
            state.errorMessage = message;
        });
});

export default reducer;
