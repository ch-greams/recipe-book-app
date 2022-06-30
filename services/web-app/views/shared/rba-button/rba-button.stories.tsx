/* eslint-disable react/display-name */
import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import Utils from "@common/utils";

import RbaButton, { ButtonWidthSize } from ".";


export default {
    title: "Shared/RbaButton",
    component: RbaButton,
    argTypes: {
        label: {
            type: { name: "string", required: true },
            table: { type: { summary: "string" } },
        },
        width: {
            type: { name: "enum", value: Utils.getObjectValues(ButtonWidthSize), required: true },
            table: { type: { summary: "ButtonWidthSize" } },
            control: { type: "select", options: ButtonWidthSize },
        },
        disabled: {
            type: { name: "boolean", required: false },
            table: { type: { summary: "boolean" } },
        },
    },
} as ComponentMeta<typeof RbaButton>;

const Template: ComponentStory<typeof RbaButton> = (args) => <RbaButton {...args} />;

export const Default = Template.bind({});
Default.args = {
    label: "Button",
    width: ButtonWidthSize.Medium,
};

export const Disabled = Template.bind({});
Disabled.args = {
    label: "Button",
    disabled: true,
    width: ButtonWidthSize.Medium,
};
