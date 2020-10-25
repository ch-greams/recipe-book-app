import React, { Suspense } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Store } from "redux";
import Loader from "./Loader/Loader";


export enum RoutePath {
    Home = "",
    Food = "food",
    Recipe = "recipe",
}

export interface RootProps {
    store: Store;
}


export default class Root extends React.Component<RootProps> {
    public static readonly displayName = "Root";

    public render(): JSX.Element {

        const FoodPage = React.lazy(() => import(/* webpackChunkName: "food-page" */ "../pages/FoodPage/FoodPage"));
        const RecipePage = React.lazy(() => import(/* webpackChunkName: "recipe-page" */ "../pages/RecipePage/RecipePage"));
        const HomePage = React.lazy(() => import(/* webpackChunkName: "home-page" */ "../pages/HomePage/HomePage"));

        return (
            <Provider store={this.props.store}>
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
    }
}
