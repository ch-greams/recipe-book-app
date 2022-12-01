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
import type { JournalStoreEntry } from "@store/types/journal";

import styles from "./rba-journal-entry.module.scss";


interface Props {
    entry: JournalStoreEntry;
    onEntryTimeUpdate: RbaInputChangeCallback;
    onFoodAmountUpdate: RbaInputChangeCallback;
    onFoodAmountSave: () => void;
    onFoodUnitUpdate: RbaSelectChangeCallback;
    onFoodUnitSave: () => void;
}

const RbaJournalEntry: React.FC<Props> = ({
    entry,
    onEntryTimeUpdate,
    onFoodAmountUpdate,
    onFoodAmountSave,
    onFoodUnitUpdate,
    onFoodUnitSave,
}) => {

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: `journal_entry-${entry.id}`,
        data: { entryId: entry.id },
    });

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
                    onBlur={onFoodAmountSave}
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
                    onBlur={onFoodUnitSave}
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
