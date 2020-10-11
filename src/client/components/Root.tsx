import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route } from "react-router-dom";
import { Store } from "redux";
import Router from "./Router";


export interface RootProps {
    store: Store;
}


export default class Root extends React.Component<RootProps> {
    public static readonly displayName = "Root";

    public render(): JSX.Element {

        return (
            <Provider store={this.props.store}>
                <BrowserRouter>
                    <Route path="/:route?/:id?" component={Router} />
                </BrowserRouter>
            </Provider>
        );
    }
}
