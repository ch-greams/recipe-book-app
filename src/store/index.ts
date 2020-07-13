import { /* applyMiddleware, */ combineReducers, createStore, Store } from "redux";
//import { composeWithDevTools } from "redux-devtools-extension";
//import thunkMiddleware from "redux-thunk";
import foodReducer from "./food/reducers";


const rootReducer = combineReducers({
    foodItem: foodReducer,
});


export type AppState = ReturnType<typeof rootReducer>;

export default function configureStore(): Store {
    //const middlewares = [ thunkMiddleware ];
    //const middleWareEnhancer = applyMiddleware(...middlewares);

    const store = createStore(
        rootReducer,
        //composeWithDevTools(middleWareEnhancer),
    );

    return store;
}
