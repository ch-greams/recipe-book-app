import React from "react";
import { Provider } from "react-redux";
import type { AppProps } from "next/app";

import RbaLayout from "@views/shared/rba-layout";
import { useStore } from "@store";

import "@styles/globals.scss";

import "@common/extensions";


const App: React.FC<AppProps> = ({ Component, pageProps }) => {

    const store = useStore(pageProps.initialReduxState);

    return (
        <Provider store={store}>
            <RbaLayout>
                <Component {...pageProps} />
            </RbaLayout>
        </Provider>
    );
};

App.displayName = "App";

export default App;
