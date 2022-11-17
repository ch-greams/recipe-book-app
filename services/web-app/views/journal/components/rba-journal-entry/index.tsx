import React from "react";

import { formatTime } from "@common/date";
import type { JournalEntry } from "@store/types/journal";

import styles from "./rba-journal-entry.module.scss";


interface Props {
    entry: JournalEntry;
}

const RbaJournalEntry: React.FC<Props> = ({ entry }) => {

    return (
        <div className={styles.journalEntry}>

            <span>
                {formatTime(entry.entryTime)}
            </span>

            <span>
                {entry.foodName}
            </span>

            <span>
                {entry.foodAmount}
            </span>

            <span>
                {entry.foodUnit}
            </span>

        </div>
    );
};

RbaJournalEntry.displayName = "RbaJournalEntry";

export default RbaJournalEntry;
