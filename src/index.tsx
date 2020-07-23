import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import configureStore from "./store";
import Router from "./components/Router";


const store = configureStore();

ReactDOM.render((
    <Provider store={store}>
        <Router />
    </Provider>
), document.getElementById("content"));
