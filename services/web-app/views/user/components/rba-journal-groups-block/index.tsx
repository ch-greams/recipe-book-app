import React, { useState } from "react";

import { unwrapOr } from "@common/types";
import type { JournalGroup } from "@common/typings";
import Utils from "@common/utils";
import RbaButton, { ButtonWidthSize } from "@views/shared/rba-button";
import { RBA_BUTTON_LABEL_REVERT, RBA_BUTTON_LABEL_SAVE } from "@views/shared/rba-button/labels";
import type { JournalStoreGroup } from "@store/types/journal";

import RbaJournalGroup from "../rba-journal-group";

import styles from "./rba-journal-groups-block.module.scss";


interface Props {
    groups: JournalStoreGroup[];
    updateGroups: (groups: JournalGroup[]) => void;
}

const RbaJournalGroupsBlock: React.FC<Props> = ({ groups, updateGroups }) => {

    const [ journalGroups, setJournalGroups ] = useState(groups);

    const journalGroupSlots = Array.from({ length: 9 }).map((_empty, index) => {

        const slotIndex = index + 1;
        const group = unwrapOr(
            journalGroups.find((g) => g.uiIndex === slotIndex),
            { uiIndex: slotIndex, name: "" },
        );

        return (
            <RbaJournalGroup
                key={group.uiIndex}
                uiIndex={group.uiIndex}
                name={group.name}
                updateGroup={(uiIndex: number, name: string) => {
                    setJournalGroups(
                        [
                            ...journalGroups.filter((journalGroup) => journalGroup.uiIndex !== group.uiIndex),
                            { uiIndex, name },
                        ]
                            .sort(Utils.sortBy("uiIndex")),
                    );
                }}
            />
        );
    });

    return (
        <div className={styles.journalGroupsBlock}>

            {journalGroupSlots}

            <div className={styles.journalGroupsControls}>

                <RbaButton
                    label={RBA_BUTTON_LABEL_REVERT}
                    width={ButtonWidthSize.Full}
                    disabled={journalGroups.equals(groups)}
                    onClick={() => setJournalGroups(groups)}
                />

                <RbaButton
                    label={RBA_BUTTON_LABEL_SAVE}
                    width={ButtonWidthSize.Full}
                    onClick={() => {
                        const groupsToSave = journalGroups
                            .filter((g) => !Utils.isEmptyString(g.name))
                            .map(({ uiIndex, name }) => ({ user_id: 1, ui_index: uiIndex, name }));
                        updateGroups(groupsToSave);
                    }}
                />
            </div>


        </div>
    );
};


RbaJournalGroupsBlock.displayName = "RbaJournalGroupsBlock";

export default RbaJournalGroupsBlock;
