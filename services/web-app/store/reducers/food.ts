import { createReducer } from "@reduxjs/toolkit";

import { getErrorMessageFromStatus } from "@common/http";
import { DecimalPlaces, roundToDecimal } from "@common/numeric";
import * as units from "@common/units";

import * as actions from "../actions/food";
import {
    convertCustomUnitsIntoInputs, convertNutrientInputsIntoValues,
    convertNutrients, convertNutrientValuesIntoInputs,
} from "../helpers/food";
import type { FoodPageStore } from "../types/food";


const DEFAULT_SERVING_SIZE: number = 100;

const initialState: FoodPageStore = {

    id: -1,
    name: "Name",
    brand: "Brand",
    description: "",
    nutrients: {},
    customUnits: [],
    isPrivate: false,

    type: "Nuts",

    density: units.DEFAULT_DENSITY,
    densityInput: String(units.DEFAULT_DENSITY),
    densityVolumeUnit: units.DEFAULT_VOLUME_UNIT,
    densityWeightUnit: units.DEFAULT_WEIGHT_UNIT,

    servingSize: DEFAULT_SERVING_SIZE,
    servingSizeInput: String(DEFAULT_SERVING_SIZE),
    servingSizeUnit: units.DEFAULT_WEIGHT_UNIT,

    // NOTE: INPUTS

    nutrientsByServing: {},
    nutrientsByServingInputs: {},

    // NOTE: PAGE STATE

    isLoading: false,
    isLoaded: false,
    errorMessage: null,

    editMode: true,

    isCreated: false,
};

const reducer = createReducer(initialState, (builder) => {
    builder
        .addCase(actions.setEditMode, (state, action) => {
            state.editMode = action.payload;
        })
        .addCase(actions.updateName, (state, action) => {
            state.name = action.payload;
        })
        .addCase(actions.updateBrand, (state, action) => {
            state.brand = action.payload;
        })
        .addCase(actions.updateDescription, (state, action) => {
            state.description = action.payload;
        })
        .addCase(actions.updateType, (state, action) => {
            state.type = action.payload;
        })
        .addCase(actions.fetchFoodNew, (state) => {
            state.isLoaded = true;
            state.errorMessage = null;
            state.editMode = true;
            state.isCreated = false;
        })
        .addCase(actions.fetchFood.pending, (state, action) => {
            const { arg: foodId } = action.meta;

            state.id = foodId;
            state.isLoading = true;
            state.isLoaded = false;
            state.errorMessage = null;
            state.editMode = false;
        })
        .addCase(actions.fetchFood.fulfilled, (state, action) => {
            const { payload: food } = action;

            state.isLoading = false;
            state.isLoaded = true;
            state.errorMessage = null;

            state.id = food.id;
            state.name = food.name;
            state.brand = food.brand;

            state.density = food.density;
            state.densityInput = String(food.density);

            state.servingSize = food.serving_size;
            state.servingSizeInput = String(food.serving_size);

            state.nutrients = food.nutrients;
            state.customUnits = convertCustomUnitsIntoInputs(food.custom_units);

            state.nutrientsByServing = food.nutrients;
            state.nutrientsByServingInputs = convertNutrientValuesIntoInputs(food.nutrients);
        })
        .addCase(actions.fetchFood.rejected, (state, { payload: errorStatus }) => {
            state.isLoading = false;
            state.isLoaded = true;
            state.errorMessage = getErrorMessageFromStatus(errorStatus);
        })
        .addCase(actions.updateNutrient, (state, action) => {
            const { payload: { key, value } } = action;

            const nutrientsByServing = {
                ...state.nutrientsByServing,
                ...convertNutrientInputsIntoValues({ [key]: value }),
            };

            state.nutrients = convertNutrients(state.servingSize, false, nutrientsByServing),
            state.nutrientsByServing = nutrientsByServing,
            state.nutrientsByServingInputs = {
                ...state.nutrientsByServingInputs,
                ...{ [key]: value },
            };
        })
        .addCase(actions.addCustomUnit, (state, action) => {
            const { payload: customUnit } = action;

            // IMPROVE: Custom Unit name is empty or already exist, maybe show some kind of feedback?
            if (state.customUnits.some((cu) => cu.name === customUnit.name) || !customUnit.name.isNotEmpty()) {
                return;
            }

            state.customUnits.push({
                ...customUnit,
                amount: units.convertToMetric(
                    Number(customUnit.amountInput),
                    customUnit.unit,
                    state.customUnits,
                    state.density,
                ),
                product_id: state.id,
            });
        })
        .addCase(actions.updateCustomUnit, (state, action) => {
            const { payload: { index: customUnitIndex, customUnit: updatedCustomUnit } } = action;

            state.customUnits[customUnitIndex] = {
                ...updatedCustomUnit,
                amount: units.convertToMetric(
                    Number(updatedCustomUnit.amountInput),
                    updatedCustomUnit.unit,
                    state.customUnits,
                    state.density,
                ),
            };
        })
        .addCase(actions.removeCustomUnit, (state, action) => {
            const { payload: customUnitIndex } = action;
            state.customUnits = state.customUnits.filter((_customUnit, index) => index !== customUnitIndex);
        })
        .addCase(actions.updateDensityAmount, (state, action) => {
            const { payload: densityInput } = action;

            const density = units.convertDensityToMetric(
                Number(densityInput), state.densityWeightUnit, state.densityVolumeUnit,
            );

            // FIXME: Recalculate all volume related amounts?

            state.density = density;
            state.densityInput = densityInput;
        })
        .addCase(actions.updateDensityVolumeUnit, (state, action) => {
            const { payload: densityVolumeUnit } = action;

            const density = units.convertDensityFromMetric(state.density, state.densityWeightUnit, densityVolumeUnit);
            const densityRounded = roundToDecimal(density, DecimalPlaces.Four);

            state.densityInput = String(densityRounded);
            state.densityVolumeUnit = densityVolumeUnit;

        })
        .addCase(actions.updateDensityWeightUnit, (state, action) => {
            const { payload: densityWeightUnit } = action;

            const density = units.convertDensityFromMetric(state.density, densityWeightUnit, state.densityVolumeUnit);
            const densityRounded = roundToDecimal(density, DecimalPlaces.Four);

            state.densityInput = String(densityRounded);
            state.densityWeightUnit = densityWeightUnit;
        })
        .addCase(actions.updateServingSizeAmount, (state, action) => {
            const { payload: servingSizeInput } = action;

            const servingSize = units.convertToMetric(
                Number(servingSizeInput), state.servingSizeUnit, state.customUnits, state.density,
            );

            // NOTE: edit-mode will not update nutrients, so you can adjust how much nutrients is in selected servingSize
            if (state.editMode) {
                state.servingSize = servingSize;
                state.servingSizeInput = servingSizeInput;
            }
            // NOTE: read-mode will update nutrients to demonstrate how much you'll have in a selected servingSize
            else {
                const nutrientsByServing = convertNutrients(servingSize, true, state.nutrients);

                state.servingSize = servingSize;
                state.servingSizeInput = servingSizeInput;
                state.nutrientsByServing = nutrientsByServing;
                state.nutrientsByServingInputs = convertNutrientValuesIntoInputs(nutrientsByServing);
            }
        })
        .addCase(actions.updateServingSizeUnit, (state, action) => {
            const { payload: servingSizeUnit } = action;

            const servingSize = units.convertToMetric(
                Number(state.servingSizeInput), servingSizeUnit, state.customUnits, state.density,
            );

            // NOTE: edit-mode will not update nutrients, so you can adjust how much nutrients is in selected servingSize
            if (state.editMode) {
                state.servingSize = servingSize;
                state.servingSizeUnit = servingSizeUnit;
            }
            // NOTE: read-mode will update nutrients to demonstrate how much you'll have in a selected servingSize
            else {
                const nutrientsByServing = convertNutrients(servingSize, true, state.nutrients);

                state.servingSize = servingSize;
                state.servingSizeUnit = servingSizeUnit;
                state.nutrientsByServing = nutrientsByServing;
                state.nutrientsByServingInputs = convertNutrientValuesIntoInputs(nutrientsByServing);
            }
        })
        .addCase(actions.createFood.pending, (state) => {
            state.isLoading = true;
            state.isLoaded = false;
        })
        .addCase(actions.createFood.fulfilled, (state, action) => {
            const { payload: food } = action;

            state.isLoading = false;
            state.isLoaded = true;
            state.editMode = false;
            state.id = food.id;
            state.isCreated = true;
        })
        .addCase(actions.createFood.rejected, (state, { payload: errorStatus }) => {
            state.isLoading = false;
            state.isLoaded = true;
            state.errorMessage = getErrorMessageFromStatus(errorStatus);
        })
        .addCase(actions.updateFood.pending, (state) => {
            state.isLoading = true;
            state.isLoaded = false;
        })
        .addCase(actions.updateFood.fulfilled, (state, action) => {
            const { payload: food } = action;

            state.isLoading = false;
            state.isLoaded = true;
            state.editMode = false;
            state.id = food.id;
        })
        .addCase(actions.updateFood.rejected, (state, { payload: errorStatus }) => {
            state.isLoading = false;
            state.isLoaded = true;
            state.errorMessage = getErrorMessageFromStatus(errorStatus);
        });
});

export default reducer;
