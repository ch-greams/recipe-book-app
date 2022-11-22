/* eslint-disable react/display-name */
import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import RbaJournalBlock from ".";


export default {
    title: "User/RbaJournalBlock",
    component: RbaJournalBlock,
} as ComponentMeta<typeof RbaJournalBlock>;

const Template: ComponentStory<typeof RbaJournalBlock> = (args) => <RbaJournalBlock {...args} />;

export const Default = Template.bind({});
