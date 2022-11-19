import { createAction, createAsyncThunk } from "@reduxjs/toolkit";

import type { JournalEntry, JournalGroup } from "@common/typings";
import JournalApi from "@api/journalApi";

import type { RootState } from "..";


export const changeDate = createAction<string>("journal/change_date");
export const changeEntryGroup = createAction<{ entryId: number, entryGroupNumber: Option<number> }>("journal/change_entry_group");

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
