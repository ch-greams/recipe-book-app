import React from "react";
// import { RoutePath } from "@client/components/Root";
import Link from "next/link";

import styles from "./home-page.module.scss";


const HomePage: React.FC = () => {

    const createRecipeButtonLabel = "Create Recipe".toUpperCase();
    const createFoodButtonLabel = "Create Food".toUpperCase();

    return (
        <div className={styles.homePage}>

            <input
                className={styles.searchInput}
                type={"text"}
                placeholder={"WHAT’S FOR DINNER?"}
            />

            <div className={styles.homePageButtons}>

                {/* RoutePath.Recipe */}
                <Link href={"/recipe"}>
                    <a className={styles.homePageButton}>
                        {createRecipeButtonLabel}
                    </a>
                </Link>

                {/* RoutePath.Food */}
                <Link href={"/food"}>
                    <a className={styles.homePageButton}>
                        {createFoodButtonLabel}
                    </a>
                </Link>

            </div>

        </div>
    );
};


HomePage.displayName = "HomePage";
export default HomePage;
