import React from "react";

import RbaBlockTitle from "@views/shared/rba-block-title";

import styles from "./diary-block.module.scss";


const DiaryBlock: React.FC = () => {
    return (
        <div className={styles.diaryBlock}>
            <RbaBlockTitle text={"April 7, 2022"} />
        </div>
    );
};


DiaryBlock.displayName = "DiaryBlock";

export default DiaryBlock;
