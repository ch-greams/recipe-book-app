/* eslint-disable react/display-name */
import React from "react";
import { Provider } from "react-redux";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { store } from "@store";

import RbaLayout from ".";


export default {
    title: "Shared/RbaLayout",
    component: RbaLayout,
    argTypes: {
        children: {
            table: { type: { summary: "React.ReactNode" } },
        },
    },
    decorators : [
        (Story) => (
            <Provider store={store}>
                {Story()}
            </Provider>
        ),
    ],
} as ComponentMeta<typeof RbaLayout>;

const Template: ComponentStory<typeof RbaLayout> = (args) => <RbaLayout {...args} />;

export const Default = Template.bind({});
Default.args = {
    children: (<div style={{ height: "200px" }}></div>),
};
