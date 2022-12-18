import { createAction, createAsyncThunk } from "@reduxjs/toolkit";

import { HttpError } from "@common/http";
import { isSome } from "@common/types";
import type { FoodShort, RecipeShort, UserNutrient, UserNutrientDetailed } from "@common/typings";
import type { UserMenuItem } from "@common/utils";
import { ProductType } from "@common/utils";
import AuthApi from "@api/authApi";
import JournalApi from "@api/journalApi";
import ProductApi from "@api/productApi";

import type { AsyncThunkConfig } from ".";


export const changeMenuItem = createAction<UserMenuItem>("user/change_menu_item");

interface UserFetchDataPayload {
    favoriteFoods: FoodShort[];
    customFoods: FoodShort[];
    favoriteRecipes: RecipeShort[];
    customRecipes: RecipeShort[];
    nutrients: UserNutrientDetailed[];
}

export const fetchUserData = createAsyncThunk<UserFetchDataPayload, void, AsyncThunkConfig>(
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
            return rejectWithValue(HttpError.getStatus(error));
        }
    },
);

export const deleteCustomProduct = createAsyncThunk<void, number, AsyncThunkConfig>(
    "user/delete_custom_product",
    async (productId, { rejectWithValue }) => {
        try {
            await ProductApi.deleteProduct(productId);
        }
        catch (error) {
            return rejectWithValue(HttpError.getStatus(error));
        }
    },
);

export const deleteFavoriteProduct = createAsyncThunk<void, number, AsyncThunkConfig>(
    "user/delete_favorite_product",
    async (productId, { rejectWithValue }) => {
        try {
            await ProductApi.deleteFavoriteProduct(productId);
        }
        catch (error) {
            return rejectWithValue(HttpError.getStatus(error));
        }
    },
);

export const upsertNutrient = createAsyncThunk<UserNutrientDetailed, UserNutrient, AsyncThunkConfig>(
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
            return rejectWithValue(HttpError.getStatus(error));
        }
    },
);

export const deleteNutrient = createAsyncThunk<void, number, AsyncThunkConfig>(
    "user/delete_nutrient",
    async (nutrientId, { rejectWithValue }) => {
        try {
            await JournalApi.deleteUserNutrient(nutrientId);
        }
        catch (error) {
            return rejectWithValue(HttpError.getStatus(error));
        }
    },
);

interface UserLoginPayload {
    username: string;
    password: string;
}

export const login = createAsyncThunk<void, UserLoginPayload, AsyncThunkConfig>(
    "user/login",
    async ({ username, password }, { rejectWithValue }) => {
        try {
            await AuthApi.login(username, password);
        }
        catch (error) {
            return rejectWithValue(HttpError.getStatus(error));
        }
    },
);

interface UserSignupPayload {
    username: string;
    firstName: string;
    lastName: string;
    password: string;
}

export const signup = createAsyncThunk<void, UserSignupPayload, AsyncThunkConfig>(
    "user/signup",
    async ({ username, firstName, lastName, password }, { rejectWithValue }) => {
        try {
            await AuthApi.signup(username, firstName, lastName, password);
        }
        catch (error) {
            return rejectWithValue(HttpError.getStatus(error));
        }
    },
);
