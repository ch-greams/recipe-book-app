import {
    FOOD_ITEM_UPDATE_NAME,
    FoodItemActionTypes,
    FoodPageStore,
    FOOD_ITEM_FETCH_REQUESTED,
    FOOD_ITEM_FETCH_SUCCESS,
    FOOD_ITEM_FETCH_ERROR,
} from "./types";
import { NutritionFactType } from "../../../common/nutrients";
import { UnitWeight } from "../../../common/units";



const initialState: FoodPageStore = {

    isLoaded: false,
    errorMessage: null,

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

        case FOOD_ITEM_FETCH_REQUESTED: {
            return {
                ...state,
                isLoaded: false,
                errorMessage: null,

                id: action.payload as string,
            };
        }

        case FOOD_ITEM_FETCH_SUCCESS: {
            const foodItem = action.payload;
            return {
                ...state,
                isLoaded: true,
                errorMessage: null,

                id: foodItem.id,
                name: foodItem.name,
                brand: foodItem.brand,
                description: foodItem.description,
                nutritionFactValues: foodItem.nutritionFactValues,
            };
        }

        case FOOD_ITEM_FETCH_ERROR: {

            return {
                ...state,
                isLoaded: false,
                errorMessage: action.payload as string,
            };
        }

        default:
            return state;
    }
}
