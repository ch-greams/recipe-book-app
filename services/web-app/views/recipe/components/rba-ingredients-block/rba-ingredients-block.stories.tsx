/* eslint-disable react/display-name */
import React from "react";
import { Provider } from "react-redux";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { NutrientName } from "@common/nutrients";
import { WeightUnit } from "@common/units";
import { store } from "@store";
import type { RecipeIngredient } from "@store/types/recipe";

import RbaIngredientsBlock from ".";

export default {
    title: "Recipe/RbaIngredientsBlock",
    component: RbaIngredientsBlock,
    argTypes: {
        isReadOnly: {
            type: { name: "boolean", required: true },
            table: { type: { summary: "boolean" } },
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
} as ComponentMeta<typeof RbaIngredientsBlock>;

const search = store.getState().search;


const Template: ComponentStory<typeof RbaIngredientsBlock> = (args) => <RbaIngredientsBlock {...args} />;


const FOOD_ID_1 = 1;
const FOOD_ID_2 = 2;
const FOOD_ID_3 = 3;

const INGREDIENT_00: RecipeIngredient = {
    id: -1,
    slot_number: 1,
    food_id: FOOD_ID_1,
    isOpen: false,
    isMarked: false,
    amount: 100,
    amountInput: "100",
    unit: WeightUnit.g,
    is_recipe: false,
    name: "Sour Cream 10%",
    density: 1,
    nutrients: {
        [NutrientName.Carbohydrate]: 57,
        [NutrientName.Fat]: 10,
        [NutrientName.Protein]: 21.5,
        [NutrientName.Energy]: 394,
    },
    is_alternative: false,
    alternativeNutrients: {
        [NutrientName.Carbohydrate]: 56,
        [NutrientName.Fat]: 11,
        [NutrientName.Protein]: 20.5,
        [NutrientName.Energy]: 394,
    },
};

const INGREDIENT_01: RecipeIngredient = {
    id: -1,
    slot_number: 1,
    food_id: FOOD_ID_2,
    isOpen: false,
    isMarked: false,
    amount: 100,
    amountInput: "100",
    unit: WeightUnit.g,
    is_recipe: false,
    name: "Sour Cream 15%",
    density: 1,
    nutrients: {
        [NutrientName.Carbohydrate]: 56,
        [NutrientName.Fat]: 15,
        [NutrientName.Protein]: 20.5,
        [NutrientName.Energy]: 426,
    },
    is_alternative: true,
    alternativeNutrients: {},
};

const INGREDIENT_1: RecipeIngredient = {
    id: -3,
    slot_number: 2,
    food_id: FOOD_ID_3,
    isOpen: false,
    isMarked: false,
    amount: 5,
    amountInput: "5",
    unit: WeightUnit.oz,
    is_recipe: false,
    name: "Cottage Cheese",
    density: 1,
    nutrients: {
        [NutrientName.Carbohydrate]: 75.4,
        [NutrientName.Fat]: 18.3,
        [NutrientName.Protein]: 30.4,
        [NutrientName.Energy]: 183.1,
    },
    is_alternative: false,
    alternativeNutrients: {},
};


export const DefaultClosed = Template.bind({});
DefaultClosed.args = {
    search,
    isReadOnly: false,
    ingredients: [ INGREDIENT_00, INGREDIENT_01, INGREDIENT_1 ],
};

export const ReadOnlyClosed = Template.bind({});
ReadOnlyClosed.args = {
    search,
    isReadOnly: true,
    ingredients: [ INGREDIENT_00, INGREDIENT_01, INGREDIENT_1 ],
};

export const ReadOnlyClosedMarked = Template.bind({});
ReadOnlyClosedMarked.args = {
    search,
    isReadOnly: true,
    ingredients: [ { ...INGREDIENT_00, isMarked: true }, INGREDIENT_01, INGREDIENT_1 ],
};

export const DefaultOpen = Template.bind({});
DefaultOpen.args = {
    search,
    isReadOnly: false,
    ingredients: [ { ...INGREDIENT_00, isOpen: true, alternativeNutrients: {} }, INGREDIENT_01, INGREDIENT_1 ],
};

export const ReadOnlyOpen = Template.bind({});
ReadOnlyOpen.args = {
    search,
    isReadOnly: true,
    ingredients: [ { ...INGREDIENT_00, isOpen: true, alternativeNutrients: {} }, INGREDIENT_01, INGREDIENT_1 ],
};

export const ReadOnlyOpenMarked = Template.bind({});
ReadOnlyOpenMarked.args = {
    search,
    isReadOnly: true,
    ingredients: [ { ...INGREDIENT_00, isOpen: true, alternativeNutrients: {}, isMarked: true }, INGREDIENT_01, INGREDIENT_1 ],
};

export const AltHighlightedDefaultOpen = Template.bind({});
AltHighlightedDefaultOpen.args = {
    search,
    isReadOnly: false,
    ingredients: [ { ...INGREDIENT_00, isOpen: true }, INGREDIENT_01, INGREDIENT_1 ],
};

export const AltHighlightedReadOnlyOpen = Template.bind({});
AltHighlightedReadOnlyOpen.args = {
    search,
    isReadOnly: true,
    ingredients: [ { ...INGREDIENT_00, isOpen: true }, INGREDIENT_01, INGREDIENT_1 ],
};

export const AltHighlightedReadOnlyOpenMarked = Template.bind({});
AltHighlightedReadOnlyOpenMarked.args = {
    search,
    isReadOnly: true,
    ingredients: [ { ...INGREDIENT_00, isOpen: true, isMarked: true }, INGREDIENT_01, INGREDIENT_1 ],
};
