/* eslint-disable react/display-name */
import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import RbaJournalGroup from ".";


export default {
    title: "User/RbaJournalGroup",
    component: RbaJournalGroup,
    argTypes: {
        uiIndex: {
            type: { name: "number", required: true },
            table: { type: { summary: "number" } },
        },
        name: {
            type: { name: "string", required: true },
            table: { type: { summary: "string" } },
        },
        updateGroup: {
            type: { name: "function", required: true },
            table: { type: { summary: "(uiIndex: number, name: string) => void" } },
        },
    },
} as ComponentMeta<typeof RbaJournalGroup>;

const Template: ComponentStory<typeof RbaJournalGroup> = (args) => <RbaJournalGroup {...args} />;


export const Default = Template.bind({});
Default.args = {
    uiIndex: 3,
    name: "Dinner",
    updateGroup: (uiIndex, name) => alert(`updateGroup(${uiIndex}, "${name}")`),
};
