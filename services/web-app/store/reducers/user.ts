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

    userName: "Andrei Greams",

    selectedMenuItem: UserMenuItem.Settings,

    favoriteFoods: [],
    customFoods: [],

    journalGroups: [],
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
    // META ACTIONS
    metaActions.fetchNutrients.rejected,
    // RECIPE ACTIONS
    recipeActions.fetchRecipe.rejected, recipeActions.createRecipe.rejected,
    recipeActions.updateRecipe.rejected, recipeActions.addIngredient.rejected,
    // SEARCH ACTIONS
    searchActions.searchFoods.rejected,
    // USER ACTIONS
    userActions.fetchUserData.rejected, userActions.deleteCustomFood.rejected,
    userActions.deleteFavoriteFood.rejected, userActions.upsertNutrient.rejected,
    userActions.deleteNutrient.rejected, userActions.login.rejected, userActions.signup.rejected,
    userActions.updateJournalGroups.rejected,
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
            state.nutrients = [];
        })
        .addCase(userActions.fetchUserData.fulfilled, (state, action) => {
            const userInfo = action.payload;
            state.isLoaded = true;
            state.errorMessage = null;
            state.favoriteFoods = userInfo.favorite_foods;
            state.customFoods = userInfo.created_foods;

            state.journalGroups = userInfo.journal_groups
                .map(({ ui_index, name }) => ({ uiIndex: ui_index, name }))
                .sort(sortBy("uiIndex"));

            state.nutrients = userInfo.user_nutrients
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
        .addCase(userActions.deleteCustomFood.pending, (state) => {
            state.isLoaded = false;
            state.errorMessage = null;
        })
        .addCase(userActions.deleteCustomFood.fulfilled, (state, action) => {
            const { arg: foodId } = action.meta;
            state.isLoaded = true;
            state.errorMessage = null;
            state.customFoods = state.customFoods.filter((food) => food.id !== foodId);
            state.favoriteFoods = state.favoriteFoods.filter((food) => food.id !== foodId);
        })
        .addCase(userActions.deleteCustomFood.rejected, (state, { payload: errorStatus }) => {
            state.isLoaded = true;
            state.errorMessage = getErrorMessageFromStatus(errorStatus);
        })
        .addCase(userActions.deleteFavoriteFood.pending, (state) => {
            state.isLoaded = false;
            state.errorMessage = null;
        })
        .addCase(userActions.deleteFavoriteFood.fulfilled, (state, action) => {
            const { arg: foodId } = action.meta;
            state.isLoaded = true;
            state.errorMessage = null;
            state.favoriteFoods = state.favoriteFoods.filter((food) => food.id !== foodId);
        })
        .addCase(userActions.deleteFavoriteFood.rejected, (state, { payload: errorStatus }) => {
            state.isLoaded = true;
            state.errorMessage = getErrorMessageFromStatus(errorStatus);
        })
        .addCase(userActions.updateJournalGroups.pending, (state) => {
            state.errorMessage = null;
            state.isLoaded = false;
        })
        .addCase(userActions.updateJournalGroups.fulfilled, (state, action) => {
            const groups = action.payload;
            state.errorMessage = null;
            state.isLoaded = true;

            state.journalGroups = groups
                .map(({ ui_index, name }) => ({ uiIndex: ui_index, name }))
                .sort(sortBy("uiIndex"));
        })
        .addCase(userActions.updateJournalGroups.rejected, (state, { payload: errorStatus }) => {
            state.errorMessage = getErrorMessageFromStatus(errorStatus);
            state.isLoaded = true;
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
