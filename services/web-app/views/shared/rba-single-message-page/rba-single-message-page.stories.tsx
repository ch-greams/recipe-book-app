/* eslint-disable react/display-name */
import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import RbaSingleMessagePage from ".";


export default {
    title: "Shared/RbaSingleMessagePage",
    component: RbaSingleMessagePage,
    argTypes: {
        text: {
            type: { name: "string", required: true },
            table: { type: { summary: "string" } },
        },
    },
} as ComponentMeta<typeof RbaSingleMessagePage>;

const Template: ComponentStory<typeof RbaSingleMessagePage> = (args) => <RbaSingleMessagePage {...args} />;

export const Default = Template.bind({});
Default.args = {
    text: "John Doe",
};
