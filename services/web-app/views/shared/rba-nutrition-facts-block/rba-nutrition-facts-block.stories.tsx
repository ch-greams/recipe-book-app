/* eslint-disable react/display-name */
import React from "react";
import { Provider } from "react-redux";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { NutrientGroupType, NutrientName } from "@common/nutritionFacts";
import { NutrientUnit } from "@common/units";
import Utils from "@common/utils";
import { store } from "@store";

import RbaNutritionFactsBlock from ".";



export default {
    title: "Shared/RbaNutritionFactsBlock",
    component: RbaNutritionFactsBlock,
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
        nutritionFacts: {
            table: { type: { summary: "NutritionFact[]" } },
        },
    },
    decorators : [
        (Story) => (
            <Provider store={store}>
                {Story()}
            </Provider>
        ),
    ],
} as ComponentMeta<typeof RbaNutritionFactsBlock>;

const Template: ComponentStory<typeof RbaNutritionFactsBlock> = (args) => (<RbaNutritionFactsBlock {...args} />);

const nutritionFacts: Dictionary<NutrientName, number> = {
    [NutrientName.Carbohydrate]: 57,
    [NutrientName.DietaryFiber]: 1.7,
};
const nutritionFactInputs = Utils.convertNutritionFactValuesIntoInputs(nutritionFacts);
const group = Object.values(NutrientName);

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
};

const nutritionFactsGroup = Utils.getNutritionFacts(group, nutritionFacts, nutritionFactInputs, nutrientDescriptions);

export const Default = Template.bind({});
Default.args = {
    title: NutrientGroupType.Carbohydrates,
    nutritionFacts: nutritionFactsGroup,
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
    isReadOnly: true,
    title: NutrientGroupType.Carbohydrates,
    nutritionFacts: nutritionFactsGroup,
};
