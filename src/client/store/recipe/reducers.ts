import { NutritionFactType } from "../../../common/nutritionFacts";
import { UnitTemperature, UnitTime, UnitVolume, UnitWeight } from "../../../common/units";
import {
    RECIPE_ITEM_UPDATE_NAME,
    RECIPE_ITEM_UPDATE_BRAND,
    RECIPE_ITEM_UPDATE_SUBTITLE,
    RECIPE_ITEM_UPDATE_DESCRIPTION,
    RECIPE_ITEM_UPDATE_INGREDIENTS,
    RecipeItemActionTypes,
    RecipePageStore,
    IngredientDefault,
    Direction,
    RECIPE_ITEM_UPDATE_DIRECTIONS,
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
                name: "Eggs",

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

    directions: [
        {
            isOpen: false,
            isMarked: false,

            name: "Preheat Oven",

            time: {
                count: 5,
                unit: UnitTime.min,
            },
            temperature: {
                count: 180,
                unit: UnitTemperature.C,
            },

            timeInput: "5",
            temperatureInput: "180",

            notes: [],
            subSteps: [],
        },
        {
            isOpen: false,
            isMarked: false,

            name: "Stir",

            time: {
                count: 20,
                unit: UnitTime.min,
            },
            temperature: {
                count: 20,
                unit: UnitTemperature.C,
            },

            timeInput: "20",
            temperatureInput: "20",

            notes: [
                "Mix quickly and lightly with a fork until moistened, but do not beat.",
            ],
            subSteps: [
                {
                    isMarked: false,
                    foodId: "Milk",
                    amount: 100,
                },
                {
                    isMarked: false,
                    foodId: "Flour",
                    amount: 240,
                },
                {
                    isMarked: false,
                    foodId: "Egg",
                    amount: 120,
                },            
            ]
        },
        {
            isOpen: false,
            isMarked: false,

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

            notes: [
                "If you don't burn your house down, then everything will be ok.",
            ],
            subSteps: [],
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

        case RECIPE_ITEM_UPDATE_INGREDIENTS: {
            return {
                ...state,
                ingredients: action.payload as IngredientDefault[],
            };
        }

        case RECIPE_ITEM_UPDATE_DIRECTIONS: {
            return {
                ...state,
                directions: action.payload as Direction[],
            };
        }

        default:
            return state;
    }
}
