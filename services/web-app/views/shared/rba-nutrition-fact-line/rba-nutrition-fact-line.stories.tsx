/* eslint-disable react/display-name */
import React from "react";
import { Provider } from "react-redux";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { NutrientName } from "@common/nutrients";
import { NutrientUnit } from "@common/units";
import { store } from "@store";

import type { Nutrient } from ".";
import RbaNutrientLine from ".";



export default {
    title: "Shared/RbaNutrientLine",
    component: RbaNutrientLine,
    argTypes: {
        isReadOnly: {
            type: { name: "boolean" },
            table: { type: { summary: "boolean" } },
            defaultValue: false,
        },
        nutrient: {
            table: { type: { summary: "Nutrient" } },
        },
    },
    decorators : [
        (Story) => (
            <Provider store={store}>
                {Story()}
            </Provider>
        ),
    ],
} as ComponentMeta<typeof RbaNutrientLine>;

const Template: ComponentStory<typeof RbaNutrientLine> = (args) => (<RbaNutrientLine {...args} />);

// -----------------------------------------------------------------------------
// Nutrient
// -----------------------------------------------------------------------------

const nutrient: Nutrient = {
    type: NutrientName.Carbohydrate,
    amount: 57,
    inputValue: "57",
    unit: NutrientUnit.g,
    dailyValue: 20.7,
    isFraction: false,
};

export const Default = Template.bind({});
Default.args = {
    nutrient,
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
    isReadOnly: true,
    nutrient,
};

// -----------------------------------------------------------------------------
// NutrientFraction
// -----------------------------------------------------------------------------

const nutrientFraction: Nutrient = {
    type: NutrientName.DietaryFiber,
    amount: 57,
    inputValue: "57",
    unit: NutrientUnit.g,
    dailyValue: 20.7,
    isFraction: true,
};

export const DefaultFraction = Template.bind({});
DefaultFraction.args = {
    nutrient: nutrientFraction,
};

export const ReadOnlyFraction = Template.bind({});
ReadOnlyFraction.args = {
    isReadOnly: true,
    nutrient: nutrientFraction,
};
