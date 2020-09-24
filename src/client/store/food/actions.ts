import {
    FOOD_ITEM_UPDATE_NAME,
    FOOD_ITEM_UPDATE_BRAND,
    FOOD_ITEM_UPDATE_DESCRIPTION,
    FoodItemActionTypes,
    FOOD_ITEM_FETCH_REQUESTED,
} from "./types";



export function updateName(name: string): FoodItemActionTypes {
    return {
        type: FOOD_ITEM_UPDATE_NAME,
        payload: name,
    };
}

export function updateBrand(brand: string): FoodItemActionTypes {
    return {
        type: FOOD_ITEM_UPDATE_BRAND,
        payload: brand,
    };
}

export function updateDescription(description: string): FoodItemActionTypes {
    return {
        type: FOOD_ITEM_UPDATE_DESCRIPTION,
        payload: description,
    };
}


export function requestFoodItem(foodId: string): FoodItemActionTypes {
    return {
        type: FOOD_ITEM_FETCH_REQUESTED,
        payload: foodId,
    };
}
