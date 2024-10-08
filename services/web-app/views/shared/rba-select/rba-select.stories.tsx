/* eslint-disable react/display-name */
import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import Logger from "@common/logger";
import { getValues } from "@common/object";
import { Unit } from "@common/units";

import RbaSelect, { SelectHeightSize, SelectTheme, SelectWidthSize } from ".";


const ComponentDescription: ComponentMeta<typeof RbaSelect> = {
    title: "Shared/RbaSelect",
    component: RbaSelect,
    argTypes: {
        disabled: {
            type: { name: "boolean" },
            table: { type: { summary: "boolean" } },
        },
        theme: {
            type: { name: "enum", value: getValues(SelectTheme), required: true },
            table: { type: { summary: "SelectTheme" } },
            control: { type: "select", options: SelectTheme },
        },
        center: {
            type: { name: "boolean" },
            table: { type: { summary: "boolean" } },
        },
        width: {
            type: { name: "enum", value: getValues(SelectWidthSize), required: true },
            table: { type: { summary: "SelectWidthSize" } },
            control: { type: "select", options: SelectWidthSize },
        },
        height: {
            type: { name: "enum", value: getValues(SelectHeightSize), required: true },
            table: { type: { summary: "SelectHeightSize" } },
            control: { type: "select", options: SelectHeightSize },
        },
        options: {
            type: {
                name: "object",
                value: {
                    group: { name: "string" },
                    label: { name: "string" },
                    value: { name: "string", required: true },
                },
                required: true,
            },
            table: { type: { summary: "SelectOption[]" } },
        },
        value: {
            table: { type: { summary: "string" } },
        },
        onChange: {
            type: { name: "function", required: true },
            table: { type: { summary: "RbaSelectChangeCallback | (option: SelectOption) => void" } },
        },
    },
};

export default ComponentDescription;

const Template: ComponentStory<typeof RbaSelect> = (args) => <RbaSelect {...args} />;

export const IngredientUnit = Template.bind({});
IngredientUnit.args = {
    disabled: false,
    theme: SelectTheme.Primary,
    center: true,
    width: SelectWidthSize.Medium,
    height: SelectHeightSize.Medium,
    options: Object.values(Unit).map((unit) => ({ value: unit })),
    onChange: (option) => Logger.info(option.value),
    value: Unit.g,
};

export const AltIngredientUnit = Template.bind({});
AltIngredientUnit.args = {
    disabled: false,
    theme: SelectTheme.Alternative,
    center: true,
    width: SelectWidthSize.Medium,
    height: SelectHeightSize.Medium,
    options: Object.values(Unit).map((unit) => ({ value: unit })),
    onChange: (option) => Logger.info(option.value),
    value: Unit.g,
};

export const ServingSize = Template.bind({});
ServingSize.args = {
    disabled: false,
    theme: SelectTheme.Alternative,
    center: true,
    width: SelectWidthSize.Medium,
    height: SelectHeightSize.Large,
    options: Object.values(Unit).map((unit) => ({ value: unit })),
    onChange: (option) => Logger.info(option.value),
    value: Unit.g,
};

export const CustomUnit = Template.bind({});
CustomUnit.args = {
    disabled: false,
    theme: SelectTheme.Primary,
    center: true,
    width: SelectWidthSize.Medium,
    height: SelectHeightSize.Small,
    options: Object.values(Unit).map((unit) => ({ value: unit })),
    onChange: (option) => Logger.info(option.value),
    value: Unit.g,
};
