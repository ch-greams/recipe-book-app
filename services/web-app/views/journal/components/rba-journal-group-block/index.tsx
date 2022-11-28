import React from "react";
import * as constants from "@cypress/constants";
import { useDroppable } from "@dnd-kit/core";

import { classNames } from "@common/style";
import RbaButton, { ButtonHeightSize, ButtonTheme, ButtonWidthSize } from "@views/shared/rba-button";
import type { JournalStoreEntry } from "@store/types/journal";

import RbaJournalEntry from "../rba-journal-entry";

import styles from "./rba-journal-group-block.module.scss";


interface Props {
    groupName: string;
    groupIndex?: Option<number>;
    entries: JournalStoreEntry[];
}

const RbaJournalGroupBlock: React.FC<Props> = ({ groupIndex, groupName, entries }) => {

    const { isOver, setNodeRef } = useDroppable({
        id: `journal_group-${groupIndex}`,
        data: { groupIndex },
    });

    return (
        <div className={styles.journalGroupBlock} data-cy={constants.CY_JOURNAL_GROUP}>

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
                        label={"..."}
                        width={ButtonWidthSize.Full}
                        height={ButtonHeightSize.Full}
                        theme={ButtonTheme.PrimarySmall}
                        onClick={() => alert(`TODO: Open settings for ${groupName} group`)}
                    />
                </div>

            </div>

            {entries.map((entry) => (<RbaJournalEntry key={entry.id} entry={entry} />))}

        </div>
    );
};

RbaJournalGroupBlock.displayName = "RbaJournalGroupBlock";

export default RbaJournalGroupBlock;
