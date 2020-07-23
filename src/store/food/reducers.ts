import {
    FOOD_ITEM_UPDATE_NAME,
    FoodItemActionTypes,
    FoodItem,
} from "./types";
import { NutrientType, Unit } from "../../pages/FoodPage/FoodPage";



const initialState: FoodItem = {

    name: "Peanuts",

    amount: 100,
    unit: Unit.g,

    energy: 567,

    nutrients: {
        [NutrientType.Protein]: {
            type: NutrientType.Protein,
            amount: 25.8,
            unit: Unit.g,
            dv: 52,
        },
        [NutrientType.Fat]: {
            type: NutrientType.Fat,
            amount: 49.2,
            unit: Unit.g,
            dv: 76,
        },
        [NutrientType.Carbohydrate]: {
            type: NutrientType.Carbohydrate,
            amount: 16.1,
            unit: Unit.g,
            dv: 5,
        },
    },
};


export default function foodItemReducer(state = initialState, action: FoodItemActionTypes): FoodItem {

    switch (action.type) {

        case FOOD_ITEM_UPDATE_NAME: {
            return {
                ...state,
                name: action.payload,
            };
        }

        default:
            return state;
    }
}
