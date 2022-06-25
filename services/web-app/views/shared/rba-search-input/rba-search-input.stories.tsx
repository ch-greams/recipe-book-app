/* eslint-disable react/display-name */
import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import Utils from "@common/utils";

import RbaSearchInput, { SearchInputWidthSize } from ".";


export default {
    title: "Shared/RbaSearchInput",
    component: RbaSearchInput,
    argTypes: {
        width: {
            type: { name: "enum", value: Utils.getObjectValues(SearchInputWidthSize), required: true },
            table: { type: { summary: "SearchInputWidthSize" } },
            control: { type: "select", options: SearchInputWidthSize },
        },
    },
} as ComponentMeta<typeof RbaSearchInput>;

const Template: ComponentStory<typeof RbaSearchInput> = (args) => <RbaSearchInput {...args} />;

export const Default = Template.bind({});
Default.args = {
    width: SearchInputWidthSize.Medium,
};
