/* eslint-disable max-len */
import { createAction, createAsyncThunk } from "@reduxjs/toolkit";

import { HttpError } from "@common/http";
import type { NutrientName } from "@common/nutrients";
import type { Ingredient, ProductShort, Recipe } from "@common/typings";
import type * as units from "@common/units";
import FoodApi from "@api/foodApi";
import RecipeApi from "@api/recipeApi";

import { convertFoodToIngredient, convertRecipePageIntoRecipe } from "../helpers/recipe";
import type * as types from "../types/recipe";

import type { AsyncThunkConfig } from ".";


// -----------------------------------------------------------------------------
// Recipe
// -----------------------------------------------------------------------------

export const setEditMode = createAction<boolean>("recipe/set_edit_mode");
export const updateServingSizeAmount = createAction<string>("recipe/update_serving_size_amount");
export const updateServingSizeUnit = createAction<units.WeightUnit | units.VolumeUnit>("recipe/update_serving_size_unit");
export const updateType = createAction<string>("recipe/update_type");
export const updateNutrient = createAction<{ key: NutrientName, value: string }>("recipe/update_nutrient");
export const fetchRecipeNew = createAction("recipe/fetch_recipe_new");
export const addCustomUnit = createAction<units.CustomUnitInput>("recipe/add_custom_unit");
export const removeCustomUnit = createAction<number>("recipe/remove_custom_unit");
export const updateCustomUnit = createAction<{ index: number, customUnit: units.CustomUnitInput }>("recipe/update_custom_unit");
export const updateName = createAction<string>("recipe/update_name");
export const updateBrand = createAction<string>("recipe/update_brand");
export const updateDescription = createAction<string>("recipe/update_description");

export const fetchRecipe = createAsyncThunk<Recipe, number, AsyncThunkConfig>(
    "recipe/fetch_recipe",
    async (recipeId, { rejectWithValue }) => {
        try {
            const recipe = await RecipeApi.getRecipe(recipeId);
            return recipe;
        }
        catch (error) {
            return rejectWithValue(HttpError.getStatus(error));
        }
    },
);
export const createRecipe = createAsyncThunk<Recipe, void, AsyncThunkConfig>(
    "recipe/create_recipe",
    async (_arg, { getState, rejectWithValue }) => {
        try {
            const recipePage = getState().recipe;
            const recipe = convertRecipePageIntoRecipe(recipePage);
            const createdRecipe = await RecipeApi.createRecipe(recipe);
            return createdRecipe;
        }
        catch (error) {
            return rejectWithValue(HttpError.getStatus(error));
        }
    },
);
export const updateRecipe = createAsyncThunk<Recipe, void, AsyncThunkConfig>(
    "recipe/update_recipe",
    async (_arg, { getState, rejectWithValue }) => {
        try {
            const recipePage = getState().recipe;
            const recipe = convertRecipePageIntoRecipe(recipePage);
            const updatedRecipe = await RecipeApi.updateRecipe(recipe);
            return updatedRecipe;
        }
        catch (error) {
            return rejectWithValue(HttpError.getStatus(error));
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
export const createDirectionPartIngredient = createAction<{ directionIndex: number, ingredientNumber: number }>("recipe/create_direction_part_ingredient");
export const createDirectionPartComment = createAction<{ directionIndex: number, type: types.DirectionPartType }>("recipe/create_direction_part_comment");

// -----------------------------------------------------------------------------
// Ingredients
// -----------------------------------------------------------------------------

export const removeIngredient = createAction<number>("recipe/ingredient/remove");
export const removeIngredientAlternative = createAction<number>("recipe/ingredient/remove_alternative");
export const replaceIngredientWithAlternative = createAction<{ slotNumber: number, id: number }>("recipe/ingredient/replace_with_alt");
export const toggleIngredientOpen = createAction<number>("recipe/ingredient/toggle_open");
export const toggleIngredientMark = createAction<number>("recipe/ingredient/toggle_mark");
export const updateIngredientProductAmount = createAction<{ id: number, inputValue: string }>("recipe/ingredient/update_product_amount");
export const updateIngredientProductUnit = createAction<{ id: number, unit: (units.WeightUnit | units.VolumeUnit) }>("recipe/ingredient/update_product_unit");
export const updateAltNutrients = createAction<{ slotNumber: number, nutrients: Dictionary<NutrientName, number> }>("recipe/ingredient/update_alt_nutrients");
export const calculateNutrientsAndServingSize = createAction("recipe/ingredient/calculate_nutrients_and_serving_size");

export const addIngredient = createAsyncThunk<Ingredient, { product: ProductShort, slotNumber: number, isAlternative: boolean }, AsyncThunkConfig>(
    "recipe/ingredient/add",
    async ({ product, slotNumber, isAlternative }, { rejectWithValue }) => {
        try {
            if (product.is_recipe) {
                const recipe = await RecipeApi.getRecipe(product.id);
                return convertFoodToIngredient(recipe, slotNumber, isAlternative, true);
            }
            else {
                const food = await FoodApi.getFood(product.id);
                return convertFoodToIngredient(food, slotNumber, isAlternative, false);
            }
        }
        catch (error) {
            return rejectWithValue(HttpError.getStatus(error));
        }
    },
);
