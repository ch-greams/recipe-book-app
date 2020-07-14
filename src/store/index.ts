import { applyMiddleware, combineReducers, createStore, Store } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunkMiddleware from "redux-thunk";
import userSettingsReducer from "./userSettings/reducers";
import foodItemReducer from "./food/reducers";


const rootReducer = combineReducers({
    userSettings: userSettingsReducer,
    foodItem: foodItemReducer,
});


export type AppState = ReturnType<typeof rootReducer>;

export default function configureStore(): Store {

    const middlewares = [ thunkMiddleware ];
    const middleWareEnhancer = applyMiddleware(...middlewares);

    return createStore(
        rootReducer,
        composeWithDevTools(middleWareEnhancer),
    );
}
