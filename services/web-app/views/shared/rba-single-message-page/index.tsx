import React from "react";

import styles from "./rba-single-message-page.module.scss";


interface Props {
    text: string;
}

const RbaSingleMessagePage: React.FC<Props> = ({ text }) => {
    return (
        <div className={styles.messageBlock}>
            {text}
        </div>
    );
};

RbaSingleMessagePage.displayName = "RbaSingleMessagePage";

export default RbaSingleMessagePage;
