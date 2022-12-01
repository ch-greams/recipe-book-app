/* eslint-disable react/display-name */
import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import type { JournalStoreGroup } from "@store/types/journal";

import RbaJournalGroupsBlock from ".";


export default {
    title: "User/RbaJournalGroupsBlock",
    component: RbaJournalGroupsBlock,
    argTypes: {
        groups: {
            table: { type: { summary: "JournalStoreGroup[]" } },
        },
        updateGroups: {
            type: { name: "function", required: true },
            table: { type: { summary: "(groups: JournalGroup[]) => void" } },
        },
    },
} as ComponentMeta<typeof RbaJournalGroupsBlock>;

const Template: ComponentStory<typeof RbaJournalGroupsBlock> = (args) => <RbaJournalGroupsBlock {...args} />;

const JOURNAL_GROUPS: JournalStoreGroup[] = [
    { uiIndex: 1, name: "Breakfast" },
    { uiIndex: 3, name: "Lunch" },
    { uiIndex: 4, name: "Dinner" },
];


export const Default = Template.bind({});
Default.args = {
    groups: JOURNAL_GROUPS,
    updateGroups: (groups) => alert(`updateGroups(${groups})`),
};
