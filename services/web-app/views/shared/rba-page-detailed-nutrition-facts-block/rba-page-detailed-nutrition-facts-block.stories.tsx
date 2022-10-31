/* eslint-disable react/display-name */
import React from "react";
import { Provider } from "react-redux";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { NutrientName } from "@common/nutritionFacts";
import { NutrientUnit } from "@common/units";
import Utils from "@common/utils";
import { store } from "@store";

import RbaPageDetailedNutritionFactsBlock from ".";



export default {
    title: "Shared/RbaPageDetailedNutritionFactsBlock",
    component: RbaPageDetailedNutritionFactsBlock,
    argTypes: {
        isReadOnly: {
            type: { name: "boolean" },
            table: { type: { summary: "boolean" } },
        },
        nutritionFacts: {
            table: { type: { summary: "Dictionary<NutrientName, number>" } },
        },
        nutritionFactInputs: {
            table: { type: { summary: "Dictionary<NutrientName, string>" } },
        },
        nutrientDescriptions: {
            table: { type: { summary: "Record<NutrientName, NutritionFactDescription>" } },
        },
    },
    decorators : [
        (Story) => (
            <Provider store={store}>
                {Story()}
            </Provider>
        ),
    ],
} as ComponentMeta<typeof RbaPageDetailedNutritionFactsBlock>;

const Template: ComponentStory<typeof RbaPageDetailedNutritionFactsBlock> = (args) => (<RbaPageDetailedNutritionFactsBlock {...args} />);

const nutritionFacts: Dictionary<NutrientName, number> = {
    [NutrientName.Carbohydrate]: 57,
    [NutrientName.DietaryFiber]: 1.7,
    [NutrientName.Fat]: 10,
    [NutrientName.Protein]: 21.5,
    [NutrientName.Threonine]: 0.5,
};

const defaultNutrientDescriptions = store.getState().meta.nutrientDescriptions;

const nutrientDescriptions = {
    ...defaultNutrientDescriptions,
    [NutrientName.Carbohydrate]: {
        type: NutrientName.Carbohydrate,
        unit: NutrientUnit.g,
        dailyValue: 275,
        isFraction: false,
    },
    [NutrientName.DietaryFiber]: {
        type: NutrientName.DietaryFiber,
        unit: NutrientUnit.g,
        dailyValue: 28,
        isFraction: true,
    },
    [NutrientName.Fat]: {
        type: NutrientName.Fat,
        unit: NutrientUnit.g,
        dailyValue: 78,
        isFraction: false,
    },
    [NutrientName.Protein]: {
        type: NutrientName.Protein,
        unit: NutrientUnit.g,
        dailyValue: 50,
        isFraction: false,
    },
    [NutrientName.Threonine]: {
        type: NutrientName.Threonine,
        unit: NutrientUnit.g,
        dailyValue: null,
        isFraction: true,
    },
};

const nutritionFactInputs = Utils.convertNutritionFactValuesIntoInputs(nutritionFacts);

export const Default = Template.bind({});
Default.args = {
    nutritionFacts,
    nutritionFactInputs,
    nutrientDescriptions,
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
    isReadOnly: true,
    nutritionFacts,
    nutritionFactInputs,
    nutrientDescriptions,
};

