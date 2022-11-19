import { createReducer } from "@reduxjs/toolkit";

import { getCurrentDate } from "@common/date";
import { changeDate, changeEntryGroup, fetchJournalInfo } from "@store/actions/journal";
import type { JournalStore } from "@store/types/journal";



const initialState: JournalStore = {
    currentDate: getCurrentDate(),

    entries: [],
    groups: [],

    nutrients: {},
    nutrientsInputs: {},

    isLoaded: false,
    errorMessage: null,
};

const reducer = createReducer(initialState, (builder) => {
    builder
        .addCase(changeDate, (state, action) => {
            state.currentDate = action.payload;
        })
        .addCase(changeEntryGroup, (state, action) => {
            const { entryId, entryGroupNumber } = action.payload;
            state.entries = state.entries.map((entry) => (
                entry.id === entryId
                    ? ({ ...entry, groupOrderNumber: entryGroupNumber })
                    : entry
            ));
        })
        .addCase(fetchJournalInfo.pending, (state) => {
            state.isLoaded = false;
            state.errorMessage = null;

            state.entries = [];
            state.groups = [];
        })
        .addCase(fetchJournalInfo.fulfilled, (state, action) => {
            const { entries, groups } = action.payload;
            state.isLoaded = true;
            state.errorMessage = null;

            state.entries = entries.map((entry) => ({
                id: entry.id,
                entryDate: entry.entry_date,
                entryTime: entry.entry_time,
                groupOrderNumber: entry.journal_group_num,
                foodName: entry.product.name,
                foodAmount: entry.amount,
                foodUnit: entry.unit,
            }));

            state.groups = groups.map((group) => ({
                orderNumber: group.order_number,
                name: group.name,
            }));
        })
        .addCase(fetchJournalInfo.rejected, (state, action) => {
            const message = action.payload?.message;
            state.isLoaded = true;
            state.errorMessage = message;

            state.entries = [];
            state.groups = [];
        });
});

export default reducer;
