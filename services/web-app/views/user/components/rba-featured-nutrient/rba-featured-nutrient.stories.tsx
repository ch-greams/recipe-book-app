/* eslint-disable react/display-name */
import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import RbaFeaturedNutrient from ".";


export default {
    title: "User/RbaFeaturedNutrient",
    component: RbaFeaturedNutrient,
    argTypes: {
        slotIndex: {
            type: { name: "number", required: true },
            table: { type: { summary: "number" } },
        },
        nutrientId: {
            type: { name: "number" },
            table: { type: { summary: "number" } },
        },
        nutrientName: {
            type: { name: "string" },
            table: { type: { summary: "string" } },
        },
        userDailyTargetAmount: {
            type: { name: "string" },
            table: { type: { summary: "string" } },
        },
        nutrientDailyTargetAmount: {
            type: { name: "string" },
            table: { type: { summary: "string" } },
        },
        nutrientUnit: {
            type: { name: "string" },
            table: { type: { summary: "string" } },
        },
        updateNutrient: {
            type: { name: "function", required: true },
            table: { type: { summary: "(uiIndex: number, name: NutrientName, amount?: Option<number>) => void" } },
        },
        deleteNutrient: {
            type: { name: "function", required: true },
            table: { type: { summary: "(nutrientId: number) => void" } },
        },
    },
} as ComponentMeta<typeof RbaFeaturedNutrient>;

const Template: ComponentStory<typeof RbaFeaturedNutrient> = (args) => <RbaFeaturedNutrient {...args} />;


export const Default = Template.bind({});
Default.args = {
    slotIndex: 3,
    nutrientId: 18,
    nutrientName: "protein",
    userDailyTargetAmount: null,
    nutrientDailyTargetAmount: "50",
    nutrientUnit: "g",
    updateNutrient: (uiIndex, name, amount) => alert(`updateNutrient(${uiIndex}, "${name}", ${amount})`),
    deleteNutrient: (nutrientId) => alert(`deleteNutrient(${nutrientId})`),
};


export const Empty = Template.bind({});
Empty.args = {
    slotIndex: 7,
    updateNutrient: (uiIndex, name, amount) => alert(`updateNutrient(${uiIndex}, "${name}", ${amount})`),
    deleteNutrient: (nutrientId) => alert(`deleteNutrient(${nutrientId})`),
};
