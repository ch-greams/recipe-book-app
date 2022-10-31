import { createReducer } from "@reduxjs/toolkit";

import { searchClear, searchProducts } from "../actions/search";
import type { SearchPageStore } from "../types/search";


const initialState: SearchPageStore = {

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
        .addCase(searchProducts.pending, (state, action) => {
            const { arg: filter } = action.meta;
            state.isLoaded = false;
            state.errorMessage = null;
            state.searchInput = filter;
            state.products = [];
        })
        .addCase(searchProducts.fulfilled, (state, action) => {
            const { payload: products } = action;
            state.isLoaded = true;
            state.errorMessage = null;
            state.products = products;
        })
        .addCase(searchProducts.rejected, (state, action) => {
            const message = action.payload?.message;
            state.isLoaded = true;
            state.errorMessage = message;
            state.products = [];
        });
});


export default reducer;
