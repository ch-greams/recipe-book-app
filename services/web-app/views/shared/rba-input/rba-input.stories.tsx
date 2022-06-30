/* eslint-disable react/display-name */
import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import Utils from "@common/utils";

import RbaInput, { InputHeightSize, InputTheme, InputWidthSize } from ".";


export default {
    title: "Shared/RbaInput",
    component: RbaInput,
    argTypes: {
        width: {
            type: { name: "enum", value: Utils.getObjectValues(InputWidthSize), required: true },
            table: { type: { summary: "InputWidthSize" } },
            control: { type: "select", options: InputWidthSize },
        },
        height: {
            type: { name: "enum", value: Utils.getObjectValues(InputHeightSize), required: true },
            table: { type: { summary: "InputHeightSize" } },
            control: { type: "select", options: InputHeightSize },
        },
        theme: {
            type: { name: "enum", value: Utils.getObjectValues(InputTheme), required: true },
            table: { type: { summary: "InputTheme" } },
            control: { type: "select", options: InputTheme },
        },
        value: {
            type: { name: "string", required: true },
            table: { type: { summary: "string" } },
        },
        disabled: {
            type: { name: "boolean", required: false },
            table: { type: { summary: "boolean" } },
        },
    },
} as ComponentMeta<typeof RbaInput>;

const Template: ComponentStory<typeof RbaInput> = (args) => <RbaInput {...args} />;

export const Default = Template.bind({});
Default.args = {
    value: "1.205",
    disabled: false,
};
