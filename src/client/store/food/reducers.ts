import {
    FOOD_ITEM_UPDATE_NAME,
    FoodItemActionTypes,
    FoodPageStore,
    FOOD_ITEM_FETCH_REQUESTED,
    FOOD_ITEM_FETCH_SUCCESS,
    FOOD_ITEM_FETCH_ERROR,
    FOOD_ITEM_UPDATE_BRAND,
    FOOD_ITEM_UPDATE_SUBTITLE,
    FOOD_ITEM_UPDATE_NUTRITION_FACT,
    FOOD_ITEM_UPDATE_CUSTOM_UNITS,
} from "./types";
import { NutritionFactType } from "../../../common/nutrients";
import { CustomUnit, CustomUnitInput, UnitWeight } from "../../../common/units";
import { Dictionary } from "../../../common/typings";
import Utils from "../../../common/utils";



const initialState: FoodPageStore = {

    isLoaded: false,
    errorMessage: null,

    id: "",
    name: "Name",
    brand: "Brand",
    subtitle: "Subtitle",
    nutritionFactValues: {},
    customUnits: [],

    // NOTE: INPUTS

    nutritionFactInputs: {},
    customUnitInputs: [],

    // NOTE: STATIC

    type: "Nuts",

    density: 1,
    servingSize: 100,
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


function convertNutritionFactValuesIntoInputs(values: Dictionary<NutritionFactType, number>): Dictionary<NutritionFactType, string> {

    return Utils.getObjectKeys(values).reduce<Dictionary<NutritionFactType, string>>(
        (acc, nfType) => ({ ...acc, [nfType]: String(values[nfType]) }), {}
    );
}

function convertNutritionFactInputsIntoValues(values: Dictionary<NutritionFactType, string>): Dictionary<NutritionFactType, number> {

    return Utils.getObjectKeys(values).reduce<Dictionary<NutritionFactType, number>>(
        (acc, nfType) => ({ ...acc, [nfType]: Number(values[nfType]) }), {}
    );
}

function convertCustomUnitsIntoInputs(customUnits: CustomUnit[]): CustomUnitInput[] {

    return customUnits.map((customUnit: CustomUnit) => ({ ...customUnit, amount: String(customUnit.amount) }));
}

function convertCustomUnitsIntoValues(customUnits: CustomUnitInput[]): CustomUnit[] {

    return customUnits.map((customUnit: CustomUnitInput) => ({ ...customUnit, amount: Number(customUnit.amount) }));
}


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
                nutritionFactValues: foodItem.nutritionFactValues,
                customUnits: foodItem.customUnits,

                nutritionFactInputs: convertNutritionFactValuesIntoInputs(foodItem.nutritionFactValues),
                customUnitInputs: convertCustomUnitsIntoInputs(foodItem.customUnits),
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
            return {
                ...state,

                nutritionFactValues: {
                    ...state.nutritionFactValues,
                    ...convertNutritionFactInputsIntoValues(action.payload),
                },
                nutritionFactInputs: {
                    ...state.nutritionFactInputs,
                    ...action.payload as Dictionary<NutritionFactType, string>,
                },
            };
        }

        case FOOD_ITEM_UPDATE_CUSTOM_UNITS: {
            return {
                ...state,

                customUnits: convertCustomUnitsIntoValues(action.payload),
                customUnitInputs: action.payload as CustomUnitInput[],
            };
        }

        default:
            return state;
    }
}
