/* eslint-disable react/display-name */
import React from "react";
import { Provider } from "react-redux";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { NutrientName } from "@common/nutrients";
import { NutrientUnit } from "@common/units";
import { convertNutrientValuesIntoInputs } from "@common/utils";
import { store } from "@store";

import RbaPageDetailedNutrientsBlock from ".";



export default {
    title: "Shared/RbaPageDetailedNutrientsBlock",
    component: RbaPageDetailedNutrientsBlock,
    argTypes: {
        isReadOnly: {
            type: { name: "boolean" },
            table: { type: { summary: "boolean" } },
        },
        nutrients: {
            table: { type: { summary: "Dictionary<NutrientName, number>" } },
        },
        nutrientInputs: {
            table: { type: { summary: "Dictionary<NutrientName, string>" } },
        },
        nutrientDescriptions: {
            table: { type: { summary: "Record<NutrientName, NutrientDescription>" } },
        },
    },
    decorators : [
        (Story) => (
            <Provider store={store}>
                {Story()}
            </Provider>
        ),
    ],
} as ComponentMeta<typeof RbaPageDetailedNutrientsBlock>;

const Template: ComponentStory<typeof RbaPageDetailedNutrientsBlock> = (args) => (<RbaPageDetailedNutrientsBlock {...args} />);

const nutrients: Dictionary<NutrientName, number> = {
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
        id: 5,
        type: NutrientName.Carbohydrate,
        unit: NutrientUnit.g,
        dailyValue: 275,
        isFraction: false,
    },
    [NutrientName.DietaryFiber]: {
        id: 6,
        type: NutrientName.DietaryFiber,
        unit: NutrientUnit.g,
        dailyValue: 28,
        isFraction: true,
    },
    [NutrientName.Fat]: {
        id: 9,
        type: NutrientName.Fat,
        unit: NutrientUnit.g,
        dailyValue: 78,
        isFraction: false,
    },
    [NutrientName.Protein]: {
        id: 18,
        type: NutrientName.Protein,
        unit: NutrientUnit.g,
        dailyValue: 50,
        isFraction: false,
    },
    [NutrientName.Threonine]: {
        id: 20,
        type: NutrientName.Threonine,
        unit: NutrientUnit.g,
        dailyValue: null,
        isFraction: true,
    },
};

const nutrientInputs = convertNutrientValuesIntoInputs(nutrients);

export const Default = Template.bind({});
Default.args = {
    nutrients,
    nutrientInputs,
    nutrientDescriptions,
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
    isReadOnly: true,
    nutrients,
    nutrientInputs,
    nutrientDescriptions,
};

