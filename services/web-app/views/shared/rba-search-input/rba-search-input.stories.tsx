/* eslint-disable react/display-name */
import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import type { ProductShort } from "@common/typings";
import Utils, { ProductType } from "@common/utils";

import RbaSearchInput, { SearchInputHeightSize, SearchInputWidthSize } from ".";


export default {
    title: "Shared/RbaSearchInput",
    component: RbaSearchInput,
    argTypes: {
        value: {
            type: { name: "string", required: true },
            table: { type: { summary: "string" } },
        },
        isLoading: {
            type: { name: "boolean", required: true },
            table: { type: { summary: "boolean" } },
        },
        placeholder: {
            type: { name: "string", required: false },
            table: { type: { summary: "string" } },
        },
        width: {
            type: { name: "enum", value: Utils.getObjectValues(SearchInputWidthSize), required: true },
            table: { type: { summary: "SearchInputWidthSize" } },
            control: { type: "select", options: SearchInputWidthSize },
        },
        height: {
            type: { name: "enum", value: Utils.getObjectValues(SearchInputHeightSize), required: false },
            table: { type: { summary: "SearchInputHeightSize" } },
            control: { type: "select", options: SearchInputHeightSize },
        },
        items: {
            table: { type: { summary: "ProductShort[]" } },
        },
    },
} as ComponentMeta<typeof RbaSearchInput>;

const Template: ComponentStory<typeof RbaSearchInput> = (args) => <RbaSearchInput {...args} />;


export const Default = Template.bind({});
Default.args = {
    value: "",
    isLoading: false,
    width: SearchInputWidthSize.Medium,
    items: [],
};

export const Loading = Template.bind({});
Loading.args = {
    value: "M",
    isLoading: true,
    width: SearchInputWidthSize.Medium,
    items: [],
};


const products: ProductShort[] = [
    {
        id: 1,
        product_type: ProductType.Food,
        name: "Milk",
        brand: "",
        subtitle: "",
    },
    {
        id: 2,
        product_type: ProductType.Recipe,
        name: "Meatloaf",
        brand: "",
        subtitle: "",
    },
];

export const WithResults = Template.bind({});
WithResults.args = {
    value: "M",
    isLoading: false,
    width: SearchInputWidthSize.Medium,
    items: products,
};
