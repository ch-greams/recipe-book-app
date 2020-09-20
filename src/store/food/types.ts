import { Nutrient, NutrientType } from "../../common/nutrients";
import { UnitVolume, UnitWeight } from "../../common/units";



export interface FoodItem {

    name: string;
    energy: number;
    nutrients: Dictionary<Nutrient>;

    // NOTE: STATIC

    amount: number;
    unit: UnitWeight | UnitVolume;
    featuredNutrients: NutrientType[];
}


export const FOOD_ITEM_UPDATE_NAME = "FOOD_ITEM_UPDATE_NAME";


interface UpdateNameAction {
    type: typeof FOOD_ITEM_UPDATE_NAME;
    payload: string;
}


export type FoodItemActionTypes = (
    UpdateNameAction
);
