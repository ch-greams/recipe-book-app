/* eslint-disable react/display-name */
import React from "react";
import { Provider } from "react-redux";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { store } from "@store";

import RbaPageTitleBlockInput from ".";



export default {
    title: "Shared/RbaPageTitleBlockInput",
    component: RbaPageTitleBlockInput,
    argTypes: {
        name: {
            type: { name: "string" },
            table: { type: { summary: "string" } },
        },
        brand: {
            type: { name: "string" },
            table: { type: { summary: "string" } },
        },
        description: {
            type: { name: "string" },
            table: { type: { summary: "string" } },
        },
    },
    decorators : [
        (Story) => (
            <Provider store={store}>
                {Story()}
            </Provider>
        ),
    ],
} as ComponentMeta<typeof RbaPageTitleBlockInput>;

const Template: ComponentStory<typeof RbaPageTitleBlockInput> = (args) => (<RbaPageTitleBlockInput {...args} />);


export const WithoutDescription = Template.bind({});
WithoutDescription.args = {
    name: "Name",
    brand: "Brand",
};


export const WithDescription = Template.bind({});
WithDescription.args = {
    name: "Name",
    brand: "Brand",
    description: "Description",
};
