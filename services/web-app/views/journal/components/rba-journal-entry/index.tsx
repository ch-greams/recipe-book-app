import React from "react";
import * as constants from "@cypress/constants";
import { useDraggable } from "@dnd-kit/core";

import { getCurrentTime } from "@common/date";
import { Unit } from "@common/units";
import type { RbaInputChangeCallback } from "@views/shared/rba-input";
import { InputNormalizer } from "@views/shared/rba-input";
import RbaInput, { InputHeightSize,InputTextAlign,InputTheme, InputWidthSize } from "@views/shared/rba-input";
import type { RbaSelectChangeCallback } from "@views/shared/rba-select";
import RbaSelect, { SelectHeightSize, SelectTheme, SelectWidthSize } from "@views/shared/rba-select";
import * as actions from "@store/actions/journal";
import { useAppDispatch } from "@store/index";
import type { JournalStoreEntry } from "@store/types/journal";

import styles from "./rba-journal-entry.module.scss";


interface Props {
    entry: JournalStoreEntry;
}

const RbaJournalEntry: React.FC<Props> = ({ entry }) => {

    const dispatch = useAppDispatch();

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: `journal_entry-${entry.id}`,
        data: { entryId: entry.id },
    });

    const onEntryTimeUpdate: RbaInputChangeCallback = (value) => {
        dispatch(actions.updateEntryTime({ id: entry.id, time: value }));
    };

    const onFoodAmountUpdate: RbaInputChangeCallback = (value) => {
        dispatch(actions.updateEntryAmount({ id: entry.id, amountInput: value }));
    };

    const onFoodUnitUpdate: RbaSelectChangeCallback = (unit) => {
        dispatch(actions.updateEntryUnit({ id: entry.id, unit: unit.value }));
        dispatch(actions.updateJournalEntry(entry.id));
    };

    return (
        <div
            className={styles.journalEntry}
            style={transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined}
            data-cy={constants.CY_JOURNAL_ENTRY}
        >

            <span>
                <RbaInput
                    data-cy={constants.CY_JOURNAL_ENTRY_TIME}
                    theme={InputTheme.Alternative}
                    align={InputTextAlign.Center}
                    width={InputWidthSize.Full}
                    height={InputHeightSize.Small}
                    value={entry.entryTime}
                    normalizer={InputNormalizer.Time}
                    placeholder={getCurrentTime()}
                    onChange={onEntryTimeUpdate}
                    onBlur={() => { dispatch(actions.updateJournalEntry(entry.id)); }}
                />
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
                    data-cy={constants.CY_JOURNAL_ENTRY_FOOD_AMOUNT}
                    theme={InputTheme.Alternative}
                    width={InputWidthSize.Full}
                    height={InputHeightSize.Small}
                    value={entry.foodAmountInput}
                    normalizer={InputNormalizer.Decimal}
                    onChange={onFoodAmountUpdate}
                    onBlur={() => { dispatch(actions.updateJournalEntry(entry.id)); }}
                />
            </span>

            <span>
                <RbaSelect
                    data-cy={constants.CY_JOURNAL_ENTRY_FOOD_UNIT}
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
