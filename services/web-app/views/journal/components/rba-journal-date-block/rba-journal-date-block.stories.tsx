/* eslint-disable react/display-name */
import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import RbaJournalDateBlock from ".";


export default {
    title: "Journal/RbaJournalDateBlock",
    component: RbaJournalDateBlock,
    argTypes: {
        date: {
            type: { name: "string", required: true },
            table: { type: { summary: "string" } },
        },
        isJournalSaved: {
            type: { name: "boolean", required: true },
            table: { type: { summary: "boolean" } },
        },
        decrementDate: {
            type: { name: "function", required: true },
            table: { type: { summary: "() => void" } },
        },
        incrementDate: {
            type: { name: "function", required: true },
            table: { type: { summary: "() => void" } },
        },
    },
} as ComponentMeta<typeof RbaJournalDateBlock>;

const Template: ComponentStory<typeof RbaJournalDateBlock> = (args) => <RbaJournalDateBlock {...args} />;


export const Default = Template.bind({});
Default.args = {
    date: "2022-12-17",
    isJournalSaved: false,
    decrementDate: () => alert("decrementDate()"),
    incrementDate: () => alert("incrementDate()"),
};
