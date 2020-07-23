import { Nutrient, Unit } from "../../pages/FoodPage/FoodPage";


export interface FoodItem {
    name: string;
    amount: number,
    unit: Unit,
    energy: number,
    nutrients: Dictionary<Nutrient>;
}


export const FOOD_ITEM_UPDATE_NAME = "FOOD_ITEM_UPDATE_NAME";


interface UpdateNameAction {
    type: typeof FOOD_ITEM_UPDATE_NAME;
    payload: string;
}


export type FoodItemActionTypes = (
    UpdateNameAction
);
