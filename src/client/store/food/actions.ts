import {
    FOOD_ITEM_UPDATE_NAME,
    FoodItemActionTypes,
    FOOD_ITEM_FETCH_REQUESTED,
} from "./types";



export function updateName(name: string): FoodItemActionTypes {
    return {
        type: FOOD_ITEM_UPDATE_NAME,
        payload: name,
    };
}

export function requestFoodItem(foodId: string): FoodItemActionTypes {
    return {
        type: FOOD_ITEM_FETCH_REQUESTED,
        payload: foodId,
    };
}
