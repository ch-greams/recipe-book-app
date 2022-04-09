import React from "react";
import Link from "next/link";
import * as constants from "cypress/constants";

import Utils from "@common/utils";
import SearchInput from "@views/shared/search-input";
import PersonIcon from "@icons/person-circle-sharp.svg";

import styles from "./navbar.module.scss";


const Navbar: React.FC = () => {
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
                <SearchInput />
            </div>

            <div className={styles.navbarUserSection}>

                <Link href={"/user"}>
                    <div data-cy={constants.CY_NAVBAR_USER_ITEM} className={styles.navbarUser}>
                        <PersonIcon width={"32"} height={"32"} fill={Utils.COLOR_WHITE} stroke={Utils.COLOR_WHITE} />
                        <span className={styles.navbarUserName}>{"Andrei Khvalko"}</span>
                    </div>
                </Link>

            </div>

        </div>
    );
};

Navbar.displayName = "Navbar";

export default Navbar;
