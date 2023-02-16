/* eslint-disable react/display-name */
import React from "react";
import { Provider } from "react-redux";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import type { CustomUnitInput } from "@common/units";
import { VolumeUnit, WeightUnit } from "@common/units";
import { store } from "@store";
import * as actions from "@store/actions/food";

import RbaCustomUnitsBlock from ".";



export default {
    title: "Shared/RbaCustomUnitsBlock",
    component: RbaCustomUnitsBlock,
    argTypes: {
        isReadOnly: {
            type: { name: "boolean", required: false },
            table: { type: { summary: "boolean" } },
        },
        customUnits: {
            table: { type: { summary: "CustomUnitInput[]" } },
        },
        addCustomUnit: {
            table: { type: { summary: "(customUnit: CustomUnitInput) => AnyAction" } },
        },
        removeCustomUnit: {
            table: { type: { summary: "(index: number) => AnyAction" } },
        },
        updateCustomUnit: {
            table: { type: { summary: "(index: number, customUnit: CustomUnitInput) => AnyAction" } },
        },
    },
    decorators : [
        (Story) => (
            <Provider store={store}>
                {Story()}
            </Provider>
        ),
    ],
} as ComponentMeta<typeof RbaCustomUnitsBlock>;

const Template: ComponentStory<typeof RbaCustomUnitsBlock> = (args) => (<RbaCustomUnitsBlock {...args} />);


const customUnits: CustomUnitInput[] = [
    { food_id: -1, name: "package", amount: 120, amountInput: "120", unit: WeightUnit.g },
    { food_id: -1, name: "glass", amount: 240, amountInput: "240", unit: VolumeUnit.ml },
];

export const Default = Template.bind({});
Default.args = {
    isReadOnly: false,
    customUnits,
    addCustomUnit: actions.addCustomUnit,
    removeCustomUnit: actions.removeCustomUnit,
    updateCustomUnit: (index: number, customUnit: CustomUnitInput) => actions.updateCustomUnit({ index, customUnit }),
};


export const Empty = Template.bind({});
Empty.args = {
    isReadOnly: false,
    customUnits: [],
    addCustomUnit: actions.addCustomUnit,
    removeCustomUnit: actions.removeCustomUnit,
    updateCustomUnit: (index: number, customUnit: CustomUnitInput) => actions.updateCustomUnit({ index, customUnit }),
};
