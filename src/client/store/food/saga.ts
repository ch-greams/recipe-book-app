import { SagaIterator } from "redux-saga";
import { all, AllEffect, call, put, StrictEffect, takeLatest } from "redux-saga/effects";
import { FoodItemFetchRequestedAction, FOOD_ITEM_FETCH_ERROR, FOOD_ITEM_FETCH_REQUESTED, FOOD_ITEM_FETCH_STARTED, FOOD_ITEM_FETCH_SUCCESS } from "./types";
import superagent from "superagent";
// import Api from "...";


function* fetchFoodItem(action: FoodItemFetchRequestedAction): Generator<StrictEffect, void, superagent.Response> {

    try {

        const { payload: foodId } = action;

        yield put({ type: FOOD_ITEM_FETCH_STARTED });

        const response = yield call(
            superagent.get, `/api/food/${foodId}`
        );

        yield put({ type: FOOD_ITEM_FETCH_SUCCESS, payload: response.body });
    }
    catch (error) {

        yield put({ type: FOOD_ITEM_FETCH_ERROR, payload: error.message });
    }
}

function* watchFetchFoodItem(): SagaIterator {
    yield takeLatest(FOOD_ITEM_FETCH_REQUESTED, fetchFoodItem);
}


export default function* foodSaga(): Generator<AllEffect<SagaIterator>, void, unknown> {
    yield all([
        watchFetchFoodItem(),
    ]);
}
