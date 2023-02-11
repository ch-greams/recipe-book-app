/* eslint-disable react/display-name */
import React from "react";
import { Provider } from "react-redux";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { NutrientName } from "@common/nutrients";
import { DEFAULT_TEMPERATURE_UNIT,DEFAULT_TIME_UNIT, TemperatureUnit, TimeUnit, WeightUnit } from "@common/units";
import { store } from "@store";
import type { RecipeIngredient, RecipeInstruction, RecipeInstructionIngredient } from "@store/types/recipe";

import RbaInstructionsBlock from ".";

export default {
    title: "Recipe/RbaInstructionsBlock",
    component: RbaInstructionsBlock,
    argTypes: {
        isReadOnly: {
            type: { name: "boolean", required: true },
            table: { type: { summary: "boolean" } },
        },
        newInstruction: {
            table: { type: { summary: "RecipeInstruction" } },
        },
        instructions: {
            table: { type: { summary: "RecipeInstruction[]" } },
        },
        ingredients: {
            table: { type: { summary: "RecipeIngredient[]" } },
        },
    },
    decorators : [
        (Story) => (
            <Provider store={store}>
                {Story()}
            </Provider>
        ),
    ],
} as ComponentMeta<typeof RbaInstructionsBlock>;

const Template: ComponentStory<typeof RbaInstructionsBlock> = (args) => <RbaInstructionsBlock {...args} />;


const INSTRUCTION_1: RecipeInstruction = {
    id: 1,

    isOpen: false,
    isMarked: false,

    stepNumber: 1,
    description: "test step",

    durationValue: null,
    durationUnit: DEFAULT_TIME_UNIT,

    temperatureValue: 180,
    temperatureUnit: TemperatureUnit.C,

    durationValueInput: "",
    temperatureValueInput: "180",

    ingredients: [],
};

const INSTRUCTION_INGREDIENT_1: RecipeInstructionIngredient = {
    ingredientSlotNumber: 10,
    ingredientAmount: 5,
    ingredientAmountInput: "5",
    ingredientName: "Cottage Cheese",
    ingredientUnit: WeightUnit.oz,
    ingredientDensity: 1,
};

const INSTRUCTION_INGREDIENT_2: RecipeInstructionIngredient = {
    ingredientSlotNumber: 11,
    ingredientAmount: 100,
    ingredientAmountInput: "100",
    ingredientName: "Sour Cream",
    ingredientUnit: WeightUnit.g,
    ingredientDensity: 1,

};

const INSTRUCTION_2: RecipeInstruction = {
    id: 2,

    isOpen: true,
    isMarked: false,

    stepNumber: 2,
    description: "stir",

    durationValue: 1,
    durationUnit: TimeUnit.min,

    temperatureValue: null,
    temperatureUnit: DEFAULT_TEMPERATURE_UNIT,

    durationValueInput: "1",
    temperatureValueInput: "",

    ingredients: [],
};

const PRODUCT_ID = 1;

const INGREDIENT_1: RecipeIngredient = {
    id: 10,
    slot_number: 1,
    product_id: PRODUCT_ID,
    isOpen: false,
    isMarked: false,
    amount: 5,
    amountInput: "5",
    unit: WeightUnit.oz,
    is_recipe: false,
    name: "Cottage Cheese",
    density: 1,
    is_alternative: false,
    nutrients: {
        [NutrientName.Carbohydrate]: 75.4,
        [NutrientName.Fat]: 18.3,
        [NutrientName.Protein]: 30.4,
        [NutrientName.Energy]: 183.1,
    },
    alternativeNutrients: {},
};



export const Editable = Template.bind({});
Editable.args = {
    isReadOnly: false,
    instructions: [
        INSTRUCTION_1,
        {
            ...INSTRUCTION_2,
            ingredients: [ INSTRUCTION_INGREDIENT_1, INSTRUCTION_INGREDIENT_2 ],
        },
    ],
    ingredients: [ INGREDIENT_1 ],
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
    isReadOnly: true,
    instructions: [
        INSTRUCTION_1,
        {
            ...INSTRUCTION_2,
            ingredients: [ INSTRUCTION_INGREDIENT_1, INSTRUCTION_INGREDIENT_2 ],
        },
    ],
};
