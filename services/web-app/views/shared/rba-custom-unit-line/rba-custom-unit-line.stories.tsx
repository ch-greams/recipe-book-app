/* eslint-disable react/display-name */
import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { Units, WeightUnit } from "@common/units";
import Utils from "@common/utils";

import RbaCustomUnitLine from ".";



export default {
    title: "Shared/RbaCustomUnitLine",
    component: RbaCustomUnitLine,
    argTypes: {
        isNew: {
            type: { name: "boolean", required: true },
            table: { type: { summary: "boolean" } },
        },
        customUnit: {
            type: {
                name: "object",
                value: {
                    name: { name: "string", required: true },
                    amount: { name: "string", required: true },
                    unit: { name: "enum", value: Utils.getObjectValues(Units), required: true },
                },
                required: true,
            },
            table: { type: { summary: "CustomUnitInput" } },
        },
        updateItemName: {
            table: { type: { summary: "InputChangeCallback" } },
        },
        updateItemAmount: {
            table: { type: { summary: "InputChangeCallback" } },
        },
        updateItemUnit: {
            table: { type: { summary: "(unit: Units) => void" } },
        },
        upsertCustomUnit: {
            table: { type: { summary: "() => void" } },
        },
    },
} as ComponentMeta<typeof RbaCustomUnitLine>;

const Template: ComponentStory<typeof RbaCustomUnitLine> = (args) => (<RbaCustomUnitLine {...args} />);


export const Default = Template.bind({});
Default.args = {
    isNew: false,
    customUnit: { name: "package", amount: "120", unit: WeightUnit.g },
};

export const NewCustomUnit = Template.bind({});
NewCustomUnit.args = {
    isNew: true,
    customUnit: { name: "", amount: "100", unit: WeightUnit.g },
};
