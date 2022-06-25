/* eslint-disable react/display-name */
import React from "react";
import { Provider } from "react-redux";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import type { CustomUnitInput } from "@common/units";
import { VolumeUnit, WeightUnit } from "@common/units";
import type { AppState } from "@store";
import { useStore } from "@store";
import * as actions from "@store/food/actions";

import RbaCustomUnitsBlock from ".";



export default {
    title: "Shared/RbaCustomUnitsBlock",
    component: RbaCustomUnitsBlock,
    argTypes: {
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
            <Provider store={useStore({} as AppState)}>
                {Story()}
            </Provider>
        ),
    ],
} as ComponentMeta<typeof RbaCustomUnitsBlock>;

const Template: ComponentStory<typeof RbaCustomUnitsBlock> = (args) => (<RbaCustomUnitsBlock {...args} />);


const customUnits: CustomUnitInput[] = [
    { product_id: -1, name: "package", amount: 120, amountInput: "120", unit: WeightUnit.g },
    { product_id: -1, name: "glass", amount: 240, amountInput: "240", unit: VolumeUnit.ml },
];

export const Default = Template.bind({});
Default.args = {
    customUnits,
    addCustomUnit: actions.addCustomUnit,
    removeCustomUnit: actions.removeCustomUnit,
    updateCustomUnit: actions.updateCustomUnit,
};


export const Empty = Template.bind({});
Empty.args = {
    customUnits: [],
    addCustomUnit: actions.addCustomUnit,
    removeCustomUnit: actions.removeCustomUnit,
    updateCustomUnit: actions.updateCustomUnit,
};
