import React, { Component } from "react";
import { connect } from "react-redux";
import { AppState } from "../store";
import { UserSettings } from "../store/userSettings/types";
import HomePage from "../pages/HomePage/HomePage";
import FoodPage from "../pages/FoodPage/FoodPage";
import RecipePage from "../pages/RecipePage/RecipePage";



export enum Page {
    Home = "HomePage",
    Food = "FoodPage",
    Recipe = "RecipePage",
}


interface RouterProps {
    userSettings: UserSettings;
}


class Router extends Component<RouterProps> {

    public render(): JSX.Element {

        switch (this.props.userSettings.page) {

            case Page.Food:
                return <FoodPage />;

            case Page.Recipe:
                return <RecipePage />;

            case Page.Home:
            default:
                return <HomePage />;
        }
    }
}


const mapStateToProps = (state: AppState): RouterProps => ({
    userSettings: state.userSettings,
});

export default connect(mapStateToProps, {})(Router);
