import React, { FunctionComponent } from "react";

import styles from "./Loader.scss";


const Loader: FunctionComponent = () => {
    return (
        <div className={styles.loaderBlock}>
            {"LOADING"}
        </div>
    );
};

Loader.displayName = "Loader";

export default Loader;
