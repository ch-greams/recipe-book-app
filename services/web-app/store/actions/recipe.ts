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
// Instructions
// -----------------------------------------------------------------------------

export const removeInstruction = createAction<number>("recipe/remove_instruction");
export const toggleInstructionOpen = createAction<number>("recipe/toggle_instruction_open");
export const toggleInstructionMark = createAction<number>("recipe/toggle_instruction_mark");
export const updateInstructionStepNumber = createAction<{ instructionIndex: number, stepNumber: number }>("recipe/update_instruction_step_number");
export const updateInstructionDescription = createAction<{ instructionIndex: number, name: string }>("recipe/update_instruction_description");
export const updateInstructionTemperatureCount = createAction<{ instructionIndex: number, inputValue: string }>("recipe/update_instruction_temperature_count");
export const updateInstructionTemperatureUnit = createAction<{ instructionIndex: number, unit: units.TemperatureUnit }>("recipe/update_instruction_temperature_unit");
export const updateInstructionTimeCount = createAction<{ instructionIndex: number, inputValue: string }>("recipe/update_instruction_time_count");
export const updateInstructionTimeUnit = createAction<{ instructionIndex: number, unit: units.TimeUnit }>("recipe/update_instruction_time_unit");
export const createInstruction = createAction<types.RecipeInstruction>("recipe/create_instruction");
export const removeInstructionIngredient = createAction<{ instructionIndex: number, ingredientSlotNumber: number }>("recipe/remove_instruction_ingredient");
export const updateInstructionIngredientAmount = createAction<{ instructionIndex: number, ingredientSlotNumber: number, inputValue: string }>("recipe/update_instruction_ingredient_percentage");
export const updateInstructionIngredientUnit = createAction<{ instructionIndex: number, ingredientSlotNumber: number, unit: (units.WeightUnit | units.VolumeUnit) }>("recipe/update_instruction_ingredient_unit");
export const createInstructionIngredient = createAction<{ instructionIndex: number, ingredientSlotNumber: number }>("recipe/create_instruction_ingredient");

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
