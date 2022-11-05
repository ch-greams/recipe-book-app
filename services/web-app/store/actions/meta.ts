import { createAsyncThunk } from "@reduxjs/toolkit";

import type { NutrientMeta } from "@common/typings";
import MetaApi from "@api/metaApi";


export const fetchNutrients = createAsyncThunk<NutrientMeta[], void, { rejectValue: Error }>(
    "meta/fetch_nutrients",
    async (_arg, { rejectWithValue }) => {
        try {
            const nutrients = await MetaApi.getNutrients();
            return nutrients;
        }
        catch (error) {
            return rejectWithValue(error as Error);
        }
    },
);
