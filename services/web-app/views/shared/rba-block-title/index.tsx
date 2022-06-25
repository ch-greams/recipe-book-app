import React from "react";

import styles from "./rba-block-title.module.scss";



interface Props {
    text: string;
}

const RbaBlockTitle: React.FC<Props> = ({ text }) => {
    return (
        <div className={styles.blockTitle}>
            {text}
        </div>
    );
};

RbaBlockTitle.displayName = "RbaBlockTitle";

export default RbaBlockTitle;
