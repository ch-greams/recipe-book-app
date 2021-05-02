import { SagaIterator } from "redux-saga";
import { all, AllEffect, call, put, StrictEffect, takeLatest } from "redux-saga/effects";

import { Food } from "@common/typings";
import FoodApi from "@api/client/foodApi";

import {
    FOOD_ITEM_FETCH_ERROR,
    FOOD_ITEM_FETCH_REQUEST,
    FOOD_ITEM_FETCH_SUCCESS,
    FoodItemFetchRequestAction,
} from "./types";



function* fetchFoodItem(action: FoodItemFetchRequestAction): Generator<StrictEffect, void, Food> {

    try {

        const { payload: foodId } = action;

        const foodItem = yield call(FoodApi.getFoodItem, foodId);

        yield put({ type: FOOD_ITEM_FETCH_SUCCESS, payload: foodItem });
    }
    catch (error) {

        yield put({ type: FOOD_ITEM_FETCH_ERROR, payload: error.message });
    }
}

function* watchFetchFoodItem(): SagaIterator {
    yield takeLatest(FOOD_ITEM_FETCH_REQUEST, fetchFoodItem);
}


export default function* foodSaga(): Generator<AllEffect<SagaIterator>, void, unknown> {
    yield all([
        watchFetchFoodItem(),
    ]);
}
