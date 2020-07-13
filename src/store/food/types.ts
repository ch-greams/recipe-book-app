

export interface FoodItem {
    name: string;
}

export interface InputNumber {
    inputValue: string;
    value: number;
}



export const FOOD_ITEM_UPDATE_NAME = "FOOD_ITEM_UPDATE_NAME";


interface UpdateNameAction {
    type: typeof FOOD_ITEM_UPDATE_NAME;
    payload: string;
}


export type FoodItemActionTypes = (
    UpdateNameAction
);
