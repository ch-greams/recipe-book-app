import { NutritionFactType } from "@common/nutritionFacts";
import type { Dictionary, Food } from "@common/typings";
import { CustomUnit, CustomUnitInput, VolumeUnit, WeightUnit } from "@common/units";



export interface FoodPageStore {

    isLoaded: boolean;
    errorMessage: string;

    id: string;
    name: string;
    brand: string;
    subtitle: string;
    nutritionFacts: Dictionary<NutritionFactType, number>;
    customUnits: CustomUnit[];

    // NOTE: INPUTS

    nutritionFactsByServing: Dictionary<NutritionFactType, number>;
    nutritionFactsByServingInputs: Dictionary<NutritionFactType, string>;
    customUnitInputs: CustomUnitInput[];

    // NOTE: STATIC

    type: string;
    density: number;
    densityVolume: VolumeUnit;
    densityWeight: WeightUnit;
    servingSize: number;
    servingSizeInput: string;
    unit: WeightUnit | VolumeUnit;
    featuredNutritionFacts: NutritionFactType[];
}


export const FOOD_ITEM_UPDATE_NAME = "FOOD_ITEM_UPDATE_NAME";
export const FOOD_ITEM_UPDATE_BRAND = "FOOD_ITEM_UPDATE_BRAND";
export const FOOD_ITEM_UPDATE_SUBTITLE = "FOOD_ITEM_UPDATE_SUBTITLE";
export const FOOD_ITEM_UPDATE_NUTRITION_FACT = "FOOD_ITEM_UPDATE_NUTRITION_FACT";
export const FOOD_ITEM_UPDATE_CUSTOM_UNITS = "FOOD_ITEM_UPDATE_CUSTOM_UNITS";
export const FOOD_ITEM_ADD_CUSTOM_UNIT = "FOOD_ITEM_ADD_CUSTOM_UNIT";
export const FOOD_ITEM_REMOVE_CUSTOM_UNIT = "FOOD_ITEM_REMOVE_CUSTOM_UNIT";
export const FOOD_ITEM_UPDATE_CUSTOM_UNIT = "FOOD_ITEM_UPDATE_CUSTOM_UNIT";
export const FOOD_ITEM_UPDATE_SERVING_SIZE = "FOOD_ITEM_UPDATE_SERVING_SIZE";


export const FOOD_ITEM_FETCH_REQUEST = "FOOD_ITEM_FETCH_REQUEST";
export const FOOD_ITEM_FETCH_SUCCESS = "FOOD_ITEM_FETCH_SUCCESS";
export const FOOD_ITEM_FETCH_ERROR = "FOOD_ITEM_FETCH_ERROR";


export interface UpdateNameAction {
    type: typeof FOOD_ITEM_UPDATE_NAME;
    payload: string;
}

export interface UpdateBrandAction {
    type: typeof FOOD_ITEM_UPDATE_BRAND;
    payload: string;
}

export interface UpdateSubtitleAction {
    type: typeof FOOD_ITEM_UPDATE_SUBTITLE;
    payload: string;
}

export interface UpdateNutritionFactAction {
    type: typeof FOOD_ITEM_UPDATE_NUTRITION_FACT;
    payload: Dictionary<NutritionFactType, string>;
}

export interface UpdateCustomUnitsAction {
    type: typeof FOOD_ITEM_UPDATE_CUSTOM_UNITS;
    payload: CustomUnitInput[];
}

export interface AddCustomUnitAction {
    type: typeof FOOD_ITEM_ADD_CUSTOM_UNIT;
    payload: CustomUnitInput;
}

export interface RemoveCustomUnitAction {
    type: typeof FOOD_ITEM_REMOVE_CUSTOM_UNIT;
    payload: number;
}

export interface UpdateCustomUnitAction {
    type: typeof FOOD_ITEM_UPDATE_CUSTOM_UNIT;
    payload: {
        index: number;
        customUnit: CustomUnitInput;
    };
}

export interface UpdateServingSizeAction {
    type: typeof FOOD_ITEM_UPDATE_SERVING_SIZE;
    payload: string;
}

export interface FoodItemFetchRequestAction {
    type: typeof FOOD_ITEM_FETCH_REQUEST;
    payload: string;
}

interface FoodItemFetchSuccessAction {
    type: typeof FOOD_ITEM_FETCH_SUCCESS;
    payload: Food;
}

interface FoodItemFetchErrorAction {
    type: typeof FOOD_ITEM_FETCH_ERROR;
    payload: string;
}

export type FoodItemActionTypes = (
    UpdateNameAction | UpdateBrandAction | UpdateSubtitleAction |
    UpdateNutritionFactAction | UpdateCustomUnitsAction | UpdateServingSizeAction |
    FoodItemFetchRequestAction | FoodItemFetchErrorAction | FoodItemFetchSuccessAction
);
