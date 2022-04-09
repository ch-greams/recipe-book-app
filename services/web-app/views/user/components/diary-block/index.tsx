import React from "react";

import BlockTitle from "@views/shared/block-title";

import styles from "./diary-block.module.scss";


const DiaryBlock: React.FC = () => {
    return (
        <div className={styles.diaryBlock}>
            <BlockTitle text={"April 7, 2022"} />
        </div>
    );
};


DiaryBlock.displayName = "DiaryBlock";

export default DiaryBlock;
