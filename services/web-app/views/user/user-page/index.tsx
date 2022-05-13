import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CY_USER_MENU_ITEM } from "@cypress/constants";

import Utils, { UserMenuItem } from "@common/utils";
import RbaSingleMessagePage from "@views/shared/rba-single-message-page";
import DiaryBlock from "@views/user/components/diary-block";
import FoodsBlock from "@views/user/components/foods-block";
import RecipesBlock from "@views/user/components/recipes-block";
import type { AppState } from "@store";
import * as actions from "@store/user/actions";
import type { UserStore } from "@store/user/types";

import styles from "./user-page.module.scss";


interface Props {
    user: UserStore;
}


const UserPage: React.FC<Props> = ({ user }) => {

    const dispatch = useDispatch();

    const menuItems = [
        UserMenuItem.Diary,
        UserMenuItem.Recipes,
        UserMenuItem.Foods,
    ];

    const getMenuItemElement = (menuItem: UserMenuItem): JSX.Element => (
        <div
            data-cy={CY_USER_MENU_ITEM}
            key={menuItem}
            onClick={() => dispatch(actions.updateMenuItem(menuItem))}
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
                return (<DiaryBlock />);
            case UserMenuItem.Recipes:
                return (
                    <RecipesBlock
                        favoriteRecipes={user.favoriteRecipes}
                        customRecipes={user.customRecipes}
                    />
                );
            case UserMenuItem.Foods:
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
                {getMainBlock(user.selectedMenuItem)}
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
                    ? <RbaSingleMessagePage text={user.errorMessage} />
                    : <UserPage user={user} />
            )
            : <RbaSingleMessagePage text={"LOADING"} />
    );
};

UserPageConnected.displayName = "UserPageConnected";


export default UserPageConnected;
