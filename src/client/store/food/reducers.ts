import {
    FOOD_ITEM_UPDATE_NAME,
    FoodItemActionTypes,
    FoodItem,
} from "./types";
import { NutritionFactType } from "../../common/nutrients";
import { UnitWeight } from "../../common/units";



const initialState: FoodItem = {

    name: "Peanuts",
    brand: "Test",
    description: "That is technically a food",

    nutritionFactValues: {
        [NutritionFactType.Energy]: 567,
        [NutritionFactType.Protein]: 25.8,
        [NutritionFactType.Fat]: 49.2,
        [NutritionFactType.Monounsaturated]: 24.4,
        [NutritionFactType.Carbohydrate]: 16.1,
        [NutritionFactType.DietaryFiber]: 8.5,
        [NutritionFactType.Sugars]: 4,
        [NutritionFactType.Sodium]: 18,
        [NutritionFactType.VitaminA]: 0,
        [NutritionFactType.VitaminC]: 0,
    },

    // NOTE: STATIC

    amount: 100,
    unit: UnitWeight.g,

    featuredNutritionFacts: [
        NutritionFactType.Energy,
        NutritionFactType.Protein,
        NutritionFactType.Fat,
        NutritionFactType.Monounsaturated,
        NutritionFactType.Carbohydrate,
        NutritionFactType.DietaryFiber,
        NutritionFactType.Sugars,
        NutritionFactType.Sodium,
        NutritionFactType.VitaminA,
        NutritionFactType.VitaminC,
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
