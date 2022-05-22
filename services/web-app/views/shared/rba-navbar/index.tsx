import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import * as constants from "@cypress/constants";

import { COLOR_WHITE } from "@common/colors";
import RbaSearchInput, { SearchInputWidthSize } from "@views/shared/rba-search-input";
import type { AppState } from "@store";
import { searchProducts } from "@store/search/actions";
import type { SearchPageStore } from "@store/search/types";
import PersonIcon from "@icons/person-circle-sharp.svg";

import styles from "./rba-navbar.module.scss";


interface Props {
    hideSearch: boolean;
    username: string;
}

const RbaNavbar: React.FC<Props> = ({ hideSearch = false, username }) => {

    const dispatch = useDispatch();
    const searchPage = useSelector<AppState>((state) => state.searchPage) as SearchPageStore;

    const searchInput = (
        <RbaSearchInput
            width={SearchInputWidthSize.Full}
            isLoading={!searchPage.isLoaded}
            value={searchPage.searchInput}
            items={searchPage.products}
            onChange={(value) => { dispatch(searchProducts(value)); }}
        />
    );

    return (
        <div className={styles.navbar}>

            <div className={styles.navbarLogoSection}>
                <Link href={"/"}>
                    <div data-cy={constants.CY_NAVBAR_LOGO_ITEM} className={styles.navbarLogo}>
                        {"RecipeBook"}
                    </div>
                </Link>
            </div>

            <div className={styles.navbarSearchSection}>
                {( !hideSearch && searchInput )}
            </div>

            <div className={styles.navbarUserSection}>

                <Link href={"/user"}>
                    <div data-cy={constants.CY_NAVBAR_USER_ITEM} className={styles.navbarUser}>
                        <PersonIcon width={"32"} height={"32"} fill={COLOR_WHITE} stroke={COLOR_WHITE} />
                        <span className={styles.navbarUserName}>{username}</span>
                    </div>
                </Link>

            </div>

        </div>
    );
};

RbaNavbar.displayName = "RbaNavbar";

export default RbaNavbar;
