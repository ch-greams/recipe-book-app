import React from "react";
import Link from "next/link";
import * as constants from "@cypress/constants";

import Utils from "@common/utils";
import RbaSearchInput, { SearchInputWidthSize } from "@views/shared/rba-search-input";
import PersonIcon from "@icons/person-circle-sharp.svg";

import styles from "./rba-navbar.module.scss";


interface Props {
    username: string;
}

const RbaNavbar: React.FC<Props> = ({ username }) => {
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
                <RbaSearchInput width={SearchInputWidthSize.Full} />
            </div>

            <div className={styles.navbarUserSection}>

                <Link href={"/user"}>
                    <div data-cy={constants.CY_NAVBAR_USER_ITEM} className={styles.navbarUser}>
                        <PersonIcon width={"32"} height={"32"} fill={Utils.COLOR_WHITE} stroke={Utils.COLOR_WHITE} />
                        <span className={styles.navbarUserName}>{username}</span>
                    </div>
                </Link>

            </div>

        </div>
    );
};

RbaNavbar.displayName = "RbaNavbar";

export default RbaNavbar;
