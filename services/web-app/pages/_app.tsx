import React from "react";
import { Provider } from "react-redux";
import type { AppProps } from "next/app";
import { useStore } from "@store";

import "../styles/globals.scss";


const App: React.FC<AppProps> = ({ Component, pageProps }) => {

    const store = useStore(pageProps.initialReduxState);

    return (
        <Provider store={store}>
            <Component {...pageProps} />
        </Provider>
    );
};

App.displayName = "App";

export default App;
