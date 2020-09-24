import React from "react";
import ReactDOM from "react-dom";
import configureStore from "./store";
import Root from "./components/Root";


const store = configureStore();

ReactDOM.render(<Root store={store} />, document.getElementById("content"));
