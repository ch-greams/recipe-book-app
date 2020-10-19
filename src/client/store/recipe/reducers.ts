import { NutritionFactType } from "../../../common/nutritionFacts";
import { UnitTemperature, UnitTime, UnitVolume, UnitWeight } from "../../../common/units";
import Utils from "../../../common/utils";
import {
    RECIPE_ITEM_UPDATE_NAME,
    RECIPE_ITEM_UPDATE_BRAND,
    RECIPE_ITEM_UPDATE_SUBTITLE,
    RECIPE_ITEM_UPDATE_DESCRIPTION,
    RecipeItemActionTypes,
    RecipePageStore,
    IngredientDefault,
    SubDirectionType,
    RECIPE_ITEM_REMOVE_DIRECTION,
    RECIPE_ITEM_REMOVE_SUBDIRECTION,
    RECIPE_ITEM_TOGGLE_DIRECTION_OPEN,
    RECIPE_ITEM_TOGGLE_DIRECTION_MARK,
    RECIPE_ITEM_TOGGLE_SUBDIRECTION_MARK,
    SubDirectionIngredient,
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
    IngredientAlternative,
    RECIPE_ITEM_TOGGLE_INGREDIENT_OPEN,
    RECIPE_ITEM_TOGGLE_INGREDIENT_MARK,
    RECIPE_ITEM_UPDATE_INGREDIENT_AMOUNT,
    RECIPE_ITEM_UPDATE_INGREDIENT_UNIT,
    RECIPE_ITEM_UPDATE_ALT_INGREDIENT_AMOUNT,
    RECIPE_ITEM_UPDATE_ALT_INGREDIENT_UNIT,
    RECIPE_ITEM_UPDATE_ALT_NUTRITION_FACTS,
    RECIPE_ITEM_ADD_INGREDIENT,
    RECIPE_ITEM_ADD_ALT_INGREDIENT,
} from "./types";



const initialState: RecipePageStore = {

    isReadOnly: false,

    name: "Cocoa Muffins",
    brand: "Homemade",
    subtitle: "Those are really good",
    // eslint-disable-next-line max-len
    description: "These cocoa muffins, made with flour, sugar, cocoa, eggs, oil, and vanilla, are moist and have a not-too-sweet and in intense cocoa flavor. For those with more restrained chocolate cravings.",

    customUnitInputs: [],
    type: "Muffins",
    servingSize: 100,
    unit: UnitWeight.g,

    ingredients: [
        {
            isOpen: false,
            isMarked: false,

            item: {
                id: "f000001",
                name: "Milk",
                nutritionFacts: {
                    [NutritionFactType.Carbohydrate]: 4.7,
                    [NutritionFactType.Fat]: 3.7,
                    [NutritionFactType.Protein]: 3.3,
                    [NutritionFactType.Energy]: 64,
                },
            },

            amount: 120,
            amountInput: "120",
            unit: UnitVolume.ml,

            altNutritionFacts: {},

            alternatives: [
                {
                    amount: 240,
                    amountInput: "240",
                    unit: UnitVolume.ml,
                    item: {
                        id: "f000002",
                        name: "Oat Milk",

                        nutritionFacts: {
                            [NutritionFactType.Carbohydrate]: 16,
                            [NutritionFactType.Fat]: 5,
                            [NutritionFactType.Protein]: 3,
                            [NutritionFactType.Energy]: 120,
                        },
                    },
                },
                {
                    amount: 1,
                    amountInput: "1",
                    unit: UnitVolume.cup,
                    item: {
                        id: "f000003",
                        name: "Almond Milk",

                        nutritionFacts: {
                            [NutritionFactType.Carbohydrate]: 4,
                            [NutritionFactType.Fat]: 3,
                            [NutritionFactType.Protein]: 1,
                            [NutritionFactType.Energy]: 50,
                        },
                    },
                },
            ],
        },
        {
            isOpen: false,
            isMarked: false,

            item: {
                id: "f000004",
                name: "Wheat Flour",

                nutritionFacts: {
                    [NutritionFactType.Carbohydrate]: 79,
                    [NutritionFactType.Fat]: 1.8,
                    [NutritionFactType.Protein]: 7,
                    [NutritionFactType.Energy]: 364,
                },
            },

            amount: 100,
            amountInput: "100",
            unit: UnitWeight.g,

            altNutritionFacts: {},

            alternatives: [
                {
                    amount: 1,
                    amountInput: "1",
                    unit: UnitVolume.cup,
                    item: {
                        id: "f000005",
                        name: "Rye Flour",

                        nutritionFacts: {
                            [NutritionFactType.Carbohydrate]: 75,
                            [NutritionFactType.Fat]: 1.5,
                            [NutritionFactType.Protein]: 11,
                            [NutritionFactType.Energy]: 349,
                        },
                    },
                },
            ],
        },
        {
            isOpen: false,
            isMarked: false,

            item: {
                id: "f000006",
                name: "Egg",

                nutritionFacts: {
                    [NutritionFactType.Carbohydrate]: 1.7,
                    [NutritionFactType.Fat]: 23,
                    [NutritionFactType.Protein]: 31,
                    [NutritionFactType.Energy]: 348,
                },
            },

            amount: 1,
            amountInput: "1",
            unit: UnitVolume.cup,

            altNutritionFacts: {},

            alternatives: [],
        },
        {
            isOpen: false,
            isMarked: false,

            item: {
                id: "f000007",
                name: "Cocoa",

                nutritionFacts: {
                    [NutritionFactType.Carbohydrate]: 26.1,
                    [NutritionFactType.Fat]: 6,
                    [NutritionFactType.Protein]: 9.3,
                    [NutritionFactType.Energy]: 103,
                },
            },

            amount: 45,
            amountInput: "45",
            unit: UnitWeight.g,

            altNutritionFacts: {},

            alternatives: [],
        },
    ],

    newDirection: {
        isOpen: false,
        isMarked: false,

        stepNumber: 4,
        name: "",

        time: {
            count: 0,
            unit: UnitTime.min,
        },
        temperature: {
            count: 0,
            unit: UnitTemperature.C,
        },

        timeInput: "",
        temperatureInput: "",

        newStep: SubDirectionType.Note,
        steps: [],
    },
    directions: [
        {
            isOpen: false,
            isMarked: false,

            stepNumber: 1,
            name: "Preheat Oven",

            temperature: {
                count: 180,
                unit: UnitTemperature.C,
            },

            timeInput: "",
            temperatureInput: "180",

            newStep: SubDirectionType.Note,
            steps: [],
        },
        {
            isOpen: false,
            isMarked: false,

            stepNumber: 2,
            name: "Stir",

            time: {
                count: 20,
                unit: UnitTime.min,
            },

            timeInput: "20",
            temperatureInput: "",

            newStep: SubDirectionType.Note,
            steps: [
                {
                    type: SubDirectionType.Note,
                    label: "Mix quickly and lightly with a fork until moistened, but do not beat.",
                },
                {
                    type: SubDirectionType.Ingredient,
                    label: "Milk",

                    id: "f000001",
                    isMarked: false,
                    amount: 100,
                    amountInput: "100",
                },
                {
                    type: SubDirectionType.Ingredient,
                    label: "Flour",

                    id: "f000004",
                    isMarked: false,
                    amount: 240,
                    amountInput: "240",
                },
                {
                    type: SubDirectionType.Ingredient,
                    label: "Egg",

                    id: "f000006",
                    isMarked: false,
                    amount: 120,
                    amountInput: "120",
                },            
            ]
        },
        {
            isOpen: false,
            isMarked: false,

            stepNumber: 3,
            name: "Bake",

            time: {
                count: 40,
                unit: UnitTime.min,
            },
            temperature: {
                count: 180,
                unit: UnitTemperature.C,
            },

            timeInput: "15",
            temperatureInput: "180",

            newStep: SubDirectionType.Note,
            steps: [
                {
                    type: SubDirectionType.Note,
                    label: "If you don't burn your house down, then everything will be ok.",
                },
            ],
        },
    ],
};


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
                            )
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

                        const steps = direction.steps.map((subDirection: SubDirectionIngredient, iSubDirection) =>
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
                            steps: direction.steps.map((subDirection: SubDirectionIngredient, iSubDirection) => {

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
                            steps: direction.steps.map((subDirection: SubDirectionIngredient, iSubDirection) => (
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

            const ingredient = state.ingredients.find((ingredient) => ingredient.item.id === ingredientId);

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
                                    label: ingredient.item.name,
                
                                    id: ingredient.item.id,
                                    isMarked: false,
                                    amount: ingredient.amount,
                                    amountInput: ingredient.amountInput,
                                    unit: ingredient.unit,
                                },
                            ]
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
                            ]
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
                        unit: UnitTime.min,
                    },
                    temperature: {
                        count: 0,
                        unit: UnitTemperature.C,
                    },
            
                    timeInput: "",
                    temperatureInput: "",
            
                    newStep: SubDirectionType.Note,
                    steps: [],
                }
            };
        }

        case RECIPE_ITEM_REMOVE_INGREDIENT: {

            const id = action.payload;

            return {
                ...state,
                ingredients: state.ingredients.filter((ingredient) => ingredient.item.id !== id)
            };
        }

        case RECIPE_ITEM_REMOVE_ALT_INGREDIENT: {

            const { parentId, id } = action.payload;

            return {
                ...state,
                ingredients: state.ingredients.map((ingredient) => (
                    ( ingredient.item.id === parentId )
                        ? {
                            ...ingredient,
                            alternatives: ingredient.alternatives.filter((alt) => alt.item.id !== id)
                        }
                        : ingredient
                ))
            };
        }

        case RECIPE_ITEM_REPLACE_INGREDIENT_WITH_ALTERNATIVE: {

            const { parentId, id } = action.payload;

            const ingredients = state.ingredients.reduce<IngredientDefault[]>((accIngredients, curIngredient) => {

                if (curIngredient.item.id === parentId) {

                    const alternative = curIngredient.alternatives.find((alt) => alt.item.id === id);
                    const newAlternative: IngredientAlternative = {
                        amount: curIngredient.amount,
                        amountInput: curIngredient.amountInput,
                        unit: curIngredient.unit,
                        item: curIngredient.item,
                    };

                    return [
                        ...accIngredients,
                        {
                            ...curIngredient,
                            alternatives: [
                                ...curIngredient.alternatives.filter((alt) => alt.item.id !== id),
                                newAlternative,
                            ],
                            amount: alternative.amount,
                            amountInput: alternative.amountInput,
                            unit: alternative.unit,
                            item: alternative.item,
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
            };
        }

        case RECIPE_ITEM_TOGGLE_INGREDIENT_OPEN: {

            const id = action.payload;

            return {
                ...state,
                ingredients: state.ingredients.map((ingredient) => ({
                    ...ingredient,
                    isOpen: (ingredient.item.id === id) ? !ingredient.isOpen : ingredient.isOpen
                }))
            };
        }

        case RECIPE_ITEM_TOGGLE_INGREDIENT_MARK: {

            const id = action.payload;

            return {
                ...state,
                ingredients: state.ingredients.map((ingredient) => ({
                    ...ingredient,
                    isMarked: (ingredient.item.id === id) ? !ingredient.isMarked : ingredient.isMarked
                }))
            };
        }


        case RECIPE_ITEM_UPDATE_INGREDIENT_AMOUNT: {

            const { id, inputValue } = action.payload;

            return {
                ...state,
                ingredients: state.ingredients.map((ingredient) => {

                    if (ingredient.item.id === id) {

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
                })
            };
        }

        case RECIPE_ITEM_UPDATE_INGREDIENT_UNIT: {

            const { id, unit } = action.payload;

            return {
                ...state,
                ingredients: state.ingredients.map((ingredient) => (
                    (ingredient.item.id === id) ? { ...ingredient, unit: unit } : ingredient
                ))
            };
        }


        case RECIPE_ITEM_UPDATE_ALT_INGREDIENT_AMOUNT: {

            const { parentId, id, inputValue } = action.payload;

            return {
                ...state,
                ingredients: state.ingredients.map((ingredient) => (
                    (ingredient.item.id === parentId)
                        ? {
                            ...ingredient,
                            alternatives: ingredient.alternatives.map((alt) => {

                                const amount = Utils.decimalNormalizer(inputValue, alt.amountInput);

                                if (alt.item.id === id) {
                                    return {
                                        ...alt,
                                        amountInput: amount,
                                        amount: Number(amount),
                                    };
                                }
                                else {
                                    return alt;
                                }
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
                    (ingredient.item.id === parentId)
                        ? {
                            ...ingredient,
                            alternatives: ingredient.alternatives.map((alt) => (
                                (alt.item.id === id) ? { ...alt, unit: unit } : alt
                            )),
                        }
                        : ingredient
                ))
            };
        }

        case RECIPE_ITEM_UPDATE_ALT_NUTRITION_FACTS: {

            const { parentId, id, isSelected } = action.payload;

            return {
                ...state,
                ingredients: state.ingredients.map((ingredient) => (
                    (ingredient.item.id === parentId)
                        ? {
                            ...ingredient,
                            altNutritionFacts: (
                                isSelected
                                    ? ingredient.alternatives.find((alt) => (alt.item.id === id))?.item.nutritionFacts
                                    : {}
                            ),
                        }
                        : ingredient
                ))
            };
        }

        case RECIPE_ITEM_ADD_INGREDIENT: {

            const ingredient = action.payload;

            return {
                ...state,
                ingredients: [
                    ...state.ingredients,
                    {
                        isOpen: true,
                        isMarked: false,
        
                        item: ingredient,
        
                        amount: 100,
                        amountInput: "100",
                        unit: UnitWeight.g,
            
                        altNutritionFacts: {},
            
                        alternatives: [],    
                    },
                ],
            };
        }

        case RECIPE_ITEM_ADD_ALT_INGREDIENT: {

            const { id, altIngredient } = action.payload;

            return {
                ...state,
                ingredients: state.ingredients.map((ingredient) => (
                    (ingredient.item.id === id)
                        ? {
                            ...ingredient,
                            alternatives: [
                                ...ingredient.alternatives,
                                {
                                    amount: 100,
                                    amountInput: "100",
                                    unit: UnitWeight.g,
                                    item: altIngredient,
                                }
                            ],
                        }
                        : ingredient
                )),
            };
        }

        default:
            return state;
    }
}
