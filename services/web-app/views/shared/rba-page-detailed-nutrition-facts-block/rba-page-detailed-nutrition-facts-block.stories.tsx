/* eslint-disable react/display-name */
import React from "react";
import { Provider } from "react-redux";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import type { NutritionFactType } from "@common/nutritionFacts";
import {
    CarbohydrateNutritionFactType, LipidNutritionFactType,
    MineralNutritionFactType, ProteinNutritionFactType,
} from "@common/nutritionFacts";
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
            table: { type: { summary: "Dictionary<NutritionFactType, number>" } },
        },
        nutritionFactInputs: {
            table: { type: { summary: "Dictionary<NutritionFactType, string>" } },
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

const nutritionFacts: Dictionary<NutritionFactType, number> = {
    [CarbohydrateNutritionFactType.Carbohydrate]: 57,
    [CarbohydrateNutritionFactType.DietaryFiber]: 1.7,
    [LipidNutritionFactType.Fat]: 10,
    [ProteinNutritionFactType.Protein]: 21.5,
    [ProteinNutritionFactType.Threonine]: 0.5,
    [MineralNutritionFactType.Iron]: 0.18,
};

const nutritionFactInputs = Utils.convertNutritionFactValuesIntoInputs(nutritionFacts);

export const Default = Template.bind({});
Default.args = {
    nutritionFacts,
    nutritionFactInputs,
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
    isReadOnly: true,
    nutritionFacts,
    nutritionFactInputs,
};

