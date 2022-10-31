/* eslint-disable react/display-name */
import React from "react";
import { Provider } from "react-redux";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { NutrientName } from "@common/nutritionFacts";
import { NutrientUnit } from "@common/units";
import { store } from "@store";

import type { NutritionFact } from ".";
import RbaNutritionFactLine from ".";



export default {
    title: "Shared/RbaNutritionFactLine",
    component: RbaNutritionFactLine,
    argTypes: {
        isReadOnly: {
            type: { name: "boolean" },
            table: { type: { summary: "boolean" } },
            defaultValue: false,
        },
        nutritionFact: {
            table: { type: { summary: "NutritionFact" } },
        },
    },
    decorators : [
        (Story) => (
            <Provider store={store}>
                {Story()}
            </Provider>
        ),
    ],
} as ComponentMeta<typeof RbaNutritionFactLine>;

const Template: ComponentStory<typeof RbaNutritionFactLine> = (args) => (<RbaNutritionFactLine {...args} />);

// -----------------------------------------------------------------------------
// NutritionFact
// -----------------------------------------------------------------------------

const nutritionFact: NutritionFact = {
    type: NutrientName.Carbohydrate,
    amount: 57,
    inputValue: "57",
    unit: NutrientUnit.g,
    dailyValue: 20.7,
    isFraction: false,
};

export const Default = Template.bind({});
Default.args = {
    nutritionFact,
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
    isReadOnly: true,
    nutritionFact,
};

// -----------------------------------------------------------------------------
// NutritionFactFraction
// -----------------------------------------------------------------------------

const nutritionFactFraction: NutritionFact = {
    type: NutrientName.DietaryFiber,
    amount: 57,
    inputValue: "57",
    unit: NutrientUnit.g,
    dailyValue: 20.7,
    isFraction: true,
};

export const DefaultFraction = Template.bind({});
DefaultFraction.args = {
    nutritionFact: nutritionFactFraction,
};

export const ReadOnlyFraction = Template.bind({});
ReadOnlyFraction.args = {
    isReadOnly: true,
    nutritionFact: nutritionFactFraction,
};
