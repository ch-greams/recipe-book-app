import { createReducer } from "@reduxjs/toolkit";

import { getErrorMessageFromStatus } from "@common/http";

import { searchClear, searchFoods } from "../actions/search";
import type { SearchStore } from "../types/search";


const initialState: SearchStore = {

    isLoaded: true,
    errorMessage: null,

    searchInput: "",
    foods: [],
};

const reducer = createReducer(initialState, (builder) => {
    builder
        .addCase(searchClear, (state) => {
            state.isLoaded = true;
            state.errorMessage = null;
            state.searchInput = "";
            state.foods = [];
        })
        .addCase(searchFoods.pending, (state, { meta: { arg: filter } }) => {
            state.isLoaded = false;
            state.errorMessage = null;
            state.searchInput = filter;
            state.foods = [];
        })
        .addCase(searchFoods.fulfilled, (state, { payload: foods }) => {
            state.isLoaded = true;
            state.errorMessage = null;
            state.foods = foods;
        })
        .addCase(searchFoods.rejected, (state, { payload: errorStatus }) => {
            state.isLoaded = true;
            state.errorMessage = getErrorMessageFromStatus(errorStatus);
            state.foods = [];
        });
});


export default reducer;
