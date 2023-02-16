/* eslint-disable react/display-name */
import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import Logger from "@common/logger";
import { WeightUnit } from "@common/units";
import type { JournalStoreEntry } from "@store/types/journal";

import RbaJournalGroupBlock from ".";


export default {
    title: "Journal/RbaJournalGroupBlock",
    component: RbaJournalGroupBlock,
    argTypes: {
        groupName: {
            type: { name: "string", required: true },
            table: { type: { summary: "string" } },
        },
        groupIndex: {
            type: { name: "number" },
            table: { type: { summary: "number" } },
        },
        entries: {
            table: { type: { summary: "JournalStoreEntry[]" } },
        },
        onEntryTimeUpdate: {
            type: { name: "function", required: true },
            table: { type: { summary: "(id: number, value: string) => void" } },
        },
        onFoodAmountUpdate: {
            type: { name: "function", required: true },
            table: { type: { summary: "(id: number, value: string) => void" } },
        },
        onFoodAmountSave: {
            type: { name: "function", required: true },
            table: { type: { summary: "(id: number) => void" } },
        },
        onFoodUnitUpdate: {
            type: { name: "function", required: true },
            table: { type: { summary: "(id: number, value: string) => void" } },
        },
        onFoodUnitSave: {
            type: { name: "function", required: true },
            table: { type: { summary: "(id: number) => void" } },
        },
    },
} as ComponentMeta<typeof RbaJournalGroupBlock>;

const Template: ComponentStory<typeof RbaJournalGroupBlock> = (args) => <RbaJournalGroupBlock {...args} />;

const JOURNAL_ENTRIES: JournalStoreEntry[] = [
    {
        id: 1,
        entryDate: "2022-12-01",
        entryTime: "07:10",
        groupIndex: 2,
        foodId: 1,
        foodName: "Egg",
        foodAmount: 220,
        foodAmountInput: "220",
        foodUnit: "g",
        foodDensity: 1,
        foodNutrients: {
            energy: 143,
            carbohydrate: 1.1,
            protein: 13,
            fat: 11,
            saturated: 1.3,
        },
        foodCustomUnits: [
            {
                name: "large",
                amount: 50,
                unit: WeightUnit.g,
                food_id: 1,
            },
            {
                name: "small",
                amount: 35,
                unit: WeightUnit.g,
                food_id: 1,
            },
        ],
    },
];

export const Default = Template.bind({});
Default.args = {
    groupName: "Lunch",
    groupIndex: 2,
    entries: JOURNAL_ENTRIES,
    onEntryTimeUpdate: (id, value) => alert(`onEntryTimeUpdate(${id}, "${value}")`),
    onFoodAmountUpdate: (id, value) => alert(`onFoodAmountUpdate(${id}, "${value}")`),
    onFoodAmountSave: (id) => Logger.info(`onFoodAmountSave(${id})`),
    onFoodUnitUpdate: (id, value) => alert(`onFoodUnitUpdate(${id}, "${value}")`),
    onFoodUnitSave: (id) => Logger.info(`onFoodUnitSave(${id})`),
};
