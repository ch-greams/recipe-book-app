import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import HomePage from "./pages/HomePage/HomePage";
import configureStore from "./store";


const store = configureStore();

ReactDOM.render((
    <Provider store={store}>
        <HomePage />
    </Provider>
), document.getElementById("content"));
