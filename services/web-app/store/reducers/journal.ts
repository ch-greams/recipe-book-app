import { createReducer } from "@reduxjs/toolkit";

import { fetchJournalInfo } from "@store/actions/journal";
import type { JournalStore } from "@store/types/journal";



const initialState: JournalStore = {
    currentDate: "2022-11-04",

    entries: [],
    groups: [],

    nutrients: {},
    nutrientsInputs: {},

    isLoaded: false,
    errorMessage: null,
};

const reducer = createReducer(initialState, (builder) => {
    builder
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
                entryDate: entry.entry_date,
                entryTime: entry.entry_time,
                groupOrderNumber: entry.journal_group_num,
                // FIXME: Should get product name here instead of id
                foodName: String(entry.product_id),
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
