import React, { Component } from "react";
import styles from "./HomePage.scss";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { updateName } from "../../store/food/actions";
import { FoodItem } from "../../store/food/types";
import { UserSettings } from "../../store/userSettings/types";
import { changePage } from "../../store/userSettings/actions";
import { Page } from "../../components/Router";



interface HomePageStateToProps {
    userSettings: UserSettings;
    foodItem: FoodItem;
}

interface HomePageDispatchToProps {
    changePage: typeof changePage;
    updateName: typeof updateName;
}

interface HomePageProps extends HomePageStateToProps, HomePageDispatchToProps { }


class HomePage extends Component<HomePageProps> {

    public constructor(props: HomePageProps) {
        super(props);

        // this.props.updateName("NEW_TEST");
    }

    public render(): JSX.Element {

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


const mapStateToProps = (state: AppState): HomePageStateToProps => ({
    userSettings: state.userSettings,
    foodItem: state.foodItem,
});

const mapDispatchToProps: HomePageDispatchToProps = {
    updateName,
    changePage,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
