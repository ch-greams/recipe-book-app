import React from "react";

import type { JournalEntry, JournalGroup } from "@store/types/journal";

import RbaJournalGroup from "../rba-journal-group";

import styles from "./rba-journal-block.module.scss";


interface Props {
    groups: JournalGroup[];
    entries: JournalEntry[];
}

const RbaJournalBlock: React.FC<Props> = ({ groups, entries }) => {
    return (
        <div className={styles.journal}>

            {groups.map((group) => (
                <RbaJournalGroup
                    key={group.orderNumber}
                    name={group.name}
                    entries={entries.filter((entry) => entry.groupOrderNumber === group.orderNumber)}
                />
            ))}

            <RbaJournalGroup
                name={"unknown"}
                entries={entries.filter((entry) => !entry.groupOrderNumber)}
            />

        </div>
    );
};

RbaJournalBlock.displayName = "RbaJournalBlock";

export default RbaJournalBlock;
