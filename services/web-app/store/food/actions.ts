import type { NutritionFactType } from "@common/nutritionFacts";
import type { Food } from "@common/typings";
import type { CustomUnitInput, VolumeUnit, WeightUnit } from "@common/units";

import * as types from "./types";



export function setEditMode(name: boolean): types.SetEditModeAction {
    return {
        type: types.FOOD_SET_EDIT_MODE,
        payload: name,
    };
}

export function updateName(name: string): types.UpdateNameAction {
    return {
        type: types.FOOD_UPDATE_NAME,
        payload: name,
    };
}

export function updateBrand(brand: string): types.UpdateBrandAction {
    return {
        type: types.FOOD_UPDATE_BRAND,
        payload: brand,
    };
}

export function updateSubtitle(subtitle: string): types.UpdateSubtitleAction {
    return {
        type: types.FOOD_UPDATE_SUBTITLE,
        payload: subtitle,
    };
}

export function updateDescription(description: string): types.UpdateDescriptionAction {
    return {
        type: types.FOOD_UPDATE_DESCRIPTION,
        payload: description,
    };
}

export function updateType(type: string): types.UpdateTypeAction {
    return {
        type: types.FOOD_UPDATE_TYPE,
        payload: type,
    };
}

export function updateNutritionFact(key: NutritionFactType, value: string): types.UpdateNutritionFactAction {
    return {
        type: types.FOOD_UPDATE_NUTRITION_FACT,
        payload: { [key]: value },
    };
}

export function fetchFoodNew(): types.FoodFetchNewAction {
    return {
        type: types.FOOD_FETCH_NEW,
    };
}

export function fetchFoodRequest(foodId: number): types.FoodFetchRequestAction {
    return {
        type: types.FOOD_FETCH_REQUEST,
        payload: foodId,
    };
}

export function fetchFoodSuccess(food: Food): types.FoodFetchSuccessAction {
    return {
        type: types.FOOD_FETCH_SUCCESS,
        payload: food,
    };
}

export function fetchFoodError(error: string): types.FoodFetchErrorAction {
    return {
        type: types.FOOD_FETCH_ERROR,
        payload: error,
    };
}

export function updateDensityAmount(densityAmountInput: string): types.UpdateDensityAmountAction {
    return {
        type: types.FOOD_UPDATE_DENSITY_AMOUNT,
        payload: densityAmountInput,
    };
}

export function updateDensityVolumeUnit(densityVolumeUnit: VolumeUnit): types.UpdateDensityVolumeUnitAction {
    return {
        type: types.FOOD_UPDATE_DENSITY_VOLUME_UNIT,
        payload: densityVolumeUnit,
    };
}

export function updateDensityWeightUnit(densityWeightUnit: WeightUnit): types.UpdateDensityWeightUnitAction {
    return {
        type: types.FOOD_UPDATE_DENSITY_WEIGHT_UNIT,
        payload: densityWeightUnit,
    };
}

export function updateServingSizeAmount(servingSizeAmountInput: string): types.UpdateServingSizeAmountAction {
    return {
        type: types.FOOD_UPDATE_SERVING_SIZE_AMOUNT,
        payload: servingSizeAmountInput,
    };
}

export function updateServingSizeUnit(servingSizeUnit: WeightUnit | VolumeUnit | string): types.UpdateServingSizeUnitAction {
    return {
        type: types.FOOD_UPDATE_SERVING_SIZE_UNIT,
        payload: servingSizeUnit,
    };
}

export function addCustomUnit(customUnit: CustomUnitInput): types.AddCustomUnitAction {
    return {
        type: types.FOOD_ADD_CUSTOM_UNIT,
        payload: customUnit,
    };
}

export function removeCustomUnit(index: number): types.RemoveCustomUnitAction {
    return {
        type: types.FOOD_REMOVE_CUSTOM_UNIT,
        payload: index,
    };
}

export function updateCustomUnit(index: number, customUnit: CustomUnitInput): types.UpdateCustomUnitAction {
    return {
        type: types.FOOD_UPDATE_CUSTOM_UNIT,
        payload: { index, customUnit },
    };
}

export function createFoodRequest(): types.FoodCreateRequestAction {
    return {
        type: types.FOOD_CREATE_REQUEST,
    };
}

export function createFoodSuccess(food: Food): types.FoodCreateSuccessAction {
    return {
        type: types.FOOD_CREATE_SUCCESS,
        payload: food,
    };
}

export function createFoodError(error: string): types.FoodCreateErrorAction {
    return {
        type: types.FOOD_CREATE_ERROR,
        payload: error,
    };
}

export function updateFoodRequest(): types.FoodUpdateRequestAction {
    return {
        type: types.FOOD_UPDATE_REQUEST,
    };
}

export function updateFoodSuccess(food: Food): types.FoodUpdateSuccessAction {
    return {
        type: types.FOOD_UPDATE_SUCCESS,
        payload: food,
    };
}

export function updateFoodError(error: string): types.FoodUpdateErrorAction {
    return {
        type: types.FOOD_UPDATE_ERROR,
        payload: error,
    };
}
