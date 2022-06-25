import type { NutritionFactType } from "@common/nutritionFacts";
import type { Food } from "@common/typings";
import type { CustomUnitInput, Unit, VolumeUnit, WeightUnit } from "@common/units";



export interface FoodPageStore {

    isLoaded: boolean;
    errorMessage?: Option<string>;

    editMode: boolean;

    id: number;
    name: string;
    brand: string;
    subtitle: string;
    description: string;
    nutritionFacts: Dictionary<NutritionFactType, number>;
    customUnits: CustomUnitInput[];
    isPrivate: boolean;

    // NOTE: INPUTS

    nutritionFactsByServing: Dictionary<NutritionFactType, number>;
    nutritionFactsByServingInputs: Dictionary<NutritionFactType, string>;

    // NOTE: STATIC

    type: string;

    density: number;
    densityInput: string;
    densityVolumeUnit: VolumeUnit;
    densityWeightUnit: WeightUnit;

    servingSize: number;
    servingSizeInput: string;
    servingSizeUnit: Unit | string;
    featuredNutritionFacts: NutritionFactType[];

    // NOTE: NEW FOOD
    isCreated: boolean;
}

export const FOOD_SET_EDIT_MODE = "FOOD_SET_EDIT_MODE";

export const FOOD_UPDATE_NAME = "FOOD_UPDATE_NAME";
export const FOOD_UPDATE_BRAND = "FOOD_UPDATE_BRAND";
export const FOOD_UPDATE_SUBTITLE = "FOOD_UPDATE_SUBTITLE";
export const FOOD_UPDATE_DESCRIPTION = "FOOD_UPDATE_DESCRIPTION";
export const FOOD_UPDATE_TYPE = "FOOD_UPDATE_TYPE";
export const FOOD_UPDATE_NUTRITION_FACT = "FOOD_UPDATE_NUTRITION_FACT";

export const FOOD_UPDATE_DENSITY_AMOUNT = "FOOD_UPDATE_DENSITY_AMOUNT";
export const FOOD_UPDATE_DENSITY_VOLUME_UNIT = "FOOD_UPDATE_DENSITY_VOLUME_UNIT";
export const FOOD_UPDATE_DENSITY_WEIGHT_UNIT = "FOOD_UPDATE_DENSITY_WEIGHT_UNIT";

export const FOOD_UPDATE_SERVING_SIZE_AMOUNT = "FOOD_UPDATE_SERVING_SIZE_AMOUNT";
export const FOOD_UPDATE_SERVING_SIZE_UNIT = "FOOD_UPDATE_SERVING_SIZE_UNIT";

export const FOOD_ADD_CUSTOM_UNIT = "FOOD_ADD_CUSTOM_UNIT";
export const FOOD_REMOVE_CUSTOM_UNIT = "FOOD_REMOVE_CUSTOM_UNIT";
export const FOOD_UPDATE_CUSTOM_UNIT = "FOOD_UPDATE_CUSTOM_UNIT";

export const FOOD_FETCH_NEW = "FOOD_FETCH_NEW";
export const FOOD_FETCH_REQUEST = "FOOD_FETCH_REQUEST";
export const FOOD_FETCH_SUCCESS = "FOOD_FETCH_SUCCESS";
export const FOOD_FETCH_ERROR = "FOOD_FETCH_ERROR";

export const FOOD_CREATE_REQUEST = "FOOD_CREATE_REQUEST";
export const FOOD_CREATE_SUCCESS = "FOOD_CREATE_SUCCESS";
export const FOOD_CREATE_ERROR = "FOOD_CREATE_ERROR";

export const FOOD_UPDATE_REQUEST = "FOOD_UPDATE_REQUEST";
export const FOOD_UPDATE_SUCCESS = "FOOD_UPDATE_SUCCESS";
export const FOOD_UPDATE_ERROR = "FOOD_UPDATE_ERROR";


export interface SetEditModeAction {
    type: typeof FOOD_SET_EDIT_MODE;
    payload: boolean;
}

export interface UpdateNameAction {
    type: typeof FOOD_UPDATE_NAME;
    payload: string;
}

export interface UpdateBrandAction {
    type: typeof FOOD_UPDATE_BRAND;
    payload: string;
}

export interface UpdateSubtitleAction {
    type: typeof FOOD_UPDATE_SUBTITLE;
    payload: string;
}

export interface UpdateDescriptionAction {
    type: typeof FOOD_UPDATE_DESCRIPTION;
    payload: string;
}

export interface UpdateTypeAction {
    type: typeof FOOD_UPDATE_TYPE;
    payload: string;
}

export interface UpdateNutritionFactAction {
    type: typeof FOOD_UPDATE_NUTRITION_FACT;
    payload: Dictionary<NutritionFactType, string>;
}

export interface AddCustomUnitAction {
    type: typeof FOOD_ADD_CUSTOM_UNIT;
    payload: CustomUnitInput;
}

export interface RemoveCustomUnitAction {
    type: typeof FOOD_REMOVE_CUSTOM_UNIT;
    payload: number;
}

export interface UpdateCustomUnitAction {
    type: typeof FOOD_UPDATE_CUSTOM_UNIT;
    payload: {
        index: number;
        customUnit: CustomUnitInput;
    };
}

export interface UpdateDensityAmountAction {
    type: typeof FOOD_UPDATE_DENSITY_AMOUNT;
    payload: string;
}

export interface UpdateDensityVolumeUnitAction {
    type: typeof FOOD_UPDATE_DENSITY_VOLUME_UNIT;
    payload: VolumeUnit;
}

export interface UpdateDensityWeightUnitAction {
    type: typeof FOOD_UPDATE_DENSITY_WEIGHT_UNIT;
    payload: WeightUnit;
}

export interface UpdateServingSizeAmountAction {
    type: typeof FOOD_UPDATE_SERVING_SIZE_AMOUNT;
    payload: string;
}

export interface UpdateServingSizeUnitAction {
    type: typeof FOOD_UPDATE_SERVING_SIZE_UNIT;
    payload: Unit | string;
}

export interface FoodFetchNewAction {
    type: typeof FOOD_FETCH_NEW;
}

export interface FoodFetchRequestAction {
    type: typeof FOOD_FETCH_REQUEST;
    payload: number;
}

export interface FoodFetchSuccessAction {
    type: typeof FOOD_FETCH_SUCCESS;
    payload: Food;
}

export interface FoodFetchErrorAction {
    type: typeof FOOD_FETCH_ERROR;
    payload: string;
}

export interface FoodCreateRequestAction {
    type: typeof FOOD_CREATE_REQUEST;
}

export interface FoodCreateSuccessAction {
    type: typeof FOOD_CREATE_SUCCESS;
    payload: Food;
}

export interface FoodCreateErrorAction {
    type: typeof FOOD_CREATE_ERROR;
    payload: string;
}

export interface FoodUpdateRequestAction {
    type: typeof FOOD_UPDATE_REQUEST;
}

export interface FoodUpdateSuccessAction {
    type: typeof FOOD_UPDATE_SUCCESS;
    payload: Food;
}

export interface FoodUpdateErrorAction {
    type: typeof FOOD_UPDATE_ERROR;
    payload: string;
}

export type FoodActionTypes = (
    UpdateNameAction | UpdateBrandAction | UpdateSubtitleAction | UpdateDescriptionAction |
    UpdateTypeAction | UpdateNutritionFactAction | SetEditModeAction |
    UpdateDensityAmountAction | UpdateDensityVolumeUnitAction | UpdateDensityWeightUnitAction |
    UpdateServingSizeAmountAction | UpdateServingSizeUnitAction | FoodFetchNewAction |
    FoodFetchRequestAction | FoodFetchErrorAction | FoodFetchSuccessAction |
    AddCustomUnitAction | RemoveCustomUnitAction | UpdateCustomUnitAction |
    FoodCreateRequestAction | FoodCreateSuccessAction | FoodCreateErrorAction |
    FoodUpdateRequestAction | FoodUpdateSuccessAction | FoodUpdateErrorAction
);
