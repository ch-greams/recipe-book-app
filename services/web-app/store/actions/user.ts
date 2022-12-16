import { createAction, createAsyncThunk } from "@reduxjs/toolkit";

import type { HttpStatus } from "@common/http";
import { isSuccess } from "@common/http";
import { isSome } from "@common/types";
import type { FoodShort, RecipeShort, UserNutrient, UserNutrientDetailed } from "@common/typings";
import type { UserMenuItem } from "@common/utils";
import { ProductType } from "@common/utils";
import JournalApi from "@api/journalApi";
import AuthApi from "@api/loginApi";
import ProductApi from "@api/productApi";

import type { RootState } from "..";


export const changeMenuItem = createAction<UserMenuItem>("user/change_menu_item");



export const fetchUserData = createAsyncThunk<
    {
        favoriteFoods: FoodShort[];
        customFoods: FoodShort[];
        favoriteRecipes: RecipeShort[];
        customRecipes: RecipeShort[];
        nutrients: UserNutrientDetailed[];
    },
    void,
    { rejectValue: Error }
>(
    "user/fetch_data",
    async (_arg, { rejectWithValue }) => {
        try {
            const [ favoriteFoods, customFoods, favoriteRecipes, customRecipes, nutrients ] = await Promise.all([
                ProductApi.getFavoriteProducts<FoodShort>(ProductType.Food),
                ProductApi.getCustomProducts<FoodShort>(ProductType.Food),
                ProductApi.getFavoriteProducts<RecipeShort>(ProductType.Recipe),
                ProductApi.getCustomProducts<RecipeShort>(ProductType.Recipe),
                JournalApi.getUserNutrients(),
            ]);
            return { favoriteFoods, customFoods, favoriteRecipes, customRecipes, nutrients };
        }
        catch (error) {
            return rejectWithValue(error as Error);
        }
    },
);

export const deleteCustomProduct = createAsyncThunk<void, number, { rejectValue: Error }>(
    "user/delete_custom_product",
    async (productId, { rejectWithValue }) => {
        try {
            await ProductApi.deleteProduct(productId);
        }
        catch (error) {
            return rejectWithValue(error as Error);
        }
    },
);

export const deleteFavoriteProduct = createAsyncThunk<void, number, { rejectValue: Error }>(
    "user/delete_favorite_product",
    async (productId, { rejectWithValue }) => {
        try {
            await ProductApi.deleteFavoriteProduct(productId);
        }
        catch (error) {
            return rejectWithValue(error as Error);
        }
    },
);

export const upsertNutrient = createAsyncThunk<UserNutrientDetailed, UserNutrient, { state: RootState, rejectValue: Error }>(
    "user/upsert_nutrient",
    async (userNutrient, { getState, rejectWithValue }) => {
        try {
            const { nutrients } = getState().user;

            const prevNutrient = nutrients.find((nutrient) => nutrient.uiIndex === userNutrient.ui_index);

            const [ nutrient ] = await Promise.all([
                JournalApi.upsertUserNutrient(userNutrient),
                ...(isSome(prevNutrient) ? [ JournalApi.deleteUserNutrient(prevNutrient.nutrientId) ] : []),
            ]);

            return nutrient;
        }
        catch (error) {
            return rejectWithValue(error as Error);
        }
    },
);

export const deleteNutrient = createAsyncThunk<void, number, { rejectValue: Error }>(
    "user/delete_nutrient",
    async (nutrientId, { rejectWithValue }) => {
        try {
            await JournalApi.deleteUserNutrient(nutrientId);
        }
        catch (error) {
            return rejectWithValue(error as Error);
        }
    },
);

export const login = createAsyncThunk<void, { username: string, password: string }, { rejectValue: HttpStatus }>(
    "user/login",
    async ({ username, password }, { rejectWithValue }) => {

        const { status, body } = await AuthApi.login(username, password);

        if (!isSuccess(status, body)) {
            return rejectWithValue(status);
        }
    },
);
