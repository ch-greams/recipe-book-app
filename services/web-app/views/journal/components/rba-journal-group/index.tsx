import React from "react";
import { useDroppable } from "@dnd-kit/core";

import { classNames } from "@common/style";
import type { JournalEntry } from "@store/types/journal";

import RbaJournalEntry from "../rba-journal-entry";

import styles from "./rba-journal-group.module.scss";


interface Props {
    groupName: string;
    groupOrderNumber?: Option<number>;
    entries: JournalEntry[];
}

const RbaJournalGroup: React.FC<Props> = ({ groupOrderNumber, groupName, entries }) => {

    const { isOver, setNodeRef } = useDroppable({
        id: `journal_group-${groupOrderNumber}`,
        data: { groupOrderNumber },
    });

    return (
        <div className={styles.journalGroup}>

            <div
                className={classNames({
                    [styles.journalGroupName]: true,
                    [styles.journalEntryOver]: isOver,
                })}
                ref={setNodeRef}
            >
                {groupName.toUpperCase()}
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
