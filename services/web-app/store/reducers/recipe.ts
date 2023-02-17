import { createReducer } from "@reduxjs/toolkit";

import { sortBy } from "@common/array";
import { getErrorMessageFromStatus } from "@common/http";
import { DecimalPlaces, roundToDecimal } from "@common/numeric";
import { isSome, unwrap } from "@common/types";
import * as units from "@common/units";
import { getTemporaryId } from "@common/utils";

import * as actions from "../actions/recipe";
import {
    convertCustomUnitsIntoInputs, convertNutrientInputsIntoValues,
    convertNutrients, convertNutrientValuesIntoInputs,
} from "../helpers/food";
import {
    convertIngredients, convertInstructions, getNewStepNumber,
    getRecipeNutrientsFromIngredients, getRecipeServingSizeFromIngredients,
} from "../helpers/recipe";
import type * as types from "../types/recipe";


const DEFAULT_SERVING_SIZE: number = 100;

const initialState: types.RecipePageStore = {

    isLoading: false,
    isLoaded: false,
    errorMessage: null,

    editMode: true,
    isCreated: false,

    id: -1,
    name: "Name",
    brand: "Brand",
    description: "",
    type: "",

    isRecipe: false,

    density: units.DEFAULT_DENSITY,
    densityInput: String(units.DEFAULT_DENSITY),
    densityVolumeUnit: units.DEFAULT_VOLUME_UNIT,
    densityWeightUnit: units.DEFAULT_WEIGHT_UNIT,

    nutrients: {},
    nutrientsByServing: {},
    nutrientsByServingInputs: {},

    customUnits: [],
    isPrivate: false,

    servingSize: DEFAULT_SERVING_SIZE,
    servingSizeInput: String(DEFAULT_SERVING_SIZE),
    servingSizeUnit: units.DEFAULT_WEIGHT_UNIT,

    // NOTE: RECIPE

    ingredients: [],
    instructions: [],

    isLoadedIngredients: true,
};

const reducer = createReducer(initialState, (builder) => {
    builder
        .addCase(actions.setEditMode, (state, { payload }) => {
            state.editMode = payload;
        })
        .addCase(actions.updateName, (state, { payload }) => {
            state.name = payload;
        })
        .addCase(actions.updateBrand, (state, { payload }) => {
            state.brand = payload;
        })
        .addCase(actions.updateDescription, (state, { payload }) => {
            state.description = payload;
        })
        .addCase(actions.updateType, (state, { payload }) => {
            state.type = payload;
        })
        .addCase(actions.fetchRecipeNew, (state) => {
            state.isLoaded = true;
            state.errorMessage = null;
            state.editMode = true;
            state.isCreated = false;
        })
        .addCase(actions.fetchRecipe.pending, (state, { meta: { arg: recipeId } }) => {
            state.id = recipeId;
            state.isLoading = true;
            state.isLoaded = false;
            state.errorMessage = null;
            state.editMode = false;
        })
        .addCase(actions.fetchRecipe.fulfilled, (state, { payload: recipe }) => {
            state.isLoading = false;
            state.isLoaded = true;
            state.errorMessage = null;

            state.id = recipe.id;
            state.name = recipe.name;
            state.brand = recipe.brand;
            state.description = recipe.description;
            state.type = recipe.type;

            state.isRecipe = recipe.is_recipe;

            state.density = recipe.density;
            state.densityInput = String(recipe.density);

            state.servingSize = recipe.serving_size;
            state.servingSizeInput = String(recipe.serving_size);

            state.nutrients = recipe.nutrients;
            state.customUnits = convertCustomUnitsIntoInputs(recipe.custom_units);

            state.nutrientsByServing = recipe.nutrients;
            state.nutrientsByServingInputs = convertNutrientValuesIntoInputs(recipe.nutrients);

            const recipeIngredients = convertIngredients(recipe.ingredients);
            const recipeInstructions = convertInstructions(recipe.instructions, recipe.ingredients);

            state.ingredients = recipeIngredients;
            state.instructions = recipeInstructions;
        })
        .addCase(actions.fetchRecipe.rejected, (state, { payload: errorStatus }) => {
            state.isLoading = false;
            state.isLoaded = true;
            state.errorMessage = getErrorMessageFromStatus(errorStatus);
        })
        .addCase(actions.updateNutrient, (state, { payload: { key, value } }) => {
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
        .addCase(actions.addCustomUnit, (state, { payload: customUnit }) => {
            // IMPROVE: Custom Unit name is empty or already exist, maybe show some kind of feedback?
            if (state.customUnits.some((cu) => cu.name === customUnit.name) || !customUnit.name.isNotEmpty()) {
                return;
            }

            state.customUnits = [
                ...state.customUnits,
                {
                    ...customUnit,
                    amount: units.convertToMetric(
                        Number(customUnit.amountInput),
                        customUnit.unit,
                        state.customUnits,
                        state.density,
                    ),
                    food_id: state.id,
                },
            ];
        })
        .addCase(actions.updateCustomUnit, (state, { payload: { index, customUnit } }) => {
            state.customUnits[index] = {
                ...customUnit,
                amount: units.convertToMetric(
                    Number(customUnit.amountInput),
                    customUnit.unit,
                    state.customUnits,
                    state.density,
                ),
            };
        })
        .addCase(actions.removeCustomUnit, (state, { payload: customUnitIndex }) => {
            state.customUnits = state.customUnits.filter((_customUnit, index) => index !== customUnitIndex);
        })
        .addCase(actions.updateDensityAmount, (state, { payload: densityInput }) => {
            const density = units.convertDensityToMetric(
                Number(densityInput), state.densityWeightUnit, state.densityVolumeUnit,
            );

            // FIXME: Recalculate all volume related amounts?

            state.density = density;
            state.densityInput = densityInput;
        })
        .addCase(actions.updateDensityVolumeUnit, (state, { payload: densityVolumeUnit }) => {
            const density = units.convertDensityFromMetric(state.density, state.densityWeightUnit, densityVolumeUnit);
            const densityRounded = roundToDecimal(density, DecimalPlaces.Four);

            state.densityInput = String(densityRounded);
            state.densityVolumeUnit = densityVolumeUnit;

        })
        .addCase(actions.updateDensityWeightUnit, (state, { payload: densityWeightUnit }) => {
            const density = units.convertDensityFromMetric(state.density, densityWeightUnit, state.densityVolumeUnit);
            const densityRounded = roundToDecimal(density, DecimalPlaces.Four);

            state.densityInput = String(densityRounded);
            state.densityWeightUnit = densityWeightUnit;
        })
        .addCase(actions.updateServingSizeAmount, (state, { payload: servingSizeInput }) => {
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
        .addCase(actions.updateServingSizeUnit, (state, { payload: servingSizeUnit }) => {
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
        .addCase(actions.createRecipe.pending, (state) => {
            state.isLoading = true;
            state.isLoaded = false;
        })
        .addCase(actions.createRecipe.fulfilled, (state, { payload: recipe }) => {
            state.isLoading = false;
            state.isLoaded = true;
            state.editMode = false;
            state.id = recipe.id;
            state.isCreated = true;
        })
        .addCase(actions.createRecipe.rejected, (state, { payload: errorStatus }) => {
            state.isLoading = false;
            state.isLoaded = true;
            state.errorMessage = getErrorMessageFromStatus(errorStatus);
        })
        .addCase(actions.updateRecipe.pending, (state) => {
            state.isLoading = true;
            state.isLoaded = false;
        })
        .addCase(actions.updateRecipe.fulfilled, (state, { payload: recipe }) => {
            state.isLoading = false;
            state.isLoaded = true;
            state.editMode = false;
            state.id = recipe.id;
            state.isCreated = true;
        })
        .addCase(actions.updateRecipe.rejected, (state, { payload: errorStatus }) => {
            state.isLoading = false;
            state.isLoaded = true;
            state.errorMessage = getErrorMessageFromStatus(errorStatus);
        })
    // -----------------------------------------------------------------------------------------------------------------
    // Instructions
    // -----------------------------------------------------------------------------------------------------------------
        .addCase(actions.removeInstruction, (state, action) => {
            const { payload: instructionIndex } = action;
            state.instructions = state.instructions.filter((_instruction, index) => (index !== instructionIndex));
        })
        .addCase(actions.removeInstructionIngredient, (state, action) => {
            const { instructionIndex, ingredientSlotNumber } = action.payload;
            const instruction = state.instructions[instructionIndex];
            state.instructions[instructionIndex] = {
                ...instruction,
                ingredients: instruction.ingredients.filter((ingredient) => (ingredient.ingredientSlotNumber !== ingredientSlotNumber)),
            };
        })
        .addCase(actions.toggleInstructionOpen, (state, action) => {
            const { payload: instructionIndex } = action;
            const instruction = state.instructions[instructionIndex];
            state.instructions[instructionIndex] = { ...instruction, isOpen: !instruction.isOpen };
        })
        .addCase(actions.toggleInstructionMark, (state, action) => {
            const { payload: instructionIndex } = action;
            const instruction = state.instructions[instructionIndex];

            state.instructions[instructionIndex] = {
                ...instruction,
                isMarked: !instruction.isMarked,
                isOpen: ( instruction.isMarked ? instruction.isOpen : false ),
            };
        })
        .addCase(actions.updateInstructionIngredientAmount, (state, action) => {
            const { instructionIndex, ingredientSlotNumber, inputValue } = action.payload;
            const instruction = state.instructions[instructionIndex];

            state.instructions[instructionIndex].ingredients = instruction.ingredients.map((ingredient) => (
                (ingredient.ingredientSlotNumber === ingredientSlotNumber)
                    ? {
                        ...ingredient,
                        inputValue,
                        // TODO: Limit to what you have in ingredients, or just add validation message?
                        ingredientAmount: units.convertToMetric(
                            Number(inputValue), ingredient.ingredientUnit, [], ingredient.ingredientDensity,
                        ),
                    }
                    : ingredient
            ));
        })
        .addCase(actions.updateInstructionIngredientUnit, (state, action) => {
            const { instructionIndex, ingredientSlotNumber, unit } = action.payload;
            const instruction = state.instructions[instructionIndex];

            state.instructions[instructionIndex].ingredients = instruction.ingredients.map((ingredient) => {

                if (ingredient.ingredientSlotNumber === ingredientSlotNumber) {

                    if (state.editMode) {

                        // TODO: Limit to what you have in ingredients, or just add validation message?

                        const amount = units.convertToMetric(
                            Number(ingredient.ingredientAmountInput), unit, [], ingredient.ingredientDensity,
                        );

                        return {
                            ...ingredient,
                            ingredientUnit: unit,
                            ingredientAmount: amount,
                        };
                    }
                    else {

                        const amountInCurrentUnits = units.convertFromMetric(
                            ingredient.ingredientAmount, unit, [], ingredient.ingredientDensity,
                        );
                        const amountInput = roundToDecimal(amountInCurrentUnits, DecimalPlaces.Two);

                        return {
                            ...ingredient,
                            ingredientUnit: unit,
                            ingredientAmountInput: String(amountInput),
                        };
                    }
                }
                else {
                    return ingredient;
                }
            });
        })
        .addCase(actions.createInstructionIngredient, (state, action) => {
            const { instructionIndex, ingredientSlotNumber } = action.payload;
            const instruction = state.instructions[instructionIndex];

            const ingredient = unwrap(
                state.ingredients.find(_ingredient => _ingredient.slot_number === ingredientSlotNumber),
                `Ingredient with id = ${ingredientSlotNumber} is not found`,
            );

            state.instructions[instructionIndex] = {
                ...instruction,
                ingredients: [
                    ...instruction.ingredients,
                    {
                        ingredientName: ingredient.name,
                        ingredientSlotNumber: ingredientSlotNumber,
                        ingredientAmount: ingredient.amount,
                        ingredientAmountInput: ingredient.amountInput,
                        ingredientUnit: ingredient.unit,
                    } as types.RecipeInstructionIngredient,
                ],
            };
        })
        .addCase(actions.updateInstructionStepNumber, (state, action) => {
            const { instructionIndex, stepNumber } = action.payload;

            state.instructions = state.instructions
                .map((instruction, iInstruction) => (
                    (instructionIndex === iInstruction)
                        ? { ...instruction, stepNumber }
                        : instruction
                ))
                .sort(sortBy("stepNumber"));
        })
        .addCase(actions.updateInstructionDescription, (state, action) => {
            const { instructionIndex, name } = action.payload;
            state.instructions[instructionIndex].description = name;
        })
        .addCase(actions.updateInstructionTemperatureCount, (state, action) => {
            const { instructionIndex, inputValue } = action.payload;
            const instruction = state.instructions[instructionIndex];

            const count = (
                instruction.temperatureUnit === units.TemperatureUnit.F
                    ? units.convertFahrenheitToCelsius(Number(inputValue))
                    : Number(inputValue)
            );

            state.instructions[instructionIndex] = {
                ...instruction,
                temperatureValue: count,
                temperatureValueInput: inputValue,
            };
        })
        .addCase(actions.updateInstructionTemperatureUnit, (state, action) => {
            const { instructionIndex, unit } = action.payload;
            const instruction = state.instructions[instructionIndex];

            if (state.editMode) {

                state.instructions[instructionIndex] = {
                    ...instruction,
                    temperatureValue: (
                        unit === units.TemperatureUnit.F
                            ? units.convertFahrenheitToCelsius(Number(instruction.temperatureValueInput))
                            : Number(instruction.temperatureValueInput)
                    ),
                    temperatureUnit: unit,
                };
            }
            // NOTE: Shouldn't be possible to trigger this change with `isNone(temperatureValue) === true`
            else if (isSome(instruction.temperatureValue)) {

                const countInput = (
                    unit === units.TemperatureUnit.F
                        ? units.convertCelsiusToFahrenheit(instruction.temperatureValue)
                        : instruction.temperatureValue
                );

                state.instructions[instructionIndex] = {
                    ...instruction,
                    temperatureValueInput: String(roundToDecimal(countInput, DecimalPlaces.Two)),
                    temperatureUnit: unit,
                };
            }
        })
        .addCase(actions.updateInstructionTimeCount, (state, action) => {
            const { instructionIndex, inputValue } = action.payload;
            const instruction = state.instructions[instructionIndex];

            const count = units.convertToSeconds(Number(inputValue), instruction.durationUnit);

            state.instructions[instructionIndex] = {
                ...instruction,
                durationValue: count,
                durationValueInput: inputValue,
            };
        })
        .addCase(actions.updateInstructionTimeUnit, (state, action) => {
            const { instructionIndex, unit } = action.payload;
            const instruction = state.instructions[instructionIndex];

            if (state.editMode) {

                state.instructions[instructionIndex] = {
                    ...instruction,
                    durationValue: units.convertToSeconds(Number(instruction.durationValueInput), unit),
                    durationUnit: unit,
                };
            }
            // NOTE: Shouldn't be possible to trigger this change with `isNone(durationValue) === true`
            else if (isSome(instruction.durationValue)) {

                const countInput = units.convertFromSeconds(instruction.durationValue, unit);

                state.instructions[instructionIndex] = {
                    ...instruction,
                    durationValueInput: String(roundToDecimal(countInput, DecimalPlaces.Two)),
                    durationUnit: unit,
                };
            }
        })
        .addCase(actions.createInstruction, (state, { payload: instruction }) => {
            state.instructions.push({
                id: instruction.id,

                isOpen: false,
                isMarked: false,

                stepNumber: getNewStepNumber(state.instructions.last()?.stepNumber),
                description: instruction.description,

                durationValue: instruction.durationValue,
                durationUnit: instruction.durationUnit,

                temperatureValue: instruction.temperatureValue,
                temperatureUnit: instruction.temperatureUnit,

                durationValueInput: instruction.durationValueInput,
                temperatureValueInput: instruction.temperatureValueInput,

                ingredients: [],
            });
        })
    // -----------------------------------------------------------------------------------------------------------------
    // Ingredients
    // -----------------------------------------------------------------------------------------------------------------
        .addCase(actions.removeIngredient, (state, action) => {
            const { payload: slot_number } = action;

            state.ingredients = state.ingredients.filter((ingredient) => ingredient.slot_number !== slot_number);
        })
        .addCase(actions.removeIngredientAlternative, (state, action) => {
            const { payload: id } = action;

            state.ingredients = state.ingredients.filter((ingredient) => ingredient.id !== id);
        })
        .addCase(actions.replaceIngredientWithAlternative, (state, action) => {
            const { slotNumber, id } = action.payload;

            state.ingredients = state.ingredients.map((ingredient) => (
                ingredient.slot_number === slotNumber
                    ? (
                        ingredient.id === id
                            ? { ...ingredient, is_alternative: false, isOpen: false, alternativeNutrients: {} }
                            : { ...ingredient, is_alternative: true, isOpen: false, alternativeNutrients: {} }
                    )
                    : ingredient
            ));
        })
        .addCase(actions.toggleIngredientOpen, (state, action) => {
            const { payload: id } = action;

            state.ingredients = state.ingredients.map((ingredient) => ({
                ...ingredient,
                isOpen: (ingredient.id === id) ? !ingredient.isOpen : ingredient.isOpen,
            }));
        })
        .addCase(actions.toggleIngredientMark, (state, action) => {
            const { payload: id } = action;

            state.ingredients = state.ingredients.map((ingredient) => ({
                ...ingredient,
                isMarked: (ingredient.id === id) ? !ingredient.isMarked : ingredient.isMarked,
            }));
        })
        .addCase(actions.updateIngredientFoodAmount, (state, action) => {
            const { id, inputValue } = action.payload;

            state.ingredients = state.ingredients.map((ingredient) => (
                (ingredient.id === id)
                    ? {
                        ...ingredient,
                        amountInput: inputValue,
                        amount: units.convertToMetric(Number(inputValue), ingredient.unit, [], ingredient.density),
                    }
                    : ingredient
            ));
        })
        .addCase(actions.updateIngredientFoodUnit, (state, action) => {
            const { id, unit } = action.payload;

            state.ingredients = state.ingredients.map((ingredient) => {
                if (ingredient.id === id) {

                    if (state.editMode) {

                        return {
                            ...ingredient,
                            unit,
                            amount: units.convertToMetric(Number(ingredient.amountInput), unit, [], ingredient.density),
                        };
                    }
                    else {

                        const amountInCurrentUnits = units.convertFromMetric(ingredient.amount, unit, [], ingredient.density);

                        return {
                            ...ingredient,
                            unit,
                            amountInput: String(roundToDecimal(amountInCurrentUnits, DecimalPlaces.Two)),
                        };
                    }
                }
                else {
                    return ingredient;
                }
            });
        })
        .addCase(actions.updateAltNutrients, (state, action) => {
            const { slotNumber, nutrients } = action.payload;

            state.ingredients = state.ingredients.map((ingredient) => (
                (!ingredient.is_alternative && ingredient.slot_number === slotNumber)
                    ? {
                        ...ingredient,
                        alternativeNutrients: nutrients,
                    }
                    : ingredient
            ));
        })
        .addCase(actions.calculateNutrientsAndServingSize, (state) => {

            const servingSize = getRecipeServingSizeFromIngredients(state.ingredients);
            const servingSizeInCurrentUnits = units.convertFromMetric(
                servingSize, state.servingSizeUnit, state.customUnits, state.density,
            );
            const servingSizeInput = roundToDecimal(servingSizeInCurrentUnits, DecimalPlaces.Four);
            const nutrientsByServing = getRecipeNutrientsFromIngredients(state.ingredients);

            state.nutrients = convertNutrients(servingSize, false, nutrientsByServing);
            state.servingSize = servingSize;
            state.servingSizeInput = String(servingSizeInput);
            state.nutrientsByServing = nutrientsByServing;
            state.nutrientsByServingInputs = convertNutrientValuesIntoInputs(nutrientsByServing);
        })
        .addCase(actions.addIngredient.pending, (state) => {
            state.isLoadedIngredients = false;
        })
        .addCase(actions.addIngredient.fulfilled, (state, action) => {
            const { payload: ingredient } = action;

            state.isLoadedIngredients = true;
            state.ingredients = [
                ...state.ingredients,
                {
                    ...ingredient,

                    isOpen: true,
                    isMarked: false,

                    id: getTemporaryId(),

                    food_id: ingredient.food_id,

                    amount: 100,
                    amountInput: "100",
                    unit: units.WeightUnit.g,

                    alternativeNutrients: {},
                },
            ];
        })
        .addCase(actions.addIngredient.rejected, (state, { payload: errorStatus }) => {
            state.isLoadedIngredients = true;
            state.errorMessage = getErrorMessageFromStatus(errorStatus);
        });
});

export default reducer;
