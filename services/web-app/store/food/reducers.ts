import { NutritionFactType } from "@common/nutritionFacts";
import type { CustomUnit, CustomUnitInput } from "@common/units";
import { DEFAULT_VOLUME_UNIT, DEFAULT_WEIGHT_UNIT } from "@common/units";
import Utils, { DecimalPlaces } from "@common/utils";
import type { AppState } from "@store";

import * as types from "./types";


const initialState: types.FoodPageStore = {

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

    densityMetric: 1,
    density: 1,
    densityInput: "1",
    densityVolumeUnit: DEFAULT_VOLUME_UNIT,
    densityWeightUnit: DEFAULT_WEIGHT_UNIT,

    servingSize: 100,
    servingSizeInput: "100",
    servingSizeUnit: DEFAULT_WEIGHT_UNIT,


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


function extractState(globalState: AppState): types.FoodPageStore {
    return (globalState?.foodPage || initialState);
}

export function extractCustomUnits(globalState: AppState): CustomUnit[] {
    return extractState(globalState).customUnits;
}


export default function foodPageReducer(state = initialState, action: types.FoodItemActionTypes): types.FoodPageStore {

    switch (action.type) {

        case types.FOOD_ITEM_UPDATE_NAME: {
            return {
                ...state,
                name: action.payload,
            };
        }

        case types.FOOD_ITEM_UPDATE_BRAND: {
            return {
                ...state,
                brand: action.payload,
            };
        }

        case types.FOOD_ITEM_UPDATE_SUBTITLE: {
            return {
                ...state,
                subtitle: action.payload,
            };
        }

        case types.FOOD_ITEM_UPDATE_TYPE: {
            return {
                ...state,
                type: action.payload,
            };
        }
        
        case types.FOOD_ITEM_FETCH_REQUEST: {
            return {
                ...state,
                isLoaded: false,
                errorMessage: null,

                id: action.payload as string,
            };
        }

        case types.FOOD_ITEM_FETCH_SUCCESS: {
            const foodItem = action.payload;

            return {
                ...state,
                isLoaded: true,
                errorMessage: null,

                id: foodItem.id,
                name: foodItem.name,
                brand: foodItem.brand,
                subtitle: foodItem.subtitle,

                densityMetric: foodItem.density,
                density: foodItem.density,
                densityInput: String(foodItem.density),

                nutritionFacts: foodItem.nutritionFacts,
                customUnits: foodItem.customUnits,

                nutritionFactsByServing: foodItem.nutritionFacts,
                nutritionFactsByServingInputs: Utils.convertNutritionFactValuesIntoInputs(foodItem.nutritionFacts),
                customUnitInputs: Utils.convertCustomUnitsIntoInputs(foodItem.customUnits),
            };
        }

        case types.FOOD_ITEM_FETCH_ERROR: {
            return {
                ...state,
                isLoaded: true,
                errorMessage: action.payload as string,
            };
        }

        case types.FOOD_ITEM_UPDATE_NUTRITION_FACT: {
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

        case types.FOOD_ITEM_UPDATE_CUSTOM_UNITS: {
            return {
                ...state,

                customUnits: Utils.convertCustomUnitsIntoValues(action.payload),
                customUnitInputs: action.payload as CustomUnitInput[],
            };
        }

        case types.FOOD_ITEM_UPDATE_CUSTOM_UNIT_SUCCESS:
        case types.FOOD_ITEM_ADD_CUSTOM_UNIT_SUCCESS:
        case types.FOOD_ITEM_REMOVE_CUSTOM_UNIT_SUCCESS: {
            return {
                ...state,
                
                customUnits: action.payload as CustomUnit[],
                customUnitInputs: Utils.convertCustomUnitsIntoInputs(action.payload),
            };
        }

        case types.FOOD_ITEM_UPDATE_DENSITY_AMOUNT: {

            const densityInput = Utils.decimalNormalizer(action.payload, state.densityInput);
            const density = Number(densityInput);
            const densityMetric = Utils.convertDensity(density, state.densityWeightUnit, state.densityVolumeUnit, true);

            return {
                ...state,
                densityMetric: densityMetric,
                density: density,
                densityInput: densityInput,
            };
        }

        case types.FOOD_ITEM_UPDATE_DENSITY_VOLUME_UNIT: {

            const density = Utils.convertDensity(state.densityMetric, state.densityWeightUnit, action.payload);
            const densityRounded = Utils.roundToDecimal(density, DecimalPlaces.Four);

            return {
                ...state,
                density: densityRounded,
                densityInput: String(densityRounded),
                densityVolumeUnit: action.payload,
            };
        }

        case types.FOOD_ITEM_UPDATE_DENSITY_WEIGHT_UNIT: {

            const density = Utils.convertDensity(state.densityMetric, action.payload, state.densityVolumeUnit);
            const densityRounded = Utils.roundToDecimal(density, DecimalPlaces.Four);

            return {
                ...state,
                density: densityRounded,
                densityInput: String(densityRounded),
                densityWeightUnit: action.payload,
            };
        }

        case types.FOOD_ITEM_UPDATE_SERVING_SIZE_AMOUNT: {

            const servingSizeInput = Utils.decimalNormalizer(action.payload, state.servingSizeInput);
            const servingSize = Number(servingSizeInput);
            const nutritionFactsByServing = Utils.convertNutritionFacts(servingSize, true, state.nutritionFacts);

            return {
                ...state,

                servingSize: servingSize,
                servingSizeInput: servingSizeInput,

                nutritionFactsByServing: nutritionFactsByServing,
                nutritionFactsByServingInputs: Utils.convertNutritionFactValuesIntoInputs(nutritionFactsByServing),
            };
        }

        case types.FOOD_ITEM_UPDATE_SERVING_SIZE_UNIT: {

            return {
                ...state,

                servingSizeUnit: action.payload,

                // TODO: Update nutritionFacts values on change
                // nutritionFactsByServing: nutritionFactsByServing,
                // nutritionFactsByServingInputs: Utils.convertNutritionFactValuesIntoInputs(nutritionFactsByServing),
            };
        }

        default:
            return state;
    }
}
