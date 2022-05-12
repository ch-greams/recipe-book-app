/* eslint-disable no-console */
/* eslint-disable react/display-name */
import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { Units } from "@common/units";
import Utils from "@common/utils";
import * as types from "@store/recipe/types";

import RbaSelect, { SelectHeightSize, SelectTheme, SelectWidthSize } from ".";


const ComponentDescription: ComponentMeta<typeof RbaSelect> = {
  title: "Shared/RbaSelect",
  component: RbaSelect,
  argTypes: {
    theme: {
      type: { name: "enum", value: Utils.getObjectValues(SelectTheme), required: true },
      table: { type: { summary: "SelectTheme" } },
      control: { type: "select", options: SelectTheme },
    },
    center: {
      type: { name: "boolean" },
      table: { type: { summary: "boolean" } },
    },
    width: {
      type: { name: "enum", value: Utils.getObjectValues(SelectWidthSize), required: true },
      table: { type: { summary: "SelectWidthSize" } },
      control: { type: "select", options: SelectWidthSize },
    },
    height: {
      type: { name: "enum", value: Utils.getObjectValues(SelectHeightSize), required: true },
      table: { type: { summary: "SelectHeightSize" } },
      control: { type: "select", options: SelectHeightSize },
    },
    options: {
      type: {
        name: "object",
        value: {
          group: { name: "string" },
          label: { name: "string" },
          value: { name: "string", required: true },
        },
        required: true,
      },
      table: { type: { summary: "SelectOption[]" } },
    },
    value: {
      table: { type: { summary: "string" } },
    },
    onChange: {
      type: { name: "function", required: true },
      table: { type: { summary: "(option: SelectOption) => void" } },
    },
  },
};

export default ComponentDescription;

const Template: ComponentStory<typeof RbaSelect> = (args) => <RbaSelect {...args} />;

export const IngredientUnit = Template.bind({});
IngredientUnit.args = {
  theme: SelectTheme.Primary,
  center: true,
  width: SelectWidthSize.Medium,
  height: SelectHeightSize.Medium,
  options: Object.values(Units).map((unit) => ({ value: unit })),
  onChange: (option) => console.log(option.value),
  value: Units.g,
};

export const AltIngredientUnit = Template.bind({});
AltIngredientUnit.args = {
  theme: SelectTheme.Alternative,
  center: true,
  width: SelectWidthSize.Medium,
  height: SelectHeightSize.Medium,
  options: Object.values(Units).map((unit) => ({ value: unit })),
  onChange: (option) => console.log(option.value),
  value: Units.g,
};

export const ServingSize = Template.bind({});
ServingSize.args = {
  theme: SelectTheme.Alternative,
  center: true,
  width: SelectWidthSize.Medium,
  height: SelectHeightSize.Large,
  options: Object.values(Units).map((unit) => ({ value: unit })),
  onChange: (option) => console.log(option.value),
  value: Units.g,
};

export const CustomUnit = Template.bind({});
CustomUnit.args = {
  theme: SelectTheme.Primary,
  center: true,
  width: SelectWidthSize.Medium,
  height: SelectHeightSize.Small,
  options: Object.values(Units).map((unit) => ({ value: unit })),
  onChange: (option) => console.log(option.value),
  value: Units.g,
};

export const SubDirectionType = Template.bind({});
SubDirectionType.args = {
  theme: SelectTheme.Alternative,
  center: false,
  width: SelectWidthSize.Full,
  height: SelectHeightSize.Medium,
  options: [
    types.SubDirectionType.Tip,
    types.SubDirectionType.Note,
    types.SubDirectionType.Warning,
  ].map((type) => ({ group: "Comment", value: type })),
  onChange: (option) => console.log(option.value),
  value: types.SubDirectionType.Note,
};
