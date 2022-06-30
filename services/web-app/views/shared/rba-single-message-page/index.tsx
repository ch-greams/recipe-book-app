import React from "react";

import { isSome } from "@common/types";

import styles from "./rba-single-message-page.module.scss";


interface Props {
    text?: string;
}

const RbaSingleMessagePage: React.FC<Props> = ({ text, children }) => {
    return (
        <div className={styles.messageBlock}>
            {isSome(text) ? text : children}
        </div>
    );
};

RbaSingleMessagePage.displayName = "RbaSingleMessagePage";

export default RbaSingleMessagePage;
