/* eslint-disable react/display-name */
import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { getValues } from "@common/object";

import RbaInput, { InputHeightSize, InputTextAlign, InputTheme, InputWidthSize } from ".";


export default {
    title: "Shared/RbaInput",
    component: RbaInput,
    argTypes: {
        width: {
            type: { name: "enum", value: getValues(InputWidthSize), required: true },
            table: { type: { summary: "InputWidthSize" } },
            control: { type: "select", options: InputWidthSize },
        },
        height: {
            type: { name: "enum", value: getValues(InputHeightSize), required: true },
            table: { type: { summary: "InputHeightSize" } },
            control: { type: "select", options: InputHeightSize },
        },
        theme: {
            type: { name: "enum", value: getValues(InputTheme), required: true },
            table: { type: { summary: "InputTheme" } },
            control: { type: "select", options: InputTheme },
        },
        align: {
            type: { name: "enum", value: getValues(InputTextAlign), required: true },
            table: { type: { summary: "InputTextAlign" } },
            control: { type: "select", options: InputTextAlign },
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
    theme: InputTheme.Primary,
    width: InputWidthSize.Large,
    height: InputHeightSize.Large,
    align: InputTextAlign.Right,
    value: "1.205",
    disabled: false,
};
