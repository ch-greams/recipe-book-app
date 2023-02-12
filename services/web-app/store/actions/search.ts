import { createAction, createAsyncThunk } from "@reduxjs/toolkit";

import { HttpError } from "@common/http";
import type { FoodShort } from "@common/typings";
import ProductApi from "@api/productApi";

import type { AsyncThunkConfig } from ".";


export const searchClear = createAction("search/search_clear");

export const searchProducts = createAsyncThunk<FoodShort[], string, AsyncThunkConfig>(
    "search/search_products",
    async (filter, { rejectWithValue }) => {
        try {
            const products = await ProductApi.getProducts(filter);
            return products;
        }
        catch (error) {
            return rejectWithValue(HttpError.getStatus(error));
        }
    },
);
