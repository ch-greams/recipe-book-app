import React from "react";
import Link from "next/link";

import Utils from "@common/utils";
import SearchInput from "@views/shared/search-input";
import PersonIcon from "@icons/person-circle-outline.svg";

import styles from "./navbar.module.scss";


const Navbar: React.FC = () => {
    return (
        <div className={styles.navbar}>

            <div className={styles.navbarLabel}>

                <Link href={"/"}>
                    {"RecipeBook"}
                </Link>

            </div>

            <div className={styles.navbarSearch}>
                <SearchInput />
            </div>

            <div className={styles.navbarUser}>

                <Link href={"/user"}>

                    <div style={{ display: "flex", alignItems: "center" }}>
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
