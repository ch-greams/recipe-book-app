import { SagaIterator } from "redux-saga";
import { fork } from "redux-saga/effects";
import foodSaga from "./food/saga";
import searchSaga from "./search/saga";


export default function* rootSaga(): SagaIterator {
    yield fork(foodSaga);
    yield fork(searchSaga);
}
