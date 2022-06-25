import React from "react";

import RbaBlockTitle from "@views/shared/rba-block-title";

import styles from "./rba-diary-block.module.scss";


const RbaDiaryBlock: React.FC = () => {
    return (
        <div className={styles.diaryBlock}>
            <RbaBlockTitle text={"April 7, 2022"} />
        </div>
    );
};


RbaDiaryBlock.displayName = "RbaDiaryBlock";

export default RbaDiaryBlock;
