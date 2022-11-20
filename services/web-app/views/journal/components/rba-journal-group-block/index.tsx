import React from "react";
import { useDroppable } from "@dnd-kit/core";

import { classNames } from "@common/style";
import RbaButton, { ButtonHeightSize, ButtonTheme, ButtonWidthSize } from "@views/shared/rba-button";
import type { JournalEntry } from "@store/types/journal";

import RbaJournalEntry from "../rba-journal-entry";

import styles from "./rba-journal-group-block.module.scss";


interface Props {
    groupName: string;
    groupOrderNumber?: Option<number>;
    entries: JournalEntry[];
}

const RbaJournalGroupBlock: React.FC<Props> = ({ groupOrderNumber, groupName, entries }) => {

    const { isOver, setNodeRef } = useDroppable({
        id: `journal_group-${groupOrderNumber}`,
        data: { groupOrderNumber },
    });

    return (
        <div className={styles.journalGroupBlock}>

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

                <div className={styles.journalGroupButton}>
                    <RbaButton
                        label={"Add Food"}
                        width={ButtonWidthSize.Full}
                        height={ButtonHeightSize.Full}
                        theme={ButtonTheme.PrimarySmall}
                        onClick={() => console.log("Add Food to", groupName)}
                    />
                </div>

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

RbaJournalGroupBlock.displayName = "RbaJournalGroupBlock";

export default RbaJournalGroupBlock;
