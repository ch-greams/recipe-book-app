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
        customUnitInputs: {
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


const customUnitInputs: CustomUnitInput[] = [
    { name: "package", amount: "120", unit: WeightUnit.g },
    { name: "glass", amount: "240", unit: VolumeUnit.ml },
];

export const Default = Template.bind({});
Default.args = {
    customUnitInputs,
    addCustomUnit: actions.addCustomUnit,
    removeCustomUnit: actions.removeCustomUnit,
    updateCustomUnit: actions.updateCustomUnit,
};


export const Empty = Template.bind({});
Empty.args = {
    customUnitInputs: [],
    addCustomUnit: actions.addCustomUnit,
    removeCustomUnit: actions.removeCustomUnit,
    updateCustomUnit: actions.updateCustomUnit,
};
