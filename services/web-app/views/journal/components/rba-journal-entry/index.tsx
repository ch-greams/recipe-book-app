import React from "react";
import { useDraggable } from "@dnd-kit/core";

import { formatTime } from "@common/date";
import type { InputChangeCallback } from "@common/typings";
import { Unit } from "@common/units";
import RbaInput, { InputHeightSize,InputTheme, InputWidthSize } from "@views/shared/rba-input";
import type { RbaSelectChangeCallback } from "@views/shared/rba-select";
import RbaSelect, { SelectHeightSize, SelectTheme, SelectWidthSize } from "@views/shared/rba-select";
import * as actions from "@store/actions/journal";
import { useAppDispatch } from "@store/index";
import type { JournalEntry } from "@store/types/journal";

import styles from "./rba-journal-entry.module.scss";


interface Props {
    entry: JournalEntry;
}

const RbaJournalEntry: React.FC<Props> = ({ entry }) => {

    const dispatch = useAppDispatch();

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: `journal_entry-${entry.id}`,
        data: { entryId: entry.id },
    });

    const onFoodAmountUpdate: InputChangeCallback = (event) => {
        dispatch(actions.updateEntryAmount({ id: entry.id, amountInput: event.target.value }));
    };

    const onFoodUnitUpdate: RbaSelectChangeCallback = (unit) => {
        dispatch(actions.updateEntryUnit({ id: entry.id, unit: unit.value }));
    };

    return (
        <div
            className={styles.journalEntry}
            style={transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined}
        >

            <span className={styles.journalEntryTime}>
                {formatTime(entry.entryTime)}
            </span>

            <span
                className={styles.journalEntryName}
                ref={setNodeRef}
                {...listeners}
                {...attributes}
            >
                {entry.foodName}
            </span>

            <span>
                <RbaInput
                    theme={InputTheme.Alternative}
                    width={InputWidthSize.Full}
                    height={InputHeightSize.Small}
                    value={entry.foodAmountInput}
                    onChange={onFoodAmountUpdate}
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
                    onChange={onFoodUnitUpdate}
                />
            </span>

        </div>
    );
};

RbaJournalEntry.displayName = "RbaJournalEntry";

export default RbaJournalEntry;
