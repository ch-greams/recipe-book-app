import React from "react";
import { CY_USER_MENU_ITEM } from "@cypress/constants";

import type { NutrientDescription, NutrientName } from "@common/nutrients";
import { classNames } from "@common/style";
import RbaFoodsBlock from "@views/user/components/rba-foods-block";
import RbaSettingsBlock from "@views/user/components/rba-settings-block";
import { useAppDispatch } from "@store";
import * as userActions from "@store/actions/user";
import type { UserStore } from "@store/types/user";
import { UserMenuItem } from "@store/types/user";

import styles from "./rba-user-page.module.scss";


interface Props {
    user: UserStore;
    nutrientDescriptions: Record<NutrientName, NutrientDescription>;
}


const RbaUserPage: React.FC<Props> = ({ user, nutrientDescriptions }) => {

    const dispatch = useAppDispatch();

    const menuItems = [
        UserMenuItem.Foods,
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
            case UserMenuItem.Foods:
                return (
                    <RbaFoodsBlock
                        favoriteFoods={user.favoriteFoods}
                        customFoods={user.customFoods}
                        deleteFavoriteFood={(foodId) => dispatch(userActions.deleteFavoriteProduct(foodId))}
                        deleteCustomFood={(foodId) => dispatch(userActions.deleteCustomProduct(foodId))}
                    />
                );
            case UserMenuItem.Settings:
                return (
                    <RbaSettingsBlock
                        journalGroups={user.journalGroups}
                        userNutrients={user.nutrients}
                        nutrientDescriptions={nutrientDescriptions}
                        updateJournalGroups={(groups) => dispatch(userActions.updateJournalGroups(groups))}
                        updateNutrient={(nutrient) => dispatch(userActions.upsertNutrient(nutrient))}
                        deleteNutrient={(nutrientId) => dispatch(userActions.deleteNutrient(nutrientId))}
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
