import { createAsyncThunk } from "@reduxjs/toolkit";

import type { HttpStatus } from "@common/http";
import { isSuccess } from "@common/http";
import type { NutrientMeta } from "@common/typings";
import MetaApi from "@api/metaApi";


export const fetchNutrients = createAsyncThunk<NutrientMeta[], void, { rejectValue: HttpStatus }>(
    "meta/fetch_nutrients",
    async (_arg, { rejectWithValue }) => {
        const { status, body } = await MetaApi.getNutrients();
        return isSuccess(status, body) ? body : rejectWithValue(status);
    },
);
