import React from "react";
import Link from "next/link";

import Utils, { ProductType } from "@common/utils";
import RbaSearchInput, { SearchInputWidthSize } from "@views/shared/rba-search-input";
import { useAppDispatch, useAppSelector } from "@store";
import { searchProducts } from "@store/actions/search";

import styles from "./rba-home-page.module.scss";


const RbaHomePage: React.FC = () => {

    const CREATE_RECIPE_BUTTON_LABEL = "Create Recipe";
    const CREATE_FOOD_BUTTON_LABEL = "Create Food";

    const dispatch = useAppDispatch();
    const search = useAppSelector((state) => state.search);

    return (
        <div className={styles.homePage}>

            <RbaSearchInput
                width={SearchInputWidthSize.Medium}
                isLoading={!search.isLoaded}
                value={search.searchInput}
                items={search.products}
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
