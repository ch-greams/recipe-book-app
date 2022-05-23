/* eslint-disable react/display-name */
import React from "react";
import { Provider } from "react-redux";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import {
    CarbohydrateNutritionFactType, EnergyNutritionFactType, LipidNutritionFactType, ProteinNutritionFactType,
} from "@common/nutritionFacts";
import { WeightUnit } from "@common/units";
import { ProductType } from "@common/utils";
import type { AppState } from "@store";
import { useStore } from "@store";
import type { RecipeIngredient } from "@store/recipe/types";
import { extractState } from "@store/search/reducer";

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
            <Provider store={useStore({} as AppState)}>
                {Story()}
            </Provider>
        ),
    ],
} as ComponentMeta<typeof RbaIngredientsBlock>;

const search = extractState({} as AppState);


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
            nutrition_facts: {
                [CarbohydrateNutritionFactType.Carbohydrate]: 57,
                [LipidNutritionFactType.Fat]: 10,
                [ProteinNutritionFactType.Protein]: 21.5,
                [EnergyNutritionFactType.Energy]: 394,
            },
        },
        [PRODUCT_ID_2]: {
            amount: 100,
            amountInput: "100",
            unit: WeightUnit.g,
            product_id: PRODUCT_ID_2,
            product_type: ProductType.Food,
            name: "Sour Cream 15%",
            nutrition_facts: {
                [CarbohydrateNutritionFactType.Carbohydrate]: 56,
                [LipidNutritionFactType.Fat]: 15,
                [ProteinNutritionFactType.Protein]: 20.5,
                [EnergyNutritionFactType.Energy]: 426,
            },
        },
    },
    alternativeNutritionFacts: {
        [CarbohydrateNutritionFactType.Carbohydrate]: 56,
        [LipidNutritionFactType.Fat]: 11,
        [ProteinNutritionFactType.Protein]: 20.5,
        [EnergyNutritionFactType.Energy]: 394,
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
