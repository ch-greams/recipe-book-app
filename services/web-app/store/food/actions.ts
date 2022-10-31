import { createAction, createAsyncThunk } from "@reduxjs/toolkit";

import type { NutritionFactType } from "@common/nutritionFacts";
import type { Food } from "@common/typings";
import type { CustomUnitInput, Unit, VolumeUnit, WeightUnit } from "@common/units";
import Utils from "@common/utils";
import FoodApi from "@api/foodApi";

import type { RootState } from "..";


export const setEditMode = createAction<boolean>("food/set_edit_mode");
export const updateName = createAction<string>("food/update_name");
export const updateBrand = createAction<string>("food/update_brand");
export const updateSubtitle = createAction<string>("food/update_subtitle");
export const updateDescription = createAction<string>("food/update_description");
export const updateType = createAction<string>("food/update_type");
export const updateDensityAmount = createAction<string>("food/update_density_amount");
export const updateDensityVolumeUnit = createAction<VolumeUnit>("food/update_density_volume_unit");
export const updateDensityWeightUnit = createAction<WeightUnit>("food/update_density_weight_unit");
export const updateServingSizeAmount = createAction<string>("food/update_serving_size_amount");
export const updateServingSizeUnit = createAction<Unit | string>("food/update_serving_size_unit");
export const addCustomUnit = createAction<CustomUnitInput>("food/add_custom_unit");
export const updateCustomUnit = createAction<{ index: number, customUnit: CustomUnitInput }>("food/update_custom_unit");
export const removeCustomUnit = createAction<number>("food/remove_custom_unit");
export const updateNutritionFact = createAction<{ key: NutritionFactType, value: string }>("food/update_nutrient");
export const fetchFoodNew = createAction("food/fetch_food_new");

export const fetchFood = createAsyncThunk<Food, number, { rejectValue: Error }>(
    "food/fetch_food",
    async (foodId, { rejectWithValue }) => {
        try {
            const food = await FoodApi.getFood(foodId);
            return food;
        }
        catch (error) {
            return rejectWithValue(error as Error);
        }
    },
);
export const createFood = createAsyncThunk<Food, void, { state: RootState, rejectValue: Error }>(
    "food/create_food",
    async (_params, { getState, rejectWithValue }) => {
        try {
            const foodPage = getState().food;
            const food = Utils.convertFoodPageIntoFood(foodPage);
            const createdFood = await FoodApi.createFood(food);
            return createdFood;
        }
        catch (error) {
            return rejectWithValue(error as Error);
        }
    },
);
export const updateFood = createAsyncThunk<Food, void, { state: RootState, rejectValue: Error }>(
    "food/update_food",
    async (_params, { getState, rejectWithValue }) => {
        try {
            const foodPage = getState().food;
            const food = Utils.convertFoodPageIntoFood(foodPage);
            const updatedFood = await FoodApi.updateFood(food);
            return updatedFood;
        }
        catch (error) {
            return rejectWithValue(error as Error);
        }
    },
);
