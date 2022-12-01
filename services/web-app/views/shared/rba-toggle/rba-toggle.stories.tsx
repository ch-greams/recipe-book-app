/* eslint-disable react/display-name */
import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import RbaToggle from ".";


export default {
    title: "Shared/RbaToggle",
    component: RbaToggle,
    argTypes: {
        value: {
            type: { name: "boolean", required: false },
            table: { type: { summary: "boolean" } },
        },
        onToggle: {
            type: { name: "function", required: true },
            table: { type: { summary: "(value: boolean) => void" } },
        },
    },
} as ComponentMeta<typeof RbaToggle>;

const Template: ComponentStory<typeof RbaToggle> = (args) => <RbaToggle {...args} />;

export const Default = Template.bind({});
Default.args = {
    value: false,
    onToggle: (value) => alert(`onToggle(${value})`),
};
