import React from "react";
import { CY_USER_MENU_ITEM } from "@cypress/constants";

import Utils, { UserMenuItem } from "@common/utils";
import RbaDiaryBlock from "@views/user/components/rba-diary-block";
import RbaFoodsBlock from "@views/user/components/rba-foods-block";
import RbaRecipesBlock from "@views/user/components/rba-recipes-block";
import { useAppDispatch } from "@store";
import * as actions from "@store/user/actions";
import type { UserStore } from "@store/user/types";

import styles from "./rba-user-page.module.scss";


interface Props {
    user: UserStore;
}


const RbaUserPage: React.FC<Props> = ({ user }) => {

    const dispatch = useAppDispatch();

    const menuItems = [
        UserMenuItem.Diary,
        UserMenuItem.Recipes,
        UserMenuItem.Foods,
    ];

    const getMenuItemElement = (menuItem: UserMenuItem): JSX.Element => (
        <div
            data-cy={CY_USER_MENU_ITEM}
            key={menuItem}
            onClick={() => dispatch(actions.changeMenuItem(menuItem))}
            className={Utils.classNames({
                [styles.navigationMenuItem]: true,
                [styles.selectedItem]: user.selectedMenuItem === menuItem,
            })}
        >
            {menuItem}
        </div>
    );

    const getMainBlock = (menuItem: UserMenuItem): JSX.Element => {
        switch (menuItem) {
            case UserMenuItem.Diary:
                return (<RbaDiaryBlock />);
            case UserMenuItem.Recipes:
                return (
                    <RbaRecipesBlock
                        favoriteRecipes={user.favoriteRecipes}
                        customRecipes={user.customRecipes}
                    />
                );
            case UserMenuItem.Foods:
                return (
                    <RbaFoodsBlock
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
                {getMainBlock(user.selectedMenuItem)}
            </div>
        </div>
    );
};


RbaUserPage.displayName = "RbaUserPage";

export default RbaUserPage;
