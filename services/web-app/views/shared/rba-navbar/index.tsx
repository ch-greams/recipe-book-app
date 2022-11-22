import React from "react";
import Link from "next/link";
import * as constants from "@cypress/constants";

import { Color } from "@common/style";
import RbaSearchInput, { SearchInputWidthSize } from "@views/shared/rba-search-input";
import { searchProducts } from "@store/actions/search";
import { useAppDispatch, useAppSelector } from "@store/index";
import { IconSize } from "@icons/icon-params";
import RbaIconPerson from "@icons/rba-icon-person";

import styles from "./rba-navbar.module.scss";


interface Props {
    hideSearch: boolean;
    username: string;
}

const RbaNavbar: React.FC<Props> = ({ hideSearch = false, username }) => {

    const dispatch = useAppDispatch();
    const searchPage = useAppSelector((state) => state.search);

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
                        <RbaIconPerson size={IconSize.ExtraLarge} color={Color.White} />
                        <span className={styles.navbarUserName}>{username}</span>
                    </div>
                </Link>

            </div>

        </div>
    );
};

RbaNavbar.displayName = "RbaNavbar";

export default RbaNavbar;
