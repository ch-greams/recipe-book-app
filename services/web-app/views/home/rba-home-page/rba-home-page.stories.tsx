/* eslint-disable react/display-name */
import React from "react";
import { Provider } from "react-redux";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import type { AppState } from "@store";
import { useStore } from "@store";

import RbaHomePage from ".";


export default {
    title: "Home/RbaHomePage",
    component: RbaHomePage,
    decorators : [
        (Story) => (
            <Provider store={useStore({} as AppState)}>
                {Story()}
            </Provider>
        ),
    ],
} as ComponentMeta<typeof RbaHomePage>;

const Template: ComponentStory<typeof RbaHomePage> = (args) => <RbaHomePage {...args} />;

export const Default = Template.bind({});
