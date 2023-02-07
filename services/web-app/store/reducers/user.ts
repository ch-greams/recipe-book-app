import { createReducer, isAnyOf } from "@reduxjs/toolkit";

import { sortBy } from "@common/array";
import { getErrorMessageFromStatus, HttpStatus } from "@common/http";

import * as foodActions from "../actions/food";
import * as journalActions from "../actions/journal";
import * as metaActions from "../actions/meta";
import * as recipeActions from "../actions/recipe";
import * as searchActions from "../actions/search";
import * as userActions from "../actions/user";
import type { UserStore } from "../types/user";
import { UserMenuItem } from "../types/user";



const initialState: UserStore = {

    isLoggedIn: true,

    userId: 1,
    userName: "Andrei Greams",

    selectedMenuItem: UserMenuItem.Settings,

    favoriteRecipes: [],
    customRecipes: [],

    favoriteFoods: [],
    customFoods: [],

    nutrients: [],

    isLoaded: false,
    errorMessage: null,
};

const ASYNC_REJECTIONS = isAnyOf(
    // FOOD ACTIONS
    foodActions.fetchFood.rejected, foodActions.createFood.rejected, foodActions.updateFood.rejected,
    // JOURNAL ACTIONS
    journalActions.fetchJournalInfo.rejected, journalActions.createJournalEntry.rejected,
    journalActions.updateJournalEntry.rejected, journalActions.deleteJournalEntry.rejected,
    journalActions.updateJournalGroups.rejected,
    // META ACTIONS
    metaActions.fetchNutrients.rejected,
    // RECIPE ACTIONS
    recipeActions.fetchRecipe.rejected, recipeActions.createRecipe.rejected,
    recipeActions.updateRecipe.rejected, recipeActions.addIngredient.rejected,
    // SEARCH ACTIONS
    searchActions.searchProducts.rejected,
    // USER ACTIONS
    userActions.fetchUserData.rejected, userActions.deleteCustomProduct.rejected,
    userActions.deleteFavoriteProduct.rejected, userActions.upsertNutrient.rejected,
    userActions.deleteNutrient.rejected, userActions.login.rejected, userActions.signup.rejected,
);

const reducer = createReducer(initialState, (builder) => {
    builder
        .addCase(userActions.changeMenuItem, (state, action) => {
            state.selectedMenuItem = action.payload;
        })
        .addCase(userActions.fetchUserData.pending, (state) => {
            state.isLoaded = false;
            state.errorMessage = null;
            state.favoriteFoods = [];
            state.customFoods = [];
            state.favoriteRecipes = [];
            state.customRecipes = [];
            state.nutrients = [];
        })
        .addCase(userActions.fetchUserData.fulfilled, (state, action) => {
            const { favoriteFoods, customFoods, favoriteRecipes, customRecipes, nutrients } = action.payload;
            state.isLoaded = true;
            state.errorMessage = null;
            state.favoriteFoods = favoriteFoods;
            state.customFoods = customFoods;
            state.favoriteRecipes = favoriteRecipes;
            state.customRecipes = customRecipes;
            state.nutrients = nutrients
                .map((nutrient) => ({
                    nutrientId: nutrient.nutrient_id,
                    isFeatured: nutrient.is_featured,
                    userDailyTargetAmount: nutrient.daily_target_amount,
                    uiIndex: nutrient.ui_index,
                    nutrientName: nutrient.nutrient_name,
                    nutrientDailyTargetAmount: nutrient.nutrient_daily_value,
                    nutrientUnit: nutrient.nutrient_unit,
                    nutrientGroup: nutrient.nutrient_group,
                    nutrientParentName: nutrient.nutrient_parent_name,
                }))
                .sort(sortBy("uiIndex"));
        })
        .addCase(userActions.fetchUserData.rejected, (state, { payload: errorStatus }) => {
            state.isLoaded = true;
            state.errorMessage = getErrorMessageFromStatus(errorStatus);
        })
        .addCase(userActions.deleteCustomProduct.pending, (state) => {
            state.isLoaded = false;
            state.errorMessage = null;
        })
        .addCase(userActions.deleteCustomProduct.fulfilled, (state, action) => {
            const { arg: productId } = action.meta;
            state.isLoaded = true;
            state.errorMessage = null;
            state.customFoods = state.customFoods.filter((food) => food.id !== productId);
            state.favoriteFoods = state.favoriteFoods.filter((food) => food.id !== productId);
            state.customRecipes = state.customRecipes.filter((recipe) => recipe.id !== productId);
            state.favoriteRecipes = state.favoriteRecipes.filter((recipe) => recipe.id !== productId);
        })
        .addCase(userActions.deleteCustomProduct.rejected, (state, { payload: errorStatus }) => {
            state.isLoaded = true;
            state.errorMessage = getErrorMessageFromStatus(errorStatus);
        })
        .addCase(userActions.deleteFavoriteProduct.pending, (state) => {
            state.isLoaded = false;
            state.errorMessage = null;
        })
        .addCase(userActions.deleteFavoriteProduct.fulfilled, (state, action) => {
            const { arg: productId } = action.meta;
            state.isLoaded = true;
            state.errorMessage = null;
            state.favoriteFoods = state.favoriteFoods.filter((food) => food.id !== productId);
            state.favoriteRecipes = state.favoriteRecipes.filter((recipe) => recipe.id !== productId);
        })
        .addCase(userActions.deleteFavoriteProduct.rejected, (state, { payload: errorStatus }) => {
            state.isLoaded = true;
            state.errorMessage = getErrorMessageFromStatus(errorStatus);
        })
        .addCase(userActions.upsertNutrient.pending, (state) => {
            state.isLoaded = false;
            state.errorMessage = null;
        })
        .addCase(userActions.upsertNutrient.fulfilled, (state, action) => {
            const { payload: userNutrient } = action;
            state.isLoaded = true;
            state.errorMessage = null;

            state.nutrients = [
                ...state.nutrients.filter((nutrient) => (
                    nutrient.nutrientId !== userNutrient.nutrient_id && nutrient.uiIndex !== userNutrient.ui_index
                )),
                {
                    nutrientId: userNutrient.nutrient_id,
                    isFeatured: userNutrient.is_featured,
                    userDailyTargetAmount: userNutrient.daily_target_amount,
                    uiIndex: userNutrient.ui_index,
                    nutrientName: userNutrient.nutrient_name,
                    nutrientDailyTargetAmount: userNutrient.nutrient_daily_value,
                    nutrientUnit: userNutrient.nutrient_unit,
                    nutrientGroup: userNutrient.nutrient_group,
                    nutrientParentName: userNutrient.nutrient_parent_name,
                },
            ];
        })
        .addCase(userActions.upsertNutrient.rejected, (state, { payload: errorStatus }) => {
            state.isLoaded = true;
            state.errorMessage = getErrorMessageFromStatus(errorStatus);
        })
        .addCase(userActions.deleteNutrient.pending, (state) => {
            state.isLoaded = false;
            state.errorMessage = null;
        })
        .addCase(userActions.deleteNutrient.fulfilled, (state, action) => {
            const { arg: nutrientId } = action.meta;
            state.isLoaded = true;
            state.errorMessage = null;

            state.nutrients = state.nutrients.filter((nutrient) => nutrient.nutrientId !== nutrientId);
        })
        .addCase(userActions.deleteNutrient.rejected, (state, { payload: errorStatus }) => {
            state.isLoaded = true;
            state.errorMessage = getErrorMessageFromStatus(errorStatus);
        })
        .addCase(userActions.login.pending, (state) => {
            state.isLoaded = false;
            state.errorMessage = null;
        })
        .addCase(userActions.login.fulfilled, (state) => {
            state.isLoaded = true;
            state.errorMessage = null;
            state.isLoggedIn = true;
        })
        .addCase(userActions.login.rejected, (state, { payload: errorStatus }) => {
            state.isLoaded = true;
            state.errorMessage = getErrorMessageFromStatus(errorStatus);
            state.isLoggedIn = false;
        })
        .addCase(userActions.signup.pending, (state) => {
            state.isLoaded = false;
            state.errorMessage = null;
            state.isLoggedIn = false;
        })
        .addCase(userActions.signup.fulfilled, (state) => {
            state.isLoaded = true;
            state.errorMessage = null;
        })
        .addCase(userActions.signup.rejected, (state, { payload: errorStatus }) => {
            state.isLoaded = true;
            state.errorMessage = getErrorMessageFromStatus(errorStatus);
        })
        .addMatcher(ASYNC_REJECTIONS, (state, { payload: errorStatus }) => {
            if (errorStatus === HttpStatus.Unauthorized) {
                // TODO: Implement full logout
                state.isLoggedIn = false;
            }
        });
});

export default reducer;
