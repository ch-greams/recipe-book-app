import { NutritionFactType } from "../../../common/nutrients";
import { Dictionary, Food } from "../../../common/typings";
import { UnitVolume, UnitWeight } from "../../../common/units";



export interface FoodPageStore {

    isLoaded: boolean;

    id: string;

    name: string;
    brand: string;
    description: string;

    nutritionFactValues: Dictionary<NutritionFactType, number>;

    // NOTE: STATIC

    amount: number;
    unit: UnitWeight | UnitVolume;
    featuredNutritionFacts: NutritionFactType[];
}


export const FOOD_ITEM_UPDATE_NAME = "FOOD_ITEM_UPDATE_NAME";

export const FOOD_ITEM_REQUEST = "FOOD_ITEM_REQUEST";
export const FOOD_ITEM_RECEIVE = "FOOD_ITEM_RECEIVE";


export const FOOD_ITEM_FETCH_REQUESTED = "FOOD_ITEM_FETCH_REQUESTED";
export const FOOD_ITEM_FETCH_STARTED = "FOOD_ITEM_FETCH_STARTED";
export const FOOD_ITEM_FETCH_SUCCESS = "FOOD_ITEM_FETCH_SUCCESS";
export const FOOD_ITEM_FETCH_ERROR = "FOOD_ITEM_FETCH_ERROR";


interface UpdateNameAction {
    type: typeof FOOD_ITEM_UPDATE_NAME;
    payload: string;
}

interface FoodItemRequestAction {
    type: typeof FOOD_ITEM_REQUEST;
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


export type FoodItemActionTypes = (
    UpdateNameAction | FoodItemRequestAction | FoodItemFetchSuccessAction | FoodItemFetchRequestedAction
);
