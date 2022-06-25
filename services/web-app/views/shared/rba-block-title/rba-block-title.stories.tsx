/* eslint-disable react/display-name */
import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import RbaBlockTitle from ".";


export default {
    title: "Shared/RbaBlockTitle",
    component: RbaBlockTitle,
    argTypes: {
        text: {
            type: { name: "string", required: true },
            table: { type: { summary: "string" } },
        },
    },
} as ComponentMeta<typeof RbaBlockTitle>;

const Template: ComponentStory<typeof RbaBlockTitle> = (args) => <RbaBlockTitle {...args} />;

export const Default = Template.bind({});
Default.args = {
    text: "Block Title",
};
