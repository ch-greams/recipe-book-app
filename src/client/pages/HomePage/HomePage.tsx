import React from "react";
import { Link } from "react-router-dom";

import { RoutePath } from "@client/components/Root";

import styles from "./HomePage.scss";


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

                <Link to={RoutePath.Recipe} className={styles.homePageButton}>
                    {createRecipeButtonLabel}
                </Link>

                <Link to={RoutePath.Food} className={styles.homePageButton}>
                    {createFoodButtonLabel}
                </Link>

            </div>

        </div>
    );
}; 


HomePage.displayName = "HomePage";
export default HomePage;
