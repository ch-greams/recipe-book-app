import React, { Component } from "react";
import styles from "./Loader.scss";


export default class Loader extends Component {
    public static readonly displayName = "Loader";

    public render(): JSX.Element {
        return (
            <div className={styles.loaderBlock}>
                {"LOADING"}
            </div>
        );
    }
}
