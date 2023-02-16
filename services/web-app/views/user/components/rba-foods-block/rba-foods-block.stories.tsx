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
            table: { type: { summary: "(foodId: number) => void" } },
        },
        deleteCustomFood: {
            table: { type: { summary: "(foodId: number) => void" } },
        },
    },
} as ComponentMeta<typeof RbaFoodsBlock>;

const Template: ComponentStory<typeof RbaFoodsBlock> = (args) => <RbaFoodsBlock {...args} />;


export const Default = Template.bind({});
Default.args = {
    favoriteFoods: [
        {
            id: 1,
            name: "Cucumber",
            brand: "",
            is_recipe: false,
        },
        {
            id: 2,
            name: "Milk",
            brand: "",
            is_recipe: false,
        },
        {
            id: 3,
            name: "Cottage Cheese",
            brand: "",
            is_recipe: true,
        },
    ],
    customFoods: [
        {
            id: 1,
            name: "Cucumber",
            brand: "",
            is_recipe: false,
        },
        {
            id: 4,
            name: "Sour Cream",
            brand: "",
            is_recipe: false,
        },
    ],
};
