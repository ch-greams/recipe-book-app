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

        // [NutrientType.Energy]: {
        //     type: NutrientType.Energy, 
        //     amount: 567, 
        //     unit: UnitEnergy.kcal, 
        //     dv: 28,
        //     isFraction: false,
        // },

        [NutrientType.Protein]: 25.8,
        [NutrientType.Fat]: 49.2,
        [NutrientType.Monounsaturated]: 24.4,
        [NutrientType.Carbohydrate]: 16.1,
        [NutrientType.DietaryFiber]: 8.5,
        [NutrientType.Sugars]: 4,
        [NutrientType.Sodium]: 18,
        [NutrientType.VitaminA]: 0,
        [NutrientType.VitaminC]: 0,
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
