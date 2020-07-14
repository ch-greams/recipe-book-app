import React, { Component } from "react";
import styles from "./HomePage.scss";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { updateName } from "../../store/food/actions";
import { FoodItem } from "../../store/food/types";
import { UserSettings, Page } from "../../store/userSettings/types";
import { changePage } from "../../store/userSettings/actions";



interface HomePageProps {

    userSettings: UserSettings;
    changePage: typeof changePage;

    foodItem: FoodItem;
    updateName: typeof updateName;
}


class HomePage extends Component<HomePageProps> {

    constructor(props: HomePageProps) {
        super(props);

        // this.props.updateName("NEW_TEST");
    }

     render(): JSX.Element {

        const createRecipeButtonLabel = "Create Recipe".toUpperCase();
        const createFoodButtonLabel = "Create Food".toUpperCase();

        const { changePage } = this.props;

        return (
            <div className={styles.homePage}>

                <input
                    className={styles.searchInput}
                    type={"text"}
                    placeholder={"WHAT’S FOR DINNER?"}
                />

                <div className={styles.homePageButtons}>

                    <div
                        className={styles.homePageButton}
                        onClick={() => changePage(Page.Recipe)}
                    >
                            {createRecipeButtonLabel}
                    </div>

                    <div
                        className={styles.homePageButton}
                        onClick={() => changePage(Page.Food)}
                    >
                            {createFoodButtonLabel}
                    </div>

                </div>

            </div>
        );
    }
}


const mapStateToProps = (state: AppState) => ({
    userSettings: state.userSettings,
    foodItem: state.foodItem,
});

export default connect(mapStateToProps, {
    updateName,
    changePage,
})(HomePage);
