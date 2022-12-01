/* eslint-disable react/display-name */
import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import RbaFoodsBlock from ".";


export default {
    title: "User/RbaFoodsBlock",
    component: RbaFoodsBlock,
    argTypes: {
        favoriteFoods: {
            table: { type: { summary: "FoodItem[]" } },
        },
        customFoods: {
            table: { type: { summary: "FoodItem[]" } },
        },
        deleteFavoriteFood: {
            table: { type: { summary: "(productId: number) => void" } },
        },
        deleteCustomFood: {
            table: { type: { summary: "(productId: number) => void" } },
        },
    },
} as ComponentMeta<typeof RbaFoodsBlock>;

const Template: ComponentStory<typeof RbaFoodsBlock> = (args) => <RbaFoodsBlock {...args} />;


export const Default = Template.bind({});
Default.args = {
    favoriteFoods: [
        { id: 1, name: "Cucumber" },
        { id: 2, name: "Milk" },
        { id: 3, name: "Cottage Cheese" },
    ],
    customFoods: [
        { id: 1, name: "Cucumber" },
        { id: 4, name: "Sour Cream" },
    ],
};
