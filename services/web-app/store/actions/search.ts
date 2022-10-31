import { createAction, createAsyncThunk } from "@reduxjs/toolkit";

import type { ProductShort } from "@common/typings";
import ProductApi from "@api/productApi";


export const searchClear = createAction("search/search_clear");

export const searchProducts = createAsyncThunk<ProductShort[], string, { rejectValue: Error }>(
    "search/search_products",
    async (filter, thunkApi) => {
        try {
            const products = await ProductApi.getProducts(filter);
            return products;
        }
        catch (error) {
            return thunkApi.rejectWithValue(error as Error);
        }
    },
);
