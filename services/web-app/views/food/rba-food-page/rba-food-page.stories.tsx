/* eslint-disable react/display-name */
import React from "react";
import { Provider } from "react-redux";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { store } from "@store";

import RbaFoodPage from "./rba-food-page";

export default {
    title: "Food/RbaFoodPage",
    component: RbaFoodPage,
    argTypes: {
        food: {
            table: { type: { summary: "FoodPageStore" } },
        },
        isNew: {
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
} as ComponentMeta<typeof RbaFoodPage>;

const Template: ComponentStory<typeof RbaFoodPage> = (args) => <RbaFoodPage {...args} />;


const food = store.getState().food;

export const Default = Template.bind({});
Default.args = {
    food: food,
    isNew: false,
};

export const New = Template.bind({});
New.args = {
    food: food,
    isNew: true,
};
