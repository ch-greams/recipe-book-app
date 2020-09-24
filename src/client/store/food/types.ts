import { NutritionFactType } from "../../../common/nutrients";
import { Dictionary, Food } from "../../../common/typings";
import { CustomUnit, UnitVolume, UnitWeight } from "../../../common/units";



export interface FoodPageStore {

    isLoaded: boolean;
    errorMessage: string;

    id: string;

    name: string;
    brand: string;
    description: string;

    nutritionFactValues: Dictionary<NutritionFactType, number>;

    // NOTE: STATIC

    customUnits: CustomUnit[];
    amount: number;
    unit: UnitWeight | UnitVolume;
    featuredNutritionFacts: NutritionFactType[];
}


export const FOOD_ITEM_UPDATE_NAME = "FOOD_ITEM_UPDATE_NAME";
export const FOOD_ITEM_UPDATE_BRAND = "FOOD_ITEM_UPDATE_BRAND";
export const FOOD_ITEM_UPDATE_DESCRIPTION = "FOOD_ITEM_UPDATE_DESCRIPTION";


export const FOOD_ITEM_FETCH_REQUESTED = "FOOD_ITEM_FETCH_REQUESTED";
export const FOOD_ITEM_FETCH_SUCCESS = "FOOD_ITEM_FETCH_SUCCESS";
export const FOOD_ITEM_FETCH_ERROR = "FOOD_ITEM_FETCH_ERROR";


interface UpdateNameAction {
    type: typeof FOOD_ITEM_UPDATE_NAME;
    payload: string;
}

interface UpdateBrandAction {
    type: typeof FOOD_ITEM_UPDATE_BRAND;
    payload: string;
}

interface UpdateDescriptionAction {
    type: typeof FOOD_ITEM_UPDATE_DESCRIPTION;
    payload: string;
}


export interface FoodItemFetchRequestedAction {
    type: typeof FOOD_ITEM_FETCH_REQUESTED;
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
    UpdateNameAction | UpdateBrandAction | UpdateDescriptionAction |
    FoodItemFetchRequestedAction | FoodItemFetchErrorAction | FoodItemFetchSuccessAction
);
