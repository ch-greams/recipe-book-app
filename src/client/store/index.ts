import { applyMiddleware, combineReducers, createStore, Store } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { createLogger } from "redux-logger";
import createSagaMiddleware from "redux-saga";

import foodPageReducer from "./food/reducers";
import recipePageReducer from "./recipe/reducers";
import searchPageReducer from "./search/reducers";
import rootSaga from "./rootSaga";



const rootReducer = combineReducers({
    foodPage: foodPageReducer,
    recipePage: recipePageReducer,
    searchPage: searchPageReducer,
});

export type AppState = ReturnType<typeof rootReducer>;

export default function configureStore(): Store {

    const sagaMiddleware = createSagaMiddleware();

    const middlewares = [
        createLogger(),
        sagaMiddleware,
    ];
    const middleWareEnhancer = applyMiddleware(...middlewares);

    const store = createStore(
        rootReducer,
        composeWithDevTools(middleWareEnhancer),
    );

    sagaMiddleware.run(rootSaga);

    return store;
}
