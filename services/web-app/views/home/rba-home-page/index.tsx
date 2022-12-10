import React from "react";
import Link from "next/link";

import { BUTTON_CREATE_FOOD,BUTTON_CREATE_RECIPE } from "@common/labels";
import Utils, { ProductType } from "@common/utils";
import RbaSearchInput, { SearchInputWidthSize } from "@views/shared/rba-search-input";
import { useAppDispatch, useAppSelector } from "@store";
import { searchProducts } from "@store/actions/search";

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
                items={search.products}
                onChange={(value) => { dispatch(searchProducts(value)); }}
            />

            <div className={styles.homePageButtons}>

                <Link
                    href={Utils.getNewProductPath(ProductType.Recipe)}
                    legacyBehavior={true}
                >
                    <a className={styles.homePageButton}>
                        {BUTTON_CREATE_RECIPE}
                    </a>
                </Link>

                <Link
                    href={Utils.getNewProductPath(ProductType.Food)}
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
