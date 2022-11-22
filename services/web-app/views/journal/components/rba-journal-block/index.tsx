import React, { useState } from "react";
import { DndContext } from "@dnd-kit/core";

import { DEFAULT_TIME_FORMAT, getCurrentTime } from "@common/date";
import { isSome } from "@common/types";
import Utils from "@common/utils";
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
    userId: number;
    currentDate: string;
    groups: JournalStoreGroup[];
    entries: JournalStoreEntry[];
    search: SearchStore;
}

const RbaJournalBlock: React.FC<Props> = ({ userId, currentDate, groups, entries, search }) => {

    const dispatch = useAppDispatch();
    const [ showTrash, setShowTrash ] = useState(false);

    return (
        <div className={styles.journal}>

            <DndContext
                onDragStart={() => { setShowTrash(true); }}
                onDragEnd={(event) => {

                    setShowTrash(false);

                    const draggableEntryId: Option<number> = event.active?.data.current?.entryId;
                    const droppableEntryGroupNumber: Option<number> = event.over?.data.current?.groupOrderNumber;
                    const droppableIsTrash: Option<boolean> = event.over?.data.current?.isTrash;

                    if (isSome(draggableEntryId) && isSome(event.over?.id)) {
                        if (droppableIsTrash) {
                            dispatch(journalActions.deleteJournalEntry(draggableEntryId));
                        }
                        else {
                            dispatch(journalActions.updateEntryGroup({
                                id: draggableEntryId,
                                groupNumber: droppableEntryGroupNumber,
                            }));
                            dispatch(journalActions.updateJournalEntry(draggableEntryId));
                        }
                    }
                }}
            >

                {groups.map((group) => (
                    <RbaJournalGroupBlock
                        key={group.orderNumber}
                        groupOrderNumber={group.orderNumber}
                        groupName={group.name}
                        entries={entries.filter((entry) => entry.groupOrderNumber === group.orderNumber)}
                    />
                ))}

                <RbaJournalGroupBlock
                    groupName={"unknown"}
                    entries={entries.filter((entry) => !entry.groupOrderNumber)}
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
                        id: Utils.getTemporaryId(),
                        user_id: userId,
                        entry_date: currentDate,
                        entry_time: getCurrentTime(DEFAULT_TIME_FORMAT),
                        product_id: product.id,
                        amount: 100,
                        unit: "g",
                        journal_group_num: null,
                    }));

                    dispatch(searchActions.searchClear());
                }}
            />

        </div>
    );
};

RbaJournalBlock.displayName = "RbaJournalBlock";

export default RbaJournalBlock;
