/* eslint-disable react/display-name */
import React from "react";
import { Provider } from "react-redux";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import type { AppState } from "@store";
import { useStore } from "@store";
import { extractState } from "@store/recipe/reducer";

import RbaRecipePage from "./rba-recipe-page";

export default {
    title: "Recipe/RbaRecipePage",
    component: RbaRecipePage,
    argTypes: {
        recipeItem: {
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
            <Provider store={useStore({} as AppState)}>
                {Story()}
            </Provider>
        ),
    ],
} as ComponentMeta<typeof RbaRecipePage>;

const Template: ComponentStory<typeof RbaRecipePage> = (args) => <RbaRecipePage {...args} />;


const recipeItem = extractState({} as AppState);

export const Default = Template.bind({});
Default.args = {
    recipeItem,
    isNew: false,
    isReadOnly: true,
};

export const Editable = Template.bind({});
Editable.args = {
    recipeItem,
    isNew: true,
    isReadOnly: false,
};
