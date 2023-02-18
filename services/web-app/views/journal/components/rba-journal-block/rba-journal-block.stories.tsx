/* eslint-disable react/display-name */
import React from "react";
import { Provider } from "react-redux";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { WeightUnit } from "@common/units";
import { store } from "@store";
import type { JournalStoreEntry, JournalStoreGroup } from "@store/types/journal";

import RbaJournalBlock from ".";



export default {
    title: "Journal/RbaJournalBlock",
    component: RbaJournalBlock,
    argTypes: {
        currentDate: {
            type: { name: "string", required: false },
            table: { type: { summary: "string" } },
        },
        groups: {
            table: { type: { summary: "JournalStoreGroup[]" } },
        },
        entries: {
            table: { type: { summary: "JournalStoreEntry[]" } },
        },
        search: {
            table: { type: { summary: "SearchStore" } },
        },
    },
    decorators : [
        (Story) => (
            <Provider store={store}>
                {Story()}
            </Provider>
        ),
    ],
} as ComponentMeta<typeof RbaJournalBlock>;

const Template: ComponentStory<typeof RbaJournalBlock> = (args) => (<RbaJournalBlock {...args} />);


const JOURNAL_GROUPS: JournalStoreGroup[] = [
    { uiIndex: 1, name: "Breakfast" },
    { uiIndex: 2, name: "Lunch" },
    { uiIndex: 3, name: "Dinner" },
];

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


const SEARCH_STORE = store.getState().search;



export const Default = Template.bind({});
Default.args = {
    currentDate: "2022-12-17",
    groups: JOURNAL_GROUPS,
    entries: JOURNAL_ENTRIES,
    search: SEARCH_STORE,
};
