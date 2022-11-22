import React from "react";
import { CY_USER_MENU_ITEM } from "@cypress/constants";

import { classNames } from "@common/style";
import { UserMenuItem } from "@common/utils";
import RbaFoodsBlock from "@views/user/components/rba-foods-block";
import RbaJournalBlock from "@views/user/components/rba-journal-block";
import RbaRecipesBlock from "@views/user/components/rba-recipes-block";
import { useAppDispatch } from "@store";
import * as actions from "@store/actions/user";
import type { UserStore } from "@store/types/user";

import styles from "./rba-user-page.module.scss";


interface Props {
    user: UserStore;
}


const RbaUserPage: React.FC<Props> = ({ user }) => {

    const dispatch = useAppDispatch();

    const menuItems = [
        UserMenuItem.Journal,
        UserMenuItem.Recipes,
        UserMenuItem.Foods,
    ];

    const getMenuItemElement = (menuItem: UserMenuItem): JSX.Element => (
        <div
            data-cy={CY_USER_MENU_ITEM}
            key={menuItem}
            onClick={() => dispatch(actions.changeMenuItem(menuItem))}
            className={classNames({
                [styles.navigationMenuItem]: true,
                [styles.selectedItem]: user.selectedMenuItem === menuItem,
            })}
        >
            {menuItem}
        </div>
    );

    const getMainBlock = (menuItem: UserMenuItem): JSX.Element => {
        switch (menuItem) {
            case UserMenuItem.Journal:
                return (<RbaJournalBlock />);
            case UserMenuItem.Recipes:
                return (
                    <RbaRecipesBlock
                        favoriteRecipes={user.favoriteRecipes}
                        customRecipes={user.customRecipes}
                        deleteFavoriteRecipe={(productId) => dispatch(actions.deleteFavoriteProduct(productId))}
                        deleteCustomRecipe={(productId) => dispatch(actions.deleteCustomProduct(productId))}
                    />
                );
            case UserMenuItem.Foods:
                return (
                    <RbaFoodsBlock
                        favoriteFoods={user.favoriteFoods}
                        customFoods={user.customFoods}
                        deleteFavoriteFood={(productId) => dispatch(actions.deleteFavoriteProduct(productId))}
                        deleteCustomFood={(productId) => dispatch(actions.deleteCustomProduct(productId))}
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
