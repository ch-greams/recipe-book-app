import { isSome, unwrap, unwrapOr } from "@common/types";
import type * as typings from "@common/typings";
import * as units from "@common/units";
import Utils, { DecimalPlaces } from "@common/utils";
import type { AppState } from "@store";

import * as types from "./types";


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

    isLoaded: false,
    isLoadedIngredients: true,
    errorMessage: null,

    editMode: true,

    id: -1,
    name: "Name",
    brand: "Brand",
    subtitle: "Subtitle",
    description: "",
    type: "",

    density: units.DEFAULT_DENSITY,
    densityInput: String(units.DEFAULT_DENSITY),
    densityVolumeUnit: units.DEFAULT_VOLUME_UNIT,
    densityWeightUnit: units.DEFAULT_WEIGHT_UNIT,

    nutritionFacts: {},
    nutritionFactsByServing: {},
    nutritionFactsByServingInputs: {},

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


export function extractState(globalState: AppState): types.RecipePageStore {
    return (globalState?.recipePage || initialState);
}


function convertIngredients(ingredients: typings.Ingredient[]): types.RecipeIngredient[] {

    return ingredients.map((ingredient) => ({
        ...ingredient,

        isOpen: false,
        isMarked: false,
        products: Utils.getObjectValues(ingredient.products).reduce((acc, product) => {

            const amountInCurrentUnits = units.convertFromMetric(
                product.amount, product.unit, [], product.density,
            );
            const amountInput = Utils.roundToDecimal(amountInCurrentUnits, DecimalPlaces.Two);

            return {
                ...acc,
                [product.product_id]: {
                    ...product,
                    amountInput: String(amountInput),
                },
            };
        }, {}),
        alternativeNutritionFacts: {},
    }));
}

function getIngredientProduct(ingredient_id: number, ingredients: typings.Ingredient[]): typings.IngredientProduct {

    const ingredient = unwrap(
        ingredients.find((i) => i.id === ingredient_id),
        "ingredients.find((i) => i.id === ingredient_id)",
    );

    return Utils.getIngredientProduct(ingredient);
}

function convertDirectionPart(
    directionPart: typings.DirectionPart,
    ingredients: typings.Ingredient[],
): types.RecipeDirectionPartComment | types.RecipeDirectionPartIngredient {

    if (directionPart.direction_part_type === types.DirectionPartType.Ingredient) {

        const MAX_INGREDIENT_PERCENT = 1;

        const ingredientId = unwrap(directionPart.ingredient_id, "directionPart.ingredient_id");
        const product = getIngredientProduct(ingredientId, ingredients);

        const ingredientAmount = product.amount * unwrapOr(directionPart.ingredient_amount, MAX_INGREDIENT_PERCENT);

        const amountInCurrentUnits = units.convertFromMetric(ingredientAmount, product.unit, [], product.density);
        const ingredientAmountInput = Utils.roundToDecimal(amountInCurrentUnits, DecimalPlaces.Two);

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
                ? String( Utils.roundToDecimal(
                    units.convertFromSeconds(direction.duration_value, direction.duration_unit),
                    DecimalPlaces.Two,
                ) )
                : ""
        );

        const temperatureValueInput = (
            direction.temperature_value
                ? String( Utils.roundToDecimal(
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

export default function recipePageReducer(state = initialState, action: types.RecipeActionTypes): types.RecipePageStore {

    switch (action.type) {

        case types.RECIPE_SET_EDIT_MODE: {
            return {
                ...state,
                editMode: action.payload,
            };
        }

        case types.RECIPE_UPDATE_NAME: {
            return {
                ...state,
                name: action.payload,
            };
        }

        case types.RECIPE_UPDATE_BRAND: {
            return {
                ...state,
                brand: action.payload,
            };
        }

        case types.RECIPE_UPDATE_SUBTITLE: {
            return {
                ...state,
                subtitle: action.payload,
            };
        }

        case types.RECIPE_UPDATE_DESCRIPTION: {
            return {
                ...state,
                description: action.payload,
            };
        }

        case types.RECIPE_UPDATE_TYPE: {
            return {
                ...state,
                type: action.payload,
            };
        }

        case types.RECIPE_ADD_CUSTOM_UNIT: {

            const { payload: customUnit } = action;

            // IMPROVE: Custom Unit name is empty or already exist, maybe show some kind of feedback?
            if (state.customUnits.some((cu) => cu.name === customUnit.name) || Utils.isEmptyString(customUnit.name)) {
                return state;
            }

            return {
                ...state,

                customUnits: [
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
                ],
            };
        }

        case types.RECIPE_UPDATE_CUSTOM_UNIT: {

            const { payload: { index: customUnitIndex, customUnit: updatedCustomUnit } } = action;

            return {
                ...state,

                customUnits: state.customUnits.map((customUnit, index) => (
                    (index === customUnitIndex)
                        ? {
                            ...updatedCustomUnit,
                            amount: units.convertToMetric(
                                Number(updatedCustomUnit.amountInput),
                                updatedCustomUnit.unit,
                                state.customUnits,
                                state.density,
                            ),
                        }
                        : customUnit
                )),
            };
        }

        case types.RECIPE_REMOVE_CUSTOM_UNIT: {

            const { payload: customUnitIndex } = action;

            return {
                ...state,
                customUnits: state.customUnits.filter((_customUnit, index) => index !== customUnitIndex),
            };
        }

        case types.RECIPE_REMOVE_DIRECTION: {
            const directionIndex = action.payload;
            return {
                ...state,
                directions: state.directions.filter((_direction, index) => (index !== directionIndex)),
            };
        }

        case types.RECIPE_REMOVE_DIRECTION_PART: {
            const { directionIndex, directionPartId } = action.payload;
            return {
                ...state,
                directions: state.directions.map((direction, iDirection) => (
                    (iDirection === directionIndex)
                        ? {
                            ...direction,
                            steps: direction.steps.filter((directionPart) => (directionPart.id !== directionPartId)),
                        }
                        : direction
                )),
            };
        }

        case types.RECIPE_TOGGLE_DIRECTION_OPEN: {
            const directionIndex = action.payload;
            return {
                ...state,
                directions: state.directions.map((direction, index) =>
                    (index === directionIndex)
                        ? { ...direction, isOpen: !direction.isOpen }
                        : direction,
                ),
            };
        }

        case types.RECIPE_TOGGLE_DIRECTION_MARK: {
            const directionIndex = action.payload;
            return {
                ...state,
                directions: state.directions.map((direction, index) =>
                    (index === directionIndex)
                        ? {
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
                        }
                        : direction,
                ),
            };
        }

        case types.RECIPE_TOGGLE_DIRECTION_PART_MARK: {
            const { directionIndex, directionPartId } = action.payload;
            return {
                ...state,
                directions: state.directions.map((direction, iDirection) => {

                    if (directionIndex === iDirection) {

                        const steps = direction.steps.map((directionPart) => (
                            (directionPart.type === types.DirectionPartType.Ingredient) && (directionPartId === directionPart.id)
                                ? { ...directionPart, isMarked: !(directionPart as types.RecipeDirectionPartIngredient).isMarked }
                                : directionPart
                        ));

                        const areAllStepsMarked = steps.every((step) => (
                            (step.type !== types.DirectionPartType.Ingredient) || (step as types.RecipeDirectionPartIngredient).isMarked
                        ));

                        return {
                            ...direction,
                            steps: steps,
                            isMarked: areAllStepsMarked,
                            isOpen: ( areAllStepsMarked ? false : direction.isOpen ),
                        };
                    }
                    else {
                        return direction;
                    }
                }),
            };
        }

        case types.RECIPE_UPDATE_DIRECTION_PART_STEP_NUMBER: {
            const { directionIndex, directionPartId, stepNumber } = action.payload;

            const directions = state.directions.map((direction, iDirection) => {
                if (directionIndex === iDirection) {

                    return {
                        ...direction,
                        steps: direction.steps
                            .map((directionPart) => (
                                (directionPart.id === directionPartId)
                                    ? { ...directionPart, stepNumber }
                                    : directionPart
                            ))
                            .sort(Utils.sortBy("stepNumber")),
                    };
                }
                else {
                    return direction;
                }
            });


            return { ...state, directions };
        }

        case types.RECIPE_UPDATE_DIRECTION_PART_NOTE: {
            const { directionIndex, directionPartId, note } = action.payload;

            return {
                ...state,
                directions: state.directions.map((direction, iDirection) => (
                    (directionIndex === iDirection)
                        ? {
                            ...direction,
                            steps: direction.steps.map((directionPart) =>
                                (directionPart.type !== types.DirectionPartType.Ingredient) && (directionPartId === directionPart.id)
                                    ? { ...directionPart, commentText: note }
                                    : directionPart,
                            ),
                        }
                        : direction
                )),
            };
        }

        case types.RECIPE_UPDATE_DIRECTION_PART_INGREDIENT_AMOUNT: {

            const { directionIndex, directionPartId, inputValue } = action.payload;

            const directions = state.directions.map((direction, iDirection) => {

                if (directionIndex === iDirection) {

                    const steps = direction.steps.map((directionPart) => {

                        if (isDirectionPartIngredient(directionPart) && (directionPart.id === directionPartId)) {

                            // TODO: Limit to what you have in ingredients, or just add validation message?

                            const amountInput = Utils.decimalNormalizer(inputValue, directionPart.ingredientAmountInput);
                            const amount = units.convertToMetric(
                                Number(amountInput), directionPart.ingredientUnit, [], directionPart.ingredientDensity,
                            );

                            return {
                                ...directionPart,
                                ingredientAmountInput: amountInput,
                                ingredientAmount: amount,
                            };
                        }
                        else {
                            return directionPart;
                        }
                    });

                    return { ...direction, steps };
                }
                else {
                    return direction;
                }
            });

            return { ...state, directions };
        }

        case types.RECIPE_UPDATE_DIRECTION_PART_INGREDIENT_UNIT: {

            const { directionIndex, directionPartId, unit } = action.payload;

            return {
                ...state,
                directions: state.directions.map((direction, iDirection) => {

                    if (directionIndex === iDirection) {

                        const steps = direction.steps.map((directionPart) => {

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
                                    const amountInput = Utils.roundToDecimal(amountInCurrentUnits, DecimalPlaces.Two);

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

                        return { ...direction, steps };
                    }
                    else {
                        return direction;
                    }
                }),
            };
        }

        case types.RECIPE_CREATE_DIRECTION_PART_INGREDIENT: {

            const { directionIndex, ingredientId } = action.payload;

            const ingredient = unwrap(
                state.ingredients.find(_ingredient => _ingredient.id === ingredientId),
                `Ingredient with id = ${ingredientId} is not found`,
            );

            const ingredientProduct = Utils.getRecipeIngredientProduct(ingredient);

            return {
                ...state,
                directions: state.directions.map((direction, iDirection) => (
                    (directionIndex === iDirection)
                        ? {
                            ...direction,
                            steps: [
                                ...direction.steps,
                                {
                                    id: Utils.getTemporaryId(),
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
                        }
                        : direction
                )),
            };
        }

        case types.RECIPE_CREATE_DIRECTION_PART_COMMENT: {

            const { directionIndex, type } = action.payload;

            return {
                ...state,
                directions: state.directions.map((direction, iDirection) => (
                    (directionIndex === iDirection)
                        ? {
                            ...direction,
                            steps: [
                                ...direction.steps,
                                {
                                    id: Utils.getTemporaryId(),
                                    stepNumber: getNewStepNumber(direction.steps.last()?.stepNumber),
                                    type: type,
                                    commentText: type,
                                } as types.RecipeDirectionPartComment,
                            ],
                        }
                        : direction
                )),
            };
        }

        case types.RECIPE_UPDATE_DIRECTION_STEP_NUMBER: {

            const { directionIndex, stepNumber } = action.payload;

            return {
                ...state,
                directions: state.directions
                    .map((direction, iDirection) => (
                        (directionIndex === iDirection)
                            ? { ...direction, stepNumber }
                            : direction
                    ))
                    .sort(Utils.sortBy("stepNumber")),
            };
        }

        case types.RECIPE_UPDATE_DIRECTION_NAME: {

            const { directionIndex, name } = action.payload;

            return {
                ...state,
                directions: state.directions.map((direction, iDirection) => (
                    (directionIndex === iDirection)
                        ? { ...direction, name }
                        : direction
                )),
            };
        }

        case types.RECIPE_UPDATE_DIRECTION_TEMPERATURE_COUNT: {

            const { directionIndex, inputValue } = action.payload;

            return {
                ...state,
                directions: state.directions.map((direction, iDirection) => {

                    if (directionIndex === iDirection) {

                        const countInput = Utils.decimalNormalizer(inputValue, direction.temperatureValueInput);
                        const count = (
                            direction.temperatureUnit === units.TemperatureUnit.F
                                ? units.convertFahrenheitToCelsius(Number(countInput))
                                : Number(countInput)
                        );

                        return {
                            ...direction,
                            temperatureValue: count,
                            temperatureValueInput: countInput,
                        };
                    }
                    else {
                        return direction;
                    }
                }),
            };
        }

        case types.RECIPE_UPDATE_DIRECTION_TEMPERATURE_UNIT: {

            const { directionIndex, unit } = action.payload;

            return {
                ...state,
                directions: state.directions.map((direction, iDirection) => {

                    if (directionIndex === iDirection) {

                        if (state.editMode) {

                            const count = (
                                unit === units.TemperatureUnit.F
                                    ? units.convertFahrenheitToCelsius(Number(direction.temperatureValueInput))
                                    : Number(direction.temperatureValueInput)
                            );

                            return {
                                ...direction,
                                temperatureValue: count,
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

                            return {
                                ...direction,
                                temperatureValueInput: String(Utils.roundToDecimal(countInput, DecimalPlaces.Two)),
                                temperatureUnit: unit,
                            };
                        }
                    }

                    return direction;
                }),
            };
        }

        case types.RECIPE_UPDATE_DIRECTION_TIME_COUNT: {

            const { directionIndex, inputValue } = action.payload;

            return {
                ...state,
                directions: state.directions.map((direction, iDirection) => {

                    if (directionIndex === iDirection) {

                        const countInput = Utils.decimalNormalizer(inputValue, direction.durationValueInput);
                        const count = units.convertToSeconds(Number(countInput), direction.durationUnit);

                        return {
                            ...direction,
                            durationValue: count,
                            durationValueInput: countInput,
                        };
                    }
                    else {
                        return direction;
                    }
                }),
            };
        }

        case types.RECIPE_UPDATE_DIRECTION_TIME_UNIT: {

            const { directionIndex, unit } = action.payload;

            return {
                ...state,
                directions: state.directions.map((direction, iDirection) => {

                    if (directionIndex === iDirection) {

                        if (state.editMode) {
                            const count = units.convertToSeconds(Number(direction.durationValueInput), unit);

                            return {
                                ...direction,
                                durationValue: count,
                                durationUnit: unit,
                            };
                        }
                        // NOTE: Shouldn't be possible to trigger this change with `isNone(durationValue) === true`
                        else if (isSome(direction.durationValue)) {

                            const countInput = units.convertFromSeconds(direction.durationValue, unit);

                            return {
                                ...direction,
                                durationValueInput: String(Utils.roundToDecimal(countInput, DecimalPlaces.Two)),
                                durationUnit: unit,
                            };
                        }
                    }

                    return direction;
                }),
            };
        }

        case types.RECIPE_UPDATE_NEW_DIRECTION_STEP_NUMBER: {

            const stepNumber = action.payload;

            return {
                ...state,
                newDirection: { ...state.newDirection, stepNumber: stepNumber },
            };
        }

        case types.RECIPE_UPDATE_NEW_DIRECTION_NAME: {

            const name = action.payload;

            return {
                ...state,
                newDirection: { ...state.newDirection, name: name },
            };
        }

        case types.RECIPE_UPDATE_NEW_DIRECTION_TEMPERATURE_COUNT: {

            const inputValue = action.payload;

            const countInput = Utils.decimalNormalizer(inputValue, state.newDirection.temperatureValueInput);
            const count = (
                state.newDirection.temperatureUnit === units.TemperatureUnit.F
                    ? units.convertFahrenheitToCelsius(Number(countInput))
                    : Number(countInput)
            );

            return {
                ...state,
                newDirection: {
                    ...state.newDirection,
                    temperatureValue: count,
                    temperatureValueInput: countInput,
                },
            };
        }

        case types.RECIPE_UPDATE_NEW_DIRECTION_TEMPERATURE_UNIT: {

            const unit = action.payload;

            const count = (
                unit === units.TemperatureUnit.F
                    ? units.convertFahrenheitToCelsius(Number(state.newDirection.temperatureValueInput))
                    : Number(state.newDirection.temperatureValueInput)
            );

            return {
                ...state,
                newDirection: {
                    ...state.newDirection,
                    temperatureValue: count,
                    temperatureUnit: unit,
                },
            };
        }

        case types.RECIPE_UPDATE_NEW_DIRECTION_TIME_COUNT: {

            const inputValue = action.payload;

            const countInput = Utils.decimalNormalizer(inputValue, state.newDirection.durationValueInput);
            const count = units.convertToSeconds(Number(countInput), state.newDirection.durationUnit);

            return {
                ...state,
                newDirection: {
                    ...state.newDirection,
                    durationValue: count,
                    durationValueInput: countInput,
                },
            };
        }

        case types.RECIPE_UPDATE_NEW_DIRECTION_TIME_UNIT: {

            const unit = action.payload;

            const count = units.convertToSeconds(Number(state.newDirection.durationValueInput), unit);

            return {
                ...state,
                newDirection: {
                    ...state.newDirection,
                    durationValue: count,
                    durationUnit: unit,
                },
            };
        }

        case types.RECIPE_CREATE_DIRECTION: {

            const direction = action.payload;

            return {
                ...state,
                directions: [
                    ...state.directions,
                    {
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
                    },
                ],
                newDirection: DEFAULT_DIRECTION,
            };
        }

        case types.RECIPE_REMOVE_INGREDIENT: {

            const id = action.payload;

            const ingredients = state.ingredients.filter((ingredient) => ingredient.id !== id);

            const servingSize = Utils.getRecipeServingSizeFromIngredients(ingredients);
            const servingSizeInCurrentUnits = units.convertFromMetric(
                servingSize, state.servingSizeUnit, state.customUnits, state.density,
            );
            const servingSizeInput = Utils.roundToDecimal(servingSizeInCurrentUnits, DecimalPlaces.Four);

            const nutritionFactsByServing = Utils.getRecipeNutritionFactsFromIngredients(ingredients);

            return {
                ...state,
                ingredients: ingredients,
                nutritionFacts: Utils.convertNutritionFacts(servingSize, false, nutritionFactsByServing),

                servingSize: servingSize,
                servingSizeInput: String(servingSizeInput),

                nutritionFactsByServing: nutritionFactsByServing,
                nutritionFactsByServingInputs: Utils.convertNutritionFactValuesIntoInputs(nutritionFactsByServing),
            };
        }

        case types.RECIPE_REMOVE_INGREDIENT_PRODUCT: {

            const { parentId, id } = action.payload;

            return {
                ...state,
                ingredients: state.ingredients.map((ingredient) => (
                    ( ingredient.id === parentId )
                        ? {
                            ...ingredient,
                            products: Utils.getObjectKeys(ingredient.products, true).reduce((acc, product_id) => (
                                product_id !== id || ingredient.product_id === id
                                    ? { ...acc, [product_id]: ingredient.products[product_id] }
                                    : acc
                            ), {}),
                        }
                        : ingredient
                )),
            };
        }

        // TODO: Check, might have unexpected/broken behaviour in read-mode
        case types.RECIPE_REPLACE_INGREDIENT_WITH_ALTERNATIVE: {

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

            const servingSize = Utils.getRecipeServingSizeFromIngredients(ingredients);
            const servingSizeInCurrentUnits = units.convertFromMetric(
                servingSize, state.servingSizeUnit, state.customUnits, state.density,
            );
            const servingSizeInput = Utils.roundToDecimal(servingSizeInCurrentUnits, DecimalPlaces.Four);

            const nutritionFactsByServing = Utils.getRecipeNutritionFactsFromIngredients(ingredients);

            return {
                ...state,
                ingredients: ingredients,
                nutritionFacts: Utils.convertNutritionFacts(servingSize, false, nutritionFactsByServing),

                servingSize: servingSize,
                servingSizeInput: String(servingSizeInput),

                nutritionFactsByServing: nutritionFactsByServing,
                nutritionFactsByServingInputs: Utils.convertNutritionFactValuesIntoInputs(nutritionFactsByServing),
            };
        }

        case types.RECIPE_TOGGLE_INGREDIENT_OPEN: {

            const id = action.payload;

            return {
                ...state,
                ingredients: state.ingredients.map((ingredient) => ({
                    ...ingredient,
                    isOpen: (ingredient.id === id) ? !ingredient.isOpen : ingredient.isOpen,
                })),
            };
        }

        case types.RECIPE_TOGGLE_INGREDIENT_MARK: {

            const id = action.payload;

            return {
                ...state,
                ingredients: state.ingredients.map((ingredient) => ({
                    ...ingredient,
                    isMarked: (ingredient.id === id) ? !ingredient.isMarked : ingredient.isMarked,
                })),
            };
        }

        case types.RECIPE_UPDATE_INGREDIENT_PRODUCT_AMOUNT: {

            const { parentId, id, inputValue } = action.payload;

            const ingredients = state.ingredients.map((ingredient) => {

                if (ingredient.id === parentId) {

                    const product = unwrap(ingredient.products[id], `ingredient.products[${id}]`);

                    const amountInput = Utils.decimalNormalizer(inputValue, product.amountInput);
                    const amount = units.convertToMetric(
                        Number(amountInput), product.unit, [], product.density,
                    );

                    return {
                        ...ingredient,
                        products: {
                            ...ingredient.products,
                            [id]: { ...product, amountInput, amount },
                        },
                    };
                }
                else {
                    return ingredient;
                }
            });

            const servingSize = Utils.getRecipeServingSizeFromIngredients(ingredients);
            const servingSizeInCurrentUnits = units.convertFromMetric(
                servingSize, state.servingSizeUnit, state.customUnits, state.density,
            );
            const servingSizeInput = Utils.roundToDecimal(servingSizeInCurrentUnits, DecimalPlaces.Four);

            const nutritionFactsByServing = Utils.getRecipeNutritionFactsFromIngredients(ingredients);

            return {
                ...state,
                ingredients: ingredients,
                nutritionFacts: Utils.convertNutritionFacts(servingSize, false, nutritionFactsByServing),

                servingSize: servingSize,
                servingSizeInput: String(servingSizeInput),

                nutritionFactsByServing: nutritionFactsByServing,
                nutritionFactsByServingInputs: Utils.convertNutritionFactValuesIntoInputs(nutritionFactsByServing),
            };
        }

        case types.RECIPE_UPDATE_INGREDIENT_PRODUCT_UNIT: {

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
                        const amountInput = String(Utils.roundToDecimal(amountInCurrentUnits, DecimalPlaces.Two));

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

            const servingSize = Utils.getRecipeServingSizeFromIngredients(ingredients);
            const servingSizeInCurrentUnits = units.convertFromMetric(
                servingSize, state.servingSizeUnit, state.customUnits, state.density,
            );
            const servingSizeInput = Utils.roundToDecimal(servingSizeInCurrentUnits, DecimalPlaces.Four);

            const nutritionFactsByServing = Utils.getRecipeNutritionFactsFromIngredients(ingredients);

            return {
                ...state,
                ingredients: ingredients,
                nutritionFacts: Utils.convertNutritionFacts(servingSize, false, nutritionFactsByServing),

                servingSize: servingSize,
                servingSizeInput: String(servingSizeInput),

                nutritionFactsByServing: nutritionFactsByServing,
                nutritionFactsByServingInputs: Utils.convertNutritionFactValuesIntoInputs(nutritionFactsByServing),
            };
        }

        case types.RECIPE_UPDATE_ALT_NUTRITION_FACTS: {

            const { parentId, id, isSelected } = action.payload;

            return {
                ...state,
                ingredients: state.ingredients.map((ingredient) => (
                    (ingredient.id === parentId)
                        ? {
                            ...ingredient,
                            alternativeNutritionFacts: (
                                isSelected
                                    ? unwrap(ingredient.products[id], `ingredient.products["${id}"]`).nutrition_facts
                                    : {}
                            ),
                        }
                        : ingredient
                )),
            };
        }

        case types.RECIPE_ADD_INGREDIENT_REQUEST: {
            return {
                ...state,
                isLoadedIngredients: false,
            };
        }

        case types.RECIPE_ADD_INGREDIENT_SUCCESS: {

            const ingredientProduct = action.payload;

            const ingredients: types.RecipeIngredient[] = [
                ...state.ingredients,
                {
                    isOpen: true,
                    isMarked: false,

                    id: Utils.getTemporaryId(),

                    product_id: ingredientProduct.product_id,

                    alternativeNutritionFacts: {},

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

            const servingSize = Utils.getRecipeServingSizeFromIngredients(ingredients);
            const servingSizeInCurrentUnits = units.convertFromMetric(
                servingSize, state.servingSizeUnit, state.customUnits, state.density,
            );
            const servingSizeInput = Utils.roundToDecimal(servingSizeInCurrentUnits, DecimalPlaces.Four);

            const nutritionFactsByServing = Utils.getRecipeNutritionFactsFromIngredients(ingredients);

            return {
                ...state,
                isLoadedIngredients: true,

                ingredients: ingredients,
                nutritionFacts: Utils.convertNutritionFacts(servingSize, false, nutritionFactsByServing),

                servingSize: servingSize,
                servingSizeInput: String(servingSizeInput),

                nutritionFactsByServing: nutritionFactsByServing,
                nutritionFactsByServingInputs: Utils.convertNutritionFactValuesIntoInputs(nutritionFactsByServing),
            };
        }

        case types.RECIPE_ADD_INGREDIENT_ERROR: {
            return {
                ...state,
                isLoadedIngredients: true,
                errorMessage: action.payload as string,
            };
        }

        case types.RECIPE_ADD_INGREDIENT_PRODUCT_REQUEST: {
            return {
                ...state,
                isLoadedIngredients: false,
            };
        }

        case types.RECIPE_ADD_INGREDIENT_PRODUCT_SUCCESS: {

            const { id, product } = action.payload;

            return {
                ...state,
                isLoadedIngredients: true,
                ingredients: state.ingredients.map((ingredient) => (
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
                )),
            };
        }

        case types.RECIPE_ADD_INGREDIENT_PRODUCT_ERROR: {
            return {
                ...state,
                isLoadedIngredients: true,
                errorMessage: action.payload as string,
            };
        }

        case types.RECIPE_UPDATE_SERVING_SIZE_AMOUNT: {

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

        case types.RECIPE_UPDATE_SERVING_SIZE_UNIT: {

            const servingSizeUnit = action.payload;

            const servingSize = units.convertToMetric(
                Number(state.servingSizeInput), servingSizeUnit, state.customUnits, state.density,
            );

            // NOTE: edit-mode will not update nutritionFacts, so you can adjust how much nutritionFacts is in selected servingSize
            if (state.editMode) {
                return {
                    ...state,
                    servingSize: servingSize,
                    servingSizeUnit: servingSizeUnit,
                };
            }
            // NOTE: read-mode will update nutritionFacts to demonstrate how much you'll have in a selected servingSize
            else {
                const nutritionFactsByServing = Utils.convertNutritionFacts(servingSize, true, state.nutritionFacts);

                return {
                    ...state,
                    servingSize: servingSize,
                    servingSizeUnit: servingSizeUnit,
                    nutritionFactsByServing: nutritionFactsByServing,
                    nutritionFactsByServingInputs: Utils.convertNutritionFactValuesIntoInputs(nutritionFactsByServing),
                };
            }
        }

        case types.RECIPE_FETCH_NEW: {
            return {
                ...state,
                isLoaded: true,
                errorMessage: null,
                editMode: true,
                isCreated: false,
            };
        }

        case types.RECIPE_FETCH_REQUEST: {
            return {
                ...state,
                isLoaded: false,
                errorMessage: null,
                editMode: false,

                id: action.payload,
            };
        }

        case types.RECIPE_FETCH_SUCCESS: {
            const recipe = action.payload;

            const recipeIngredients = convertIngredients(recipe.ingredients);
            const recipeDirections = convertDirections(recipe.directions, recipe.ingredients);

            const nutritionFactsByServing = Utils.getRecipeNutritionFactsFromIngredients(recipeIngredients);

            return {
                ...state,
                isLoaded: true,
                errorMessage: null,

                id: recipe.id,
                name: recipe.name,
                brand: recipe.brand,
                subtitle: recipe.subtitle,
                description: recipe.description,
                type: recipe.type,

                density: recipe.density,
                densityInput: String(recipe.density),

                servingSize: recipe.serving_size,
                servingSizeInput: String(recipe.serving_size),

                nutritionFacts: Utils.convertNutritionFacts(recipe.serving_size, false, nutritionFactsByServing),
                customUnits: Utils.convertCustomUnitsIntoInputs(recipe.custom_units),

                nutritionFactsByServing: nutritionFactsByServing,
                nutritionFactsByServingInputs: Utils.convertNutritionFactValuesIntoInputs(nutritionFactsByServing),

                ingredients: recipeIngredients,
                directions: recipeDirections,
            };
        }

        case types.RECIPE_FETCH_ERROR: {
            return {
                ...state,
                isLoaded: true,
                errorMessage: action.payload as string,
            };
        }

        case types.RECIPE_CREATE_REQUEST: {
            return {
                ...state,
                isLoaded: false,
            };
        }

        case types.RECIPE_CREATE_SUCCESS: {

            const recipe = action.payload;

            return {
                ...state,
                isLoaded: true,
                editMode: false,
                id: recipe.id,
                isCreated: true,
            };
        }

        case types.RECIPE_CREATE_ERROR: {
            return {
                ...state,
                isLoaded: true,
                errorMessage: action.payload as string,
            };
        }

        case types.RECIPE_UPDATE_REQUEST: {
            return {
                ...state,
                isLoaded: false,
            };
        }

        case types.RECIPE_UPDATE_SUCCESS: {

            const recipe = action.payload;

            return {
                ...state,
                isLoaded: true,
                editMode: false,
                id: recipe.id,
            };
        }

        case types.RECIPE_UPDATE_ERROR: {
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
