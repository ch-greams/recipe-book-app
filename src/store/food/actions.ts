import {
    FOOD_ITEM_UPDATE_NAME,
    FoodItemActionTypes
} from "./types";



export function updateName(name: string): FoodItemActionTypes {
    return {
        type: FOOD_ITEM_UPDATE_NAME,
        payload: name,
    };
}
