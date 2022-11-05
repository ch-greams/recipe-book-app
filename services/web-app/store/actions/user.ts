import { createAction, createAsyncThunk } from "@reduxjs/toolkit";

import type { FoodShort, RecipeShort } from "@common/typings";
import type { UserMenuItem } from "@common/utils";
import { ProductType } from "@common/utils";
import ProductApi from "@api/productApi";


export const changeMenuItem = createAction<UserMenuItem>("user/change_menu_item");



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

export const fetchFoods = createAsyncThunk<
    { favoriteFoods: FoodShort[], customFoods: FoodShort[] },
    void,
    { rejectValue: Error }
>(
    "user/fetch_foods",
    async (_arg, { rejectWithValue }) => {
        try {
            const [ favoriteFoods, customFoods ] = await Promise.all([
                ProductApi.getFavoriteProducts<FoodShort>(ProductType.Food),
                ProductApi.getCustomProducts<FoodShort>(ProductType.Food),
            ]);
            return { favoriteFoods, customFoods };
        }
        catch (error) {
            return rejectWithValue(error as Error);
        }
    },
);
