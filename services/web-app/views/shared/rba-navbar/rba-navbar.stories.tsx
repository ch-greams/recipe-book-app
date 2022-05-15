/* eslint-disable react/display-name */
import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import RbaNavbar from ".";


export default {
    title: "Shared/RbaNavbar",
    component: RbaNavbar,
    argTypes: {
        username: {
            type: { name: "string", required: true },
            table: { type: { summary: "string" } },
        },
    },
} as ComponentMeta<typeof RbaNavbar>;

const Template: ComponentStory<typeof RbaNavbar> = (args) => <RbaNavbar {...args} />;

export const Default = Template.bind({});
Default.args = {
    username: "John Doe",
};
