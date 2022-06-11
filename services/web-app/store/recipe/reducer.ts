import { unwrap, unwrapOr } from "@common/types";
import type * as typings from "@common/typings";
import * as units from "@common/units";
import Utils from "@common/utils";
import type { AppState } from "@store";

import * as types from "./types";


const initialState: types.RecipePageStore = {

    isLoaded: false,
    errorMessage: null,

    editMode: true,

    id: -1,
    name: "Name",
    brand: "Brand",
    subtitle: "Subtitle",
    description: "",
    type: "",
    density: units.DEFAULT_DENSITY,

    nutritionFacts: {},

    customUnits: [],

    servingSize: 100,
    servingSizeInput: "100",
    servingSizeUnit: units.DEFAULT_WEIGHT_UNIT,

    ingredients: [],

    newDirection: {
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
    },
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
        products: Utils.getObjectValues(ingredient.products).reduce((acc, product) => ({
            ...acc,
            [product.product_id]: {
                ...product,
                amountInput: String(product.amount),
            },
        }), {}),
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

        return {
            stepNumber: directionPart.step_number,
            type: directionPart.direction_part_type,
            ingredientId: ingredientId,

            ingredientAmount: ingredientAmount,
            ingredientAmountInput: String(ingredientAmount),

            ingredientName: product.name,
            ingredientUnit: product.unit,

            isMarked: false,
        };
    }
    else {
        return {
            stepNumber: directionPart.step_number,
            type: directionPart.direction_part_type,
            commentText: unwrapOr(directionPart.comment_text, directionPart.direction_part_type),
        };
    }
}

function convertDirections(directions: typings.Direction[], ingredients: typings.Ingredient[]): types.RecipeDirection[] {

    return directions.map((direction) => ({
        id: direction.id,

        stepNumber: direction.step_number,
        name: direction.name,

        durationValue: direction.duration_value,
        durationUnit: direction.duration_unit,
        durationValueInput: direction.duration_value ? String(direction.duration_value) : "",

        temperatureValue: direction.temperature_value,
        temperatureUnit: direction.temperature_unit,
        temperatureValueInput: direction.temperature_value ? String(direction.temperature_value) : "",

        isOpen: true,
        isMarked: false,

        steps: direction.steps.map((step) => convertDirectionPart(step, ingredients)),
    }));
}

export default function recipePageReducer(state = initialState, action: types.RecipeItemActionTypes): types.RecipePageStore {

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

        case types.RECIPE_UPDATE_CUSTOM_UNIT: {

            const { payload: { index: customUnitIndex, customUnit: updatedCustomUnitInput } } = action;

            return {
                ...state,

                customUnits: state.customUnits.map((customUnit, index) => (
                    index === customUnitIndex ? updatedCustomUnitInput : customUnit
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
            const { directionIndex, stepNumber } = action.payload;
            return {
                ...state,
                directions: state.directions.map((direction, iDirection) => (
                    (iDirection === directionIndex)
                        ? {
                            ...direction,
                            steps: direction.steps.filter(
                                (subDirection) => (subDirection.stepNumber !== stepNumber),
                            ),
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
                                    : direction.steps.map((subDirection) => (
                                        (subDirection.type === types.DirectionPartType.Ingredient)
                                            ? { ...subDirection, isMarked: true }
                                            : subDirection
                                    ))
                            ),
                        }
                        : direction,
                ),
            };
        }

        case types.RECIPE_TOGGLE_DIRECTION_PART_MARK: {
            const { directionIndex, stepNumber } = action.payload;
            return {
                ...state,
                directions: state.directions.map((direction, iDirection) => {

                    if (directionIndex === iDirection) {

                        const steps = direction.steps.map((subDirection) => (
                            (subDirection.type === types.DirectionPartType.Ingredient) && (stepNumber === subDirection.stepNumber)
                                ? { ...subDirection, isMarked: !(subDirection as types.RecipeDirectionPartIngredient).isMarked }
                                : subDirection
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
            const { directionIndex, stepNumber, newStepNumber } = action.payload;

            // IMPROVE: Should not be necessary with drag and drop functionality
            const isNewStepNumberTaken = state.directions.some(
                (direction) => direction.steps.some((directionPart) => directionPart.stepNumber === newStepNumber),
            );

            if (isNewStepNumberTaken) {
                return state;
            }

            return {
                ...state,
                directions: state.directions.map((direction, iDirection) => (
                    (directionIndex === iDirection)
                        ? {
                            ...direction,
                            steps: direction.steps
                                .map((directionPart) => (
                                    (directionPart.stepNumber === stepNumber)
                                        ? { ...directionPart, stepNumber: newStepNumber }
                                        : directionPart
                                ))
                                .sort(Utils.sortBy("stepNumber")),
                        }
                        : direction
                )),
            };
        }

        case types.RECIPE_UPDATE_DIRECTION_PART_NOTE: {
            const { directionIndex, stepNumber, note } = action.payload;

            return {
                ...state,
                directions: state.directions.map((direction, iDirection) => (
                    (directionIndex === iDirection)
                        ? {
                            ...direction,
                            steps: direction.steps.map((subDirection) =>
                                (subDirection.type !== types.DirectionPartType.Ingredient) && (stepNumber === subDirection.stepNumber)
                                    ? { ...subDirection, commentText: note }
                                    : subDirection,
                            ),
                        }
                        : direction
                )),
            };
        }

        case types.RECIPE_UPDATE_DIRECTION_PART_INGREDIENT_AMOUNT: {

            const { directionIndex, stepNumber, inputValue } = action.payload;

            return {
                ...state,
                directions: state.directions.map((direction, iDirection) => (
                    (directionIndex === iDirection)
                        ? {
                            ...direction,
                            steps: direction.steps.map((directionPart) => {

                                const isSelectedDirectionPart = (
                                    (directionPart.type === types.DirectionPartType.Ingredient) &&
                                    (directionPart.stepNumber === stepNumber)
                                );

                                if (isSelectedDirectionPart) {
                                    const amount = Utils.decimalNormalizer(
                                        inputValue,
                                        (directionPart as types.RecipeDirectionPartIngredient).ingredientAmountInput,
                                    );

                                    return {
                                        ...directionPart,
                                        ingredientAmountInput: amount,
                                        ingredientAmount: Number(amount),
                                    };
                                }
                                else {
                                    return directionPart;
                                }
                            }),
                        }
                        : direction
                )),
            };
        }

        case types.RECIPE_UPDATE_DIRECTION_PART_INGREDIENT_UNIT: {

            const { directionIndex, stepNumber, unit } = action.payload;

            return {
                ...state,
                directions: state.directions.map((direction, iDirection) => (
                    (directionIndex === iDirection)
                        ? {
                            ...direction,
                            steps: direction.steps.map((subDirection) => (
                                (subDirection.type === types.DirectionPartType.Ingredient) && (stepNumber === subDirection.stepNumber)
                                    ? { ...subDirection, ingredientUnit: unit }
                                    : subDirection
                            )),
                        }
                        : direction
                )),
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
                                    stepNumber: direction.steps.length,
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
                                    stepNumber: direction.steps.length,
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

                    const count = Utils.decimalNormalizer(inputValue, direction.temperatureValueInput);

                    return (
                        (directionIndex === iDirection)
                            ? {
                                ...direction,
                                temperatureValue: Number(count),
                                temperatureValueInput: count,
                            }
                            : direction
                    );
                }),
            };
        }

        case types.RECIPE_UPDATE_DIRECTION_TEMPERATURE_UNIT: {

            const { directionIndex, unit } = action.payload;

            return {
                ...state,
                directions: state.directions.map((direction, iDirection) => (
                    (directionIndex === iDirection)
                        ? {
                            ...direction,
                            temperatureUnit: unit,
                        }
                        : direction
                )),
            };
        }

        case types.RECIPE_UPDATE_DIRECTION_TIME_COUNT: {

            const { directionIndex, inputValue } = action.payload;

            return {
                ...state,
                directions: state.directions.map((direction, iDirection) => {

                    const count = Utils.decimalNormalizer(inputValue, direction.durationValueInput);

                    return (
                        (directionIndex === iDirection)
                            ? {
                                ...direction,
                                durationValue: Number(count),
                                durationValueInput: count,
                            }
                            : direction
                    );
                }),
            };
        }

        case types.RECIPE_UPDATE_DIRECTION_TIME_UNIT: {

            const { directionIndex, unit } = action.payload;

            return {
                ...state,
                directions: state.directions.map((direction, iDirection) => (
                    (directionIndex === iDirection)
                        ? {
                            ...direction,
                            durationUnit: unit,
                        }
                        : direction
                )),
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

            const count = Utils.decimalNormalizer(inputValue, state.newDirection.temperatureValueInput);

            return {
                ...state,
                newDirection: {
                    ...state.newDirection,
                    temperatureValue: Number(count),
                    temperatureValueInput: count,
                },
            };
        }

        case types.RECIPE_UPDATE_NEW_DIRECTION_TEMPERATURE_UNIT: {

            const unit = action.payload;

            return {
                ...state,
                newDirection: {
                    ...state.newDirection,
                    temperatureUnit: unit,
                },
            };
        }

        case types.RECIPE_UPDATE_NEW_DIRECTION_TIME_COUNT: {

            const inputValue = action.payload;

            const count = Utils.decimalNormalizer(inputValue, state.newDirection.durationValueInput);

            return {
                ...state,
                newDirection: {
                    ...state.newDirection,
                    durationValue: Number(count),
                    durationValueInput: count,
                },
            };
        }

        case types.RECIPE_UPDATE_NEW_DIRECTION_TIME_UNIT: {

            const unit = action.payload;

            return {
                ...state,
                newDirection: {
                    ...state.newDirection,
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

                        stepNumber: direction.stepNumber,
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
                newDirection: {
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
                },
            };
        }

        case types.RECIPE_REMOVE_INGREDIENT: {

            const id = action.payload;

            const ingredients = state.ingredients.filter((ingredient) => ingredient.id !== id);

            return {
                ...state,
                ingredients: ingredients,
                nutritionFacts: Utils.getRecipeNutritionFacts(ingredients),
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

            return {
                ...state,
                ingredients: ingredients,
                nutritionFacts: Utils.getRecipeNutritionFacts(ingredients),
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

            return {
                ...state,
                ingredients: state.ingredients.map((ingredient) => {

                    if (ingredient.id === parentId) {
                        const product = unwrap(ingredient.products[id], `ingredient.products[${id}]`);
                        const amount = Utils.decimalNormalizer(inputValue, product.amountInput);

                        return {
                            ...ingredient,
                            products: {
                                ...ingredient.products,
                                [id]: {
                                    ...product,
                                    amountInput: amount,
                                    amount: Number(amount),
                                },
                            },
                        };
                    }
                    else {
                        return ingredient;
                    }
                }),
            };
        }

        case types.RECIPE_UPDATE_INGREDIENT_PRODUCT_UNIT: {

            const { parentId, id, unit } = action.payload;

            return {
                ...state,
                ingredients: state.ingredients.map((ingredient) => {
                    if (ingredient.id === parentId) {

                        const product = unwrap(ingredient.products[id], `ingredient.products[${id}]`);

                        return {
                            ...ingredient,
                            products: {
                                ...ingredient.products,
                                [id]: { ...product, unit },
                            },
                        };
                    }
                    else {
                        return ingredient;
                    }
                }),
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
                                    ? unwrap(
                                        ingredient.products[id],
                                        `ingredient.products["${id}"]`,
                                    ).nutrition_facts
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
                // FIXME: Add alternative loading status (like overlay spinner)
                // isLoaded: true,
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

            return {
                ...state,
                ingredients: ingredients,
                nutritionFacts: Utils.getRecipeNutritionFacts(ingredients),
            };
        }

        case types.RECIPE_ADD_INGREDIENT_ERROR: {
            return {
                ...state,
                isLoaded: true,
                errorMessage: action.payload as string,
            };
        }

        case types.RECIPE_ADD_INGREDIENT_PRODUCT_REQUEST: {
            return {
                ...state,
                // FIXME: Add alternative loading status (like overlay spinner)
                // isLoaded: true,
            };
        }

        case types.RECIPE_ADD_INGREDIENT_PRODUCT_SUCCESS: {

            const { id, product } = action.payload;

            return {
                ...state,
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
                isLoaded: true,
                errorMessage: action.payload as string,
            };
        }

        case types.RECIPE_UPDATE_SERVING_SIZE_AMOUNT: {

            const inputValue = action.payload;

            const amount = Utils.decimalNormalizer(inputValue, state.servingSizeInput);

            return {
                ...state,
                servingSize: Number(amount),
                servingSizeInput: amount,
            };
        }

        case types.RECIPE_UPDATE_SERVING_SIZE_UNIT: {

            const unit = action.payload;

            return {
                ...state,
                servingSizeUnit: unit,
            };
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
            const recipeItem = action.payload;

            const recipeIngredients = convertIngredients(recipeItem.ingredients);
            const recipeDirections = convertDirections(recipeItem.directions, recipeItem.ingredients);

            return {
                ...state,
                isLoaded: true,
                errorMessage: null,

                id: recipeItem.id,
                name: recipeItem.name,
                brand: recipeItem.brand,
                subtitle: recipeItem.subtitle,
                description: recipeItem.description,
                type: recipeItem.type,

                nutritionFacts: Utils.getRecipeNutritionFacts(recipeItem.ingredients),
                customUnits: Utils.convertCustomUnitsIntoInputs(recipeItem.custom_units),

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

            const recipeItem = action.payload;

            return {
                ...state,
                isLoaded: true,
                editMode: false,
                id: recipeItem.id,
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

            const recipeItem = action.payload;

            return {
                ...state,
                isLoaded: true,
                editMode: false,
                id: recipeItem.id,
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
