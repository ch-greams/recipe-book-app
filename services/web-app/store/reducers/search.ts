import { createReducer } from "@reduxjs/toolkit";

import { getErrorMessageFromStatus } from "@common/http";

import { searchClear, searchProducts } from "../actions/search";
import type { SearchStore } from "../types/search";


const initialState: SearchStore = {

    isLoaded: true,
    errorMessage: null,

    searchInput: "",
    products: [],
};

const reducer = createReducer(initialState, (builder) => {
    builder
        .addCase(searchClear, (state) => {
            state.isLoaded = true;
            state.errorMessage = null;
            state.searchInput = "";
            state.products = [];
        })
        .addCase(searchProducts.pending, (state, { meta: { arg: filter } }) => {
            state.isLoaded = false;
            state.errorMessage = null;
            state.searchInput = filter;
            state.products = [];
        })
        .addCase(searchProducts.fulfilled, (state, { payload: products }) => {
            state.isLoaded = true;
            state.errorMessage = null;
            state.products = products;
        })
        .addCase(searchProducts.rejected, (state, { payload: errorStatus }) => {
            state.isLoaded = true;
            state.errorMessage = getErrorMessageFromStatus(errorStatus);
            state.products = [];
        });
});


export default reducer;
