/* eslint-disable react/display-name */
import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import RbaFooter from ".";


export default {
    title: "Shared/RbaFooter",
    component: RbaFooter,
} as ComponentMeta<typeof RbaFooter>;

const Template: ComponentStory<typeof RbaFooter> = (args) => <RbaFooter {...args} />;

export const Default = Template.bind({});
