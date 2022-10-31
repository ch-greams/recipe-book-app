import { createReducer } from "@reduxjs/toolkit";

import { NutrientName } from "@common/nutritionFacts";
import * as units from "@common/units";
import Utils, { DecimalPlaces } from "@common/utils";

import * as actions from "../actions/food";
import type { FoodPageStore } from "../types/food";


const DEFAULT_SERVING_SIZE: number = 100;

const initialState: FoodPageStore = {

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

    servingSize: DEFAULT_SERVING_SIZE,
    servingSizeInput: String(DEFAULT_SERVING_SIZE),
    servingSizeUnit: units.DEFAULT_WEIGHT_UNIT,

    // NOTE: INPUTS

    nutritionFactsByServing: {},
    nutritionFactsByServingInputs: {},

    // TODO: Move it from this store into the User's one
    featuredNutritionFacts: [
        NutrientName.Energy,
        NutrientName.Carbohydrate,
        NutrientName.DietaryFiber,
        NutrientName.Sugars,
        NutrientName.Fat,
        NutrientName.Monounsaturated,
        NutrientName.Protein,
        NutrientName.Sodium,
        NutrientName.VitaminA,
        NutrientName.VitaminC,
    ],

    // NOTE: PAGE STATE

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
        .addCase(actions.updateSubtitle, (state, action) => {
            state.subtitle = action.payload;
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
            state.isLoaded = false;
            state.errorMessage = null;
            state.editMode = false;
        })
        .addCase(actions.fetchFood.fulfilled, (state, action) => {
            const { payload: food } = action;

            state.isLoaded = true;
            state.errorMessage = null;

            state.id = food.id;
            state.name = food.name;
            state.brand = food.brand;
            state.subtitle = food.subtitle;

            state.density = food.density;
            state.densityInput = String(food.density);

            state.servingSize = food.serving_size;
            state.servingSizeInput = String(food.serving_size);

            state.nutritionFacts = food.nutrition_facts;
            state.customUnits = Utils.convertCustomUnitsIntoInputs(food.custom_units);

            state.nutritionFactsByServing = food.nutrition_facts;
            state.nutritionFactsByServingInputs = Utils.convertNutritionFactValuesIntoInputs(food.nutrition_facts);
        })
        .addCase(actions.fetchFood.rejected, (state, action) => {
            state.isLoaded = true;
            state.errorMessage = action.payload?.message;
        })
        .addCase(actions.updateNutritionFact, (state, action) => {
            const { payload: { key, value } } = action;

            const nutritionFactsByServing = {
                ...state.nutritionFactsByServing,
                ...Utils.convertNutritionFactInputsIntoValues({ [key]: value }),
            };

            state.nutritionFacts = Utils.convertNutritionFacts(state.servingSize, false, nutritionFactsByServing),
            state.nutritionFactsByServing = nutritionFactsByServing,
            state.nutritionFactsByServingInputs = {
                ...state.nutritionFactsByServingInputs,
                ...{ [key]: value },
            };
        })
        .addCase(actions.addCustomUnit, (state, action) => {
            const { payload: customUnit } = action;

            // IMPROVE: Custom Unit name is empty or already exist, maybe show some kind of feedback?
            if (state.customUnits.some((cu) => cu.name === customUnit.name) || Utils.isEmptyString(customUnit.name)) {
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

            const densityInputNormalized = Utils.decimalNormalizer(densityInput, state.densityInput);
            const density = units.convertDensityToMetric(
                Number(densityInputNormalized), state.densityWeightUnit, state.densityVolumeUnit,
            );

            // FIXME: Recalculate all volume related amounts?

            state.density = density;
            state.densityInput = densityInputNormalized;
        })
        .addCase(actions.updateDensityVolumeUnit, (state, action) => {
            const { payload: densityVolumeUnit } = action;

            const density = units.convertDensityFromMetric(state.density, state.densityWeightUnit, densityVolumeUnit);
            const densityRounded = Utils.roundToDecimal(density, DecimalPlaces.Four);

            state.densityInput = String(densityRounded);
            state.densityVolumeUnit = densityVolumeUnit;

        })
        .addCase(actions.updateDensityWeightUnit, (state, action) => {
            const { payload: densityWeightUnit } = action;

            const density = units.convertDensityFromMetric(state.density, densityWeightUnit, state.densityVolumeUnit);
            const densityRounded = Utils.roundToDecimal(density, DecimalPlaces.Four);

            state.densityInput = String(densityRounded);
            state.densityWeightUnit = densityWeightUnit;
        })
        .addCase(actions.updateServingSizeAmount, (state, action) => {
            const { payload: servingSizeInput } = action;

            const servingSizeInputNormalized = Utils.decimalNormalizer(servingSizeInput, state.servingSizeInput);
            const servingSize = units.convertToMetric(
                Number(servingSizeInputNormalized), state.servingSizeUnit, state.customUnits, state.density,
            );

            // NOTE: edit-mode will not update nutritionFacts, so you can adjust how much nutritionFacts is in selected servingSize
            if (state.editMode) {
                state.servingSize = servingSize;
                state.servingSizeInput = servingSizeInputNormalized;
            }
            // NOTE: read-mode will update nutritionFacts to demonstrate how much you'll have in a selected servingSize
            else {
                const nutritionFactsByServing = Utils.convertNutritionFacts(servingSize, true, state.nutritionFacts);

                state.servingSize = servingSize;
                state.servingSizeInput = servingSizeInputNormalized;
                state.nutritionFactsByServing = nutritionFactsByServing;
                state.nutritionFactsByServingInputs = Utils.convertNutritionFactValuesIntoInputs(nutritionFactsByServing);
            }
        })
        .addCase(actions.updateServingSizeUnit, (state, action) => {
            const { payload: servingSizeUnit } = action;

            const servingSize = units.convertToMetric(
                Number(state.servingSizeInput), servingSizeUnit, state.customUnits, state.density,
            );

            // NOTE: edit-mode will not update nutritionFacts, so you can adjust how much nutritionFacts is in selected servingSize
            if (state.editMode) {
                state.servingSize = servingSize;
                state.servingSizeUnit = servingSizeUnit;
            }
            // NOTE: read-mode will update nutritionFacts to demonstrate how much you'll have in a selected servingSize
            else {
                const nutritionFactsByServing = Utils.convertNutritionFacts(servingSize, true, state.nutritionFacts);

                state.servingSize = servingSize;
                state.servingSizeUnit = servingSizeUnit;
                state.nutritionFactsByServing = nutritionFactsByServing;
                state.nutritionFactsByServingInputs = Utils.convertNutritionFactValuesIntoInputs(nutritionFactsByServing);
            }
        })
        .addCase(actions.createFood.pending, (state) => {
            state.isLoaded = false;
        })
        .addCase(actions.createFood.fulfilled, (state, action) => {
            const { payload: food } = action;

            state.isLoaded = true;
            state.editMode = false;
            state.id = food.id;
            state.isCreated = true;
        })
        .addCase(actions.createFood.rejected, (state, action) => {
            state.isLoaded = true;
            state.errorMessage = action.payload?.message;
        })
        .addCase(actions.updateFood.pending, (state) => {
            state.isLoaded = false;
        })
        .addCase(actions.updateFood.fulfilled, (state, action) => {
            const { payload: food } = action;

            state.isLoaded = true;
            state.editMode = false;
            state.id = food.id;
        })
        .addCase(actions.updateFood.rejected, (state, action) => {
            state.isLoaded = true;
            state.errorMessage = action.payload?.message;
        });
});

export default reducer;
