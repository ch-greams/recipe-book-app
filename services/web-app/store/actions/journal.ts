import { createAsyncThunk } from "@reduxjs/toolkit";

import type { JournalEntry, JournalGroup } from "@common/typings";
import JournalApi from "@api/journalApi";

import type { RootState } from "..";



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
