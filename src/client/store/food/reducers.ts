import { NutritionFactType } from "@common/nutritionFacts";
import type { Dictionary } from "@common/typings";
import { CustomUnitInput, VolumeUnit, WeightUnit } from "@common/units";
import Utils from "@common/utils";

import {
    FOOD_ITEM_FETCH_ERROR,
    FOOD_ITEM_FETCH_REQUESTED,
    FOOD_ITEM_FETCH_SUCCESS,
    FOOD_ITEM_UPDATE_BRAND,
    FOOD_ITEM_UPDATE_CUSTOM_UNITS,
    FOOD_ITEM_UPDATE_NAME,
    FOOD_ITEM_UPDATE_NUTRITION_FACT,
    FOOD_ITEM_UPDATE_SERVING_SIZE,
    FOOD_ITEM_UPDATE_SUBTITLE,
    FoodItemActionTypes,
    FoodPageStore,
} from "./types";



const initialState: FoodPageStore = {

    isLoaded: false,
    errorMessage: null,

    id: "",
    name: "Name",
    brand: "Brand",
    subtitle: "Subtitle",
    nutritionFacts: {},
    customUnits: [],

    // NOTE: INPUTS

    nutritionFactsByServing: {},
    nutritionFactsByServingInputs: {},
    customUnitInputs: [],

    // NOTE: STATIC

    type: "Nuts",

    density: 1,
    densityVolume: VolumeUnit.ml,
    densityWeight: WeightUnit.g,

    servingSize: 100,
    servingSizeInput: "100",
    unit: WeightUnit.g,


    featuredNutritionFacts: [
        NutritionFactType.Energy,
        NutritionFactType.Carbohydrate,
        NutritionFactType.DietaryFiber,
        NutritionFactType.Sugars,
        NutritionFactType.Fat,
        NutritionFactType.Monounsaturated,
        NutritionFactType.Protein,
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

        case FOOD_ITEM_UPDATE_BRAND: {
            return {
                ...state,
                brand: action.payload,
            };
        }

        case FOOD_ITEM_UPDATE_SUBTITLE: {
            return {
                ...state,
                subtitle: action.payload,
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
                subtitle: foodItem.subtitle,
                nutritionFacts: foodItem.nutritionFacts,
                customUnits: foodItem.customUnits,

                nutritionFactsByServing: foodItem.nutritionFacts,
                nutritionFactsByServingInputs: Utils.convertNutritionFactValuesIntoInputs(foodItem.nutritionFacts),
                customUnitInputs: Utils.convertCustomUnitsIntoInputs(foodItem.customUnits),
            };
        }

        case FOOD_ITEM_FETCH_ERROR: {
            return {
                ...state,
                isLoaded: true,
                errorMessage: action.payload as string,
            };
        }

        case FOOD_ITEM_UPDATE_NUTRITION_FACT: {
            const nutritionFactsByServing = {
                ...state.nutritionFactsByServing,
                ...Utils.convertNutritionFactInputsIntoValues(action.payload),
            };

            return {
                ...state,

                nutritionFacts: Utils.convertNutritionFacts(state.servingSize, false, nutritionFactsByServing),
                nutritionFactsByServing: nutritionFactsByServing,
                nutritionFactsByServingInputs: {
                    ...state.nutritionFactsByServingInputs,
                    ...action.payload as Dictionary<NutritionFactType, string>,
                },
            };
        }

        case FOOD_ITEM_UPDATE_CUSTOM_UNITS: {
            return {
                ...state,

                customUnits: Utils.convertCustomUnitsIntoValues(action.payload),
                customUnitInputs: action.payload as CustomUnitInput[],
            };
        }

        case FOOD_ITEM_UPDATE_SERVING_SIZE: {
            const servingSize = Number(action.payload);
            const nutritionFactsByServing = Utils.convertNutritionFacts(servingSize, true, state.nutritionFacts);

            return {
                ...state,

                servingSize: servingSize,
                servingSizeInput: action.payload,

                nutritionFactsByServing: nutritionFactsByServing,
                nutritionFactsByServingInputs: Utils.convertNutritionFactValuesIntoInputs(nutritionFactsByServing),
            };
        }

        default:
            return state;
    }
}
