import React, { Suspense } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Store } from "redux";

import Loader from "@client/components/Loader/Loader";


export enum RoutePath {
    Home = "",
    Food = "food",
    Recipe = "recipe",
}

export interface RootProps {
    store: Store;
}


const Root: React.FC<RootProps> = ({ store }) => {

    const FoodPage = React.lazy(() => import(/* webpackChunkName: "food-page" */ "../pages/FoodPage/FoodPage"));
    const RecipePage = React.lazy(() => import(/* webpackChunkName: "recipe-page" */ "../pages/RecipePage/RecipePage"));
    const HomePage = React.lazy(() => import(/* webpackChunkName: "home-page" */ "../pages/HomePage/HomePage"));

    return (
        <Provider store={store}>
            <BrowserRouter>
                <Suspense fallback={<Loader />}>
                    <Switch>
                        <Route path={"/food/:foodId?"} component={FoodPage} />
                        <Route path={"/recipe/:recipeId?"} component={RecipePage} />
                        <Route path={"/"} component={HomePage} />
                    </Switch>
                </Suspense>
            </BrowserRouter>
        </Provider>
    );
};


Root.displayName = "Root";
export default Root;
