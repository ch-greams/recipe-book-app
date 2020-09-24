import React from "react";
import { RouteComponentProps } from "react-router-dom";
import FoodPage from "../pages/FoodPage/FoodPage";
import HomePage from "../pages/HomePage/HomePage";
import RecipePage from "../pages/RecipePage/RecipePage";



export enum Route {
    Home = "",
    Food = "food",
    Recipe = "recipe",
}

interface RouterParams {
    route: Route;
    id: string;
}

type RouterProps = RouteComponentProps<RouterParams>;

   
const Router: React.FunctionComponent<RouterProps> = (props: RouterProps): React.ReactElement => {

    const { match: { params: { route, id } } } = props;

    switch (route) {
        case Route.Food:
            return <FoodPage foodId={id} />;

        case Route.Recipe:
            return <RecipePage />;

        case Route.Home:
        default:
            return <HomePage />;
    }
};

export default Router;
