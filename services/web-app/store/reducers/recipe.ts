import { createReducer } from "@reduxjs/toolkit";

import { sortBy } from "@common/array";
import { getErrorMessageFromStatus } from "@common/http";
import { DecimalPlaces, roundToDecimal } from "@common/numeric";
import { isSome, unwrap, unwrapOr } from "@common/types";
import type * as typings from "@common/typings";
import * as units from "@common/units";
import { getTemporaryId } from "@common/utils";

import * as actions from "../actions/recipe";
import {
    convertCustomUnitsIntoInputs, convertNutrientInputsIntoValues, convertNutrients, convertNutrientValuesIntoInputs,
} from "../helpers/food";
import { getRecipeNutrientsFromIngredients, getRecipeServingSizeFromIngredients } from "../helpers/recipe";
import type * as types from "../types/recipe";


const DEFAULT_SERVING_SIZE: number = 100;

const initialState: types.RecipePageStore = {

    isLoading: false,
    isLoaded: false,
    isLoadedIngredients: true,
    errorMessage: null,

    editMode: true,

    id: -1,
    name: "Name",
    brand: "Brand",
    description: "",
    type: "",

    density: units.DEFAULT_DENSITY,
    densityInput: String(units.DEFAULT_DENSITY),
    densityVolumeUnit: units.DEFAULT_VOLUME_UNIT,
    densityWeightUnit: units.DEFAULT_WEIGHT_UNIT,

    nutrients: {},
    nutrientsByServing: {},
    nutrientsByServingInputs: {},

    customUnits: [],

    servingSize: DEFAULT_SERVING_SIZE,
    servingSizeInput: String(DEFAULT_SERVING_SIZE),
    servingSizeUnit: units.DEFAULT_WEIGHT_UNIT,

    ingredients: [],
    instructions: [],

    isPrivate: false,

    // NOTE: NEW RECIPE

    isCreated: false,
};


function convertIngredients(ingredients: typings.Ingredient[]): types.RecipeIngredient[] {

    return ingredients.map((ingredient) => {

        const amountInCurrentUnits = units.convertFromMetric(ingredient.amount, ingredient.unit, [], ingredient.density);
        const amountInput = roundToDecimal(amountInCurrentUnits, DecimalPlaces.Two);

        return {
            ...ingredient,

            amountInput: String(amountInput),

            isOpen: false,
            isMarked: false,

            alternativeNutrients: {},
        };
    });
}

function convertInstructionIngredient(
    instructionIngredient: typings.InstructionIngredient,
    ingredients: typings.Ingredient[],
): types.RecipeInstructionIngredient {

    const MAX_INGREDIENT_PERCENT = 1;

    const ingredientSlotNumber = unwrap(
        instructionIngredient.ingredient_slot_number,
        "instructionIngredient.ingredient_slot_number",
    );
    const ingredient = unwrap(
        ingredients.find((i) => i.slot_number === ingredientSlotNumber),
        "ingredients.find((i) => i.slot_number === ingredientSlotNumber)",
    );

    const ingredientAmount = ingredient.amount * unwrapOr(instructionIngredient.ingredient_percentage, MAX_INGREDIENT_PERCENT);

    const amountInCurrentUnits = units.convertFromMetric(ingredientAmount, ingredient.unit, [], ingredient.density);
    const ingredientAmountInput = roundToDecimal(amountInCurrentUnits, DecimalPlaces.Two);

    return {
        ingredientSlotNumber: ingredientSlotNumber,

        ingredientAmount: ingredientAmount,
        ingredientAmountInput: String(ingredientAmountInput),

        ingredientName: ingredient.name,
        ingredientUnit: ingredient.unit,

        ingredientDensity: ingredient.density,
    };
}

function convertInstructions(instructions: typings.Instruction[], ingredients: typings.Ingredient[]): types.RecipeInstruction[] {

    return instructions.map((instruction) => ({
        id: instruction.id,

        stepNumber: instruction.step_number,
        description: instruction.description,

        durationValue: instruction.duration_value,
        durationUnit: instruction.duration_unit,
        durationValueInput: (
            instruction.duration_value
                ? String( roundToDecimal(
                    units.convertFromSeconds(instruction.duration_value, instruction.duration_unit),
                    DecimalPlaces.Two,
                ) )
                : ""
        ),

        temperatureValue: instruction.temperature_value,
        temperatureUnit: instruction.temperature_unit,
        temperatureValueInput: (
            instruction.temperature_value
                ? String( roundToDecimal(
                    instruction.temperature_unit === units.TemperatureUnit.F
                        ? units.convertCelsiusToFahrenheit(instruction.temperature_value)
                        : instruction.temperature_value,
                    DecimalPlaces.Two,
                ) )
                : ""
        ),

        isOpen: true,
        isMarked: false,

        ingredients: instruction.ingredients.map((step) => convertInstructionIngredient(step, ingredients)),
    }));
}

function getNewStepNumber(last: Option<number>): number {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    return (last || -1) + 1;
}


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
        .addCase(actions.addCustomUnit, (state, action) => {
            const { payload: customUnit } = action;

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
                    product_id: state.id,
                },
            ];
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
        .addCase(actions.fetchRecipeNew, (state) => {
            state.isLoaded = true;
            state.errorMessage = null;
            state.editMode = true;
            state.isCreated = false;
        })
        .addCase(actions.fetchRecipe.pending, (state, action) => {
            const { arg: recipeId } = action.meta;

            state.id = recipeId;
            state.isLoading = true;
            state.isLoaded = false;
            state.errorMessage = null;
            state.editMode = false;
        })
        .addCase(actions.fetchRecipe.fulfilled, (state, action) => {
            const { payload: recipe } = action;

            const recipeIngredients = convertIngredients(recipe.ingredients);
            const recipeInstructions = convertInstructions(recipe.instructions, recipe.ingredients);

            state.isLoading = false;
            state.isLoaded = true;
            state.errorMessage = null;

            state.id = recipe.id;
            state.name = recipe.name;
            state.brand = recipe.brand;
            state.description = recipe.description;
            state.type = recipe.type;

            state.density = recipe.density;
            state.densityInput = String(recipe.density);

            state.servingSize = recipe.serving_size;
            state.servingSizeInput = String(recipe.serving_size);

            state.nutrients = recipe.nutrients;
            state.customUnits = convertCustomUnitsIntoInputs(recipe.custom_units);

            state.nutrientsByServing = recipe.nutrients;
            state.nutrientsByServingInputs = convertNutrientValuesIntoInputs(recipe.nutrients);

            state.ingredients = recipeIngredients;
            state.instructions = recipeInstructions;
        })
        .addCase(actions.fetchRecipe.rejected, (state, { payload: errorStatus }) => {
            state.isLoading = false;
            state.isLoaded = true;
            state.errorMessage = getErrorMessageFromStatus(errorStatus);
        })
        .addCase(actions.createRecipe.pending, (state) => {
            state.isLoading = true;
            state.isLoaded = false;
        })
        .addCase(actions.createRecipe.fulfilled, (state, action) => {
            const { payload: recipe } = action;

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
        .addCase(actions.updateRecipe.fulfilled, (state, action) => {
            const { payload: recipe } = action;

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
        .addCase(actions.updateIngredientProductAmount, (state, action) => {
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
        .addCase(actions.updateIngredientProductUnit, (state, action) => {
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

                    product_id: ingredient.product_id,

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
