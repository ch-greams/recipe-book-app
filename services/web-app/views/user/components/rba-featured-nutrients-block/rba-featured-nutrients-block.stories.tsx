/* eslint-disable react/display-name */
import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { store } from "@store";
import type { UserStoreNutrient } from "@store/types/user";

import RbaFeaturedNutrientsBlock from ".";


export default {
    title: "User/RbaFeaturedNutrientsBlock",
    component: RbaFeaturedNutrientsBlock,
    argTypes: {
        userNutrients: {
            table: { type: { summary: "UserStoreNutrient[]" } },
        },
        nutrientDescriptions: {
            table: { type: { summary: "Record<NutrientName, NutrientDescription>" } },
        },
        updateNutrient: {
            type: { name: "function", required: true },
            table: { type: { summary: "(nutrient: UserNutrient) => void" } },
        },
        deleteNutrient: {
            type: { name: "function", required: true },
            table: { type: { summary: "(nutrientId: number) => void" } },
        },
    },
} as ComponentMeta<typeof RbaFeaturedNutrientsBlock>;

const Template: ComponentStory<typeof RbaFeaturedNutrientsBlock> = (args) => <RbaFeaturedNutrientsBlock {...args} />;

const DEFAULT_NUTRIENT_DESCRIPTIONS = store.getState().meta.nutrientDescriptions;

const USER_NUTRIENTS: UserStoreNutrient[] = [
    {
        nutrientId: 9,
        isFeatured: true,
        userDailyTargetAmount: null,
        uiIndex: 1,
        nutrientName: "fat",
        nutrientDailyTargetAmount: 78,
        nutrientUnit: "g",
        nutrientGroup: "lipids",
        nutrientParentName: null,
    },
    {
        nutrientId: 10,
        isFeatured: true,
        userDailyTargetAmount: 22.5,
        uiIndex: 2,
        nutrientName: "monounsaturated",
        nutrientDailyTargetAmount: null,
        nutrientUnit: "g",
        nutrientGroup: "lipids",
        nutrientParentName: "fat",
    },
];


export const Default = Template.bind({});
Default.args = {
    userNutrients: USER_NUTRIENTS,
    nutrientDescriptions: DEFAULT_NUTRIENT_DESCRIPTIONS,
    updateNutrient: (nutrient) => alert(`updateNutrient(${nutrient})`),
    deleteNutrient: (nutrientId) => alert(`deleteNutrient(${nutrientId})`),
};
