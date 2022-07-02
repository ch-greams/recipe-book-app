/* eslint-disable react/display-name */
import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { Color } from "@common/colors";
import { IconSize } from "@icons/icon-params";
import RbaIconLoading from "@icons/rba-icon-loading";

import RbaSingleMessagePage from ".";


export default {
    title: "Shared/RbaSingleMessagePage",
    component: RbaSingleMessagePage,
    argTypes: {
        text: {
            type: { name: "string", required: false },
            table: { type: { summary: "string" } },
        },
    },
} as ComponentMeta<typeof RbaSingleMessagePage>;

const Template: ComponentStory<typeof RbaSingleMessagePage> = (args) => <RbaSingleMessagePage {...args} />;

export const Default = Template.bind({});
Default.args = {
    text: "John Doe",
};

export const WithChildComponent = Template.bind({});
WithChildComponent.args = {
    children: (<RbaIconLoading size={IconSize.ExtraLarge} color={Color.White} />),
};
