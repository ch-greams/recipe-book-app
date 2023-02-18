/* eslint-disable react/display-name */
import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import Logger from "@common/logger";
import { WeightUnit } from "@common/units";
import type { JournalStoreEntry } from "@store/types/journal";

import RbaJournalEntry from ".";


export default {
    title: "Journal/RbaJournalEntry",
    component: RbaJournalEntry,
    argTypes: {
        entry: {
            table: { type: { summary: "JournalStoreEntry" } },
        },
        onEntryTimeUpdate: {
            type: { name: "function", required: true },
            table: { type: { summary: "RbaInputChangeCallback" } },
        },
        onFoodAmountUpdate: {
            type: { name: "function", required: true },
            table: { type: { summary: "RbaInputChangeCallback" } },
        },
        onFoodAmountSave: {
            type: { name: "function", required: true },
            table: { type: { summary: "() => void" } },
        },
        onFoodUnitUpdate: {
            type: { name: "function", required: true },
            table: { type: { summary: "RbaSelectChangeCallback" } },
        },
        onFoodUnitSave: {
            type: { name: "function", required: true },
            table: { type: { summary: "() => void" } },
        },
    },
} as ComponentMeta<typeof RbaJournalEntry>;

const Template: ComponentStory<typeof RbaJournalEntry> = (args) => <RbaJournalEntry {...args} />;

const JOURNAL_ENTRY: JournalStoreEntry = {
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
};


export const Default = Template.bind({});
Default.args = {
    entry: JOURNAL_ENTRY,
    onEntryTimeUpdate: (value) => alert(`onEntryTimeUpdate(${value})`),
    onFoodAmountUpdate: (value) => alert(`onFoodAmountUpdate(${value})`),
    onFoodAmountSave: () => Logger.info("onFoodAmountSave()"),
    onFoodUnitUpdate: (unit) => alert(`onFoodUnitUpdate(${JSON.stringify(unit)})`),
    onFoodUnitSave: () => Logger.info("onFoodUnitSave()"),
};
