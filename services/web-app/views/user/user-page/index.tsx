import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Utils from "@common/utils";
import SingleMessagePage from "@views/shared/single-message-page";
import DiaryBlock from "@views/user/components/diary-block";
import FoodsBlock from "@views/user/components/foods-block";
import RecipesBlock from "@views/user/components/recipes-block";
import type { AppState } from "@store";
import * as actions from "@store/user/actions";
import type { UserStore } from "@store/user/types";

import styles from "./user-page.module.scss";


export enum MenuItem {
    Diary = "Diary",
    Recipes = "Recipes",
    Foods = "Foods",
}


interface Props {
    user: UserStore;
}


const UserPage: React.FC<Props> = ({ user }) => {

    const [ selectedMenuItem, selectMenuItem ] = useState(MenuItem.Diary);

    const menuItems = [
        MenuItem.Diary,
        MenuItem.Recipes,
        MenuItem.Foods,
    ];

    const getMenuItemElement = (menuItem: MenuItem): JSX.Element => (
        <div
            key={menuItem}
            onClick={() => selectMenuItem(menuItem)}
            className={Utils.classNames({
                [styles.navigationMenuItem]: true,
                [styles.selectedItem]: selectedMenuItem === menuItem,
            })}
        >
            {menuItem}
        </div>
    );

    const getMainBlock = (menuItem: MenuItem): JSX.Element => {
        switch (menuItem) {
            case MenuItem.Diary:
                return (<DiaryBlock />);
            case MenuItem.Recipes:
                return (
                    <RecipesBlock
                        favoriteRecipes={user.favoriteRecipes}
                        customRecipes={user.customRecipes}
                    />
                );
            case MenuItem.Foods:
                return (
                    <FoodsBlock
                        favoriteFoods={user.favoriteFoods}
                        customFoods={user.customFoods}
                    />
                );
        }
    };

    return (
        <div className={styles.homePage}>

            <div className={styles.navigationMenu}>
                {menuItems.map(getMenuItemElement)}
            </div>

            <div className={styles.mainBlock}>
                {getMainBlock(selectedMenuItem)}
            </div>
        </div>
    );
};


UserPage.displayName = "UserPage";


const UserPageConnected: React.FC = () => {

    const dispatch = useDispatch();

    const user = useSelector<AppState>((state) => state.user) as UserStore;

    useEffect(() => {
        dispatch(actions.requestFoods());
        dispatch(actions.requestRecipes());
    }, [ dispatch ]);

    return (
        user.isLoaded
            ? (
                user.errorMessage
                    ? <SingleMessagePage text={user.errorMessage} />
                    : <UserPage user={user} />
            )
            : <SingleMessagePage text={"LOADING"} />
    );
};

UserPageConnected.displayName = "UserPageConnected";


export default UserPageConnected;
