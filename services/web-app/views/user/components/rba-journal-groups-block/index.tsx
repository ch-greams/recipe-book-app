import React, { useState } from "react";

import { isSome } from "@common/types";
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


    const updateJournalGroup = (slot: number) => {
        return (orderNumber: number, name: string) => {
            setJournalGroups(
                [
                    ...journalGroups.filter((journalGroup) => journalGroup.orderNumber !== slot),
                    { orderNumber, name },
                ]
                    .sort(Utils.sortBy("orderNumber")),
            );
        };
    };

    const journalGroupSlots = Array.from({ length: 9 }).map((_empty, index) => {

        const slotOrderNumber = index + 1;
        const group = journalGroups.find((g) => g.orderNumber === slotOrderNumber);

        return (
            isSome(group)
                ? (
                    <RbaJournalGroup
                        key={group.orderNumber}
                        orderNumber={group.orderNumber}
                        name={group.name}
                        updateGroup={updateJournalGroup(slotOrderNumber)}
                    />
                )
                : (
                    <RbaJournalGroup
                        key={slotOrderNumber}
                        orderNumber={slotOrderNumber}
                        name={""}
                        updateGroup={updateJournalGroup(slotOrderNumber)}
                    />
                )
        );
    });

    return (
        <div className={styles.journalGroupsBlock}>

            {journalGroupSlots}

            <div className={styles.journalGroupsControls}>

                <RbaButton
                    label={RBA_BUTTON_LABEL_REVERT}
                    width={ButtonWidthSize.Full}
                    onClick={() => setJournalGroups(groups)}
                />

                <RbaButton
                    label={RBA_BUTTON_LABEL_SAVE}
                    width={ButtonWidthSize.Full}
                    onClick={() => {
                        const groupsToSave = journalGroups
                            .filter((g) => !Utils.isEmptyString(g.name))
                            .map(({ orderNumber, name }) => ({ user_id: 1, order_number: orderNumber, name }));
                        updateGroups(groupsToSave);
                    }}
                />
            </div>


        </div>
    );
};


RbaJournalGroupsBlock.displayName = "RbaJournalGroupsBlock";

export default RbaJournalGroupsBlock;
