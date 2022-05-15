/* eslint-disable react/display-name */
import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import RbaHomePage from ".";


export default {
    title: "Home/RbaHomePage",
    component: RbaHomePage,
} as ComponentMeta<typeof RbaHomePage>;

const Template: ComponentStory<typeof RbaHomePage> = (args) => <RbaHomePage {...args} />;

export const Default = Template.bind({});
