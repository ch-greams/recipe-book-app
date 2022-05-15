/* eslint-disable react/display-name */
import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import RbaDiaryBlock from ".";


export default {
    title: "User/RbaDiaryBlock",
    component: RbaDiaryBlock,
} as ComponentMeta<typeof RbaDiaryBlock>;

const Template: ComponentStory<typeof RbaDiaryBlock> = (args) => <RbaDiaryBlock {...args} />;

export const Default = Template.bind({});
