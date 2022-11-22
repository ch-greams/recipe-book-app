/* eslint-disable react/display-name */
import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { Unit, WeightUnit } from "@common/units";
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
        isReadOnly: {
            type: { name: "boolean", required: false },
            table: { type: { summary: "boolean" } },
        },
        customUnit: {
            type: {
                name: "object",
                value: {
                    name: { name: "string", required: true },
                    amount: { name: "string", required: true },
                    unit: { name: "enum", value: Utils.getObjectValues(Unit), required: true },
                },
                required: true,
            },
            table: { type: { summary: "CustomUnitInput" } },
        },
        updateItemName: {
            table: { type: { summary: "RbaInputChangeCallback" } },
        },
        updateItemAmount: {
            table: { type: { summary: "RbaInputChangeCallback" } },
        },
        updateItemUnit: {
            table: { type: { summary: "(unit: Units) => void" } },
        },
        onButtonClick: {
            table: { type: { summary: "() => void" } },
        },
    },
} as ComponentMeta<typeof RbaCustomUnitLine>;

const Template: ComponentStory<typeof RbaCustomUnitLine> = (args) => (<RbaCustomUnitLine {...args} />);


export const Default = Template.bind({});
Default.args = {
    isNew: false,
    isReadOnly: false,
    customUnit: { product_id: -1, name: "package", amount: 120, amountInput: "120", unit: WeightUnit.g },
};

export const NewCustomUnit = Template.bind({});
NewCustomUnit.args = {
    isNew: true,
    isReadOnly: false,
    customUnit: { product_id: -1, name: "", amount: 100, amountInput: "100", unit: WeightUnit.g },
};
