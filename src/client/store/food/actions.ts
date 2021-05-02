import { NutritionFactType } from "@common/nutritionFacts";
import { CustomUnitInput } from "@common/units";

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

export function updateCustomUnits(customUnits: CustomUnitInput[]): types.UpdateCustomUnitsAction {
    return {
        type: types.FOOD_ITEM_UPDATE_CUSTOM_UNITS,
        payload: customUnits,
    };
}

export function addCustomUnit(customUnit: CustomUnitInput): types.AddCustomUnitAction {
    return {
        type: types.FOOD_ITEM_ADD_CUSTOM_UNIT,
        payload: customUnit,
    };
}

export function removeCustomUnit(index: number): types.RemoveCustomUnitAction {
    return {
        type: types.FOOD_ITEM_REMOVE_CUSTOM_UNIT,
        payload: index,
    };
}

export function updateCustomUnit(index: number, customUnit: CustomUnitInput): types.UpdateCustomUnitAction {
    return {
        type: types.FOOD_ITEM_UPDATE_CUSTOM_UNIT,
        payload: { index, customUnit },
    };
}

export function fetchFoodItemRequest(foodId: string): types.FoodItemFetchRequestAction {
    return {
        type: types.FOOD_ITEM_FETCH_REQUEST,
        payload: foodId,
    };
}

export function updateServingSize(servingSizeInput: string): types.UpdateServingSizeAction {
    return {
        type: types.FOOD_ITEM_UPDATE_SERVING_SIZE,
        payload: servingSizeInput,
    };
}
