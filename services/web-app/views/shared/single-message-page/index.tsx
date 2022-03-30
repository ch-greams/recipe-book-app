import React from "react";

import styles from "./single-message-page.module.scss";


interface Props {
    text: string;
}

const SingleMessagePage: React.FC<Props> = ({ text }) => {
    return (
        <div className={styles.messageBlock}>
            {text}
        </div>
    );
};

SingleMessagePage.displayName = "SingleMessagePage";

export default SingleMessagePage;
