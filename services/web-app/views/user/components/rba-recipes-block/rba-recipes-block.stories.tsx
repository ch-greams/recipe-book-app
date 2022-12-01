/* eslint-disable react/display-name */
import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import RbaRecipesBlock from ".";


export default {
    title: "User/RbaRecipesBlock",
    component: RbaRecipesBlock,
    argTypes: {
        favoriteRecipes: {
            table: { type: { summary: "RecipeItem[]" } },
        },
        customRecipes: {
            table: { type: { summary: "RecipeItem[]" } },
        },
        deleteFavoriteRecipe: {
            table: { type: { summary: "(productId: number) => void" } },
        },
        deleteCustomRecipe: {
            table: { type: { summary: "(productId: number) => void" } },
        },
    },
} as ComponentMeta<typeof RbaRecipesBlock>;

const Template: ComponentStory<typeof RbaRecipesBlock> = (args) => <RbaRecipesBlock {...args} />;


export const Default = Template.bind({});
Default.args = {
    favoriteRecipes: [
        { id: 1, name: "Cuscus" },
        { id: 2, name: "Muffins" },
    ],
    customRecipes: [
        { id: 1, name: "Cuscus" },
    ],
};
