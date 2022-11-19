import { createReducer } from "@reduxjs/toolkit";

import { getCurrentDate } from "@common/date";
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
        .addCase(actions.updateEntryAmount, (state, action) => {
            const { id, amountInput } = action.payload;

            state.entries = state.entries.map((entry) => {
                if (entry.id === id) {

                    const foodAmountInputNormalized = Utils.decimalNormalizer(amountInput, entry.foodAmountInput);
                    const foodAmount = convertToMetric(
                        Number(foodAmountInputNormalized), entry.foodUnit, entry.foodCustomUnits, entry.foodDensity,
                    );

                    return {
                        ...entry,
                        foodAmount: foodAmount,
                        foodAmountInput: foodAmountInputNormalized,
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

            state.entries = entries.map((entry) => ({
                id: entry.id,
                entryDate: entry.entry_date,
                entryTime: entry.entry_time,
                groupOrderNumber: entry.journal_group_num,
                foodName: entry.product.name,
                foodAmount: entry.amount,
                foodAmountInput: String(entry.amount),
                foodUnit: entry.unit,
                foodDensity: entry.product.density,
                foodNutrients: entry.nutrients,
                foodCustomUnits: entry.custom_units,
            }));

            state.groups = groups.map((group) => ({
                orderNumber: group.order_number,
                name: group.name,
            }));

            state.nutrients = getNutrientsFromJournalEntries(state.entries);
        })
        .addCase(actions.fetchJournalInfo.rejected, (state, action) => {
            const message = action.payload?.message;
            state.isLoaded = true;
            state.errorMessage = message;

            state.entries = [];
            state.groups = [];
        });
});

export default reducer;
