import React from "react";
import ReactDOM from "react-dom";

import Root from "@client/components/Root";
import configureStore from "@client/store";

import "@common/extensions";

const store = configureStore();

ReactDOM.render(<Root store={store} />, document.getElementById("content"));
