import React from "react";

import { formatDate } from "@common/date";

import styles from "./rba-journal-date-block.module.scss";


interface Props {
    date: string;
}

const RbaJournalDateBlock: React.FC<Props> = ({ date }) => {
    return (
        <div className={styles.journalDateBlock}>

            <span className={styles.journalDateControl}>
                {"<"}
            </span>

            <span className={styles.journalDate}>
                {formatDate(date)}
            </span>

            <span className={styles.journalDateControl}>
                {">"}
            </span>

        </div>
    );
};

RbaJournalDateBlock.displayName = "RbaJournalDateBlock";

export default RbaJournalDateBlock;
