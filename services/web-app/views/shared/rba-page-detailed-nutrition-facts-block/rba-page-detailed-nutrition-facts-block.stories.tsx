/* eslint-disable react/display-name */
import React from "react";
import { Provider } from "react-redux";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { NutrientName } from "@common/nutrients";
import { NutrientUnit } from "@common/units";
import Utils from "@common/utils";
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

const nutrientInputs = Utils.convertNutrientValuesIntoInputs(nutrients);

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

