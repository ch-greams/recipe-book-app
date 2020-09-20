import {
    FOOD_ITEM_UPDATE_NAME,
    FoodItemActionTypes,
    FoodItem,
} from "./types";
import { NutrientType } from "../../common/nutrients";
import { UnitWeight } from "../../common/units";



const initialState: FoodItem = {

    name: "Peanuts",

    energy: 567,

    nutrients: {
        [NutrientType.Protein]: {
            type: NutrientType.Protein,
            amount: 25.8,
            unit: UnitWeight.g,
            dv: 52,
            isFraction: false,
        },

        [NutrientType.Fat]: {
            type: NutrientType.Fat,
            amount: 49.2,
            unit: UnitWeight.g,
            dv: 76,
            isFraction: false,
        },

        [NutrientType.Monounsaturated]: {
            type: NutrientType.Monounsaturated, 
            amount: 24.4, 
            unit: UnitWeight.g, 
            dv: 5,
            isFraction: true,
        },

        [NutrientType.Carbohydrate]: {
            type: NutrientType.Carbohydrate,
            amount: 16.1,
            unit: UnitWeight.g,
            dv: 5,
            isFraction: false,
        },

        [NutrientType.DietaryFiber]: {
            type: NutrientType.DietaryFiber, 
            amount: 8.5, 
            unit: UnitWeight.g, 
            dv: 3,
            isFraction: true,
         },
        [NutrientType.Sugars]: {
            type: NutrientType.Sugars, 
            amount: 4, 
            unit: UnitWeight.g, 
            dv: 0,
            isFraction: true,
        },

        [NutrientType.Sodium]: {
            type: NutrientType.Sodium, 
            amount: 18, 
            unit: UnitWeight.mg, 
            dv: 1,
            isFraction: false,
        },

        [NutrientType.VitaminA]: {
            type: NutrientType.VitaminA, 
            amount: 0, 
            unit: UnitWeight.IU, 
            dv: 0,
            isFraction: false,
        },
        [NutrientType.VitaminC]: {
            type: NutrientType.VitaminC, 
            amount: 0, 
            unit: UnitWeight.mg, 
            dv: 0,
            isFraction: false,
        },
    },

    // NOTE: STATIC

    amount: 100,
    unit: UnitWeight.g,

    featuredNutrients: [
        NutrientType.Protein,
        NutrientType.Fat,
        NutrientType.Monounsaturated,
        NutrientType.Carbohydrate,
        NutrientType.DietaryFiber,
        NutrientType.Sugars,
        NutrientType.Sodium,
        NutrientType.VitaminA,
        NutrientType.VitaminC,
    ],
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
