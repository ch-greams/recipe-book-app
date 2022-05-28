import type { NutritionFactType } from "@common/nutritionFacts";
import type { Food } from "@common/typings";
import type { CustomUnitInput, VolumeUnit, WeightUnit } from "@common/units";

import * as types from "./types";



export function setEditMode(name: boolean): types.SetEditModeAction {
    return {
        type: types.FOOD_ITEM_SET_EDIT_MODE,
        payload: name,
    };
}

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

export function updateDescription(description: string): types.UpdateDescriptionAction {
    return {
        type: types.FOOD_ITEM_UPDATE_DESCRIPTION,
        payload: description,
    };
}

export function updateType(type: string): types.UpdateTypeAction {
    return {
        type: types.FOOD_ITEM_UPDATE_TYPE,
        payload: type,
    };
}

export function updateNutritionFact(key: NutritionFactType, value: string): types.UpdateNutritionFactAction {
    return {
        type: types.FOOD_ITEM_UPDATE_NUTRITION_FACT,
        payload: { [key]: value },
    };
}

export function fetchFoodItemNew(): types.FoodItemFetchNewAction {
    return {
        type: types.FOOD_ITEM_FETCH_NEW,
    };
}

export function fetchFoodItemRequest(foodId: number): types.FoodItemFetchRequestAction {
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

export function updateDensityAmount(densityAmountInput: string): types.UpdateDensityAmountAction {
    return {
        type: types.FOOD_ITEM_UPDATE_DENSITY_AMOUNT,
        payload: densityAmountInput,
    };
}

export function updateDensityVolumeUnit(densityVolumeUnit: VolumeUnit): types.UpdateDensityVolumeUnitAction {
    return {
        type: types.FOOD_ITEM_UPDATE_DENSITY_VOLUME_UNIT,
        payload: densityVolumeUnit,
    };
}

export function updateDensityWeightUnit(densityWeightUnit: WeightUnit): types.UpdateDensityWeightUnitAction {
    return {
        type: types.FOOD_ITEM_UPDATE_DENSITY_WEIGHT_UNIT,
        payload: densityWeightUnit,
    };
}

export function updateServingSizeAmount(servingSizeAmountInput: string): types.UpdateServingSizeAmountAction {
    return {
        type: types.FOOD_ITEM_UPDATE_SERVING_SIZE_AMOUNT,
        payload: servingSizeAmountInput,
    };
}

export function updateServingSizeUnit(servingSizeUnit: WeightUnit | VolumeUnit | string): types.UpdateServingSizeUnitAction {
    return {
        type: types.FOOD_ITEM_UPDATE_SERVING_SIZE_UNIT,
        payload: servingSizeUnit,
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

export function createFoodItemRequest(): types.FoodItemCreateRequestAction {
    return {
        type: types.FOOD_ITEM_CREATE_REQUEST,
    };
}

export function createFoodItemSuccess(food: Food): types.FoodItemCreateSuccessAction {
    return {
        type: types.FOOD_ITEM_CREATE_SUCCESS,
        payload: food,
    };
}

export function createFoodItemError(error: string): types.FoodItemCreateErrorAction {
    return {
        type: types.FOOD_ITEM_CREATE_ERROR,
        payload: error,
    };
}

export function updateFoodItemRequest(): types.FoodItemUpdateRequestAction {
    return {
        type: types.FOOD_ITEM_UPDATE_REQUEST,
    };
}

export function updateFoodItemSuccess(food: Food): types.FoodItemUpdateSuccessAction {
    return {
        type: types.FOOD_ITEM_UPDATE_SUCCESS,
        payload: food,
    };
}

export function updateFoodItemError(error: string): types.FoodItemUpdateErrorAction {
    return {
        type: types.FOOD_ITEM_UPDATE_ERROR,
        payload: error,
    };
}
