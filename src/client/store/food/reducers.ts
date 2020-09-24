import {
    FOOD_ITEM_UPDATE_NAME,
    FoodItemActionTypes,
    FoodPageStore,
    FOOD_ITEM_FETCH_SUCCESS,
} from "./types";
import { NutritionFactType } from "../../../common/nutrients";
import { UnitWeight } from "../../../common/units";



const initialState: FoodPageStore = {

    isLoaded: false,

    id: "",

    name: "",
    brand: "",
    description: "",

    nutritionFactValues: {},

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


export default function foodPageReducer(state = initialState, action: FoodItemActionTypes): FoodPageStore {

    switch (action.type) {

        case FOOD_ITEM_UPDATE_NAME: {
            return {
                ...state,
                name: action.payload,
            };
        }

        case FOOD_ITEM_FETCH_SUCCESS: {
            return {
                ...state,
                isLoaded: true,

                name: action.payload.name,
                brand: action.payload.brand,
                description: action.payload.description,
                nutritionFactValues: action.payload.nutritionFactValues,
            };
        }

        default:
            return state;
    }
}
