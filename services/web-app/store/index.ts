import { useMemo } from "react";
import type { AnyAction, Store } from "redux";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { createLogger } from "redux-logger";
import createSagaMiddleware from "redux-saga";

import foodPageReducer from "./food/reducer";
import recipePageReducer from "./recipe/reducer";
import searchPageReducer from "./search/reducer";
import userReducer from "./user/reducer";
import rootSaga from "./rootSaga";



const rootReducer = combineReducers({
    foodPage: foodPageReducer,
    recipePage: recipePageReducer,
    searchPage: searchPageReducer,
    user: userReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

function initializeStore(initialState: AppState): Store {

    const sagaMiddleware = createSagaMiddleware();

    const middlewares = [
        createLogger(),
        sagaMiddleware,
    ];
    const middleWareEnhancer = applyMiddleware(...middlewares);

    const store = createStore(
        rootReducer,
        initialState,
        composeWithDevTools(middleWareEnhancer),
    );

    sagaMiddleware.run(rootSaga);

    return store;
}


export function useStore(initialState: AppState): Store {
    return useMemo<Store<AppState, AnyAction>>(() => initializeStore(initialState), [ initialState ]);
}
