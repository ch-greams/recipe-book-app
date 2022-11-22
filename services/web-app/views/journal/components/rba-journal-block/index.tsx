import React from "react";
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

    return (
        <div className={styles.journal}>

            <DndContext onDragEnd={(event) => {

                const entryId = event.active?.data.current?.entryId;
                const entryGroupNumber = event.over?.data.current?.groupOrderNumber;

                if (isSome(entryId) && isSome(event.over?.id)) {
                    dispatch(journalActions.updateEntryGroup({ id: entryId, groupNumber: entryGroupNumber }));
                    dispatch(journalActions.updateJournalEntry(entryId));
                }
            }}>

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
