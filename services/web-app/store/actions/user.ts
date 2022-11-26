import { createAction, createAsyncThunk } from "@reduxjs/toolkit";

import type { FoodShort, RecipeShort, UserNutrient } from "@common/typings";
import type { UserMenuItem } from "@common/utils";
import { ProductType } from "@common/utils";
import JournalApi from "@api/journalApi";
import ProductApi from "@api/productApi";


export const changeMenuItem = createAction<UserMenuItem>("user/change_menu_item");



export const fetchUserData = createAsyncThunk<
    {
        favoriteFoods: FoodShort[];
        customFoods: FoodShort[];
        favoriteRecipes: RecipeShort[];
        customRecipes: RecipeShort[];
        nutrients: UserNutrient[];
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
