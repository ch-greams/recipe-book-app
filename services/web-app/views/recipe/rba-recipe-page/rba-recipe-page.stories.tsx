/* eslint-disable react/display-name */
import React from "react";
import { Provider } from "react-redux";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { store } from "@store";

import RbaRecipePage from "./rba-recipe-page";

export default {
    title: "Recipe/RbaRecipePage",
    component: RbaRecipePage,
    argTypes: {
        recipe: {
            table: { type: { summary: "RecipePageStore" } },
        },
        isNew: {
            type: { name: "boolean", required: true },
            table: { type: { summary: "boolean" } },
        },
        isReadOnly: {
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
} as ComponentMeta<typeof RbaRecipePage>;

const Template: ComponentStory<typeof RbaRecipePage> = (args) => <RbaRecipePage {...args} />;


const recipe = store.getState().recipe;
const search = store.getState().search;

export const Default = Template.bind({});
Default.args = {
    recipe: recipe,
    search,
    isNew: false,
    isReadOnly: true,
};

export const Editable = Template.bind({});
Editable.args = {
    recipe: recipe,
    search,
    isNew: true,
    isReadOnly: false,
};
