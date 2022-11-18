import React from "react";

import { formatTime } from "@common/date";
import { Unit } from "@common/units";
import RbaInput, { InputHeightSize,InputTheme, InputWidthSize } from "@views/shared/rba-input";
import RbaSelect, { SelectHeightSize, SelectTheme, SelectWidthSize } from "@views/shared/rba-select";
import type { JournalEntry } from "@store/types/journal";

import styles from "./rba-journal-entry.module.scss";


interface Props {
    entry: JournalEntry;
}

const RbaJournalEntry: React.FC<Props> = ({ entry }) => {

    return (
        <div className={styles.journalEntry}>

            <span>
                {formatTime(entry.entryTime)}
            </span>

            <span>
                {entry.foodName}
            </span>

            <span>
                <RbaInput
                    theme={InputTheme.Alternative}
                    width={InputWidthSize.Full}
                    height={InputHeightSize.Small}
                    value={String(entry.foodAmount)}
                    onChange={(event) => {
                        // dispatch(actions.updateDensityAmount());
                        console.log("event.target.value = ", event.target.value);
                    }}
                />
            </span>

            <span>
                <RbaSelect
                    theme={SelectTheme.Alternative}
                    center={true}
                    width={SelectWidthSize.Full}
                    height={SelectHeightSize.Small}
                    options={Object.values(Unit).map((unit) => ({ value: unit }))}
                    value={entry.foodUnit}
                    onChange={() => console.log("change unit")}
                />
            </span>

        </div>
    );
};

RbaJournalEntry.displayName = "RbaJournalEntry";

export default RbaJournalEntry;
