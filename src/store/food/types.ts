import { NutritionFactType } from "../../common/nutrients";
import { Dictionary } from "../../common/typings";
import { UnitVolume, UnitWeight } from "../../common/units";



export interface FoodItem {

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


interface UpdateNameAction {
    type: typeof FOOD_ITEM_UPDATE_NAME;
    payload: string;
}


export type FoodItemActionTypes = (
    UpdateNameAction
);
