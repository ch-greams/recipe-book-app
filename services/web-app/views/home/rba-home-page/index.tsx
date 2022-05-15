import React from "react";
import Link from "next/link";

import Utils, { RoutePath } from "@common/utils";

import styles from "./rba-home-page.module.scss";


const RbaHomePage: React.FC = () => {

    const CREATE_RECIPE_BUTTON_LABEL = "Create Recipe".toUpperCase();
    const CREATE_FOOD_BUTTON_LABEL = "Create Food".toUpperCase();

    return (
        <div className={styles.homePage}>

            <input
                className={styles.searchInput}
                type={"text"}
                placeholder={"WHAT’S FOR DINNER?"}
            />

            <div className={styles.homePageButtons}>

                <Link href={Utils.getNewItemPath(RoutePath.Recipe)}>
                    <a className={styles.homePageButton}>
                        {CREATE_RECIPE_BUTTON_LABEL}
                    </a>
                </Link>

                <Link href={Utils.getNewItemPath(RoutePath.Food)}>
                    <a className={styles.homePageButton}>
                        {CREATE_FOOD_BUTTON_LABEL}
                    </a>
                </Link>

            </div>

        </div>
    );
};


RbaHomePage.displayName = "RbaHomePage";
export default RbaHomePage;
