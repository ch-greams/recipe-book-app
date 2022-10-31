/* eslint-disable react/display-name */
import React from "react";
import { Provider } from "react-redux";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { NutrientName } from "@common/nutritionFacts";
import { WeightUnit } from "@common/units";
import { ProductType } from "@common/utils";
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


const PRODUCT_ID_1 = 1;
const PRODUCT_ID_2 = 2;
const PRODUCT_ID_3 = 3;

const INGREDIENT_0: RecipeIngredient = {
    id: -1,
    product_id: PRODUCT_ID_1,
    isOpen: false,
    isMarked: false,
    products: {
        [PRODUCT_ID_1]: {
            amount: 100,
            amountInput: "100",
            unit: WeightUnit.g,
            product_id: PRODUCT_ID_1,
            product_type: ProductType.Food,
            name: "Sour Cream 10%",
            density: 1,
            nutrition_facts: {
                [NutrientName.Carbohydrate]: 57,
                [NutrientName.Fat]: 10,
                [NutrientName.Protein]: 21.5,
                [NutrientName.Energy]: 394,
            },
        },
        [PRODUCT_ID_2]: {
            amount: 100,
            amountInput: "100",
            unit: WeightUnit.g,
            product_id: PRODUCT_ID_2,
            product_type: ProductType.Food,
            name: "Sour Cream 15%",
            density: 1,
            nutrition_facts: {
                [NutrientName.Carbohydrate]: 56,
                [NutrientName.Fat]: 15,
                [NutrientName.Protein]: 20.5,
                [NutrientName.Energy]: 426,
            },
        },
    },
    alternativeNutritionFacts: {
        [NutrientName.Carbohydrate]: 56,
        [NutrientName.Fat]: 11,
        [NutrientName.Protein]: 20.5,
        [NutrientName.Energy]: 394,
    },
};

const INGREDIENT_1: RecipeIngredient = {
    id: -1,
    product_id: PRODUCT_ID_3,
    isOpen: false,
    isMarked: false,
    products: {
        [PRODUCT_ID_3]: {
            amount: 5,
            amountInput: "5",
            unit: WeightUnit.oz,
            product_id: PRODUCT_ID_3,
            product_type: ProductType.Food,
            name: "Cottage Cheese",
            density: 1,
            nutrition_facts: {
                [NutrientName.Carbohydrate]: 75.4,
                [NutrientName.Fat]: 18.3,
                [NutrientName.Protein]: 30.4,
                [NutrientName.Energy]: 183.1,
            },
        },
    },
    alternativeNutritionFacts: {},
};


export const DefaultClosed = Template.bind({});
DefaultClosed.args = {
    search,
    isReadOnly: false,
    ingredients: [ INGREDIENT_0, INGREDIENT_1 ],
};

export const ReadOnlyClosed = Template.bind({});
ReadOnlyClosed.args = {
    search,
    isReadOnly: true,
    ingredients: [ INGREDIENT_0, INGREDIENT_1 ],
};

export const ReadOnlyClosedMarked = Template.bind({});
ReadOnlyClosedMarked.args = {
    search,
    isReadOnly: true,
    ingredients: [ { ...INGREDIENT_0, isMarked: true }, INGREDIENT_1 ],
};

export const DefaultOpen = Template.bind({});
DefaultOpen.args = {
    search,
    isReadOnly: false,
    ingredients: [ { ...INGREDIENT_0, isOpen: true, alternativeNutritionFacts: {} }, INGREDIENT_1 ],
};

export const ReadOnlyOpen = Template.bind({});
ReadOnlyOpen.args = {
    search,
    isReadOnly: true,
    ingredients: [ { ...INGREDIENT_0, isOpen: true, alternativeNutritionFacts: {} }, INGREDIENT_1 ],
};

export const ReadOnlyOpenMarked = Template.bind({});
ReadOnlyOpenMarked.args = {
    search,
    isReadOnly: true,
    ingredients: [ { ...INGREDIENT_0, isOpen: true, alternativeNutritionFacts: {}, isMarked: true }, INGREDIENT_1 ],
};

export const AltHighlightedDefaultOpen = Template.bind({});
AltHighlightedDefaultOpen.args = {
    search,
    isReadOnly: false,
    ingredients: [ { ...INGREDIENT_0, isOpen: true }, INGREDIENT_1 ],
};

export const AltHighlightedReadOnlyOpen = Template.bind({});
AltHighlightedReadOnlyOpen.args = {
    search,
    isReadOnly: true,
    ingredients: [ { ...INGREDIENT_0, isOpen: true }, INGREDIENT_1 ],
};

export const AltHighlightedReadOnlyOpenMarked = Template.bind({});
AltHighlightedReadOnlyOpenMarked.args = {
    search,
    isReadOnly: true,
    ingredients: [ { ...INGREDIENT_0, isOpen: true, isMarked: true }, INGREDIENT_1 ],
};
