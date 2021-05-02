import { NutritionFactType } from "@common/nutritionFacts";
import { CustomUnit, CustomUnitInput } from "@common/units";

import { Food } from "../../../common/typings";

import * as types from "./types";



export function updateName(name: string): types.UpdateNameAction {
    return {
        type: types.FOOD_ITEM_UPDATE_NAME,
        payload: name,
    };
}

export function updateBrand(brand: string): types.UpdateBrandAction {
    return {
        type: types.FOOD_ITEM_UPDATE_BRAND,
        payload: brand,
    };
}

export function updateSubtitle(subtitle: string): types.UpdateSubtitleAction {
    return {
        type: types.FOOD_ITEM_UPDATE_SUBTITLE,
        payload: subtitle,
    };
}

export function updateNutritionFact(key: NutritionFactType, value: string): types.UpdateNutritionFactAction {
    return {
        type: types.FOOD_ITEM_UPDATE_NUTRITION_FACT,
        payload: { [key]: value },
    };
}

export function fetchFoodItemRequest(foodId: string): types.FoodItemFetchRequestAction {
    return {
        type: types.FOOD_ITEM_FETCH_REQUEST,
        payload: foodId,
    };
}

export function fetchFoodItemSuccess(food: Food): types.FoodItemFetchSuccessAction {
    return {
        type: types.FOOD_ITEM_FETCH_SUCCESS,
        payload: food,
    };
}

export function fetchFoodItemError(error: string): types.FoodItemFetchErrorAction {
    return {
        type: types.FOOD_ITEM_FETCH_ERROR,
        payload: error,
    };
}

export function updateServingSize(servingSizeInput: string): types.UpdateServingSizeAction {
    return {
        type: types.FOOD_ITEM_UPDATE_SERVING_SIZE,
        payload: servingSizeInput,
    };
}

export function updateCustomUnits(customUnits: CustomUnitInput[]): types.UpdateCustomUnitsAction {
    return {
        type: types.FOOD_ITEM_UPDATE_CUSTOM_UNITS,
        payload: customUnits,
    };
}

export function addCustomUnitRequest(customUnit: CustomUnitInput): types.AddCustomUnitRequestAction {
    return {
        type: types.FOOD_ITEM_ADD_CUSTOM_UNIT_REQUEST,
        payload: customUnit,
    };
}

export function addCustomUnitSuccess(customUnits: CustomUnit[]): types.AddCustomUnitSuccessAction {
    return {
        type: types.FOOD_ITEM_ADD_CUSTOM_UNIT_SUCCESS,
        payload: customUnits,
    };
}

export function addCustomUnitError(error: string): types.AddCustomUnitErrorAction {
    return {
        type: types.FOOD_ITEM_ADD_CUSTOM_UNIT_ERROR,
        payload: error,
    };
}

export function removeCustomUnitRequest(index: number): types.RemoveCustomUnitRequestAction {
    return {
        type: types.FOOD_ITEM_REMOVE_CUSTOM_UNIT_REQUEST,
        payload: index,
    };
}

export function removeCustomUnitSuccess(customUnits: CustomUnit[]): types.RemoveCustomUnitSuccessAction {
    return {
        type: types.FOOD_ITEM_REMOVE_CUSTOM_UNIT_SUCCESS,
        payload: customUnits,
    };
}

export function removeCustomUnitError(error: string): types.RemoveCustomUnitErrorAction {
    return {
        type: types.FOOD_ITEM_REMOVE_CUSTOM_UNIT_ERROR,
        payload: error,
    };
}

export function updateCustomUnitRequest(index: number, customUnit: CustomUnitInput): types.UpdateCustomUnitRequestAction {
    return {
        type: types.FOOD_ITEM_UPDATE_CUSTOM_UNIT_REQUEST,
        payload: { index, customUnit },
    };
}

export function updateCustomUnitSuccess(customUnits: CustomUnit[]): types.UpdateCustomUnitSuccessAction {
    return {
        type: types.FOOD_ITEM_UPDATE_CUSTOM_UNIT_SUCCESS,
        payload: customUnits,
    };
}

export function updateCustomUnitError(error: string): types.UpdateCustomUnitErrorAction {
    return {
        type: types.FOOD_ITEM_UPDATE_CUSTOM_UNIT_ERROR,
        payload: error,
    };
}
