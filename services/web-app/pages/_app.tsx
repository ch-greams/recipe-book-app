import React from "react";
import { Provider } from "react-redux";
import type { AppProps } from "next/app";

import RbaLayout from "@views/shared/rba-layout";
import { store } from "@store";

import "@styles/globals.scss";

import "@common/extensions";


const App: React.FC<AppProps> = (props) => {
    return (
        <Provider store={store}>
            <RbaLayout page={props} />
        </Provider>
    );
};

App.displayName = "App";

export default App;
