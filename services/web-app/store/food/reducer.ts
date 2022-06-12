import { NutritionFactType } from "@common/nutritionFacts";
import * as units from "@common/units";
import Utils, { DecimalPlaces } from "@common/utils";
import type { AppState } from "@store";

import * as types from "./types";


const initialState: types.FoodPageStore = {

    id: -1,
    name: "Name",
    brand: "Brand",
    subtitle: "Subtitle",
    description: "",
    nutritionFacts: {},
    customUnits: [],
    isPrivate: false,

    type: "Nuts",

    density: units.DEFAULT_DENSITY,
    densityInput: String(units.DEFAULT_DENSITY),
    densityVolumeUnit: units.DEFAULT_VOLUME_UNIT,
    densityWeightUnit: units.DEFAULT_WEIGHT_UNIT,

    servingSize: 100,
    servingSizeInput: "100",
    servingSizeUnit: units.DEFAULT_WEIGHT_UNIT,

    // NOTE: INPUTS

    nutritionFactsByServing: {},
    nutritionFactsByServingInputs: {},

    // TODO: Move it from this store into the User's one
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

    // NOTE: PAGE STATE

    isLoaded: false,
    errorMessage: null,

    editMode: true,

    isCreated: false,
};


export function extractState(globalState: AppState): types.FoodPageStore {
    return (globalState?.foodPage || initialState);
}


export default function foodPageReducer(state = initialState, action: types.FoodActionTypes): types.FoodPageStore {

    switch (action.type) {

        case types.FOOD_SET_EDIT_MODE: {
            return {
                ...state,
                editMode: action.payload,
            };
        }

        case types.FOOD_UPDATE_NAME: {
            return {
                ...state,
                name: action.payload,
            };
        }

        case types.FOOD_UPDATE_BRAND: {
            return {
                ...state,
                brand: action.payload,
            };
        }

        case types.FOOD_UPDATE_SUBTITLE: {
            return {
                ...state,
                subtitle: action.payload,
            };
        }

        case types.FOOD_UPDATE_DESCRIPTION: {
            return {
                ...state,
                description: action.payload,
            };
        }

        case types.FOOD_UPDATE_TYPE: {
            return {
                ...state,
                type: action.payload,
            };
        }

        case types.FOOD_FETCH_NEW: {
            return {
                ...state,
                isLoaded: true,
                errorMessage: null,

                editMode: true,

                isCreated: false,
            };
        }

        case types.FOOD_FETCH_REQUEST: {
            return {
                ...state,
                isLoaded: false,
                errorMessage: null,

                editMode: false,

                id: action.payload,
            };
        }

        case types.FOOD_FETCH_SUCCESS: {
            const food = action.payload;

            return {
                ...state,
                isLoaded: true,
                errorMessage: null,

                id: food.id,
                name: food.name,
                brand: food.brand,
                subtitle: food.subtitle,

                density: food.density,
                densityInput: String(food.density),

                nutritionFacts: food.nutrition_facts,
                customUnits: Utils.convertCustomUnitsIntoInputs(food.custom_units),

                nutritionFactsByServing: food.nutrition_facts,
                nutritionFactsByServingInputs: Utils.convertNutritionFactValuesIntoInputs(food.nutrition_facts),
            };
        }

        case types.FOOD_FETCH_ERROR: {
            return {
                ...state,
                isLoaded: true,
                errorMessage: action.payload as string,
            };
        }

        case types.FOOD_UPDATE_NUTRITION_FACT: {
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

        case types.FOOD_ADD_CUSTOM_UNIT: {

            const { payload: customUnitInput } = action;

            // IMPROVE: Custom Unit name is empty or already exist, maybe show some kind of feedback?
            if (state.customUnits.some((cu) => cu.name === customUnitInput.name) || Utils.isEmptyString(customUnitInput.name)) {
                return state;
            }

            return {
                ...state,

                customUnits: [
                    ...state.customUnits,
                    { ...customUnitInput, product_id: state.id },
                ],
            };
        }

        case types.FOOD_UPDATE_CUSTOM_UNIT: {

            const { payload: { index: customUnitIndex, customUnit: updatedCustomUnitInput } } = action;

            return {
                ...state,

                customUnits: state.customUnits.map((customUnit, index) => (
                    index === customUnitIndex ? updatedCustomUnitInput : customUnit
                )),
            };
        }

        case types.FOOD_REMOVE_CUSTOM_UNIT: {

            const { payload: customUnitIndex } = action;

            return {
                ...state,
                customUnits: state.customUnits.filter((_customUnit, index) => index !== customUnitIndex),
            };
        }

        case types.FOOD_UPDATE_DENSITY_AMOUNT: {

            const densityInput = action.payload;

            const densityInputNormalized = Utils.decimalNormalizer(densityInput, state.densityInput);
            const density = units.convertDensityToMetric(
                Number(densityInputNormalized), state.densityWeightUnit, state.densityVolumeUnit,
            );

            return {
                ...state,
                density: density,
                densityInput: densityInputNormalized,
            };
        }

        case types.FOOD_UPDATE_DENSITY_VOLUME_UNIT: {

            const densityVolumeUnit = action.payload;

            const density = units.convertDensityFromMetric(state.density, state.densityWeightUnit, densityVolumeUnit);
            const densityRounded = Utils.roundToDecimal(density, DecimalPlaces.Four);

            return {
                ...state,
                densityInput: String(densityRounded),
                densityVolumeUnit: densityVolumeUnit,
            };
        }

        case types.FOOD_UPDATE_DENSITY_WEIGHT_UNIT: {

            const densityWeightUnit = action.payload;

            const density = units.convertDensityFromMetric(state.density, densityWeightUnit, state.densityVolumeUnit);
            const densityRounded = Utils.roundToDecimal(density, DecimalPlaces.Four);

            return {
                ...state,
                densityInput: String(densityRounded),
                densityWeightUnit: densityWeightUnit,
            };
        }

        case types.FOOD_UPDATE_SERVING_SIZE_AMOUNT: {

            const servingSizeInput = action.payload;
            const servingSizeInputNormalized = Utils.decimalNormalizer(servingSizeInput, state.servingSizeInput);
            const servingSize = units.convertToMetric(
                Number(servingSizeInputNormalized), state.servingSizeUnit, state.customUnits, state.density,
            );

            // NOTE: edit-mode will not update nutritionFacts, so you can adjust how much nutritionFacts is in selected servingSize
            if (state.editMode) {
                return {
                    ...state,
                    servingSize: servingSize,
                    servingSizeInput: servingSizeInputNormalized,
                };
            }
            // NOTE: read-mode will update nutritionFacts to demonstrate how much you'll have in a selected servingSize
            else {
                const nutritionFactsByServing = Utils.convertNutritionFacts(servingSize, true, state.nutritionFacts);

                return {
                    ...state,
                    servingSize: servingSize,
                    servingSizeInput: servingSizeInputNormalized,
                    nutritionFactsByServing: nutritionFactsByServing,
                    nutritionFactsByServingInputs: Utils.convertNutritionFactValuesIntoInputs(nutritionFactsByServing),
                };
            }
        }

        case types.FOOD_UPDATE_SERVING_SIZE_UNIT: {

            const servingSizeUnit = action.payload;

            const servingSize = units.convertFromMetric(state.servingSize, servingSizeUnit, state.customUnits, state.density);
            const servingSizeRounded = Utils.roundToDecimal(servingSize, DecimalPlaces.Four);

            return {
                ...state,
                servingSizeInput: String(servingSizeRounded),
                servingSizeUnit: servingSizeUnit,
            };
        }

        case types.FOOD_CREATE_REQUEST: {
            return {
                ...state,
                isLoaded: false,
            };
        }

        case types.FOOD_CREATE_SUCCESS: {

            const food = action.payload;

            return {
                ...state,
                isLoaded: true,
                editMode: false,
                id: food.id,
                isCreated: true,
            };
        }

        case types.FOOD_CREATE_ERROR: {
            return {
                ...state,
                isLoaded: true,
                errorMessage: action.payload as string,
            };
        }

        case types.FOOD_UPDATE_REQUEST: {
            return {
                ...state,
                isLoaded: false,
            };
        }

        case types.FOOD_UPDATE_SUCCESS: {

            const food = action.payload;

            return {
                ...state,
                isLoaded: true,
                editMode: false,
                id: food.id,
            };
        }

        case types.FOOD_UPDATE_ERROR: {
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
