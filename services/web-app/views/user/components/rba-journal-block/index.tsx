import React from "react";

import RbaBlockTitle from "@views/shared/rba-block-title";

import styles from "./rba-journal-block.module.scss";


const RbaJournalBlock: React.FC = () => {
    return (
        <div className={styles.journalBlock}>
            <RbaBlockTitle text={"April 7, 2022"} />
        </div>
    );
};


RbaJournalBlock.displayName = "RbaJournalBlock";

export default RbaJournalBlock;
