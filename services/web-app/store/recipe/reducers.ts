import type { NutritionFactType } from "@common/nutritionFacts";
import type * as typings from "@common/typings";
import type { CustomUnit } from "@common/units";
import * as units from "@common/units";
import Utils, { DecimalPlaces } from "@common/utils";
import type { AppState } from "@store";

import type { RecipeSubDirectionIngredient } from "./types";
import * as types from "./types";


const initialState: types.RecipePageStore = {

    isLoaded: false,
    errorMessage: null,
    isReadOnly: false,

    id: -1,
    name: "Name",
    brand: "Brand",
    subtitle: "Subtitle",
    description: "Description",
    type: "",

    nutritionFacts: {},

    customUnits: [],
    customUnitInputs: [],

    servingSize: 100,
    servingSizeInput: "100",
    servingSizeUnit: units.DEFAULT_WEIGHT_UNIT,

    ingredients: [],

    newDirection: {
        isOpen: false,
        isMarked: false,

        step_number: 4,
        name: "",

        duration: {
            value: 0,
            unit: units.DEFAULT_TIME_UNIT,
        },
        temperature: {
            value: 0,
            unit: units.DEFAULT_TEMPERATURE_UNIT,
        },

        durationInput: "",
        temperatureInput: "",

        newStep: types.SubDirectionType.Note,
        steps: [],
    },
    directions: [],
};


function extractState(globalState: AppState): types.RecipePageStore {
    return (globalState?.recipePage || initialState);
}

export function extractCustomUnits(globalState: AppState): units.CustomUnit[] {
    return extractState(globalState).customUnits;
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
        altNutritionFacts: {},
    }));
}

function convertDirections(directions: typings.Direction[]): types.RecipeDirection[] {

    return directions.map((direction) => ({
        ...direction,

        isOpen: true,
        isMarked: false,
        durationInput: direction.duration?.value ? String(direction.duration?.value) : "",
        temperatureInput: direction.temperature?.value ? String(direction.temperature?.value) : "",
        newStep: types.SubDirectionType.Note,

        steps: direction.steps.map((step) => 
            step.direction_part_type !== types.SubDirectionType.Ingredient
                ? step
                : ({
                    ...step,
                    isMarked: false,
                    amountInput: String((step as typings.SubDirectionIngredient).product_amount),
                }),
        ),
    }));
}

function getRecipeNutritionFacts(ingredients: typings.Ingredient[]): Dictionary<NutritionFactType, number> {

    const nutritionFactsById: Dictionary<NutritionFactType, number>[] = ingredients
        .map((ingredient) => {

            const ingredientProduct = Utils.unwrapForced(
                ingredient.products[ingredient.product_id],
                `ingredient.products["${ingredient.product_id}"]`,
            );
            
            const nutritionFacts = ingredientProduct.nutrition_facts;
            const multiplier = Utils.getPercentMultiplier(ingredientProduct.amount);

            return Utils.getObjectKeys(nutritionFacts)
                .reduce((acc: Dictionary<NutritionFactType, number>, nutritionFactType) => {

                    const nutritionFactValue = nutritionFacts[nutritionFactType];

                    return {
                        ...acc,
                        [nutritionFactType]: (
                            Utils.isSome(nutritionFactValue)
                                ? Utils.roundToDecimal(nutritionFactValue * multiplier, DecimalPlaces.Two)
                                : null
                        ),
                    };
                }, {});
        });

    return Utils.dictionarySum(nutritionFactsById);
}


export default function recipePageReducer(state = initialState, action: types.RecipeItemActionTypes): types.RecipePageStore {

    switch (action.type) {

        case types.RECIPE_ITEM_UPDATE_NAME: {
            return {
                ...state,
                name: action.payload,
            };
        }

        case types.RECIPE_ITEM_UPDATE_BRAND: {
            return {
                ...state,
                brand: action.payload,
            };
        }

        case types.RECIPE_ITEM_UPDATE_SUBTITLE: {
            return {
                ...state,
                subtitle: action.payload,
            };
        }

        case types.RECIPE_ITEM_UPDATE_DESCRIPTION: {
            return {
                ...state,
                description: action.payload,
            };
        }

        case types.RECIPE_ITEM_UPDATE_TYPE: {
            return {
                ...state,
                type: action.payload,
            };
        }

        case types.RECIPE_ITEM_UPDATE_CUSTOM_UNITS: {
            return {
                ...state,

                customUnits: Utils.convertCustomUnitsIntoValues(action.payload),
                customUnitInputs: action.payload as units.CustomUnitInput[],
            };
        }

        case types.RECIPE_ITEM_UPDATE_CUSTOM_UNIT_SUCCESS:
        case types.RECIPE_ITEM_ADD_CUSTOM_UNIT_SUCCESS:
        case types.RECIPE_ITEM_REMOVE_CUSTOM_UNIT_SUCCESS: {
            return {
                ...state,
                
                customUnits: action.payload as CustomUnit[],
                customUnitInputs: Utils.convertCustomUnitsIntoInputs(action.payload),
            };
        }

        case types.RECIPE_ITEM_REMOVE_DIRECTION: {
            const directionIndex = action.payload;
            return {
                ...state,
                directions: state.directions.filter((_direction, index) => (index !== directionIndex)),
            };
        }

        case types.RECIPE_ITEM_REMOVE_SUBDIRECTION: {
            const { directionIndex, subDirectionIndex } = action.payload;
            return {
                ...state,
                directions: state.directions.map((direction, iDirection) => (
                    (iDirection === directionIndex)
                        ? {
                            ...direction,
                            steps: direction.steps.filter(
                                (_sd, iSubDirection) => (iSubDirection !== subDirectionIndex),
                            ),
                        }
                        : direction
                )),
            };
        }

        case types.RECIPE_ITEM_TOGGLE_DIRECTION_OPEN: {
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

        case types.RECIPE_ITEM_TOGGLE_DIRECTION_MARK: {
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
                                        (subDirection.direction_part_type === types.SubDirectionType.Ingredient)
                                            ? { ...subDirection, isMarked: true }
                                            : subDirection
                                    ))
                            ),
                        }
                        : direction,
                ),
            };
        }

        case types.RECIPE_ITEM_TOGGLE_SUBDIRECTION_MARK: {
            const { directionIndex, subDirectionIndex } = action.payload;
            return {
                ...state,
                directions: state.directions.map((direction, iDirection) => {

                    if (directionIndex === iDirection) {

                        const steps = direction.steps.map((subDirection, iSubDirection) => (
                            (subDirection.direction_part_type === types.SubDirectionType.Ingredient) && (subDirectionIndex === iSubDirection)
                                ? { ...subDirection, isMarked: !(subDirection as types.RecipeSubDirectionIngredient).isMarked }
                                : subDirection
                        ));

                        const areAllStepsMarked = steps.every((step) => (
                            (step.direction_part_type !== types.SubDirectionType.Ingredient) || (step as types.RecipeSubDirectionIngredient).isMarked
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

        case types.RECIPE_ITEM_UPDATE_SUBDIRECTION_NOTE: {
            const { directionIndex, subDirectionIndex, note } = action.payload;

            return {
                ...state,
                directions: state.directions.map((direction, iDirection) => (
                    (directionIndex === iDirection)
                        ? {
                            ...direction,
                            steps: direction.steps.map((subDirection, iSubDirection) =>
                                (subDirection.direction_part_type !== types.SubDirectionType.Ingredient) && (subDirectionIndex === iSubDirection)
                                    ? { ...subDirection, label: note }
                                    : subDirection,
                            ),
                        }
                        : direction
                )),
            };
        }

        case types.RECIPE_ITEM_UPDATE_SUBDIRECTION_INGREDIENT_AMOUNT: {

            const { directionIndex, subDirectionIndex, inputValue } = action.payload;

            return {
                ...state,
                directions: state.directions.map((direction, iDirection) => (
                    (directionIndex === iDirection)
                        ? {
                            ...direction,
                            steps: direction.steps.map((subDirection, iSubDirection) => {

                                if (
                                    (subDirection.direction_part_type === types.SubDirectionType.Ingredient) && (subDirectionIndex === iSubDirection)
                                ) {
                                    const amount = Utils.decimalNormalizer(inputValue, (subDirection as RecipeSubDirectionIngredient).amountInput);

                                    return {
                                        ...subDirection,
                                        amountInput: amount,
                                        amount: Number(amount),
                                    };
                                }
                                else {
                                    return subDirection;
                                }
                            }),
                        }
                        : direction
                )),
            };
        }

        case types.RECIPE_ITEM_UPDATE_SUBDIRECTION_INGREDIENT_UNIT: {

            const { directionIndex, subDirectionIndex, unit } = action.payload;

            return {
                ...state,
                directions: state.directions.map((direction, iDirection) => (
                    (directionIndex === iDirection)
                        ? {
                            ...direction,
                            steps: direction.steps.map((subDirection, iSubDirection) => (
                                (subDirection.direction_part_type === types.SubDirectionType.Ingredient) && (subDirectionIndex === iSubDirection)
                                    ? { ...subDirection, unit: unit }
                                    : subDirection
                            )),
                        }
                        : direction
                )),
            };
        }

        case types.RECIPE_ITEM_CREATE_SUBDIRECTION_INGREDIENT: {

            const { directionIndex, ingredientId } = action.payload;

            const ingredient = Utils.unwrapForced(
                state.ingredients.find(_ingredient => _ingredient.id === ingredientId),
                `Ingredient with id = ${ingredientId} is not found`,
            );

            const ingredientProduct = Utils.unwrapForced(
                ingredient.products[ingredient.product_id],
                `IngredientProduct with id = ${ingredient.product_id} is not found`,
            );

            return {
                ...state,
                directions: state.directions.map((direction, iDirection) => (
                    (directionIndex === iDirection)
                        ? {
                            ...direction,
                            steps: [
                                ...direction.steps,
                                {
                                    direction_part_type: types.SubDirectionType.Ingredient,
                                    label: ingredientProduct.name,
                
                                    id: ingredientProduct.product_id,
                                    isMarked: false,
                                    amount: ingredientProduct.amount,
                                    amountInput: ingredientProduct.amountInput,
                                    unit: ingredientProduct.unit,
                                },
                            ],
                        }
                        : direction
                )),  
            };
        }

        case types.RECIPE_ITEM_CREATE_SUBDIRECTION: {

            const { directionIndex, type } = action.payload;

            return {
                ...state,
                directions: state.directions.map((direction, iDirection) => (
                    (directionIndex === iDirection)
                        ? {
                            ...direction,
                            steps: [
                                ...direction.steps,
                                { direction_part_type: type, label: type },
                            ],
                        }
                        : direction
                )),  
            };
        }

        case types.RECIPE_ITEM_UPDATE_NEW_SUBDIRECTION_TYPE: {

            const { directionIndex, type } = action.payload;

            return {
                ...state,
                directions: state.directions.map((direction, iDirection) => (
                    (directionIndex === iDirection)
                        ? { ...direction, newStep: type }
                        : direction
                )),  
            };
        }

        case types.RECIPE_ITEM_UPDATE_DIRECTION_STEP_NUMBER: {

            const { directionIndex, stepNumber } = action.payload;

            return {
                ...state,
                directions: state.directions.map((direction, iDirection) => (
                    (directionIndex === iDirection)
                        ? { ...direction, step_number: stepNumber }
                        : direction
                )),  
            };
        }

        case types.RECIPE_ITEM_UPDATE_DIRECTION_NAME: {

            const { directionIndex, name } = action.payload;

            return {
                ...state,
                directions: state.directions.map((direction, iDirection) => (
                    (directionIndex === iDirection)
                        ? { ...direction, name: name }
                        : direction
                )),  
            };
        }

        case types.RECIPE_ITEM_UPDATE_DIRECTION_TEMPERATURE_COUNT: {

            const { directionIndex, inputValue } = action.payload;

            return {
                ...state,
                directions: state.directions.map((direction, iDirection) => {

                    const count = Utils.decimalNormalizer(inputValue, direction.temperatureInput);

                    return (
                        (directionIndex === iDirection)
                            ? {
                                ...direction,
                                temperature: {
                                    unit: units.DEFAULT_TEMPERATURE_UNIT,
                                    ...direction.temperature,
                                    value: Number(count),
                                },
                                temperatureInput: count,
                            }
                            : direction
                    );
                }),  
            };
        }

        case types.RECIPE_ITEM_UPDATE_DIRECTION_TEMPERATURE_UNIT: {

            const { directionIndex, unit } = action.payload;

            return {
                ...state,
                directions: state.directions.map((direction, iDirection) => (
                    (directionIndex === iDirection)
                        ? {
                            ...direction,
                            temperature: {
                                value: 0,
                                ...direction.temperature,
                                unit: unit,
                            },
                        }
                        : direction
                )),  
            };
        }

        case types.RECIPE_ITEM_UPDATE_DIRECTION_TIME_COUNT: {

            const { directionIndex, inputValue } = action.payload;

            return {
                ...state,
                directions: state.directions.map((direction, iDirection) => {

                    const count = Utils.decimalNormalizer(inputValue, direction.durationInput);

                    return (
                        (directionIndex === iDirection)
                            ? {
                                ...direction,
                                duration: {
                                    unit: units.DEFAULT_TIME_UNIT,
                                    ...direction.duration,
                                    value: Number(count),
                                },
                                durationInput: count,
                            }
                            : direction
                    );
                }),  
            };
        }

        case types.RECIPE_ITEM_UPDATE_DIRECTION_TIME_UNIT: {

            const { directionIndex, unit } = action.payload;

            return {
                ...state,
                directions: state.directions.map((direction, iDirection) => (
                    (directionIndex === iDirection)
                        ? {
                            ...direction,
                            duration: {
                                value: 0,
                                ...direction.duration,
                                unit: unit,
                            },
                        }
                        : direction
                )),  
            };
        }

        case types.RECIPE_ITEM_UPDATE_NEW_DIRECTION_STEP_NUMBER: {

            const stepNumber = action.payload;

            return {
                ...state,
                newDirection: { ...state.newDirection, step_number: stepNumber },  
            };
        }

        case types.RECIPE_ITEM_UPDATE_NEW_DIRECTION_NAME: {

            const name = action.payload;

            return {
                ...state,
                newDirection: { ...state.newDirection, name: name },  
            };
        }

        case types.RECIPE_ITEM_UPDATE_NEW_DIRECTION_TEMPERATURE_COUNT: {

            const inputValue = action.payload;

            const count = Utils.decimalNormalizer(inputValue, state.newDirection.temperatureInput);

            return {
                ...state,
                newDirection: {
                    ...state.newDirection,
                    temperature: {
                        unit: units.DEFAULT_TEMPERATURE_UNIT,
                        ...state.newDirection.temperature,
                        value: Number(count),
                    },
                    temperatureInput: count,
                },
            };
        }

        case types.RECIPE_ITEM_UPDATE_NEW_DIRECTION_TEMPERATURE_UNIT: {

            const unit = action.payload;

            return {
                ...state,
                newDirection: {
                    ...state.newDirection,
                    temperature: {
                        value: 0,
                        ...state.newDirection.temperature,
                        unit: unit,
                    },
                },  
            };
        }

        case types.RECIPE_ITEM_UPDATE_NEW_DIRECTION_TIME_COUNT: {

            const inputValue = action.payload;

            const count = Utils.decimalNormalizer(inputValue, state.newDirection.durationInput);

            return {
                ...state,
                newDirection: {
                    ...state.newDirection,
                    duration: {
                        unit: units.DEFAULT_TIME_UNIT,
                        ...state.newDirection.duration,
                        value: Number(count),
                    },
                    durationInput: count,
                },  
            };
        }

        case types.RECIPE_ITEM_UPDATE_NEW_DIRECTION_TIME_UNIT: {

            const unit = action.payload;

            return {
                ...state,
                newDirection: {
                    ...state.newDirection,
                    duration: {
                        value: 0,
                        ...state.newDirection.duration,
                        unit: unit,
                    },
                },  
            };
        }

        case types.RECIPE_ITEM_CREATE_DIRECTION: {

            const direction = action.payload;

            return {
                ...state,
                directions: [
                    ...state.directions,
                    {
                        isOpen: false,
                        isMarked: false,
                
                        step_number: direction.step_number,
                        name: direction.name,
                
                        duration: ( !direction.durationInput ? null : direction.duration  ),
                        temperature: ( !direction.temperatureInput ? null : direction.temperature ),
                
                        durationInput: direction.durationInput,
                        temperatureInput: direction.temperatureInput,
                
                        newStep: types.SubDirectionType.Note,
                        steps: [],
                    },
                ],
                newDirection: {
                    isOpen: false,
                    isMarked: false,

                    step_number: 0,
                    name: "",

                    duration: {
                        value: 0,
                        unit: units.TimeUnit.min,
                    },
                    temperature: {
                        value: 0,
                        unit: units.TemperatureUnit.C,
                    },
            
                    durationInput: "",
                    temperatureInput: "",
            
                    newStep: types.SubDirectionType.Note,
                    steps: [],
                },
            };
        }

        case types.RECIPE_ITEM_REMOVE_INGREDIENT: {

            const id = action.payload;

            const ingredients = state.ingredients.filter((ingredient) => ingredient.id !== id);

            return {
                ...state,
                ingredients: ingredients,
                nutritionFacts: getRecipeNutritionFacts(ingredients),
            };
        }

        case types.RECIPE_ITEM_REMOVE_ALT_INGREDIENT: {

            const { parentId, id } = action.payload;

            return {
                ...state,
                ingredients: state.ingredients.map((ingredient) => (
                    ( ingredient.id === parentId )
                        ? {
                            ...ingredient,
                            products: Utils.getObjectKeys(ingredient.products).reduce((acc, product_id) => (
                                product_id !== id
                                    ? { ...acc, [product_id]: ingredient.products[product_id] }
                                    : acc
                            ), {}),
                        }
                        : ingredient
                )),
            };
        }

        case types.RECIPE_ITEM_REPLACE_INGREDIENT_WITH_ALTERNATIVE: {

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
                nutritionFacts: getRecipeNutritionFacts(ingredients),
            };
        }

        case types.RECIPE_ITEM_TOGGLE_INGREDIENT_OPEN: {

            const id = action.payload;

            return {
                ...state,
                ingredients: state.ingredients.map((ingredient) => ({
                    ...ingredient,
                    isOpen: (ingredient.id === id) ? !ingredient.isOpen : ingredient.isOpen,
                })),
            };
        }

        case types.RECIPE_ITEM_TOGGLE_INGREDIENT_MARK: {

            const id = action.payload;

            return {
                ...state,
                ingredients: state.ingredients.map((ingredient) => ({
                    ...ingredient,
                    isMarked: (ingredient.id === id) ? !ingredient.isMarked : ingredient.isMarked,
                })),
            };
        }


        case types.RECIPE_ITEM_UPDATE_INGREDIENT_AMOUNT: {

            const { id, inputValue } = action.payload;

            const ingredients = state.ingredients.map((ingredient) => {

                if (ingredient.id === id) {
                    const product = Utils.unwrapForced(ingredient.products[ingredient.product_id], `ingredient.products[${ingredient.product_id}]`);
                    const amount = Utils.decimalNormalizer(inputValue, product.amountInput);

                    return {
                        ...ingredient,
                        products: {
                            ...ingredient.products,
                            [ingredient.product_id]: {
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
            });

            return {
                ...state,
                ingredients: ingredients,
                nutritionFacts: getRecipeNutritionFacts(ingredients),
            };
        }

        case types.RECIPE_ITEM_UPDATE_INGREDIENT_UNIT: {

            const { id, unit } = action.payload;

            return {
                ...state,
                ingredients: state.ingredients.map((ingredient) => {
                    if (ingredient.id === id) {

                        const product = Utils.unwrapForced(ingredient.products[ingredient.product_id], `ingredient.products[${ingredient.product_id}]`);

                        return {
                            ...ingredient,
                            products: {
                                ...ingredient.products,
                                [ingredient.product_id]: { ...product, unit },
                            },
                        };
                    }
                    else {
                        return ingredient;
                    }
                }),
            };
        }


        case types.RECIPE_ITEM_UPDATE_ALT_INGREDIENT_AMOUNT: {

            const { parentId, id, inputValue } = action.payload;

            return {
                ...state,
                ingredients: state.ingredients.map((ingredient) => {

                    if (ingredient.id === parentId) {
                        const product = Utils.unwrapForced(ingredient.products[id], `ingredient.products[${id}]`);
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

        case types.RECIPE_ITEM_UPDATE_ALT_INGREDIENT_UNIT: {

            const { parentId, id, unit } = action.payload;

            return {
                ...state,
                ingredients: state.ingredients.map((ingredient) => {
                    if (ingredient.id === parentId) {

                        const product = Utils.unwrapForced(ingredient.products[id], `ingredient.products[${id}]`);

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

        case types.RECIPE_ITEM_UPDATE_ALT_NUTRITION_FACTS: {

            const { parentId, id, isSelected } = action.payload;

            return {
                ...state,
                ingredients: state.ingredients.map((ingredient) => (
                    (ingredient.id === parentId)
                        ? {
                            ...ingredient,
                            altNutritionFacts: (
                                isSelected
                                    ? Utils.unwrapForced(
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

        case types.RECIPE_ITEM_ADD_INGREDIENT: {

            const ingredientProduct = action.payload;

            const ingredients = [
                ...state.ingredients,
                {
                    isOpen: true,
                    isMarked: false,
    
                    // NOTE: new id that will be generated by postgres
                    id: -1, // ingredient.id,

                    product_id: ingredientProduct.product_id,
            
                    altNutritionFacts: {},
        
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
                nutritionFacts: getRecipeNutritionFacts(ingredients),
            };
        }

        case types.RECIPE_ITEM_ADD_ALT_INGREDIENT: {

            const { id, altIngredientProduct } = action.payload;

            return {
                ...state,
                ingredients: state.ingredients.map((ingredient) => (
                    (ingredient.id === id)
                        ? {
                            ...ingredient,
                            products: {
                                ...ingredient.products,
                                [altIngredientProduct.product_id]: {
                                    ...altIngredientProduct,
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

        case types.RECIPE_ITEM_UPDATE_SERVING_SIZE_AMOUNT: {

            const inputValue = action.payload;

            const amount = Utils.decimalNormalizer(inputValue, state.servingSizeInput);

            return {
                ...state,
                servingSize: Number(amount),
                servingSizeInput: amount,
            };
        }

        case types.RECIPE_ITEM_UPDATE_SERVING_SIZE_UNIT: {

            const unit = action.payload;

            return {
                ...state,
                servingSizeUnit: unit,
            };
        }

        case types.RECIPE_ITEM_FETCH_REQUEST: {
            return {
                ...state,
                isLoaded: false,
                errorMessage: null,

                id: action.payload,
            };
        }

        case types.RECIPE_ITEM_FETCH_SUCCESS: {
            const recipeItem = action.payload;

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

                nutritionFacts: getRecipeNutritionFacts(recipeItem.ingredients),

                customUnits: recipeItem.custom_units,
                customUnitInputs: Utils.convertCustomUnitsIntoInputs(recipeItem.custom_units),

                ingredients: convertIngredients(recipeItem.ingredients),
                directions: convertDirections(recipeItem.directions),
            };
        }

        case types.RECIPE_ITEM_FETCH_ERROR: {
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
