/* eslint-disable react/display-name */
import React from "react";
import { Provider } from "react-redux";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import type { AppState } from "@store";
import { useStore } from "@store";
import { extractState } from "@store/food/reducer";

import RbaFoodPage from "./rba-food-page";

export default {
    title: "Food/RbaFoodPage",
    component: RbaFoodPage,
    argTypes: {
        foodItem: {
            table: { type: { summary: "FoodPageStore" } },
        },
        isNew: {
            type: { name: "boolean", required: true },
            table: { type: { summary: "boolean" } },
        },
    },
    decorators : [
        (Story) => (
            <Provider store={useStore({} as AppState)}>
                {Story()}
            </Provider>
        ),
    ],
} as ComponentMeta<typeof RbaFoodPage>;

const Template: ComponentStory<typeof RbaFoodPage> = (args) => <RbaFoodPage {...args} />;


const foodItem = extractState({} as AppState);

export const Default = Template.bind({});
Default.args = {
    foodItem,
    isNew: false,
};

export const New = Template.bind({});
New.args = {
    foodItem,
    isNew: true,
};
