import React, { useState } from "react";
import * as constants from "@cypress/constants";
import { DndContext } from "@dnd-kit/core";

import { DEFAULT_TIME_FORMAT, getCurrentTime } from "@common/date";
import { isSome } from "@common/types";
import { getTemporaryId } from "@common/utils";
import RbaSearchInput, { SearchInputHeightSize, SearchInputWidthSize } from "@views/shared/rba-search-input";
import { useAppDispatch } from "@store";
import * as journalActions from "@store/actions/journal";
import * as searchActions from "@store/actions/search";
import type { JournalStoreEntry, JournalStoreGroup } from "@store/types/journal";
import type { SearchStore } from "@store/types/search";

import RbaJournalGroupBlock from "../rba-journal-group-block";

import RbaJournalTrash from "./rba-journal-trash";

import styles from "./rba-journal-block.module.scss";


interface Props {
    currentDate: string;
    groups: JournalStoreGroup[];
    entries: JournalStoreEntry[];
    search: SearchStore;
}

const RbaJournalBlock: React.FC<Props> = ({ currentDate, groups, entries, search }) => {

    const dispatch = useAppDispatch();
    const [ showTrash, setShowTrash ] = useState(false);

    const onEntryTimeUpdate = (id: number, value: string): void => {
        dispatch(journalActions.updateEntryTime({ id: id, time: value }));
    };
    const onFoodAmountUpdate = (id: number, value: string): void => {
        dispatch(journalActions.updateEntryAmount({ id: id, amountInput: value }));
    };
    const onFoodAmountSave = (id: number): void => {
        dispatch(journalActions.updateJournalEntry(id));
    };
    const onFoodUnitUpdate = (id: number, value: string): void => {
        dispatch(journalActions.updateEntryUnit({ id: id, unit: value }));
        dispatch(journalActions.updateJournalEntry(id));
    };
    const onFoodUnitSave = (id: number): void => {
        dispatch(journalActions.updateJournalEntry(id));
    };

    return (
        <div className={styles.journal} data-cy={constants.CY_JOURNAL_BLOCK}>

            <DndContext
                onDragStart={() => { setShowTrash(true); }}
                onDragEnd={(event) => {

                    setShowTrash(false);

                    const draggableEntryId: Option<number> = event.active?.data.current?.entryId;
                    const droppableEntryGroupIndex: Option<number> = event.over?.data.current?.groupIndex;
                    const droppableIsTrash: Option<boolean> = event.over?.data.current?.isTrash;

                    if (isSome(draggableEntryId) && isSome(event.over?.id)) {
                        if (droppableIsTrash) {
                            dispatch(journalActions.deleteJournalEntry(draggableEntryId));
                        }
                        else {
                            dispatch(journalActions.updateEntryGroup({
                                id: draggableEntryId,
                                groupIndex: droppableEntryGroupIndex,
                            }));
                            dispatch(journalActions.updateJournalEntry(draggableEntryId));
                        }
                    }
                }}
            >

                {groups.map((group) => (
                    <RbaJournalGroupBlock
                        key={group.uiIndex}
                        groupIndex={group.uiIndex}
                        groupName={group.name}
                        entries={entries.filter((entry) => entry.groupIndex === group.uiIndex)}
                        onEntryTimeUpdate={onEntryTimeUpdate}
                        onFoodAmountUpdate={onFoodAmountUpdate}
                        onFoodAmountSave={onFoodAmountSave}
                        onFoodUnitUpdate={onFoodUnitUpdate}
                        onFoodUnitSave={onFoodUnitSave}
                    />
                ))}

                <RbaJournalGroupBlock
                    groupName={"unknown"}
                    entries={entries.filter(({ groupIndex }) => (
                        !groupIndex || groups.every(({ uiIndex }) => uiIndex !== groupIndex)
                    ))}
                    onEntryTimeUpdate={onEntryTimeUpdate}
                    onFoodAmountUpdate={onFoodAmountUpdate}
                    onFoodAmountSave={onFoodAmountSave}
                    onFoodUnitUpdate={onFoodUnitUpdate}
                    onFoodUnitSave={onFoodUnitSave}
                />

                {( showTrash && <RbaJournalTrash /> )}

            </DndContext>

            <RbaSearchInput
                width={SearchInputWidthSize.Full}
                height={SearchInputHeightSize.Small}
                placeholder={"Add a new entry..."}
                isLoading={!search.isLoaded}
                value={search.searchInput}
                items={search.products}
                onChange={(value) => { dispatch(searchActions.searchProducts(value)); }}
                onSelect={(product) => {

                    dispatch(journalActions.createJournalEntry({
                        id: getTemporaryId(),
                        entry_date: currentDate,
                        entry_time: getCurrentTime(DEFAULT_TIME_FORMAT),
                        product_id: product.id,
                        amount: 100,
                        unit: "g",
                        journal_group_ui_index: null,
                    }));

                    dispatch(searchActions.searchClear());
                }}
                data-cy={constants.CY_JOURNAL_SEARCH_INPUT}
            />

        </div>
    );
};

RbaJournalBlock.displayName = "RbaJournalBlock";

export default RbaJournalBlock;
