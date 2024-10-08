/* eslint-disable react/display-name */
import React from "react";
import { Provider } from "react-redux";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { NutrientGroupType, NutrientName } from "@common/nutrients";
import { NutrientUnit } from "@common/units";
import { getNutrients } from "@common/utils";
import { store } from "@store";
import { convertNutrientValuesIntoInputs } from "@store/helpers/food";

import RbaNutrientsBlock from ".";



export default {
    title: "Shared/RbaNutrientsBlock",
    component: RbaNutrientsBlock,
    argTypes: {
        isReadOnly: {
            type: { name: "boolean" },
            table: { type: { summary: "boolean" } },
            defaultValue: false,
        },
        title: {
            type: { name: "string" },
            table: { type: { summary: "string" } },
        },
        nutrients: {
            table: { type: { summary: "Nutrient[]" } },
        },
    },
    decorators : [
        (Story) => (
            <Provider store={store}>
                {Story()}
            </Provider>
        ),
    ],
} as ComponentMeta<typeof RbaNutrientsBlock>;

const Template: ComponentStory<typeof RbaNutrientsBlock> = (args) => (<RbaNutrientsBlock {...args} />);

const nutrients: Dictionary<NutrientName, number> = {
    [NutrientName.Carbohydrate]: 57,
    [NutrientName.DietaryFiber]: 1.7,
};
const nutrientInputs = convertNutrientValuesIntoInputs(nutrients);
const group = Object.values(NutrientName);

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
};

const nutrientsGroup = getNutrients(group, nutrients, nutrientInputs, nutrientDescriptions);

export const Default = Template.bind({});
Default.args = {
    title: NutrientGroupType.Carbohydrates,
    nutrients: nutrientsGroup,
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
    isReadOnly: true,
    title: NutrientGroupType.Carbohydrates,
    nutrients: nutrientsGroup,
};
