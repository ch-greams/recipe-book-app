import { createReducer } from "@reduxjs/toolkit";

import { sortBy } from "@common/array";
import { getErrorMessageFromStatus } from "@common/http";
import { DecimalPlaces, roundToDecimal } from "@common/numeric";
import { getKeys, getValues } from "@common/object";
import { isSome, unwrap, unwrapOr } from "@common/types";
import type * as typings from "@common/typings";
import * as units from "@common/units";
import { convertNutrients, convertNutrientValuesIntoInputs, getTemporaryId } from "@common/utils";
import { convertCustomUnitsIntoInputs } from "@store/helpers/food";

import * as actions from "../actions/recipe";
import {
    getIngredientProduct, getRecipeIngredientProduct,
    getRecipeNutrientsFromIngredients, getRecipeServingSizeFromIngredients,
} from "../helpers/recipe";
import * as types from "../types/recipe";


const DEFAULT_DIRECTION: types.RecipeDirection = {
    id: -1,

    isOpen: false,
    isMarked: false,

    stepNumber: 0,
    name: "",

    durationValue: 0,
    durationUnit: units.DEFAULT_TIME_UNIT,

    temperatureValue: 0,
    temperatureUnit: units.DEFAULT_TEMPERATURE_UNIT,

    durationValueInput: "",
    temperatureValueInput: "",

    steps: [],
};

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

    newDirection: DEFAULT_DIRECTION,
    directions: [],

    isPrivate: false,

    // NOTE: NEW RECIPE

    isCreated: false,
};


function convertIngredients(ingredients: typings.Ingredient[]): types.RecipeIngredient[] {

    return ingredients.map((ingredient) => ({
        ...ingredient,

        isOpen: false,
        isMarked: false,
        products: getValues(ingredient.products).reduce((acc, product) => {

            const amountInCurrentUnits = units.convertFromMetric(
                product.amount, product.unit, [], product.density,
            );
            const amountInput = roundToDecimal(amountInCurrentUnits, DecimalPlaces.Two);

            return {
                ...acc,
                [product.product_id]: {
                    ...product,
                    amountInput: String(amountInput),
                },
            };
        }, {}),
        alternativeNutrients: {},
    }));
}

function getProductFromIngredients(ingredient_id: number, ingredients: typings.Ingredient[]): typings.IngredientProduct {

    const ingredient = unwrap(
        ingredients.find((i) => i.id === ingredient_id),
        "ingredients.find((i) => i.id === ingredient_id)",
    );

    return getIngredientProduct(ingredient);
}

function convertDirectionPart(
    directionPart: typings.DirectionPart,
    ingredients: typings.Ingredient[],
): types.RecipeDirectionPartComment | types.RecipeDirectionPartIngredient {

    if (directionPart.direction_part_type === types.DirectionPartType.Ingredient) {

        const MAX_INGREDIENT_PERCENT = 1;

        const ingredientId = unwrap(directionPart.ingredient_id, "directionPart.ingredient_id");
        const product = getProductFromIngredients(ingredientId, ingredients);

        const ingredientAmount = product.amount * unwrapOr(directionPart.ingredient_amount, MAX_INGREDIENT_PERCENT);

        const amountInCurrentUnits = units.convertFromMetric(ingredientAmount, product.unit, [], product.density);
        const ingredientAmountInput = roundToDecimal(amountInCurrentUnits, DecimalPlaces.Two);

        return {
            id: directionPart.step_number,
            stepNumber: directionPart.step_number,
            type: directionPart.direction_part_type,
            ingredientId: ingredientId,

            ingredientAmount: ingredientAmount,
            ingredientAmountInput: String(ingredientAmountInput),

            ingredientName: product.name,
            ingredientUnit: product.unit,

            ingredientDensity: product.density,

            isMarked: false,
        };
    }
    else {
        return {
            id: directionPart.step_number,
            stepNumber: directionPart.step_number,
            type: directionPart.direction_part_type,
            commentText: unwrapOr(directionPart.comment_text, directionPart.direction_part_type),
        };
    }
}

function convertDirections(directions: typings.Direction[], ingredients: typings.Ingredient[]): types.RecipeDirection[] {

    return directions.map((direction) => {

        const durationValueInput = (
            direction.duration_value
                ? String( roundToDecimal(
                    units.convertFromSeconds(direction.duration_value, direction.duration_unit),
                    DecimalPlaces.Two,
                ) )
                : ""
        );

        const temperatureValueInput = (
            direction.temperature_value
                ? String( roundToDecimal(
                    direction.temperature_unit === units.TemperatureUnit.F
                        ? units.convertCelsiusToFahrenheit(direction.temperature_value)
                        : direction.temperature_value,
                    DecimalPlaces.Two,
                ) )
                : ""
        );

        return {
            id: direction.id,

            stepNumber: direction.step_number,
            name: direction.name,

            durationValue: direction.duration_value,
            durationUnit: direction.duration_unit,
            durationValueInput: durationValueInput,

            temperatureValue: direction.temperature_value,
            temperatureUnit: direction.temperature_unit,
            temperatureValueInput: temperatureValueInput,

            isOpen: true,
            isMarked: false,

            steps: direction.steps.map((step) => convertDirectionPart(step, ingredients)),
        };
    });
}

function isDirectionPartIngredient(
    directionPart: types.RecipeDirectionPartComment | types.RecipeDirectionPartIngredient,
): directionPart is types.RecipeDirectionPartIngredient {
    return directionPart.type === types.DirectionPartType.Ingredient;
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
    // -----------------------------------------------------------------------------------------------------------------
    // Directions
    // -----------------------------------------------------------------------------------------------------------------
        .addCase(actions.removeDirection, (state, action) => {
            const { payload: directionIndex } = action;
            state.directions = state.directions.filter((_direction, index) => (index !== directionIndex));
        })
        .addCase(actions.removeDirectionPart, (state, action) => {
            const { directionIndex, directionPartId } = action.payload;
            const direction = state.directions[directionIndex];
            state.directions[directionIndex] = {
                ...direction,
                steps: direction.steps.filter((directionPart) => (directionPart.id !== directionPartId)),
            };
        })
        .addCase(actions.toggleDirectionOpen, (state, action) => {
            const { payload: directionIndex } = action;
            const direction = state.directions[directionIndex];
            state.directions[directionIndex] = { ...direction, isOpen: !direction.isOpen };
        })
        .addCase(actions.toggleDirectionMark, (state, action) => {
            const { payload: directionIndex } = action;
            const direction = state.directions[directionIndex];

            state.directions[directionIndex] = {
                ...direction,
                isMarked: !direction.isMarked,
                isOpen: ( direction.isMarked ? direction.isOpen : false ),
                steps: (
                    direction.isMarked
                        ? direction.steps
                        : direction.steps.map((directionPart) => (
                            (directionPart.type === types.DirectionPartType.Ingredient)
                                ? { ...directionPart, isMarked: true }
                                : directionPart
                        ))
                ),
            };
        })
        .addCase(actions.toggleDirectionPartMark, (state, action) => {
            const { directionIndex, directionPartId } = action.payload;
            const direction = state.directions[directionIndex];

            const steps = direction.steps.map((directionPart) => (
                (directionPart.type === types.DirectionPartType.Ingredient) && (directionPartId === directionPart.id)
                    ? { ...directionPart, isMarked: !(directionPart as types.RecipeDirectionPartIngredient).isMarked }
                    : directionPart
            ));

            const areAllStepsMarked = steps.every((step) => (
                (step.type !== types.DirectionPartType.Ingredient) || (step as types.RecipeDirectionPartIngredient).isMarked
            ));

            state.directions[directionIndex] = {
                ...direction,
                steps: steps,
                isMarked: areAllStepsMarked,
                isOpen: ( areAllStepsMarked ? false : direction.isOpen ),
            };
        })
        .addCase(actions.updateDirectionPartStepNumber, (state, action) => {
            const { directionIndex, directionPartId, stepNumber } = action.payload;
            const direction = state.directions[directionIndex];

            state.directions[directionIndex] = {
                ...direction,
                steps: direction.steps
                    .map((directionPart) => (
                        (directionPart.id === directionPartId)
                            ? { ...directionPart, stepNumber }
                            : directionPart
                    ))
                    .sort(sortBy("stepNumber")),
            };
        })
        .addCase(actions.updateDirectionPartNote, (state, action) => {
            const { directionIndex, directionPartId, note } = action.payload;
            const direction = state.directions[directionIndex];

            state.directions[directionIndex] = {
                ...direction,
                steps: direction.steps.map((directionPart) =>
                    (directionPart.type !== types.DirectionPartType.Ingredient) && (directionPartId === directionPart.id)
                        ? { ...directionPart, commentText: note }
                        : directionPart,
                ),
            };
        })
        .addCase(actions.updateDirectionPartIngredientAmount, (state, action) => {
            const { directionIndex, directionPartId, inputValue } = action.payload;
            const direction = state.directions[directionIndex];

            state.directions[directionIndex].steps = direction.steps.map((directionPart) => {

                if (isDirectionPartIngredient(directionPart) && (directionPart.id === directionPartId)) {

                    // TODO: Limit to what you have in ingredients, or just add validation message?
                    const ingredientAmount = units.convertToMetric(
                        Number(inputValue), directionPart.ingredientUnit, [], directionPart.ingredientDensity,
                    );

                    return { ...directionPart, inputValue, ingredientAmount };
                }
                else {
                    return directionPart;
                }
            });
        })
        .addCase(actions.updateDirectionPartIngredientUnit, (state, action) => {
            const { directionIndex, directionPartId, unit } = action.payload;
            const direction = state.directions[directionIndex];

            state.directions[directionIndex].steps = direction.steps.map((directionPart) => {

                if (isDirectionPartIngredient(directionPart) && (directionPart.id === directionPartId)) {

                    if (state.editMode) {

                        // TODO: Limit to what you have in ingredients, or just add validation message?

                        const amount = units.convertToMetric(
                            Number(directionPart.ingredientAmountInput), unit, [], directionPart.ingredientDensity,
                        );

                        return {
                            ...directionPart,
                            ingredientUnit: unit,
                            ingredientAmount: amount,
                        };
                    }
                    else {

                        const amountInCurrentUnits = units.convertFromMetric(
                            directionPart.ingredientAmount, unit, [], directionPart.ingredientDensity,
                        );
                        const amountInput = roundToDecimal(amountInCurrentUnits, DecimalPlaces.Two);

                        return {
                            ...directionPart,
                            ingredientUnit: unit,
                            ingredientAmountInput: String(amountInput),
                        };
                    }
                }
                else {
                    return directionPart;
                }
            });
        })
        .addCase(actions.createDirectionPartIngredient, (state, action) => {
            const { directionIndex, ingredientId } = action.payload;
            const direction = state.directions[directionIndex];

            const ingredient = unwrap(
                state.ingredients.find(_ingredient => _ingredient.id === ingredientId),
                `Ingredient with id = ${ingredientId} is not found`,
            );

            const ingredientProduct = getRecipeIngredientProduct(ingredient);

            state.directions[directionIndex] = {
                ...direction,
                steps: [
                    ...direction.steps,
                    {
                        id: getTemporaryId(),
                        stepNumber: getNewStepNumber(direction.steps.last()?.stepNumber),
                        type: types.DirectionPartType.Ingredient,
                        ingredientName: ingredientProduct.name,
                        ingredientId: ingredientId,
                        isMarked: false,
                        ingredientAmount: ingredientProduct.amount,
                        ingredientAmountInput: ingredientProduct.amountInput,
                        ingredientUnit: ingredientProduct.unit,
                    } as types.RecipeDirectionPartIngredient,
                ],
            };
        })
        .addCase(actions.createDirectionPartComment, (state, action) => {
            const { directionIndex, type } = action.payload;
            const direction = state.directions[directionIndex];

            state.directions[directionIndex] = {
                ...direction,
                steps: [
                    ...direction.steps,
                    {
                        id: getTemporaryId(),
                        stepNumber: getNewStepNumber(direction.steps.last()?.stepNumber),
                        type: type,
                        commentText: type,
                    } as types.RecipeDirectionPartComment,
                ],
            };
        })
        .addCase(actions.updateDirectionStepNumber, (state, action) => {
            const { directionIndex, stepNumber } = action.payload;

            state.directions = state.directions
                .map((direction, iDirection) => (
                    (directionIndex === iDirection)
                        ? { ...direction, stepNumber }
                        : direction
                ))
                .sort(sortBy("stepNumber"));
        })
        .addCase(actions.updateDirectionName, (state, action) => {
            const { directionIndex, name } = action.payload;
            state.directions[directionIndex].name = name;
        })
        .addCase(actions.updateDirectionTemperatureCount, (state, action) => {
            const { directionIndex, inputValue } = action.payload;
            const direction = state.directions[directionIndex];

            const count = (
                direction.temperatureUnit === units.TemperatureUnit.F
                    ? units.convertFahrenheitToCelsius(Number(inputValue))
                    : Number(inputValue)
            );

            state.directions[directionIndex] = {
                ...direction,
                temperatureValue: count,
                temperatureValueInput: inputValue,
            };
        })
        .addCase(actions.updateDirectionTemperatureUnit, (state, action) => {
            const { directionIndex, unit } = action.payload;
            const direction = state.directions[directionIndex];

            if (state.editMode) {

                state.directions[directionIndex] = {
                    ...direction,
                    temperatureValue: (
                        unit === units.TemperatureUnit.F
                            ? units.convertFahrenheitToCelsius(Number(direction.temperatureValueInput))
                            : Number(direction.temperatureValueInput)
                    ),
                    temperatureUnit: unit,
                };
            }
            // NOTE: Shouldn't be possible to trigger this change with `isNone(temperatureValue) === true`
            else if (isSome(direction.temperatureValue)) {

                const countInput = (
                    unit === units.TemperatureUnit.F
                        ? units.convertCelsiusToFahrenheit(direction.temperatureValue)
                        : direction.temperatureValue
                );

                state.directions[directionIndex] = {
                    ...direction,
                    temperatureValueInput: String(roundToDecimal(countInput, DecimalPlaces.Two)),
                    temperatureUnit: unit,
                };
            }
        })
        .addCase(actions.updateDirectionTimeCount, (state, action) => {
            const { directionIndex, inputValue } = action.payload;
            const direction = state.directions[directionIndex];

            const count = units.convertToSeconds(Number(inputValue), direction.durationUnit);

            state.directions[directionIndex] = {
                ...direction,
                durationValue: count,
                durationValueInput: inputValue,
            };
        })
        .addCase(actions.updateDirectionTimeUnit, (state, action) => {
            const { directionIndex, unit } = action.payload;
            const direction = state.directions[directionIndex];

            if (state.editMode) {

                state.directions[directionIndex] = {
                    ...direction,
                    durationValue: units.convertToSeconds(Number(direction.durationValueInput), unit),
                    durationUnit: unit,
                };
            }
            // NOTE: Shouldn't be possible to trigger this change with `isNone(durationValue) === true`
            else if (isSome(direction.durationValue)) {

                const countInput = units.convertFromSeconds(direction.durationValue, unit);

                state.directions[directionIndex] = {
                    ...direction,
                    durationValueInput: String(roundToDecimal(countInput, DecimalPlaces.Two)),
                    durationUnit: unit,
                };
            }
        })
        .addCase(actions.updateNewDirectionStepNumber, (state, action) => {
            state.newDirection.stepNumber = action.payload;
        })
        .addCase(actions.updateNewDirectionName, (state, action) => {
            state.newDirection.name = action.payload;
        })
        .addCase(actions.updateNewDirectionTemperatureCount, (state, action) => {
            const { payload: inputValue } = action;

            const count = (
                state.newDirection.temperatureUnit === units.TemperatureUnit.F
                    ? units.convertFahrenheitToCelsius(Number(inputValue))
                    : Number(inputValue)
            );

            state.newDirection.temperatureValueInput = inputValue;
            state.newDirection.temperatureValue = count;
        })
        .addCase(actions.updateNewDirectionTemperatureUnit, (state, action) => {
            const { payload: unit } = action;

            const count = (
                unit === units.TemperatureUnit.F
                    ? units.convertFahrenheitToCelsius(Number(state.newDirection.temperatureValueInput))
                    : Number(state.newDirection.temperatureValueInput)
            );

            state.newDirection.temperatureValue = count;
            state.newDirection.temperatureUnit = unit;
        })
        .addCase(actions.updateNewDirectionTimeCount, (state, action) => {
            const { payload: inputValue } = action;

            const count = units.convertToSeconds(Number(inputValue), state.newDirection.durationUnit);

            state.newDirection.durationValueInput = inputValue;
            state.newDirection.durationValue = count;
        })
        .addCase(actions.updateNewDirectionTimeUnit, (state, action) => {
            const { payload: unit } = action;

            const count = units.convertToSeconds(Number(state.newDirection.durationValueInput), unit);

            state.newDirection.durationValue = count;
            state.newDirection.durationUnit = unit;
        })
        .addCase(actions.createDirection, (state, action) => {
            const { payload: direction } = action;

            state.directions.push({
                id: direction.id,

                isOpen: false,
                isMarked: false,

                stepNumber: getNewStepNumber(state.directions.last()?.stepNumber),
                name: direction.name,

                durationValue: direction.durationValue,
                durationUnit: direction.durationUnit,

                temperatureValue: direction.temperatureValue,
                temperatureUnit: direction.temperatureUnit,

                durationValueInput: direction.durationValueInput,
                temperatureValueInput: direction.temperatureValueInput,

                steps: [],
            });
            state.newDirection = DEFAULT_DIRECTION;
        })
    // -----------------------------------------------------------------------------------------------------------------
    // Ingredients
    // -----------------------------------------------------------------------------------------------------------------
        .addCase(actions.removeIngredient, (state, action) => {
            const { payload: id } = action;

            const ingredients = state.ingredients.filter((ingredient) => ingredient.id !== id);

            const servingSize = getRecipeServingSizeFromIngredients(ingredients);
            const servingSizeInCurrentUnits = units.convertFromMetric(
                servingSize, state.servingSizeUnit, state.customUnits, state.density,
            );
            const servingSizeInput = roundToDecimal(servingSizeInCurrentUnits, DecimalPlaces.Four);
            const nutrientsByServing = getRecipeNutrientsFromIngredients(ingredients);

            state.ingredients = ingredients;
            state.nutrients = convertNutrients(servingSize, false, nutrientsByServing);
            state.servingSize = servingSize;
            state.servingSizeInput = String(servingSizeInput);
            state.nutrientsByServing = nutrientsByServing;
            state.nutrientsByServingInputs = convertNutrientValuesIntoInputs(nutrientsByServing);
        })
        .addCase(actions.removeIngredientProduct, (state, action) => {
            const { parentId, id } = action.payload;

            state.ingredients = state.ingredients.map((ingredient) => (
                ( ingredient.id === parentId )
                    ? {
                        ...ingredient,
                        products: getKeys(ingredient.products, true).reduce((acc, product_id) => (
                            product_id !== id || ingredient.product_id === id
                                ? { ...acc, [product_id]: ingredient.products[product_id] }
                                : acc
                        ), {}),
                    }
                    : ingredient
            ));
        })
        .addCase(actions.replaceIngredientWithAlternative, (state, action) => {
            const { parentId, id } = action.payload;

            const ingredients = state.ingredients.reduce<types.RecipeIngredient[]>((accIngredients, curIngredient) => (
                (curIngredient.id === parentId)
                    ? [
                        ...accIngredients,
                        {
                            ...curIngredient,
                            product_id: id,
                        },
                    ]
                    : [ ...accIngredients, curIngredient ]
            ), []);

            const servingSize = getRecipeServingSizeFromIngredients(ingredients);
            const servingSizeInCurrentUnits = units.convertFromMetric(
                servingSize, state.servingSizeUnit, state.customUnits, state.density,
            );
            const servingSizeInput = roundToDecimal(servingSizeInCurrentUnits, DecimalPlaces.Four);
            const nutrientsByServing = getRecipeNutrientsFromIngredients(ingredients);


            state.ingredients = ingredients;
            state.nutrients = convertNutrients(servingSize, false, nutrientsByServing);
            state.servingSize = servingSize;
            state.servingSizeInput = String(servingSizeInput);
            state.nutrientsByServing = nutrientsByServing;
            state.nutrientsByServingInputs = convertNutrientValuesIntoInputs(nutrientsByServing);
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
            const { parentId, id, inputValue } = action.payload;

            const ingredients = state.ingredients.map((ingredient) => {

                if (ingredient.id === parentId) {

                    const product = unwrap(ingredient.products[id], `ingredient.products[${id}]`);

                    const amount = units.convertToMetric(
                        Number(inputValue), product.unit, [], product.density,
                    );

                    return {
                        ...ingredient,
                        products: {
                            ...ingredient.products,
                            [id]: { ...product, amountInput: inputValue, amount },
                        },
                    };
                }
                else {
                    return ingredient;
                }
            });

            const servingSize = getRecipeServingSizeFromIngredients(ingredients);
            const servingSizeInCurrentUnits = units.convertFromMetric(
                servingSize, state.servingSizeUnit, state.customUnits, state.density,
            );
            const servingSizeInput = roundToDecimal(servingSizeInCurrentUnits, DecimalPlaces.Four);
            const nutrientsByServing = getRecipeNutrientsFromIngredients(ingredients);


            state.ingredients = ingredients;
            state.nutrients = convertNutrients(servingSize, false, nutrientsByServing);
            state.servingSize = servingSize;
            state.servingSizeInput = String(servingSizeInput);
            state.nutrientsByServing = nutrientsByServing;
            state.nutrientsByServingInputs = convertNutrientValuesIntoInputs(nutrientsByServing);
        })
        .addCase(actions.updateIngredientProductUnit, (state, action) => {
            const { parentId, id, unit } = action.payload;

            const ingredients = state.ingredients.map((ingredient) => {
                if (ingredient.id === parentId) {

                    const product = unwrap(ingredient.products[id], `ingredient.products[${id}]`);

                    if (state.editMode) {

                        const amount = units.convertToMetric(
                            Number(product.amountInput), unit, [], product.density,
                        );

                        return {
                            ...ingredient,
                            products: {
                                ...ingredient.products,
                                [id]: { ...product, amount, unit },
                            },
                        };
                    }
                    else {

                        const amountInCurrentUnits = units.convertFromMetric(product.amount, unit, [], product.density);
                        const amountInput = String(roundToDecimal(amountInCurrentUnits, DecimalPlaces.Two));

                        return {
                            ...ingredient,
                            products: {
                                ...ingredient.products,
                                [id]: { ...product, amountInput, unit },
                            },
                        };
                    }
                }
                else {
                    return ingredient;
                }
            });

            const servingSize = getRecipeServingSizeFromIngredients(ingredients);
            const servingSizeInCurrentUnits = units.convertFromMetric(
                servingSize, state.servingSizeUnit, state.customUnits, state.density,
            );
            const servingSizeInput = roundToDecimal(servingSizeInCurrentUnits, DecimalPlaces.Four);
            const nutrientsByServing = getRecipeNutrientsFromIngredients(ingredients);


            state.ingredients = ingredients;
            state.nutrients = convertNutrients(servingSize, false, nutrientsByServing);
            state.servingSize = servingSize;
            state.servingSizeInput = String(servingSizeInput);
            state.nutrientsByServing = nutrientsByServing;
            state.nutrientsByServingInputs = convertNutrientValuesIntoInputs(nutrientsByServing);
        })
        .addCase(actions.updateAltNutrients, (state, action) => {
            const { parentId, id, isSelected } = action.payload;

            state.ingredients = state.ingredients.map((ingredient) => (
                (ingredient.id === parentId)
                    ? {
                        ...ingredient,
                        alternativeNutrients: (
                            isSelected
                                ? unwrap(ingredient.products[id], `ingredient.products["${id}"]`).nutrients
                                : {}
                        ),
                    }
                    : ingredient
            ));
        })

        .addCase(actions.addIngredient.pending, (state) => {
            state.isLoadedIngredients = false;
        })
        .addCase(actions.addIngredient.fulfilled, (state, action) => {
            const { payload: ingredientProduct } = action;

            const ingredients: types.RecipeIngredient[] = [
                ...state.ingredients,
                {
                    isOpen: true,
                    isMarked: false,

                    id: getTemporaryId(),

                    product_id: ingredientProduct.product_id,

                    alternativeNutrients: {},

                    products: {
                        [ingredientProduct.product_id]: {
                            ...ingredientProduct,
                            amount: 100,
                            amountInput: "100",
                            unit: units.WeightUnit.g,
                        },
                    },
                },
            ];

            const servingSize = getRecipeServingSizeFromIngredients(ingredients);
            const servingSizeInCurrentUnits = units.convertFromMetric(
                servingSize, state.servingSizeUnit, state.customUnits, state.density,
            );
            const servingSizeInput = roundToDecimal(servingSizeInCurrentUnits, DecimalPlaces.Four);
            const nutrientsByServing = getRecipeNutrientsFromIngredients(ingredients);


            state.isLoadedIngredients = true;
            state.ingredients = ingredients;
            state.nutrients = convertNutrients(servingSize, false, nutrientsByServing);
            state.servingSize = servingSize;
            state.servingSizeInput = String(servingSizeInput);
            state.nutrientsByServing = nutrientsByServing;
            state.nutrientsByServingInputs = convertNutrientValuesIntoInputs(nutrientsByServing);

        })
        .addCase(actions.addIngredient.rejected, (state, { payload: errorStatus }) => {
            state.isLoadedIngredients = true;
            state.errorMessage = getErrorMessageFromStatus(errorStatus);
        })
        .addCase(actions.addIngredientProduct.pending, (state) => {
            state.isLoadedIngredients = false;
        })
        .addCase(actions.addIngredientProduct.fulfilled, (state, action) => {
            const { id, product } = action.payload;

            state.isLoadedIngredients = true;
            state.ingredients = state.ingredients.map((ingredient) => (
                (ingredient.id === id)
                    ? {
                        ...ingredient,
                        products: {
                            ...ingredient.products,
                            [product.product_id]: {
                                ...product,
                                amount: 100,
                                amountInput: "100",
                                unit: units.WeightUnit.g,
                            },
                        },
                    }
                    : ingredient
            ));
        })
        .addCase(actions.addIngredientProduct.rejected, (state, { payload: errorStatus }) => {
            state.isLoadedIngredients = true;
            state.errorMessage = getErrorMessageFromStatus(errorStatus);
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
            const recipeDirections = convertDirections(recipe.directions, recipe.ingredients);

            const nutrientsByServing = getRecipeNutrientsFromIngredients(recipeIngredients);

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

            state.nutrients = convertNutrients(recipe.serving_size, false, nutrientsByServing);
            state.customUnits = convertCustomUnitsIntoInputs(recipe.custom_units);

            state.nutrientsByServing = nutrientsByServing;
            state.nutrientsByServingInputs = convertNutrientValuesIntoInputs(nutrientsByServing);

            state.ingredients = recipeIngredients;
            state.directions = recipeDirections;
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
        });
});

export default reducer;
