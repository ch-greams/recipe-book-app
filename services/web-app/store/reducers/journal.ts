import { createReducer } from "@reduxjs/toolkit";

import { formatTime, getCurrentDate, parseTime } from "@common/date";
import { convertToMetric } from "@common/units";
import Utils from "@common/utils";

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
            const { id, groupNumber } = action.payload;
            state.entries = state.entries.map((entry) => (
                entry.id === id
                    ? ({ ...entry, groupOrderNumber: groupNumber })
                    : entry
            ));
        })
        .addCase(actions.updateEntryTime, (state, action) => {
            const { id, time } = action.payload;
            state.entries = state.entries
                .map((entry) => (
                    entry.id === id
                        ? ({ ...entry, entryTime: time })
                        : entry
                ))
                .sort(Utils.sortBy("entryTime", (entryTime) => parseTime(entryTime as string)));
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
                    groupOrderNumber: entry.journal_group_num,
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
                .sort(Utils.sortBy("entryTime", (entryTime) => parseTime(entryTime as string)));

            state.nutrients = getNutrientsFromJournalEntries(state.entries);
        })
        .addCase(actions.createJournalEntry.rejected, (state, action) => {
            const message = action.payload?.message;
            state.errorMessage = message;
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
        .addCase(actions.updateJournalEntry.rejected, (state, action) => {
            const message = action.payload?.message;
            state.errorMessage = message;
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
        .addCase(actions.deleteJournalEntry.rejected, (state, action) => {
            const message = action.payload?.message;
            state.errorMessage = message;
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
                    groupOrderNumber: entry.journal_group_num,
                    foodId: entry.product_id,
                    foodName: entry.product_name,
                    foodAmount: entry.amount,
                    foodAmountInput: String(entry.amount),
                    foodUnit: entry.unit,
                    foodDensity: entry.product_density,
                    foodNutrients: entry.nutrients,
                    foodCustomUnits: entry.custom_units,
                }))
                .sort(Utils.sortBy("entryTime", (entryTime) => parseTime(entryTime as string)));

            state.groups = groups
                .map(({ order_number, name }) => ({ orderNumber: order_number, name }))
                .sort(Utils.sortBy("orderNumber"));

            state.nutrients = getNutrientsFromJournalEntries(state.entries);
        })
        .addCase(actions.fetchJournalInfo.rejected, (state, action) => {
            const message = action.payload?.message;
            state.isLoaded = true;
            state.errorMessage = message;

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
                .map(({ order_number, name }) => ({ orderNumber: order_number, name }))
                .sort(Utils.sortBy("orderNumber"));
        })
        .addCase(actions.updateJournalGroups.rejected, (state, action) => {
            const message = action.payload?.message;
            state.errorMessage = message;
            state.isLoaded = true;
        });
});

export default reducer;
