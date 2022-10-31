import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import logger from "redux-logger";
import { configureStore } from "@reduxjs/toolkit";

import foodReducer from "./reducers/food";
import recipeReducer from "./reducers/recipe";
import searchReducer from "./reducers/search";
import userReducer from "./reducers/user";



export const store = configureStore({
    reducer: {
        food: foodReducer,
        recipe: recipeReducer,
        search: searchReducer,
        user: userReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
    devTools: true,
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
