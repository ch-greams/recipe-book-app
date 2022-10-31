/* eslint-disable react/display-name */
import React from "react";
import { Provider } from "react-redux";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { store } from "@store";

import RbaNavbar from ".";

export default {
    title: "Shared/RbaNavbar",
    component: RbaNavbar,
    argTypes: {
        username: {
            type: { name: "string", required: true },
            table: { type: { summary: "string" } },
        },
        hideSearch: {
            type: { name: "boolean", required: true },
            table: { type: { summary: "boolean" } },
        },
    },
    decorators : [
        (Story) => (
            <Provider store={store}>
                {Story()}
            </Provider>
        ),
    ],
} as ComponentMeta<typeof RbaNavbar>;

const Template: ComponentStory<typeof RbaNavbar> = (args) => <RbaNavbar {...args} />;

export const Default = Template.bind({});
Default.args = {
    username: "John Doe",
    hideSearch: false,
};

export const WithoutSearch = Template.bind({});
WithoutSearch.args = {
    username: "John Doe",
    hideSearch: true,
};
