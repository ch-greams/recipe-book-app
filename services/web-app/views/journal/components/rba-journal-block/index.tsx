import React from "react";
import { DndContext } from "@dnd-kit/core";

import { isSome } from "@common/types";
import { useAppDispatch } from "@store";
import * as actions from "@store/actions/journal";
import type { JournalEntry, JournalGroup } from "@store/types/journal";

import RbaJournalGroup from "../rba-journal-group";

import styles from "./rba-journal-block.module.scss";


interface Props {
    groups: JournalGroup[];
    entries: JournalEntry[];
}

const RbaJournalBlock: React.FC<Props> = ({ groups, entries }) => {

    const dispatch = useAppDispatch();

    return (
        <div className={styles.journal}>

            <DndContext onDragEnd={(event) => {

                const entryId = event.active?.data.current?.entryId;
                const entryGroupNumber = event.over?.data.current?.groupOrderNumber;

                if (isSome(entryId) && isSome(event.over?.id)) {
                    dispatch(actions.updateEntryGroup({ id: entryId, groupNumber: entryGroupNumber }));
                }
            }}>

                {groups.map((group) => (
                    <RbaJournalGroup
                        key={group.orderNumber}
                        groupOrderNumber={group.orderNumber}
                        groupName={group.name}
                        entries={entries.filter((entry) => entry.groupOrderNumber === group.orderNumber)}
                    />
                ))}

                <RbaJournalGroup
                    groupName={"unknown"}
                    entries={entries.filter((entry) => !entry.groupOrderNumber)}
                />

            </DndContext>

        </div>
    );
};

RbaJournalBlock.displayName = "RbaJournalBlock";

export default RbaJournalBlock;
