import React from "react";

import type { JournalGroup } from "@common/typings";
import RbaBlockTitle from "@views/shared/rba-block-title";
import type { JournalStoreGroup } from "@store/types/journal";

import RbaJournalGroupsBlock from "../rba-journal-groups-block";

import styles from "./rba-settings-block.module.scss";


interface Props {
    journalGroups: JournalStoreGroup[];
    updateJournalGroups: (groups: JournalGroup[]) => void;
}

const RbaSettingsBlock: React.FC<Props> = ({ journalGroups, updateJournalGroups }) => {
    return (
        <div className={styles.journalBlock}>

            <RbaBlockTitle text={"Journal Groups"} />

            <RbaJournalGroupsBlock
                groups={journalGroups}
                updateGroups={updateJournalGroups}
            />

            <RbaBlockTitle text={"Featured Nutrients"} />

            <RbaBlockTitle text={"Nutrients"} />

        </div>
    );
};


RbaSettingsBlock.displayName = "RbaSettingsBlock";

export default RbaSettingsBlock;
