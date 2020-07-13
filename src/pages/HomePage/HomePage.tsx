import React, { Component } from "react";
import styles from "./HomePage.scss";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { updateName } from "../../store/food/actions";
import { FoodItem } from "src/store/food/types";



interface HomePageProps {
    updateName: typeof updateName;

    foodItem: FoodItem;
}


class HomePage extends Component<HomePageProps> {

    constructor(props: HomePageProps) {
        super(props);

        this.props.updateName("NEW_TEST");

        // this.state = {};
    }

     render(): JSX.Element {

        return (
            <div className={styles.homePage}>
                Home Page {this.props.foodItem.name}
            </div>
        );
    }
}


const mapStateToProps = (state: AppState) => ({
    foodItem: state.foodItem,
});

export default connect(mapStateToProps, {
    updateName,
})(HomePage);
