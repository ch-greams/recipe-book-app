/* eslint-disable react/display-name */
import React from "react";
import { Provider } from "react-redux";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { CarbohydrateNutritionFactType, EnergyNutritionFactType,LipidNutritionFactType, ProteinNutritionFactType } from "@common/nutritionFacts";
import { DEFAULT_TEMPERATURE_UNIT,DEFAULT_TIME_UNIT, TemperatureUnit, TimeUnit, WeightUnit } from "@common/units";
import { ProductType } from "@common/utils";
import type { AppState } from "@store";
import { useStore } from "@store";
import type { RecipeDirection, RecipeDirectionPartComment, RecipeIngredient, RecipeDirectionPartIngredient } from "@store/recipe/types";
import { DirectionPartType } from "@store/recipe/types";

import RbaDirectionsBlock from ".";

export default {
    title: "Recipe/RbaDirectionsBlock",
    component: RbaDirectionsBlock,
    argTypes: {
        isReadOnly: {
            type: { name: "boolean", required: true },
            table: { type: { summary: "boolean" } },
        },
        newDirection: {
            table: { type: { summary: "RecipeDirection" } },
        },
        directions: {
            table: { type: { summary: "RecipeDirection[]" } },
        },
        ingredients: {
            table: { type: { summary: "RecipeIngredient[]" } },
        },
    },
    decorators : [
        (Story) => (
            <Provider store={useStore({} as AppState)}>
                {Story()}
            </Provider>
        ),
    ],
} as ComponentMeta<typeof RbaDirectionsBlock>;

const Template: ComponentStory<typeof RbaDirectionsBlock> = (args) => <RbaDirectionsBlock {...args} />;


const NEW_DIRECTION: RecipeDirection = {
    id: -1,

    isOpen: false,
    isMarked: false,

    stepNumber: 0,
    name: "",

    durationValue: 0,
    durationUnit: DEFAULT_TIME_UNIT,

    temperatureValue: 0,
    temperatureUnit: DEFAULT_TEMPERATURE_UNIT,

    durationValueInput: "",
    temperatureValueInput: "",

    steps: [],
};

const DIRECTION_1: RecipeDirection = {
    id: 1,

    isOpen: false,
    isMarked: false,

    stepNumber: 1,
    name: "test step",

    durationValue: null,
    durationUnit: DEFAULT_TIME_UNIT,

    temperatureValue: 180,
    temperatureUnit: TemperatureUnit.C,

    durationValueInput: "",
    temperatureValueInput: "180",

    steps: [],
};

const SUB_DIRECTION_0: RecipeDirectionPartComment = {
    stepNumber: 0,
    type: DirectionPartType.Note,
    commentText: "Add Cottage Cheese first",
};

const SUB_DIRECTION_1: RecipeDirectionPartIngredient = {
    stepNumber: 1,
    type: DirectionPartType.Ingredient,
    isMarked: false,
    ingredientId: 10,
    ingredientAmount: 5,
    ingredientAmountInput: "5",
    ingredientName: "Cottage Cheese",
    ingredientUnit: WeightUnit.oz,
};

const SUB_DIRECTION_2: RecipeDirectionPartIngredient = {
    stepNumber: 2,
    type: DirectionPartType.Ingredient,
    isMarked: false,
    ingredientId: 11,
    ingredientAmount: 100,
    ingredientAmountInput: "100",
    ingredientName: "Sour Cream",
    ingredientUnit: WeightUnit.g,

};

const DIRECTION_2: RecipeDirection = {
    id: 2,

    isOpen: true,
    isMarked: false,

    stepNumber: 2,
    name: "stir",

    durationValue: 1,
    durationUnit: TimeUnit.min,

    temperatureValue: null,
    temperatureUnit: DEFAULT_TEMPERATURE_UNIT,

    durationValueInput: "1",
    temperatureValueInput: "",

    steps: [],
};

const PRODUCT_ID = 1;

const INGREDIENT_1: RecipeIngredient = {
    id: 10,
    product_id: PRODUCT_ID,
    isOpen: false,
    isMarked: false,
    products: {
        [PRODUCT_ID]: {
            amount: 5,
            amountInput: "5",
            unit: WeightUnit.oz,
            product_id: PRODUCT_ID,
            product_type: ProductType.Food,
            name: "Cottage Cheese",
            nutrition_facts: {
                [CarbohydrateNutritionFactType.Carbohydrate]: 75.4,
                [LipidNutritionFactType.Fat]: 18.3,
                [ProteinNutritionFactType.Protein]: 30.4,
                [EnergyNutritionFactType.Energy]: 183.1,
            },
        },
    },
    alternativeNutritionFacts: {},
};



export const Editable = Template.bind({});
Editable.args = {
    isReadOnly: false,
    newDirection: NEW_DIRECTION,
    directions: [
        DIRECTION_1,
        {
            ...DIRECTION_2,
            steps: [ SUB_DIRECTION_0, SUB_DIRECTION_1, SUB_DIRECTION_2 ],
        },
    ],
    ingredients: [ INGREDIENT_1 ],
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
    isReadOnly: true,
    newDirection: NEW_DIRECTION,
    directions: [
        DIRECTION_1,
        {
            ...DIRECTION_2,
            steps: [ SUB_DIRECTION_0, { ...SUB_DIRECTION_1, isMarked: true }, SUB_DIRECTION_2 ],
        },
    ],
};
