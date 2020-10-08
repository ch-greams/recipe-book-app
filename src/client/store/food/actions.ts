import { NutritionFactType } from "../../../common/nutritionFacts";
import { CustomUnitInput } from "../../../common/units";
import {
    FOOD_ITEM_UPDATE_NAME,
    FOOD_ITEM_UPDATE_BRAND,
    FOOD_ITEM_UPDATE_SUBTITLE,
    FOOD_ITEM_FETCH_REQUESTED,
    FOOD_ITEM_UPDATE_NUTRITION_FACT,
    FOOD_ITEM_UPDATE_CUSTOM_UNITS,
    UpdateCustomUnitsAction,
    FoodItemFetchRequestedAction,
    UpdateNameAction,
    UpdateBrandAction,
    UpdateSubtitleAction,
    UpdateNutritionFactAction,
} from "./types";



export function updateName(name: string): UpdateNameAction {
    return {
        type: FOOD_ITEM_UPDATE_NAME,
        payload: name,
    };
}

export function updateBrand(brand: string): UpdateBrandAction {
    return {
        type: FOOD_ITEM_UPDATE_BRAND,
        payload: brand,
    };
}

export function updateSubtitle(subtitle: string): UpdateSubtitleAction {
    return {
        type: FOOD_ITEM_UPDATE_SUBTITLE,
        payload: subtitle,
    };
}

export function updateNutritionFact(key: NutritionFactType, value: string): UpdateNutritionFactAction {
    return {
        type: FOOD_ITEM_UPDATE_NUTRITION_FACT,
        payload: { [key]: value },
    };
}

export function updateCustomUnits(customUnits: CustomUnitInput[]): UpdateCustomUnitsAction {
    return {
        type: FOOD_ITEM_UPDATE_CUSTOM_UNITS,
        payload: customUnits,
    };
}

export function requestFoodItem(foodId: string): FoodItemFetchRequestedAction {
    return {
        type: FOOD_ITEM_FETCH_REQUESTED,
        payload: foodId,
    };
}
