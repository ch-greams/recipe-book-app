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
    onEntryTimeUpdate: (id: number, value: string) => void;
    onFoodAmountUpdate: (id: number, value: string) => void;
    onFoodAmountSave: (id: number) => void;
    onFoodUnitUpdate: (id: number, value: string) => void;
    onFoodUnitSave: (id: number) => void;
}

const RbaJournalGroupBlock: React.FC<Props> = ({
    groupIndex,
    groupName,
    entries,
    onEntryTimeUpdate,
    onFoodAmountUpdate,
    onFoodAmountSave,
    onFoodUnitUpdate,
    onFoodUnitSave,
}) => {

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

            {entries.map((entry) => (
                <RbaJournalEntry
                    key={entry.id}
                    entry={entry}
                    onEntryTimeUpdate={(value) => { onEntryTimeUpdate(entry.id, value); }}
                    onFoodAmountUpdate={(value) => { onFoodAmountUpdate(entry.id, value); }}
                    onFoodAmountSave={() => { onFoodAmountSave(entry.id); }}
                    onFoodUnitUpdate={(unit) => { onFoodUnitUpdate(entry.id, unit.value); }}
                    onFoodUnitSave={() => { onFoodUnitSave(entry.id); }}
                />
            ))}

        </div>
    );
};

RbaJournalGroupBlock.displayName = "RbaJournalGroupBlock";

export default RbaJournalGroupBlock;
