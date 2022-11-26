import React from "react";

import Utils from "@common/utils";
import RbaInput, { InputHeightSize,InputTextAlign, InputTheme, InputWidthSize } from "@views/shared/rba-input";
import RbaToggle from "@views/shared/rba-toggle";

import styles from "./rba-journal-group.module.scss";


interface Props {
    orderNumber: number;
    name: string;
    updateGroup: (orderNumber: number, name: string) => void;
}

const RbaJournalGroup: React.FC<Props> = ({ orderNumber, name, updateGroup }) => {

    return (

        <div className={styles.journalGroupLine} >

            <div className={styles.journalGroup}>

                <div className={styles.journalGroupNumber}>
                    {orderNumber}
                </div>

                <RbaInput
                    theme={InputTheme.Primary}
                    align={InputTextAlign.Left}
                    width={InputWidthSize.Full}
                    height={InputHeightSize.Medium}
                    value={name}
                    onChange={(value) => { updateGroup(orderNumber, value); }}
                />

            </div>

            <RbaToggle
                value={!Utils.isEmptyString(name)}
                onToggle={() => updateGroup(orderNumber, "")}
            />

        </div>

    );
};


RbaJournalGroup.displayName = "RbaJournalGroup";

export default RbaJournalGroup;
