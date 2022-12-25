import React from "react";
import * as constants from "@cypress/constants";

import RbaInput, { InputHeightSize, InputTextAlign, InputTheme, InputWidthSize } from "@views/shared/rba-input";
import RbaToggle from "@views/shared/rba-toggle";

import styles from "./rba-journal-group.module.scss";


interface Props {
    uiIndex: number;
    name: string;
    updateGroup: (uiIndex: number, name: string) => void;
}

const RbaJournalGroup: React.FC<Props> = ({ uiIndex, name, updateGroup }) => {

    return (

        <div className={styles.journalGroupLine} data-cy={constants.CY_USER_JOURNAL_GROUP}>

            <div className={styles.journalGroup}>

                <div className={styles.journalGroupIndex} data-cy={constants.CY_USER_JOURNAL_GROUP_INDEX}>
                    {uiIndex}
                </div>

                <RbaInput
                    data-cy={constants.CY_USER_JOURNAL_GROUP_INPUT}
                    theme={InputTheme.Primary}
                    align={InputTextAlign.Left}
                    width={InputWidthSize.Full}
                    height={InputHeightSize.Medium}
                    value={name}
                    onChange={(value) => { updateGroup(uiIndex, value); }}
                />

            </div>

            <RbaToggle
                value={name.isNotEmpty()}
                onToggle={() => updateGroup(uiIndex, "")}
            />

        </div>

    );
};


RbaJournalGroup.displayName = "RbaJournalGroup";

export default RbaJournalGroup;
