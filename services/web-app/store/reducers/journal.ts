import { createReducer } from "@reduxjs/toolkit";

import { sortBy, sortByConverted } from "@common/array";
import { formatTime, getCurrentDate, parseTime } from "@common/date";
import { getErrorMessageFromStatus } from "@common/http";
import { convertToMetric } from "@common/units";

import * as actions from "../actions/journal";
import { getNutrientsFromJournalEntries } from "../helpers/journal";
import type { JournalStore } from "../types/journal";



const initialState: JournalStore = {
    currentDate: getCurrentDate(),

    entries: [],
    groups: [],

    nutrients: {},

    isSaved: false,
    isLoaded: false,
    errorMessage: null,
};

const reducer = createReducer(initialState, (builder) => {
    builder
        .addCase(actions.updateDate, (state, action) => {
            state.currentDate = action.payload;
        })
        .addCase(actions.updateEntryGroup, (state, action) => {
            const { id, groupIndex } = action.payload;
            state.entries = state.entries.map((entry) => ( entry.id === id ? ({ ...entry, groupIndex }) : entry ));
        })
        .addCase(actions.updateEntryTime, (state, action) => {
            const { id, time } = action.payload;
            state.entries = state.entries
                .map((entry) => (
                    entry.id === id
                        ? ({ ...entry, entryTime: time })
                        : entry
                ))
                .sort(sortByConverted("entryTime", (entryTime) => parseTime(entryTime as string)));
        })
        .addCase(actions.updateEntryAmount, (state, action) => {
            const { id, amountInput } = action.payload;

            state.entries = state.entries.map((entry) => {
                if (entry.id === id) {

                    const foodAmount = convertToMetric(
                        Number(amountInput), entry.foodUnit, entry.foodCustomUnits, entry.foodDensity,
                    );

                    return {
                        ...entry,
                        foodAmount: foodAmount,
                        foodAmountInput: amountInput,
                    };
                }
                else {
                    return entry;
                }
            });

            state.nutrients = getNutrientsFromJournalEntries(state.entries);
        })
        .addCase(actions.updateEntryUnit, (state, action) => {
            const { id, unit } = action.payload;
            state.entries = state.entries.map((entry) => (
                (entry.id === id)
                    ? {
                        ...entry,
                        foodAmount: convertToMetric(
                            Number(entry.foodAmountInput), unit, entry.foodCustomUnits, entry.foodDensity,
                        ),
                        foodUnit: unit,
                    }
                    : entry
            ));

            state.nutrients = getNutrientsFromJournalEntries(state.entries);
        })
        .addCase(actions.createJournalEntry.pending, (state) => {
            state.errorMessage = null;
            state.isSaved = false;
        })
        .addCase(actions.createJournalEntry.fulfilled, (state, action) => {
            const entry = action.payload;
            state.errorMessage = null;
            state.isSaved = true;

            state.entries = [
                ...state.entries,
                {
                    id: entry.id,
                    entryDate: entry.entry_date,
                    entryTime: formatTime(entry.entry_time),
                    groupIndex: entry.journal_group_ui_index,
                    foodId: entry.product_id,
                    foodName: entry.product_name,
                    foodAmount: entry.amount,
                    foodAmountInput: String(entry.amount),
                    foodUnit: entry.unit,
                    foodDensity: entry.product_density,
                    foodNutrients: entry.nutrients,
                    foodCustomUnits: entry.custom_units,
                },
            ]
                .sort(sortByConverted("entryTime", (entryTime) => parseTime(entryTime as string)));

            state.nutrients = getNutrientsFromJournalEntries(state.entries);
        })
        .addCase(actions.createJournalEntry.rejected, (state, { payload: errorStatus }) => {
            state.errorMessage = getErrorMessageFromStatus(errorStatus);
            state.isSaved = true;
        })
        .addCase(actions.updateJournalEntry.pending, (state) => {
            state.errorMessage = null;
            state.isSaved = false;
        })
        .addCase(actions.updateJournalEntry.fulfilled, (state) => {
            state.errorMessage = null;
            state.isSaved = true;
        })
        .addCase(actions.updateJournalEntry.rejected, (state, { payload: errorStatus }) => {
            state.errorMessage = getErrorMessageFromStatus(errorStatus);
            state.isSaved = true;
        })
        .addCase(actions.deleteJournalEntry.pending, (state) => {
            state.errorMessage = null;
            state.isSaved = false;
        })
        .addCase(actions.deleteJournalEntry.fulfilled, (state, action) => {
            const entryId = action.payload;
            state.errorMessage = null;
            state.isSaved = true;

            state.entries = state.entries.filter((entry) => entry.id !== entryId);
            state.nutrients = getNutrientsFromJournalEntries(state.entries);
        })
        .addCase(actions.deleteJournalEntry.rejected, (state, { payload: errorStatus }) => {
            state.errorMessage = getErrorMessageFromStatus(errorStatus);
            state.isSaved = true;
        })
        .addCase(actions.fetchJournalInfo.pending, (state) => {
            state.isLoaded = false;
            state.errorMessage = null;

            state.entries = [];
            state.groups = [];
        })
        .addCase(actions.fetchJournalInfo.fulfilled, (state, action) => {
            const { entries, groups } = action.payload;
            state.isLoaded = true;
            state.errorMessage = null;

            state.entries = entries
                .map((entry) => ({
                    id: entry.id,
                    entryDate: entry.entry_date,
                    entryTime: formatTime(entry.entry_time),
                    groupIndex: entry.journal_group_ui_index,
                    foodId: entry.product_id,
                    foodName: entry.product_name,
                    foodAmount: entry.amount,
                    foodAmountInput: String(entry.amount),
                    foodUnit: entry.unit,
                    foodDensity: entry.product_density,
                    foodNutrients: entry.nutrients,
                    foodCustomUnits: entry.custom_units,
                }))
                .sort(sortByConverted("entryTime", (entryTime) => parseTime(entryTime as string)));

            state.groups = groups
                .map(({ ui_index, name }) => ({ uiIndex: ui_index, name }))
                .sort(sortBy("uiIndex"));

            state.nutrients = getNutrientsFromJournalEntries(state.entries);
        })
        .addCase(actions.fetchJournalInfo.rejected, (state, { payload: errorStatus }) => {
            state.isLoaded = true;
            state.errorMessage = getErrorMessageFromStatus(errorStatus);

            state.entries = [];
            state.groups = [];
        })
        .addCase(actions.updateJournalGroups.pending, (state) => {
            state.errorMessage = null;
            state.isLoaded = false;
        })
        .addCase(actions.updateJournalGroups.fulfilled, (state, action) => {
            const groups = action.payload;
            state.errorMessage = null;
            state.isLoaded = true;

            state.groups = groups
                .map(({ ui_index, name }) => ({ uiIndex: ui_index, name }))
                .sort(sortBy("uiIndex"));
        })
        .addCase(actions.updateJournalGroups.rejected, (state, { payload: errorStatus }) => {
            state.errorMessage = getErrorMessageFromStatus(errorStatus);
            state.isLoaded = true;
        });
});

export default reducer;
