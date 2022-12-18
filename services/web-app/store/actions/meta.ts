import { createAsyncThunk } from "@reduxjs/toolkit";

import { HttpError } from "@common/http";
import type { NutrientMeta } from "@common/typings";
import MetaApi from "@api/metaApi";

import type { AsyncThunkConfig } from ".";


export const fetchNutrients = createAsyncThunk<NutrientMeta[], void, AsyncThunkConfig>(
    "meta/fetch_nutrients",
    async (_arg, { rejectWithValue }) => {
        try {
            const nutrients = await MetaApi.getNutrients();
            return nutrients;
        }
        catch (error) {
            return rejectWithValue(HttpError.getStatus(error));
        }
    },
);
