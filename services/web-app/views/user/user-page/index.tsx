import React, { useState } from "react";

import Utils from "@common/utils";
import DiaryBlock from "@views/user/components/diary-block";
import FoodsBlock from "@views/user/components/foods-block";
import RecipesBlock from "@views/user/components/recipes-block";

import styles from "./user-page.module.scss";


export enum MenuItem {
    Diary = "Diary",
    Recipes = "Recipes",
    Foods = "Foods",
}


const UserPage: React.FC = () => {

    const [ selectedMenuItem, selectMenuItem ] = useState(MenuItem.Diary);

    const menuItems = [
        MenuItem.Diary,
        MenuItem.Recipes,
        MenuItem.Foods,
    ];

    const foods = [
        { id: 1, name: "Heinz - Sweet & Sour Sauce" },
        { id: 2, name: "McCain - Potatoes" },
        { id: 3, name: "Bonduelle - Green Peas" },
        { id: 4, name: "Barilla - Capellini n.1" },
    ];

    const recipes = [
        { id: 1, name: "Hawaiian Pizza" },
        { id: 2, name: "Chocolate Kugelhopf" },
        { id: 3, name: "Cottage Cheese Dip" },
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
                return (<RecipesBlock recipes={recipes} />);
            case MenuItem.Foods:
                return (<FoodsBlock foods={foods} />);
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
export default UserPage;
