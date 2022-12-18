import { createAction, createAsyncThunk } from "@reduxjs/toolkit";

import { DEFAULT_TIME_DISPLAY_FORMAT, DEFAULT_TIME_FORMAT, formatTime } from "@common/date";
import { HttpError } from "@common/http";
import { unwrap } from "@common/types";
import type { JournalEntry, JournalEntryDetailed, JournalGroup } from "@common/typings";
import JournalApi from "@api/journalApi";

import type { AsyncThunkConfig } from ".";


export const updateDate = createAction<string>("journal/update_date");
export const updateEntryGroup = createAction<{ id: number, groupIndex: Option<number> }>("journal/update_entry_group");
export const updateEntryTime = createAction<{ id: number, time: string }>("journal/update_entry_time");
export const updateEntryAmount = createAction<{ id: number, amountInput: string }>("journal/update_entry_amount");
export const updateEntryUnit = createAction<{ id: number, unit: string }>("journal/update_entry_unit");

export const fetchJournalInfo = createAsyncThunk<
    { entries: JournalEntryDetailed[], groups: JournalGroup[] },
    void,
    AsyncThunkConfig
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
            return rejectWithValue(HttpError.getStatus(error));
        }
    },
);

export const createJournalEntry = createAsyncThunk<JournalEntryDetailed, JournalEntry, AsyncThunkConfig>(
    "journal/create_entry",
    async (entry, { rejectWithValue }) => {
        try {
            const entryResponse = await JournalApi.createJournalEntry(entry);
            return entryResponse;
        }
        catch (error) {
            return rejectWithValue(HttpError.getStatus(error));
        }
    },
);

export const updateJournalEntry = createAsyncThunk<JournalEntry, number, AsyncThunkConfig>(
    "journal/update_entry",
    async (entryId, { rejectWithValue, getState }) => {
        try {
            const { journal: { entries }, user: { userId } } = getState();

            const entry = unwrap( entries.find((e) => e.id === entryId), `entries.find((e) => e.id === ${entryId})` );

            const entryResponse = await JournalApi.updateJournalEntry({
                id: entry.id,
                user_id: userId,
                entry_date: entry.entryDate,
                entry_time: formatTime(entry.entryTime, DEFAULT_TIME_DISPLAY_FORMAT, DEFAULT_TIME_FORMAT),
                product_id: entry.foodId,
                amount: entry.foodAmount,
                unit: entry.foodUnit,
                journal_group_ui_index: entry.groupIndex,
            });

            return entryResponse;
        }
        catch (error) {
            return rejectWithValue(HttpError.getStatus(error));
        }
    },
);

export const deleteJournalEntry = createAsyncThunk<number, number, AsyncThunkConfig>(
    "journal/delete_entry",
    async (entryId, { rejectWithValue }) => {
        try {
            await JournalApi.deleteJournalEntry(entryId);
            return entryId;
        }
        catch (error) {
            return rejectWithValue(HttpError.getStatus(error));
        }
    },
);

export const updateJournalGroups = createAsyncThunk<JournalGroup[], JournalGroup[], AsyncThunkConfig>(
    "journal/update_groups",
    async (groups, { rejectWithValue }) => {
        try {
            await JournalApi.updateJournalGroups(groups);
            return groups;
        }
        catch (error) {
            return rejectWithValue(HttpError.getStatus(error));
        }
    },
);
