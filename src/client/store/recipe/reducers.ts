import { NutritionFactType } from "../../../common/nutritionFacts";
import { Dictionary, Direction, IngredientDefault, IngredientItem, SubDirectionIngredient } from "../../../common/typings";
import { CustomUnitInput, TemperatureUnit, TimeUnit, WeightUnit } from "../../../common/units";
import Utils, { DecimalPlaces } from "../../../common/utils";
import {
    RECIPE_ITEM_UPDATE_NAME,
    RECIPE_ITEM_UPDATE_BRAND,
    RECIPE_ITEM_UPDATE_SUBTITLE,
    RECIPE_ITEM_UPDATE_DESCRIPTION,
    RecipeItemActionTypes,
    RecipePageStore,
    RecipeIngredientDefault,
    SubDirectionType,
    RECIPE_ITEM_REMOVE_DIRECTION,
    RECIPE_ITEM_REMOVE_SUBDIRECTION,
    RECIPE_ITEM_TOGGLE_DIRECTION_OPEN,
    RECIPE_ITEM_TOGGLE_DIRECTION_MARK,
    RECIPE_ITEM_TOGGLE_SUBDIRECTION_MARK,
    RecipeSubDirectionIngredient,
    RECIPE_ITEM_UPDATE_SUBDIRECTION_NOTE,
    RECIPE_ITEM_UPDATE_SUBDIRECTION_INGREDIENT_AMOUNT,
    RECIPE_ITEM_UPDATE_SUBDIRECTION_INGREDIENT_UNIT,
    RECIPE_ITEM_CREATE_SUBDIRECTION_INGREDIENT,
    RECIPE_ITEM_CREATE_SUBDIRECTION,
    RECIPE_ITEM_UPDATE_NEW_SUBDIRECTION_TYPE,
    RECIPE_ITEM_UPDATE_DIRECTION_STEP_NUMBER,
    RECIPE_ITEM_UPDATE_DIRECTION_NAME,
    RECIPE_ITEM_UPDATE_DIRECTION_TEMPERATURE_COUNT,
    RECIPE_ITEM_UPDATE_DIRECTION_TEMPERATURE_UNIT,
    RECIPE_ITEM_UPDATE_DIRECTION_TIME_COUNT,
    RECIPE_ITEM_UPDATE_DIRECTION_TIME_UNIT,
    RECIPE_ITEM_UPDATE_NEW_DIRECTION_STEP_NUMBER,
    RECIPE_ITEM_UPDATE_NEW_DIRECTION_NAME,
    RECIPE_ITEM_UPDATE_NEW_DIRECTION_TEMPERATURE_COUNT,
    RECIPE_ITEM_UPDATE_NEW_DIRECTION_TEMPERATURE_UNIT,
    RECIPE_ITEM_UPDATE_NEW_DIRECTION_TIME_COUNT,
    RECIPE_ITEM_UPDATE_NEW_DIRECTION_TIME_UNIT,
    RECIPE_ITEM_CREATE_DIRECTION,
    RECIPE_ITEM_REMOVE_INGREDIENT,
    RECIPE_ITEM_REMOVE_ALT_INGREDIENT,
    RECIPE_ITEM_REPLACE_INGREDIENT_WITH_ALTERNATIVE,
    RecipeIngredient,
    RECIPE_ITEM_TOGGLE_INGREDIENT_OPEN,
    RECIPE_ITEM_TOGGLE_INGREDIENT_MARK,
    RECIPE_ITEM_UPDATE_INGREDIENT_AMOUNT,
    RECIPE_ITEM_UPDATE_INGREDIENT_UNIT,
    RECIPE_ITEM_UPDATE_ALT_INGREDIENT_AMOUNT,
    RECIPE_ITEM_UPDATE_ALT_INGREDIENT_UNIT,
    RECIPE_ITEM_UPDATE_ALT_NUTRITION_FACTS,
    RECIPE_ITEM_ADD_INGREDIENT,
    RECIPE_ITEM_ADD_ALT_INGREDIENT,
    RECIPE_ITEM_UPDATE_SERVING_SIZE_AMOUNT,
    RECIPE_ITEM_UPDATE_SERVING_SIZE_UNIT,
    RECIPE_ITEM_UPDATE_TYPE,
    RECIPE_ITEM_UPDATE_CUSTOM_UNITS,
    RECIPE_ITEM_FETCH_REQUESTED,
    RECIPE_ITEM_FETCH_SUCCESS,
    RECIPE_ITEM_FETCH_ERROR,
    RecipeDirection,
} from "./types";



const initialState: RecipePageStore = {

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
    servingSizeUnit: WeightUnit.g,

    ingredients: [],

    newDirection: {
        isOpen: false,
        isMarked: false,

        stepNumber: 4,
        name: "",

        time: {
            count: 0,
            unit: TimeUnit.min,
        },
        temperature: {
            count: 0,
            unit: TemperatureUnit.C,
        },

        timeInput: "",
        temperatureInput: "",

        newStep: SubDirectionType.Note,
        steps: [],
    },
    directions: [],

    references: {},
};



function convertIngredients(ingredients: IngredientDefault[]): RecipeIngredientDefault[] {

    return ingredients.map((ingredient) => ({
        ...ingredient,

        isOpen: true,
        isMarked: false,
        amountInput: String(ingredient.amount),
        alternatives: ingredient.alternatives.map((alt) => ({
            ...alt,
            amountInput: String(alt.amount),
        })),
        altNutritionFacts: {},
    }));
}

function convertDirections(directions: Direction[]): RecipeDirection[] {

    return directions.map((direction) => ({
        ...direction,

        isOpen: true,
        isMarked: false,
        timeInput: direction.time?.count ? String(direction.time?.count) : "",
        temperatureInput: direction.temperature?.count ? String(direction.temperature?.count) : "",
        newStep: SubDirectionType.Note,

        steps: direction.steps.map((step) => 
            step.type !== SubDirectionType.Ingredient
                ? step
                : ({
                    ...step,
                    isMarked: false,
                    amountInput: String((step as SubDirectionIngredient).amount),
                })
        ),
    }));
}

function getRecipeNutritionFacts(
    ingredients: IngredientDefault[],
    references: Dictionary<string, IngredientItem>,
): Dictionary<NutritionFactType, number> {

    const nutritionFactsById: Dictionary<NutritionFactType, number>[] = ingredients
        .map((ingredient) => {
            
            const nf = references[ingredient.id].nutritionFacts;
            const multiplier = Utils.getPercentMultiplier(ingredient.amount);

            return Utils.getObjectKeys(nf)
                .reduce((acc, nfType) => ({
                    ...acc,
                    [nfType]: (
                        typeof nf[nfType] === "number"
                            ? Utils.roundToDecimal(nf[nfType] * multiplier, DecimalPlaces.Two)
                            : null
                    ),
                }), {});
        });

    return Utils.dictionarySum(nutritionFactsById);
}


export default function recipePageReducer(state = initialState, action: RecipeItemActionTypes): RecipePageStore {

    switch (action.type) {

        case RECIPE_ITEM_UPDATE_NAME: {
            return {
                ...state,
                name: action.payload,
            };
        }

        case RECIPE_ITEM_UPDATE_BRAND: {
            return {
                ...state,
                brand: action.payload,
            };
        }

        case RECIPE_ITEM_UPDATE_SUBTITLE: {
            return {
                ...state,
                subtitle: action.payload,
            };
        }

        case RECIPE_ITEM_UPDATE_DESCRIPTION: {
            return {
                ...state,
                description: action.payload,
            };
        }

        case RECIPE_ITEM_UPDATE_TYPE: {
            return {
                ...state,
                type: action.payload,
            };
        }

        case RECIPE_ITEM_UPDATE_CUSTOM_UNITS: {
            return {
                ...state,

                customUnits: Utils.convertCustomUnitsIntoValues(action.payload),
                customUnitInputs: action.payload as CustomUnitInput[],
            };
        }

        case RECIPE_ITEM_REMOVE_DIRECTION: {
            const directionIndex = action.payload;
            return {
                ...state,
                directions: state.directions.filter((_direction, index) => (index !== directionIndex)),
            };
        }

        case RECIPE_ITEM_REMOVE_SUBDIRECTION: {
            const { directionIndex, subDirectionIndex } = action.payload;
            return {
                ...state,
                directions: state.directions.map((direction, iDirection) => (
                    (iDirection === directionIndex)
                        ? {
                            ...direction,
                            steps: direction.steps.filter(
                                (_sd, iSubDirection) => (iSubDirection !== subDirectionIndex)
                            ),
                        }
                        : direction
                )),
            };
        }

        case RECIPE_ITEM_TOGGLE_DIRECTION_OPEN: {
            const directionIndex = action.payload;
            return {
                ...state,
                directions: state.directions.map((direction, index) =>
                    (index === directionIndex)
                        ? { ...direction, isOpen: !direction.isOpen }
                        : direction
                ),
            };
        }

        case RECIPE_ITEM_TOGGLE_DIRECTION_MARK: {
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
                                        (subDirection.type === SubDirectionType.Ingredient)
                                            ? { ...subDirection, isMarked: true }
                                            : subDirection
                                    ))
                            ),
                        }
                        : direction
                ),
            };
        }

        case RECIPE_ITEM_TOGGLE_SUBDIRECTION_MARK: {
            const { directionIndex, subDirectionIndex } = action.payload;
            return {
                ...state,
                directions: state.directions.map((direction, iDirection) => {

                    if (directionIndex === iDirection) {

                        const steps = direction.steps.map((subDirection: RecipeSubDirectionIngredient, iSubDirection) =>
                            (subDirection.type === SubDirectionType.Ingredient) && (subDirectionIndex === iSubDirection)
                                ? { ...subDirection, isMarked: !subDirection.isMarked }
                                : subDirection
                        );

                        const areAllStepsMarked = steps.every((step) => (
                            (step.type !== SubDirectionType.Ingredient) || step.isMarked
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

        case RECIPE_ITEM_UPDATE_SUBDIRECTION_NOTE: {
            const { directionIndex, subDirectionIndex, note } = action.payload;

            return {
                ...state,
                directions: state.directions.map((direction, iDirection) => (
                    (directionIndex === iDirection)
                        ? {
                            ...direction,
                            steps: direction.steps.map((subDirection, iSubDirection) =>
                                (subDirection.type !== SubDirectionType.Ingredient) && (subDirectionIndex === iSubDirection)
                                    ? { ...subDirection, label: note }
                                    : subDirection
                            ),
                        }
                        : direction
                )),
            };
        }

        case RECIPE_ITEM_UPDATE_SUBDIRECTION_INGREDIENT_AMOUNT: {

            const { directionIndex, subDirectionIndex, inputValue } = action.payload;

            return {
                ...state,
                directions: state.directions.map((direction, iDirection) => (
                    (directionIndex === iDirection)
                        ? {
                            ...direction,
                            steps: direction.steps.map((subDirection: RecipeSubDirectionIngredient, iSubDirection) => {

                                if (
                                    (subDirection.type === SubDirectionType.Ingredient) && (subDirectionIndex === iSubDirection)
                                ) {
                                    const amount = Utils.decimalNormalizer(inputValue, subDirection.amountInput);

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

        case RECIPE_ITEM_UPDATE_SUBDIRECTION_INGREDIENT_UNIT: {

            const { directionIndex, subDirectionIndex, unit } = action.payload;

            return {
                ...state,
                directions: state.directions.map((direction, iDirection) => (
                    (directionIndex === iDirection)
                        ? {
                            ...direction,
                            steps: direction.steps.map((subDirection: RecipeSubDirectionIngredient, iSubDirection) => (
                                (subDirection.type === SubDirectionType.Ingredient) && (subDirectionIndex === iSubDirection)
                                    ? { ...subDirection, unit: unit }
                                    : subDirection
                            )),
                        }
                        : direction
                )),
            };
        }

        case RECIPE_ITEM_CREATE_SUBDIRECTION_INGREDIENT: {

            const { directionIndex, ingredientId } = action.payload;

            const ingredientItem = state.references[ingredientId];
            const ingredient = state.ingredients.find((ingredient) => ingredient.id === ingredientId);

            return {
                ...state,
                directions: state.directions.map((direction, iDirection) => (
                    (directionIndex === iDirection)
                        ? {
                            ...direction,
                            steps: [
                                ...direction.steps,
                                {
                                    type: SubDirectionType.Ingredient,
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

        case RECIPE_ITEM_CREATE_SUBDIRECTION: {

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

        case RECIPE_ITEM_UPDATE_NEW_SUBDIRECTION_TYPE: {

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

        case RECIPE_ITEM_UPDATE_DIRECTION_STEP_NUMBER: {

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

        case RECIPE_ITEM_UPDATE_DIRECTION_NAME: {

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

        case RECIPE_ITEM_UPDATE_DIRECTION_TEMPERATURE_COUNT: {

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

        case RECIPE_ITEM_UPDATE_DIRECTION_TEMPERATURE_UNIT: {

            const { directionIndex, unit } = action.payload;

            return {
                ...state,
                directions: state.directions.map((direction, iDirection) => (
                    (directionIndex === iDirection)
                        ? {
                            ...direction,
                            temperature: {
                                ...direction.temperature,
                                unit: unit,
                            },
                        }
                        : direction
                )),  
            };
        }

        case RECIPE_ITEM_UPDATE_DIRECTION_TIME_COUNT: {

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

        case RECIPE_ITEM_UPDATE_DIRECTION_TIME_UNIT: {

            const { directionIndex, unit } = action.payload;

            return {
                ...state,
                directions: state.directions.map((direction, iDirection) => (
                    (directionIndex === iDirection)
                        ? {
                            ...direction,
                            time: {
                                ...direction.time,
                                unit: unit,
                            },
                        }
                        : direction
                )),  
            };
        }

        case RECIPE_ITEM_UPDATE_NEW_DIRECTION_STEP_NUMBER: {

            const stepNumber = action.payload;

            return {
                ...state,
                newDirection: { ...state.newDirection, stepNumber: stepNumber },  
            };
        }

        case RECIPE_ITEM_UPDATE_NEW_DIRECTION_NAME: {

            const name = action.payload;

            return {
                ...state,
                newDirection: { ...state.newDirection, name: name },  
            };
        }

        case RECIPE_ITEM_UPDATE_NEW_DIRECTION_TEMPERATURE_COUNT: {

            const inputValue = action.payload;

            const count = Utils.decimalNormalizer(inputValue, state.newDirection.temperatureInput);

            return {
                ...state,
                newDirection: {
                    ...state.newDirection,
                    temperature: {
                        ...state.newDirection.temperature,
                        count: Number(count),
                    },
                    temperatureInput: count,
                },
            };
        }

        case RECIPE_ITEM_UPDATE_NEW_DIRECTION_TEMPERATURE_UNIT: {

            const unit = action.payload;

            return {
                ...state,
                newDirection: {
                    ...state.newDirection,
                    temperature: {
                        ...state.newDirection.temperature,
                        unit: unit,
                    },
                },  
            };
        }

        case RECIPE_ITEM_UPDATE_NEW_DIRECTION_TIME_COUNT: {

            const inputValue = action.payload;

            const count = Utils.decimalNormalizer(inputValue, state.newDirection.timeInput);

            return {
                ...state,
                newDirection: {
                    ...state.newDirection,
                    time: {
                        ...state.newDirection.time,
                        count: Number(count),
                    },
                    timeInput: count,
                },  
            };
        }

        case RECIPE_ITEM_UPDATE_NEW_DIRECTION_TIME_UNIT: {

            const unit = action.payload;

            return {
                ...state,
                newDirection: {
                    ...state.newDirection,
                    time: {
                        ...state.newDirection.time,
                        unit: unit,
                    },
                },  
            };
        }

        case RECIPE_ITEM_CREATE_DIRECTION: {

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
                
                        newStep: SubDirectionType.Note,
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
                        unit: TimeUnit.min,
                    },
                    temperature: {
                        count: 0,
                        unit: TemperatureUnit.C,
                    },
            
                    timeInput: "",
                    temperatureInput: "",
            
                    newStep: SubDirectionType.Note,
                    steps: [],
                },
            };
        }

        case RECIPE_ITEM_REMOVE_INGREDIENT: {

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

        case RECIPE_ITEM_REMOVE_ALT_INGREDIENT: {

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

        case RECIPE_ITEM_REPLACE_INGREDIENT_WITH_ALTERNATIVE: {

            const { parentId, id } = action.payload;

            const ingredients = state.ingredients.reduce<RecipeIngredientDefault[]>((accIngredients, curIngredient) => {

                if (curIngredient.id === parentId) {

                    const alternative = curIngredient.alternatives.find((alt) => alt.id === id);
                    const newAlternative: RecipeIngredient = {
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
                    return [ ...accIngredients, curIngredient];
                }
            }, []);

            return {
                ...state,
                ingredients: ingredients,
                nutritionFacts: getRecipeNutritionFacts(ingredients, state.references),
            };
        }

        case RECIPE_ITEM_TOGGLE_INGREDIENT_OPEN: {

            const id = action.payload;

            return {
                ...state,
                ingredients: state.ingredients.map((ingredient) => ({
                    ...ingredient,
                    isOpen: (ingredient.id === id) ? !ingredient.isOpen : ingredient.isOpen,
                })),
            };
        }

        case RECIPE_ITEM_TOGGLE_INGREDIENT_MARK: {

            const id = action.payload;

            return {
                ...state,
                ingredients: state.ingredients.map((ingredient) => ({
                    ...ingredient,
                    isMarked: (ingredient.id === id) ? !ingredient.isMarked : ingredient.isMarked,
                })),
            };
        }


        case RECIPE_ITEM_UPDATE_INGREDIENT_AMOUNT: {

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

        case RECIPE_ITEM_UPDATE_INGREDIENT_UNIT: {

            const { id, unit } = action.payload;

            return {
                ...state,
                ingredients: state.ingredients.map((ingredient) => (
                    (ingredient.id === id) ? { ...ingredient, unit: unit } : ingredient
                )),
            };
        }


        case RECIPE_ITEM_UPDATE_ALT_INGREDIENT_AMOUNT: {

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

        case RECIPE_ITEM_UPDATE_ALT_INGREDIENT_UNIT: {

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

        case RECIPE_ITEM_UPDATE_ALT_NUTRITION_FACTS: {

            const { parentId, id, isSelected } = action.payload;

            return {
                ...state,
                ingredients: state.ingredients.map((ingredient) => (
                    (ingredient.id === parentId)
                        ? {
                            ...ingredient,
                            altNutritionFacts: (
                                isSelected ? state.references[id]?.nutritionFacts : {}
                            ),
                        }
                        : ingredient
                )),
            };
        }

        case RECIPE_ITEM_ADD_INGREDIENT: {

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
                    unit: WeightUnit.g,
        
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

        case RECIPE_ITEM_ADD_ALT_INGREDIENT: {

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
                                    unit: WeightUnit.g,
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

        case RECIPE_ITEM_UPDATE_SERVING_SIZE_AMOUNT: {

            const inputValue = action.payload;

            const amount = Utils.decimalNormalizer(inputValue, state.servingSizeInput);

            return {
                ...state,
                servingSize: Number(amount),
                servingSizeInput: amount,
            };
        }

        case RECIPE_ITEM_UPDATE_SERVING_SIZE_UNIT: {

            const unit = action.payload;

            return {
                ...state,
                servingSizeUnit: unit,
            };
        }

        case RECIPE_ITEM_FETCH_REQUESTED: {
            return {
                ...state,
                isLoaded: false,
                errorMessage: null,

                id: action.payload as string,
            };
        }

        case RECIPE_ITEM_FETCH_SUCCESS: {
            const recipeItem = action.payload;

            const referenceItems: IngredientItem[] = [
                ...(recipeItem.references?.food || []),
                ...(recipeItem.references?.recipe || []),
            ];

            const references: Dictionary<string, IngredientItem> = referenceItems
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

        case RECIPE_ITEM_FETCH_ERROR: {
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
