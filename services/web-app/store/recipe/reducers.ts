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

    id: "",
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

        stepNumber: 4,
        name: "",

        time: {
            count: 0,
            unit: units.DEFAULT_TIME_UNIT,
        },
        temperature: {
            count: 0,
            unit: units.DEFAULT_TEMPERATURE_UNIT,
        },

        timeInput: "",
        temperatureInput: "",

        newStep: types.SubDirectionType.Note,
        steps: [],
    },
    directions: [],

    references: {},
};


function extractState(globalState: AppState): types.RecipePageStore {
    return (globalState?.recipePage || initialState);
}

export function extractCustomUnits(globalState: AppState): units.CustomUnit[] {
    return extractState(globalState).customUnits;
}


function convertIngredients(ingredients: typings.IngredientDefault[]): types.RecipeIngredientDefault[] {

    return ingredients.map((ingredient) => ({
        ...ingredient,

        isOpen: false,
        isMarked: false,
        amountInput: String(ingredient.amount),
        alternatives: ingredient.alternatives.map((alt) => ({
            ...alt,
            amountInput: String(alt.amount),
        })),
        altNutritionFacts: {},
    }));
}

function convertDirections(directions: typings.Direction[]): types.RecipeDirection[] {

    return directions.map((direction) => ({
        ...direction,

        isOpen: true,
        isMarked: false,
        timeInput: direction.time?.count ? String(direction.time?.count) : "",
        temperatureInput: direction.temperature?.count ? String(direction.temperature?.count) : "",
        newStep: types.SubDirectionType.Note,

        steps: direction.steps.map((step) => 
            step.type !== types.SubDirectionType.Ingredient
                ? step
                : ({
                    ...step,
                    isMarked: false,
                    amountInput: String((step as typings.SubDirectionIngredient).amount),
                }),
        ),
    }));
}

function getRecipeNutritionFacts(
    ingredients: typings.IngredientDefault[],
    references: Dictionary<string, typings.IngredientItem>,
): Dictionary<NutritionFactType, number> {

    const nutritionFactsById: Dictionary<NutritionFactType, number>[] = ingredients
        .map((ingredient) => {
            
            const nutritionFacts = Utils.unwrapForced(references[ingredient.id], `references["${ingredient.id}"]`).nutritionFacts;
            const multiplier = Utils.getPercentMultiplier(ingredient.amount);

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
                                        (subDirection.type === types.SubDirectionType.Ingredient)
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
                            (subDirection.type === types.SubDirectionType.Ingredient) && (subDirectionIndex === iSubDirection)
                                ? { ...subDirection, isMarked: !(subDirection as types.RecipeSubDirectionIngredient).isMarked }
                                : subDirection
                        ));

                        const areAllStepsMarked = steps.every((step) => (
                            (step.type !== types.SubDirectionType.Ingredient) || (step as types.RecipeSubDirectionIngredient).isMarked
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
                                (subDirection.type !== types.SubDirectionType.Ingredient) && (subDirectionIndex === iSubDirection)
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
                                    (subDirection.type === types.SubDirectionType.Ingredient) && (subDirectionIndex === iSubDirection)
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
                                (subDirection.type === types.SubDirectionType.Ingredient) && (subDirectionIndex === iSubDirection)
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

            const ingredientItem: typings.IngredientItem = Utils.unwrapForced(
                state.references[ingredientId],
                `state.references["${ingredientId}"]`,
            );
            const ingredient: types.RecipeIngredientDefault = Utils.unwrapForced(
                state.ingredients.find((_ingredient) => _ingredient.id === ingredientId),
                `state.ingredients.find((_ingredient) => _ingredient.id === "${ingredientId}")`,
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
                                    type: types.SubDirectionType.Ingredient,
                                    label: ingredientItem.name,
                
                                    id: ingredientItem.id,
                                    isMarked: false,
                                    amount: ingredient.amount,
                                    amountInput: ingredient.amountInput,
                                    unit: ingredient.unit,
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
                                { type: type, label: type },
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
                        ? { ...direction, stepNumber: stepNumber }
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
                                    count: Number(count),
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
                                count: 0,
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

                    const count = Utils.decimalNormalizer(inputValue, direction.timeInput);

                    return (
                        (directionIndex === iDirection)
                            ? {
                                ...direction,
                                time: {
                                    unit: units.DEFAULT_TIME_UNIT,
                                    ...direction.time,
                                    count: Number(count),
                                },
                                timeInput: count,
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
                            time: {
                                count: 0,
                                ...direction.time,
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
                newDirection: { ...state.newDirection, stepNumber: stepNumber },  
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
                        count: Number(count),
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
                        count: 0,
                        ...state.newDirection.temperature,
                        unit: unit,
                    },
                },  
            };
        }

        case types.RECIPE_ITEM_UPDATE_NEW_DIRECTION_TIME_COUNT: {

            const inputValue = action.payload;

            const count = Utils.decimalNormalizer(inputValue, state.newDirection.timeInput);

            return {
                ...state,
                newDirection: {
                    ...state.newDirection,
                    time: {
                        unit: units.DEFAULT_TIME_UNIT,
                        ...state.newDirection.time,
                        count: Number(count),
                    },
                    timeInput: count,
                },  
            };
        }

        case types.RECIPE_ITEM_UPDATE_NEW_DIRECTION_TIME_UNIT: {

            const unit = action.payload;

            return {
                ...state,
                newDirection: {
                    ...state.newDirection,
                    time: {
                        count: 0,
                        ...state.newDirection.time,
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
                
                        stepNumber: direction.stepNumber,
                        name: direction.name,
                
                        time: ( !direction.timeInput ? null : direction.time  ),
                        temperature: ( !direction.temperatureInput ? null : direction.temperature ),
                
                        timeInput: direction.timeInput,
                        temperatureInput: direction.temperatureInput,
                
                        newStep: types.SubDirectionType.Note,
                        steps: [],
                    },
                ],
                newDirection: {
                    isOpen: false,
                    isMarked: false,

                    stepNumber: 0,
                    name: "",

                    time: {
                        count: 0,
                        unit: units.TimeUnit.min,
                    },
                    temperature: {
                        count: 0,
                        unit: units.TemperatureUnit.C,
                    },
            
                    timeInput: "",
                    temperatureInput: "",
            
                    newStep: types.SubDirectionType.Note,
                    steps: [],
                },
            };
        }

        case types.RECIPE_ITEM_REMOVE_INGREDIENT: {

            const id = action.payload;

            const ingredients = state.ingredients.filter((ingredient) => ingredient.id !== id);
            const references = Utils.getObjectKeys(state.references).reduce((refs, rid) => (
                (rid !== id) ? { ...refs, [rid]: state.references[rid] } : refs
            ), {});

            return {
                ...state,
                ingredients: ingredients,
                references: references,
                nutritionFacts: getRecipeNutritionFacts(ingredients, references),
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
                            alternatives: ingredient.alternatives.filter((alt) => alt.id !== id),
                        }
                        : ingredient
                )),
                references: Utils.getObjectKeys(state.references).reduce((refs, rid) => (
                    (rid !== id) ? { ...refs, [rid]: state.references[rid] } : refs
                ), {}),
            };
        }

        case types.RECIPE_ITEM_REPLACE_INGREDIENT_WITH_ALTERNATIVE: {

            const { parentId, id } = action.payload;

            const ingredients = state.ingredients.reduce<types.RecipeIngredientDefault[]>((accIngredients, curIngredient) => {

                if (curIngredient.id === parentId) {

                    
                    const alternative: types.RecipeIngredient = Utils.unwrapForced(
                        curIngredient.alternatives.find((alt) => alt.id === id),
                        `curIngredient.alternatives.find((alt) => alt.id === "${id}")`,
                    );
                    const newAlternative: types.RecipeIngredient = {
                        amount: curIngredient.amount,
                        amountInput: curIngredient.amountInput,
                        unit: curIngredient.unit,
                        id: curIngredient.id,
                    };

                    return [
                        ...accIngredients,
                        {
                            ...curIngredient,
                            alternatives: [
                                ...curIngredient.alternatives.filter((alt) => alt.id !== id),
                                newAlternative,
                            ],
                            amount: alternative.amount,
                            amountInput: alternative.amountInput,
                            unit: alternative.unit,
                            id: alternative.id,
                        },
                    ];
                }
                else {
                    return [ ...accIngredients, curIngredient ];
                }
            }, []);

            return {
                ...state,
                ingredients: ingredients,
                nutritionFacts: getRecipeNutritionFacts(ingredients, state.references),
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

                    const amount = Utils.decimalNormalizer(inputValue, ingredient.amountInput);

                    return {
                        ...ingredient,
                        amountInput: amount,
                        amount: Number(amount),
                    };
                }
                else {
                    return ingredient;
                }
            });

            return {
                ...state,
                ingredients: ingredients,
                nutritionFacts: getRecipeNutritionFacts(ingredients, state.references),
            };
        }

        case types.RECIPE_ITEM_UPDATE_INGREDIENT_UNIT: {

            const { id, unit } = action.payload;

            return {
                ...state,
                ingredients: state.ingredients.map((ingredient) => (
                    (ingredient.id === id) ? { ...ingredient, unit: unit } : ingredient
                )),
            };
        }


        case types.RECIPE_ITEM_UPDATE_ALT_INGREDIENT_AMOUNT: {

            const { parentId, id, inputValue } = action.payload;

            return {
                ...state,
                ingredients: state.ingredients.map((ingredient) => (
                    (ingredient.id === parentId)
                        ? {
                            ...ingredient,
                            alternatives: ingredient.alternatives.map((alt) => {

                                const amount = Utils.decimalNormalizer(inputValue, alt.amountInput);

                                return (
                                    (alt.id === id)
                                        ? { ...alt, amountInput: amount, amount: Number(amount) }
                                        : alt
                                );
                            }),
                        }
                        : ingredient
                )),
            };
        }

        case types.RECIPE_ITEM_UPDATE_ALT_INGREDIENT_UNIT: {

            const { parentId, id, unit } = action.payload;

            return {
                ...state,
                ingredients: state.ingredients.map((ingredient) => (
                    (ingredient.id === parentId)
                        ? {
                            ...ingredient,
                            alternatives: ingredient.alternatives.map((alt) => (
                                (alt.id === id) ? { ...alt, unit: unit } : alt
                            )),
                        }
                        : ingredient
                )),
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
                                    ? Utils.unwrapForced(state.references[id], `state.references["${id}"]`).nutritionFacts
                                    : {}
                            ),
                        }
                        : ingredient
                )),
            };
        }

        case types.RECIPE_ITEM_ADD_INGREDIENT: {

            const ingredient = action.payload;

            if (ingredient.id in state.references) {
                return state;
            }

            const ingredients = [
                ...state.ingredients,
                {
                    isOpen: true,
                    isMarked: false,
    
                    id: ingredient.id,
    
                    amount: 100,
                    amountInput: "100",
                    unit: units.WeightUnit.g,
        
                    altNutritionFacts: {},
        
                    alternatives: [],    
                },
            ];

            const references = {
                ...state.references,
                [ingredient.id]: ingredient,
            };

            return {
                ...state,
                ingredients: ingredients,
                references: references,
                nutritionFacts: getRecipeNutritionFacts(ingredients, references),
            };
        }

        case types.RECIPE_ITEM_ADD_ALT_INGREDIENT: {

            const { id, altIngredient } = action.payload;

            if (altIngredient.id in state.references) {
                return state;
            }

            return {
                ...state,
                ingredients: state.ingredients.map((ingredient) => (
                    (ingredient.id === id)
                        ? {
                            ...ingredient,
                            alternatives: [
                                ...ingredient.alternatives,
                                {
                                    amount: 100,
                                    amountInput: "100",
                                    unit: units.WeightUnit.g,
                                    id: altIngredient.id,
                                },
                            ],
                        }
                        : ingredient
                )),
                references: {
                    ...state.references,
                    [altIngredient.id]: altIngredient,
                },
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

                id: action.payload as string,
            };
        }

        case types.RECIPE_ITEM_FETCH_SUCCESS: {
            const recipeItem = action.payload;

            const referenceItems: typings.IngredientItem[] = [
                ...(recipeItem.references?.food || []),
                ...(recipeItem.references?.recipe || []),
            ];

            const references: Dictionary<string, typings.IngredientItem> = referenceItems
                .reduce((refs, item) => ({ ...refs, [item.id]: item }), {});

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

                nutritionFacts: getRecipeNutritionFacts(recipeItem.ingredients, references),

                customUnits: recipeItem.customUnits,
                customUnitInputs: Utils.convertCustomUnitsIntoInputs(recipeItem.customUnits),

                ingredients: convertIngredients(recipeItem.ingredients),
                directions: convertDirections(recipeItem.directions),

                references: references,
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
