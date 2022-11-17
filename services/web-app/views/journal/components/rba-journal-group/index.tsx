import React from "react";

import type { JournalEntry } from "@store/types/journal";

import RbaJournalEntry from "../rba-journal-entry";

import styles from "./rba-journal-group.module.scss";


interface Props {
    name: string;
    entries: JournalEntry[];
}

const RbaJournalGroup: React.FC<Props> = ({ name, entries }) => {
    return (
        <div>

            <div className={styles.journalGroup}>
                {name.toUpperCase()}
            </div>

            {entries.map((entry) => (
                <RbaJournalEntry
                    key={entry.entryTime}
                    entry={entry}
                />
            ))}

        </div>
    );
};

RbaJournalGroup.displayName = "RbaJournalGroup";

export default RbaJournalGroup;
