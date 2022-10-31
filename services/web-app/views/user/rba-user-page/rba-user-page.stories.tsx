/* eslint-disable react/display-name */
import React from "react";
import { Provider } from "react-redux";
import type { ComponentMeta, ComponentStory } from "@storybook/react";

import { UserMenuItem } from "@common/utils";
import { store } from "@store";

import RbaUserPage from "./rba-user-page";


export default {
    title: "User/RbaUserPage",
    component: RbaUserPage,
    decorators : [
        (Story) => (
            <Provider store={store}>
                {Story()}
            </Provider>
        ),
    ],
} as ComponentMeta<typeof RbaUserPage>;

const Template: ComponentStory<typeof RbaUserPage> = (args) => <RbaUserPage {...args} />;


const user = store.getState().user;

export const Diary = Template.bind({});
Diary.args = { user };

export const Foods = Template.bind({});
Foods.args = {
    user: { ...user, selectedMenuItem: UserMenuItem.Foods },
};

export const Recipes = Template.bind({});
Recipes.args = {
    user: { ...user, selectedMenuItem: UserMenuItem.Recipes },
};
