/* eslint-disable react/display-name */
import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import Utils from "@common/utils";

import RbaButton, { ButtonWidthSize } from ".";


export default {
  title: "Shared/RbaButton",
  component: RbaButton,
  argTypes: {
    label: {
      table: { type: { summary: "string" } },
    },
    width: {
      type: { name: "enum", value: Utils.getObjectValues(ButtonWidthSize), required: true },
      table: { type: { summary: "ButtonWidthSize" } },
      control: { type: "select", options: ButtonWidthSize },
    },
  },
} as ComponentMeta<typeof RbaButton>;

const Template: ComponentStory<typeof RbaButton> = (args) => <RbaButton {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  label: "Button",
  width: ButtonWidthSize.Medium,
};
