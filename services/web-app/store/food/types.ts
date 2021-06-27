import type { NutritionFactType } from "@common/nutritionFacts";
import type { Food } from "@common/typings";
import type { CustomUnit, CustomUnitInput, VolumeUnit, WeightUnit } from "@common/units";



export interface FoodPageStore {

    isLoaded: boolean;
    errorMessage?: Option<string>;

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

    densityMetric: number;
    density: number;
    densityInput: string;
    densityVolumeUnit: VolumeUnit;
    densityWeightUnit: WeightUnit;

    servingSize: number;
    servingSizeInput: string;
    servingSizeUnit: WeightUnit | VolumeUnit | string;
    featuredNutritionFacts: NutritionFactType[];
}


export const FOOD_ITEM_UPDATE_NAME = "FOOD_ITEM_UPDATE_NAME";
export const FOOD_ITEM_UPDATE_BRAND = "FOOD_ITEM_UPDATE_BRAND";
export const FOOD_ITEM_UPDATE_SUBTITLE = "FOOD_ITEM_UPDATE_SUBTITLE";
export const FOOD_ITEM_UPDATE_TYPE = "FOOD_ITEM_UPDATE_TYPE";
export const FOOD_ITEM_UPDATE_NUTRITION_FACT = "FOOD_ITEM_UPDATE_NUTRITION_FACT";
export const FOOD_ITEM_UPDATE_CUSTOM_UNITS = "FOOD_ITEM_UPDATE_CUSTOM_UNITS";

export const FOOD_ITEM_UPDATE_DENSITY_AMOUNT = "FOOD_ITEM_UPDATE_DENSITY_AMOUNT";
export const FOOD_ITEM_UPDATE_DENSITY_VOLUME_UNIT = "FOOD_ITEM_UPDATE_DENSITY_VOLUME_UNIT";
export const FOOD_ITEM_UPDATE_DENSITY_WEIGHT_UNIT = "FOOD_ITEM_UPDATE_DENSITY_WEIGHT_UNIT";

export const FOOD_ITEM_UPDATE_SERVING_SIZE_AMOUNT = "FOOD_ITEM_UPDATE_SERVING_SIZE_AMOUNT";
export const FOOD_ITEM_UPDATE_SERVING_SIZE_UNIT = "FOOD_ITEM_UPDATE_SERVING_SIZE_UNIT";

export const FOOD_ITEM_ADD_CUSTOM_UNIT_REQUEST = "FOOD_ITEM_ADD_CUSTOM_UNIT_REQUEST";
export const FOOD_ITEM_ADD_CUSTOM_UNIT_SUCCESS = "FOOD_ITEM_ADD_CUSTOM_UNIT_SUCCESS";
export const FOOD_ITEM_ADD_CUSTOM_UNIT_ERROR = "FOOD_ITEM_ADD_CUSTOM_UNIT_ERROR";
export const FOOD_ITEM_REMOVE_CUSTOM_UNIT_REQUEST = "FOOD_ITEM_REMOVE_CUSTOM_UNIT_REQUEST";
export const FOOD_ITEM_REMOVE_CUSTOM_UNIT_SUCCESS = "FOOD_ITEM_REMOVE_CUSTOM_UNIT_SUCCESS";
export const FOOD_ITEM_REMOVE_CUSTOM_UNIT_ERROR = "FOOD_ITEM_REMOVE_CUSTOM_UNIT_ERROR";
export const FOOD_ITEM_UPDATE_CUSTOM_UNIT_REQUEST = "FOOD_ITEM_UPDATE_CUSTOM_UNIT_REQUEST";
export const FOOD_ITEM_UPDATE_CUSTOM_UNIT_SUCCESS = "FOOD_ITEM_UPDATE_CUSTOM_UNIT_SUCCESS";
export const FOOD_ITEM_UPDATE_CUSTOM_UNIT_ERROR = "FOOD_ITEM_UPDATE_CUSTOM_UNIT_ERROR";


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

export interface UpdateTypeAction {
    type: typeof FOOD_ITEM_UPDATE_TYPE;
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

export interface AddCustomUnitRequestAction {
    type: typeof FOOD_ITEM_ADD_CUSTOM_UNIT_REQUEST;
    payload: CustomUnitInput;
}

export interface AddCustomUnitSuccessAction {
    type: typeof FOOD_ITEM_ADD_CUSTOM_UNIT_SUCCESS;
    payload: CustomUnit[];
}

export interface AddCustomUnitErrorAction {
    type: typeof FOOD_ITEM_ADD_CUSTOM_UNIT_ERROR;
    payload: string;
}

export interface RemoveCustomUnitRequestAction {
    type: typeof FOOD_ITEM_REMOVE_CUSTOM_UNIT_REQUEST;
    payload: number;
}

export interface RemoveCustomUnitSuccessAction {
    type: typeof FOOD_ITEM_REMOVE_CUSTOM_UNIT_SUCCESS;
    payload: CustomUnit[];
}

export interface RemoveCustomUnitErrorAction {
    type: typeof FOOD_ITEM_REMOVE_CUSTOM_UNIT_ERROR;
    payload: string;
}

export interface UpdateCustomUnitRequestAction {
    type: typeof FOOD_ITEM_UPDATE_CUSTOM_UNIT_REQUEST;
    payload: {
        index: number;
        customUnit: CustomUnitInput;
    };
}

export interface UpdateCustomUnitSuccessAction {
    type: typeof FOOD_ITEM_UPDATE_CUSTOM_UNIT_SUCCESS;
    payload: CustomUnit[];
}

export interface UpdateCustomUnitErrorAction {
    type: typeof FOOD_ITEM_UPDATE_CUSTOM_UNIT_ERROR;
    payload: string;
}

export interface UpdateDensityAmountAction {
    type: typeof FOOD_ITEM_UPDATE_DENSITY_AMOUNT;
    payload: string;
}

export interface UpdateDensityVolumeUnitAction {
    type: typeof FOOD_ITEM_UPDATE_DENSITY_VOLUME_UNIT;
    payload: VolumeUnit;
}

export interface UpdateDensityWeightUnitAction {
    type: typeof FOOD_ITEM_UPDATE_DENSITY_WEIGHT_UNIT;
    payload: WeightUnit;
}

export interface UpdateServingSizeAmountAction {
    type: typeof FOOD_ITEM_UPDATE_SERVING_SIZE_AMOUNT;
    payload: string;
}

export interface UpdateServingSizeUnitAction {
    type: typeof FOOD_ITEM_UPDATE_SERVING_SIZE_UNIT;
    payload: WeightUnit | VolumeUnit | string;
}

export interface FoodItemFetchRequestAction {
    type: typeof FOOD_ITEM_FETCH_REQUEST;
    payload: string;
}

export interface FoodItemFetchSuccessAction {
    type: typeof FOOD_ITEM_FETCH_SUCCESS;
    payload: Food;
}

export interface FoodItemFetchErrorAction {
    type: typeof FOOD_ITEM_FETCH_ERROR;
    payload: string;
}

export type FoodItemActionTypes = (
    UpdateNameAction | UpdateBrandAction | UpdateSubtitleAction | UpdateTypeAction |
    UpdateNutritionFactAction | UpdateCustomUnitsAction |
    UpdateDensityAmountAction | UpdateDensityVolumeUnitAction | UpdateDensityWeightUnitAction |
    UpdateServingSizeAmountAction | UpdateServingSizeUnitAction |
    FoodItemFetchRequestAction | FoodItemFetchErrorAction | FoodItemFetchSuccessAction |
    AddCustomUnitRequestAction | AddCustomUnitSuccessAction | AddCustomUnitErrorAction |
    RemoveCustomUnitRequestAction | RemoveCustomUnitSuccessAction | RemoveCustomUnitErrorAction |
    UpdateCustomUnitRequestAction | UpdateCustomUnitSuccessAction | UpdateCustomUnitErrorAction
);
