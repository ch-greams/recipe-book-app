import { createAction, createAsyncThunk } from "@reduxjs/toolkit";

import type { JournalEntry, JournalGroup } from "@common/typings";
import JournalApi from "@api/journalApi";

import type { RootState } from "..";


export const updateDate = createAction<string>("journal/update_date");
export const updateEntryGroup = createAction<{ id: number, groupNumber: Option<number> }>("journal/update_entry_group");
export const updateEntryAmount = createAction<{ id: number, amountInput: string }>("journal/update_entry_amount");
export const updateEntryUnit = createAction<{ id: number, unit: string }>("journal/update_entry_unit");

export const fetchJournalInfo = createAsyncThunk<
    { entries: JournalEntry[], groups: JournalGroup[] },
    void,
    { state: RootState, rejectValue: Error }
>(
    "journal/fetch_info",
    async (_arg, { rejectWithValue, getState }) => {
        try {
            const journal = getState().journal;

            const [ entries, groups ] = await Promise.all([
                JournalApi.getJournalEntries(journal.currentDate),
                JournalApi.getJournalGroups(),
            ]);

            return { entries, groups };
        }
        catch (error) {
            return rejectWithValue(error as Error);
        }
    },
);
