import { createAction, createAsyncThunk } from "@reduxjs/toolkit";

import type { FoodShort, RecipeShort } from "@common/typings";
import type { UserMenuItem } from "@common/utils";
import { ProductType } from "@common/utils";
import ProductApi from "@api/productApi";


export const changeMenuItem = createAction<UserMenuItem>("user/change_menu_item");


// TODO: Merge those fetch_recipes and fetch_foods actions into one
export const fetchRecipes = createAsyncThunk<
    { favoriteRecipes: RecipeShort[], customRecipes: RecipeShort[] },
    void,
    { rejectValue: Error }
>(
    "user/fetch_recipes",
    async (_arg, { rejectWithValue }) => {
        try {
            const [ favoriteRecipes, customRecipes ] = await Promise.all([
                ProductApi.getFavoriteProducts<RecipeShort>(ProductType.Recipe),
                ProductApi.getCustomProducts<RecipeShort>(ProductType.Recipe),
            ]);
            return { favoriteRecipes, customRecipes };
        }
        catch (error) {
            return rejectWithValue(error as Error);
        }
    },
);

export const fetchProducts = createAsyncThunk<
    { favoriteFoods: FoodShort[], customFoods: FoodShort[], favoriteRecipes: RecipeShort[], customRecipes: RecipeShort[] },
    void,
    { rejectValue: Error }
>(
    "user/fetch_products",
    async (_arg, { rejectWithValue }) => {
        try {
            const [ favoriteFoods, customFoods, favoriteRecipes, customRecipes ] = await Promise.all([
                ProductApi.getFavoriteProducts<FoodShort>(ProductType.Food),
                ProductApi.getCustomProducts<FoodShort>(ProductType.Food),
                ProductApi.getFavoriteProducts<RecipeShort>(ProductType.Recipe),
                ProductApi.getCustomProducts<RecipeShort>(ProductType.Recipe),
            ]);
            return { favoriteFoods, customFoods, favoriteRecipes, customRecipes };
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
