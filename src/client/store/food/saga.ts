import { SagaIterator } from "redux-saga";
import { all, AllEffect, call, put, StrictEffect, takeLatest } from "redux-saga/effects";
import {
    FoodItemFetchRequestedAction,
    FOOD_ITEM_FETCH_ERROR,
    FOOD_ITEM_FETCH_REQUESTED,
    FOOD_ITEM_FETCH_SUCCESS,
} from "./types";
import FoodApi from "../../../api/client/foodApi";
import { Food } from "../../../common/typings";



function* fetchFoodItem(action: FoodItemFetchRequestedAction): Generator<StrictEffect, void, Food> {

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
    yield takeLatest(FOOD_ITEM_FETCH_REQUESTED, fetchFoodItem);
}


export default function* foodSaga(): Generator<AllEffect<SagaIterator>, void, unknown> {
    yield all([
        watchFetchFoodItem(),
    ]);
}
