/* eslint-disable react/display-name */
import React from "react";
import { Provider } from "react-redux";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { store } from "@store";

import RbaPageTitleBlock from ".";



export default {
    title: "Shared/RbaPageTitleBlock",
    component: RbaPageTitleBlock,
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
} as ComponentMeta<typeof RbaPageTitleBlock>;

const Template: ComponentStory<typeof RbaPageTitleBlock> = (args) => (<RbaPageTitleBlock {...args} />);


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
