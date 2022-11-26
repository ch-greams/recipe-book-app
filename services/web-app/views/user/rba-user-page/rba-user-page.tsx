import React from "react";
import { CY_USER_MENU_ITEM } from "@cypress/constants";

import type { NutrientDescription, NutrientName } from "@common/nutrients";
import { classNames } from "@common/style";
import { UserMenuItem } from "@common/utils";
import RbaFoodsBlock from "@views/user/components/rba-foods-block";
import RbaRecipesBlock from "@views/user/components/rba-recipes-block";
import RbaSettingsBlock from "@views/user/components/rba-settings-block";
import { useAppDispatch } from "@store";
import * as journalActions from "@store/actions/journal";
import * as userActions from "@store/actions/user";
import type { JournalStoreGroup } from "@store/types/journal";
import type { UserStore } from "@store/types/user";

import styles from "./rba-user-page.module.scss";


interface Props {
    user: UserStore;
    journalGroups: JournalStoreGroup[];
    nutrientDescriptions: Record<NutrientName, NutrientDescription>;
}


const RbaUserPage: React.FC<Props> = ({ user, journalGroups, nutrientDescriptions }) => {

    const dispatch = useAppDispatch();

    const menuItems = [
        UserMenuItem.Foods,
        UserMenuItem.Recipes,
        UserMenuItem.Settings,
    ];

    const getMenuItemElement = (menuItem: UserMenuItem): JSX.Element => (
        <div
            data-cy={CY_USER_MENU_ITEM}
            key={menuItem}
            onClick={() => dispatch(userActions.changeMenuItem(menuItem))}
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
            case UserMenuItem.Recipes:
                return (
                    <RbaRecipesBlock
                        favoriteRecipes={user.favoriteRecipes}
                        customRecipes={user.customRecipes}
                        deleteFavoriteRecipe={(productId) => dispatch(userActions.deleteFavoriteProduct(productId))}
                        deleteCustomRecipe={(productId) => dispatch(userActions.deleteCustomProduct(productId))}
                    />
                );
            case UserMenuItem.Foods:
                return (
                    <RbaFoodsBlock
                        favoriteFoods={user.favoriteFoods}
                        customFoods={user.customFoods}
                        deleteFavoriteFood={(productId) => dispatch(userActions.deleteFavoriteProduct(productId))}
                        deleteCustomFood={(productId) => dispatch(userActions.deleteCustomProduct(productId))}
                    />
                );
            case UserMenuItem.Settings:
                return (
                    <RbaSettingsBlock
                        journalGroups={journalGroups}
                        userNutrients={user.nutrients}
                        nutrientDescriptions={nutrientDescriptions}
                        updateJournalGroups={(groups) => dispatch(journalActions.updateJournalGroups(groups))}
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
