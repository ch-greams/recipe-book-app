/* eslint-disable react/display-name */
import React from "react";
import { Provider } from "react-redux";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import type { NutritionFactType } from "@common/nutritionFacts";
import { CarbohydrateNutritionFactType, NutrientGroupType } from "@common/nutritionFacts";
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

const nutritionFacts: Dictionary<NutritionFactType, number> = {
    [CarbohydrateNutritionFactType.Carbohydrate]: 57,
    [CarbohydrateNutritionFactType.DietaryFiber]: 1.7,
};
const nutritionFactInputs = Utils.convertNutritionFactValuesIntoInputs(nutritionFacts);
const group = Object.values(CarbohydrateNutritionFactType);

const nutritionFactsGroup = Utils.getNutritionFacts(group, nutritionFacts, nutritionFactInputs);

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
