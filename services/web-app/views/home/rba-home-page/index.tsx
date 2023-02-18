import React from "react";
import Link from "next/link";

import { BUTTON_CREATE_FOOD,BUTTON_CREATE_RECIPE } from "@common/labels";
import { NEW_FOOD_PATH, NEW_RECIPE_PATH } from "@common/routes";
import RbaSearchInput, { SearchInputWidthSize } from "@views/shared/rba-search-input";
import { useAppDispatch, useAppSelector } from "@store";
import { searchFoods } from "@store/actions/search";

import styles from "./rba-home-page.module.scss";


const RbaHomePage: React.FC = () => {

    const dispatch = useAppDispatch();
    const search = useAppSelector((state) => state.search);

    return (
        <div className={styles.homePage}>

            <RbaSearchInput
                width={SearchInputWidthSize.Medium}
                isLoading={!search.isLoaded}
                value={search.searchInput}
                items={search.foods}
                onChange={(value) => { dispatch(searchFoods(value)); }}
            />

            <div className={styles.homePageButtons}>

                <Link
                    href={NEW_RECIPE_PATH}
                    legacyBehavior={true}
                >
                    <a className={styles.homePageButton}>
                        {BUTTON_CREATE_RECIPE}
                    </a>
                </Link>

                <Link
                    href={NEW_FOOD_PATH}
                    legacyBehavior={true}
                >
                    <a className={styles.homePageButton}>
                        {BUTTON_CREATE_FOOD}
                    </a>
                </Link>

            </div>

        </div>
    );
};


RbaHomePage.displayName = "RbaHomePage";
export default RbaHomePage;
