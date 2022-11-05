/* eslint-disable max-len */
import { createAction, createAsyncThunk } from "@reduxjs/toolkit";

import type { IngredientProduct, ProductShort, Recipe } from "@common/typings";
import type * as units from "@common/units";
import Utils, { ProductType } from "@common/utils";
import FoodApi from "@api/foodApi";
import RecipeApi from "@api/recipeApi";

import type { RootState } from "..";
import type * as types from "../types/recipe";


// -----------------------------------------------------------------------------
// Recipe
// -----------------------------------------------------------------------------

export const setEditMode = createAction<boolean>("recipe/set_edit_mode");
export const updateServingSizeAmount = createAction<string>("recipe/update_serving_size_amount");
export const updateServingSizeUnit = createAction<units.WeightUnit | units.VolumeUnit>("recipe/update_serving_size_unit");
export const updateType = createAction<string>("recipe/update_type");
export const fetchRecipeNew = createAction("recipe/fetch_recipe_new");
export const addCustomUnit = createAction<units.CustomUnitInput>("recipe/add_custom_unit");
export const removeCustomUnit = createAction<number>("recipe/remove_custom_unit");
export const updateCustomUnit = createAction<{ index: number, customUnit: units.CustomUnitInput }>("recipe/update_custom_unit");
export const updateName = createAction<string>("recipe/update_name");
export const updateBrand = createAction<string>("recipe/update_brand");
export const updateSubtitle = createAction<string>("recipe/update_subtitle");
export const updateDescription = createAction<string>("recipe/update_description");

export const fetchRecipe = createAsyncThunk<Recipe, number, { rejectValue: Error }>(
    "recipe/fetch_recipe",
    async (recipeId, { rejectWithValue }) => {
        try {
            const recipe = await RecipeApi.getRecipe(recipeId);
            return recipe;
        }
        catch (error) {
            return rejectWithValue(error as Error);
        }
    },
);
export const createRecipe = createAsyncThunk<Recipe, void, { state: RootState, rejectValue: Error }>(
    "recipe/create_recipe",
    async (_arg, { getState, rejectWithValue }) => {
        try {
            const recipePage = getState().recipe;
            const recipe = Utils.convertRecipePageIntoRecipe(recipePage);
            const createdRecipe = await RecipeApi.createRecipe(recipe);
            return createdRecipe;
        }
        catch (error) {
            return rejectWithValue(error as Error);
        }
    },
);
export const updateRecipe = createAsyncThunk<Recipe, void, { state: RootState, rejectValue: Error }>(
    "recipe/update_recipe",
    async (_arg, { getState, rejectWithValue }) => {
        try {
            const recipePage = getState().recipe;
            const recipe = Utils.convertRecipePageIntoRecipe(recipePage);
            const updatedRecipe = await RecipeApi.updateRecipe(recipe);
            return updatedRecipe;
        }
        catch (error) {
            return rejectWithValue(error as Error);
        }
    },
);

// -----------------------------------------------------------------------------
// Directions
// -----------------------------------------------------------------------------

export const removeDirection = createAction<number>("recipe/remove_direction");
export const toggleDirectionOpen = createAction<number>("recipe/toggle_direction_open");
export const toggleDirectionMark = createAction<number>("recipe/toggle_direction_mark");
export const updateDirectionStepNumber = createAction<{ directionIndex: number, stepNumber: number }>("recipe/update_direction_step_number");
export const updateDirectionName = createAction<{ directionIndex: number, name: string }>("recipe/update_direction_name");

export const updateDirectionTemperatureCount = createAction<{ directionIndex: number, inputValue: string }>("recipe/update_direction_temperature_count");
export const updateDirectionTemperatureUnit = createAction<{ directionIndex: number, unit: units.TemperatureUnit }>("recipe/update_direction_temperature_unit");
export const updateDirectionTimeCount = createAction<{ directionIndex: number, inputValue: string }>("recipe/update_direction_time_count");
export const updateDirectionTimeUnit = createAction<{ directionIndex: number, unit: units.TimeUnit }>("recipe/update_direction_time_unit");
export const updateNewDirectionStepNumber = createAction<number>("recipe/update_new_direction_step_number");
export const updateNewDirectionName = createAction<string>("recipe/update_new_direction_name");
export const updateNewDirectionTemperatureCount = createAction<string>("recipe/update_new_direction_temperature_count");
export const updateNewDirectionTemperatureUnit = createAction<units.TemperatureUnit>("recipe/update_new_direction_temperature_unit");
export const updateNewDirectionTimeCount = createAction<string>("recipe/update_new_direction_time_count");
export const updateNewDirectionTimeUnit = createAction<units.TimeUnit>("recipe/update_new_direction_time_unit");
export const createDirection = createAction<types.RecipeDirection>("recipe/create_direction");
export const removeDirectionPart = createAction<{ directionIndex: number, directionPartId: number }>("recipe/remove_direction_part");
export const toggleDirectionPartMark = createAction<{ directionIndex: number, directionPartId: number }>("recipe/toggle_direction_part_mark");
export const updateDirectionPartStepNumber = createAction<{ directionIndex: number, directionPartId: number, stepNumber: number }>("recipe/update_direction_part_step_number");
export const updateDirectionPartNote = createAction<{ directionIndex: number, directionPartId: number, note: string }>("recipe/update_direction_part_note");
export const updateDirectionPartIngredientAmount = createAction<{ directionIndex: number, directionPartId: number, inputValue: string }>("recipe/update_direction_part_ingredient_amount");
export const updateDirectionPartIngredientUnit = createAction<{ directionIndex: number, directionPartId: number, unit: (units.WeightUnit | units.VolumeUnit) }>("recipe/update_direction_part_ingredient_unit");
export const createDirectionPartIngredient = createAction<{ directionIndex: number, ingredientId: number }>("recipe/create_direction_part_ingredient");
export const createDirectionPartComment = createAction<{ directionIndex: number, type: types.DirectionPartType }>("recipe/create_direction_part_comment");

// -----------------------------------------------------------------------------
// Ingredients
// -----------------------------------------------------------------------------

export const removeIngredient = createAction<number>("recipe/ingredient/remove");
export const removeIngredientProduct = createAction<{ parentId: number, id: number }>("recipe/ingredient/remove_product");
export const replaceIngredientWithAlternative = createAction<{ parentId: number, id: number }>("recipe/ingredient/replace_with_alt");
export const toggleIngredientOpen = createAction<number>("recipe/ingredient/toggle_open");
export const toggleIngredientMark = createAction<number>("recipe/ingredient/toggle_mark");
export const updateIngredientProductAmount = createAction<{ parentId: number, id: number, inputValue: string }>("recipe/ingredient/update_product_amount");
export const updateIngredientProductUnit = createAction<{ parentId: number, id: number, unit: (units.WeightUnit | units.VolumeUnit) }>("recipe/ingredient/update_product_unit");
export const updateAltNutrients = createAction<{ parentId: number, id: number, isSelected: boolean }>("recipe/ingredient/update_alt_nutrients");

export const addIngredient = createAsyncThunk<IngredientProduct, ProductShort, { rejectValue: Error }>(
    "recipe/ingredient/add",
    async (product, { rejectWithValue }) => {
        try {
            if (product.product_type === ProductType.Food) {
                const food = await FoodApi.getFood(product.id);
                return Utils.convertFoodToIngredientProduct(food);
            }
            else {
                const recipe = await RecipeApi.getRecipe(product.id);
                return Utils.convertRecipeToIngredientProduct(recipe);
            }
        }
        catch (error) {
            return rejectWithValue(error as Error);
        }
    },
);
export const addIngredientProduct = createAsyncThunk<{ id: number, product: IngredientProduct }, { id: number, product: ProductShort }, { rejectValue: Error }>(
    "recipe/ingredient/add_product",
    async ({ id, product }, { rejectWithValue }) => {
        try {
            if (product.product_type === ProductType.Food) {
                const food = await FoodApi.getFood(product.id);
                return { id, product: Utils.convertFoodToIngredientProduct(food) };
            }
            else {
                const recipe = await RecipeApi.getRecipe(product.id);
                return { id, product: Utils.convertRecipeToIngredientProduct(recipe) };
            }
        }
        catch (error) {
            return rejectWithValue(error as Error);
        }
    },
);
