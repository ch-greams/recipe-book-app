import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import logger from "redux-logger";
import { configureStore } from "@reduxjs/toolkit";

import journalReducer from "./reducers/journal";
import metaReducer from "./reducers/meta";
import recipeReducer from "./reducers/recipe";
import searchReducer from "./reducers/search";
import userReducer from "./reducers/user";



export const store = configureStore({
    reducer: {
        meta: metaReducer,
        recipe: recipeReducer,
        search: searchReducer,
        user: userReducer,
        journal: journalReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
    devTools: true,
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
