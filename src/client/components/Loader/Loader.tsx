import React from "react";

import styles from "./Loader.scss";


const Loader: React.FC = () => {
    return (
        <div className={styles.loaderBlock}>
            {"LOADING"}
        </div>
    );
};

Loader.displayName = "Loader";

export default Loader;
