import React, { Component } from "react";
import styles from "./HomePage.scss";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { updateName } from "../../store/food/actions";
import { FoodPageStore } from "../../store/food/types";
import { Link } from "react-router-dom";
import { Route } from "../../components/Router";



interface HomePageStateToProps {
    foodItem: FoodPageStore;
}

interface HomePageDispatchToProps {
    updateName: typeof updateName;
}

interface HomePageProps extends HomePageStateToProps, HomePageDispatchToProps { }


class HomePage extends Component<HomePageProps> {
    public static readonly displayName = "HomePage";

    public render(): JSX.Element {

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

                    <Link to={Route.Recipe} className={styles.homePageButton}>
                        {createRecipeButtonLabel}
                    </Link>

                    <Link to={Route.Food} className={styles.homePageButton}>
                        {createFoodButtonLabel}
                    </Link>

                </div>

            </div>
        );
    }
}


const mapStateToProps = (state: AppState): HomePageStateToProps => ({
    foodItem: state.foodPage,
});

const mapDispatchToProps: HomePageDispatchToProps = {
    updateName,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
