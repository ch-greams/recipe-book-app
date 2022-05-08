import { NutritionFactType } from "@common/nutritionFacts";
import type { CustomUnitInput } from "@common/units";
import { DEFAULT_VOLUME_UNIT, DEFAULT_WEIGHT_UNIT } from "@common/units";
import Utils, { DecimalPlaces } from "@common/utils";
import type { AppState } from "@store";

import * as types from "./types";


const initialState: types.FoodPageStore = {

    isLoaded: false,
    errorMessage: null,

    id: -1,
    name: "Name",
    brand: "Brand",
    subtitle: "Subtitle",
    description: "",
    nutritionFacts: {},
    customUnits: [],
    isPrivate: false,

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

    // NOTE: NEW FOOD

    isCreated: false,
};


export function extractState(globalState: AppState): types.FoodPageStore {
    return (globalState?.foodPage || initialState);
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

        case types.FOOD_ITEM_UPDATE_DESCRIPTION: {
            return {
                ...state,
                description: action.payload,
            };
        }

        case types.FOOD_ITEM_UPDATE_TYPE: {
            return {
                ...state,
                type: action.payload,
            };
        }

        case types.FOOD_ITEM_FETCH_NEW: {
            return {
                ...state,
                isLoaded: true,
                errorMessage: null,
                isCreated: false,
            };
        }

        case types.FOOD_ITEM_FETCH_REQUEST: {
            return {
                ...state,
                isLoaded: false,
                errorMessage: null,

                id: action.payload,
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

                nutritionFacts: foodItem.nutrition_facts,
                customUnits: foodItem.custom_units,

                nutritionFactsByServing: foodItem.nutrition_facts,
                nutritionFactsByServingInputs: Utils.convertNutritionFactValuesIntoInputs(foodItem.nutrition_facts),
                customUnitInputs: Utils.convertCustomUnitsIntoInputs(foodItem.custom_units),
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

        // TODO: Check that this is necessary
        case types.FOOD_ITEM_UPDATE_CUSTOM_UNITS: {
            return {
                ...state,

                customUnits: Utils.convertCustomUnitsIntoValues(action.payload),
                customUnitInputs: action.payload as CustomUnitInput[],
            };
        }

        case types.FOOD_ITEM_ADD_CUSTOM_UNIT: {

            const { payload: customUnitInput } = action;

            // IMPROVE: Custom Unit name is empty or already exist, maybe show some kind of feedback?
            if (state.customUnits.some((cu) => cu.name === customUnitInput.name) || Utils.isEmptyString(customUnitInput.name)) {
                return state;
            }

            return {
                ...state,

                customUnits: [
                    ...state.customUnits,
                    Utils.convertCustomUnitIntoValue(customUnitInput),
                ],
                customUnitInputs: [
                    ...state.customUnitInputs,
                    customUnitInput,
                ],
            };
        }

        case types.FOOD_ITEM_UPDATE_CUSTOM_UNIT: {

            const { payload: { index: customUnitIndex, customUnit: updatedCustomUnitInput } } = action;

            return {
                ...state,

                customUnits: state.customUnits.map((customUnit, index) => (
                    index === customUnitIndex
                        ? Utils.convertCustomUnitIntoValue(updatedCustomUnitInput)
                        : customUnit
                )),
                customUnitInputs: state.customUnitInputs.map((customUnit, index) => (
                    index === customUnitIndex
                        ? updatedCustomUnitInput
                        : customUnit
                )),
            };
        }

        case types.FOOD_ITEM_REMOVE_CUSTOM_UNIT: {

            const { payload: customUnitIndex } = action;

            return {
                ...state,

                customUnits: state.customUnits.filter((_customUnit, index) => index !== customUnitIndex),
                customUnitInputs: state.customUnitInputs.filter((_customUnitInput, index) => index !== customUnitIndex),
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

        case types.FOOD_ITEM_CREATE_REQUEST: {
            return {
                ...state,
                isLoaded: false,
            };
        }

        case types.FOOD_ITEM_CREATE_SUCCESS: {

            const foodItem = action.payload;

            return {
                ...state,
                isLoaded: true,
                id: foodItem.id,
                isCreated: true,
            };
        }

        case types.FOOD_ITEM_CREATE_ERROR: {
            return {
                ...state,
                isLoaded: true,
                errorMessage: action.payload as string,
            };
        }

        case types.FOOD_ITEM_UPDATE_REQUEST: {
            return {
                ...state,
                isLoaded: false,
            };
        }

        case types.FOOD_ITEM_UPDATE_SUCCESS: {

            const foodItem = action.payload;

            return {
                ...state,
                isLoaded: true,
                id: foodItem.id,
            };
        }

        case types.FOOD_ITEM_UPDATE_ERROR: {
            return {
                ...state,
                isLoaded: true,
                errorMessage: action.payload as string,
            };
        }

        default:
            return state;
    }
}
