/* eslint-disable react/display-name */
import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import RbaButton from ".";


export default {
  title: "Shared/RbaButton",
  component: RbaButton,
} as ComponentMeta<typeof RbaButton>;

const Template: ComponentStory<typeof RbaButton> = (args) => <RbaButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  label: "Button",
};

// export const Secondary = Template.bind({});
// Secondary.args = {
//   label: 'SaveButton',
// };
