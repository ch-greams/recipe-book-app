import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

import Utils, { ProductType } from "@common/utils";
import RbaSearchInput, { SearchInputWidthSize } from "@views/shared/rba-search-input";
import type { AppState } from "@store";
import { searchProducts } from "@store/search/actions";
import type { SearchPageStore } from "@store/search/types";

import styles from "./rba-home-page.module.scss";


const RbaHomePage: React.FC = () => {

    const CREATE_RECIPE_BUTTON_LABEL = "Create Recipe".toUpperCase();
    const CREATE_FOOD_BUTTON_LABEL = "Create Food".toUpperCase();

    const dispatch = useDispatch();
    const searchPage = useSelector<AppState>((state) => state.searchPage) as SearchPageStore;

    return (
        <div className={styles.homePage}>

            <RbaSearchInput
                width={SearchInputWidthSize.Medium}
                isLoading={!searchPage.isLoaded}
                value={searchPage.searchInput}
                items={searchPage.products}
                onChange={(value) => { dispatch(searchProducts(value)); }}
            />

            <div className={styles.homePageButtons}>

                <Link href={Utils.getNewProductPath(ProductType.Recipe)}>
                    <a className={styles.homePageButton}>
                        {CREATE_RECIPE_BUTTON_LABEL}
                    </a>
                </Link>

                <Link href={Utils.getNewProductPath(ProductType.Food)}>
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
