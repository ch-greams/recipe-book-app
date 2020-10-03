import { NutritionFactType } from "../../../common/nutritionFacts";
import { UnitWeight } from "../../../common/units";
import {
    RECIPE_ITEM_UPDATE_NAME,
    RECIPE_ITEM_UPDATE_BRAND,
    RECIPE_ITEM_UPDATE_SUBTITLE,
    RecipeItemActionTypes,
    RecipePageStore,
} from "./types";



const initialState: RecipePageStore = {

    isReadOnly: true,

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

            foodItem: {
                id: "Milk",
                name: "Milk",
                nutritionFacts: {
                    [NutritionFactType.Carbohydrate]: 158.2,
                    [NutritionFactType.Fat]: 8.1,
                    [NutritionFactType.Protein]: 47.3,
                    [NutritionFactType.Energy]: 573,
                },
            },

            amount: 120,

            alternatives: [
                { id: "Oat Milk", amount: 120 },
                { id: "Almond Milk", amount: 120 },
            ],
        },
        {
            isOpen: true,


            foodItem: {
                id: "Flour",
                name: "Flour",

                nutritionFacts: {
                    [NutritionFactType.Carbohydrate]: 158.2,
                    [NutritionFactType.Fat]: 8.1,
                    [NutritionFactType.Protein]: 47.3,
                    [NutritionFactType.Energy]: 573,
                },
            },

            amount: 250,
            alternatives: [
                { id: "Rye Flour", amount: 220 },
            ],
        },
        {
            isOpen: true,

            foodItem: {
                id: "Eggs",
                name: "Eggs",

                nutritionFacts: {
                    [NutritionFactType.Carbohydrate]: 158.2,
                    [NutritionFactType.Fat]: 8.1,
                    [NutritionFactType.Protein]: 47.3,
                    [NutritionFactType.Energy]: 573,
                },
            },

            amount: 2,
            alternatives: [],
        },
        {
            isOpen: false,

            foodItem: {
                id: "Cocoa",
                name: "Cocoa",

                nutritionFacts: {
                    [NutritionFactType.Carbohydrate]: 158.2,
                    [NutritionFactType.Fat]: 8.1,
                    [NutritionFactType.Protein]: 47.3,
                    [NutritionFactType.Energy]: 573,
                },
            },

            amount: 45,
            alternatives: [],
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

        default:
            return state;
    }
}
