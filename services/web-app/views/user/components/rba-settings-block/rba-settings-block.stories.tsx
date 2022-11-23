/* eslint-disable react/display-name */
import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import RbaSettingsBlock from ".";


export default {
    title: "User/RbaSettingsBlock",
    component: RbaSettingsBlock,
} as ComponentMeta<typeof RbaSettingsBlock>;

const Template: ComponentStory<typeof RbaSettingsBlock> = (args) => <RbaSettingsBlock {...args} />;

export const Default = Template.bind({});
