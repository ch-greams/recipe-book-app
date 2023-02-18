import { createAction, createAsyncThunk } from "@reduxjs/toolkit";

import { HttpError } from "@common/http";
import type { FoodShort } from "@common/typings";
import FoodApi from "@api/foodApi";

import type { AsyncThunkConfig } from ".";


export const searchClear = createAction("search/search_clear");

export const searchFoods = createAsyncThunk<FoodShort[], string, AsyncThunkConfig>(
    "search/search_foods",
    async (filter, { rejectWithValue }) => {
        try {
            const foods = await FoodApi.getFoodShorts(filter);
            return foods;
        }
        catch (error) {
            return rejectWithValue(HttpError.getStatus(error));
        }
    },
);
