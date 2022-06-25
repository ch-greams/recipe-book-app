import type { SagaIterator } from "redux-saga";
import type { AllEffect, StrictEffect } from "redux-saga/effects";
import { all, call, put, select, takeLatest } from "redux-saga/effects";

import type { Food } from "@common/typings";
import Utils from "@common/utils";
import FoodApi from "@api/foodApi";

import * as actions from "./actions";
import { extractState } from "./reducer";
import type { FoodPageStore } from "./types";
import * as types from "./types";



function* fetchFood(action: types.FoodFetchRequestAction): Generator<StrictEffect, void, unknown> {

    try {

        const { payload: foodId } = action;

        const food = (yield call(FoodApi.getFood, foodId)) as Food;

        yield put(actions.fetchFoodSuccess(food));
    }
    catch (error) {
        const { message } = error as Error;
        yield put(actions.fetchFoodError(message));
    }
}

function* createFood(): Generator<StrictEffect, void, unknown> {

    try {
        const foodPage = (yield select(extractState)) as FoodPageStore;
        const food = Utils.convertFoodPageIntoFood(foodPage);

        const createdFood = (yield call(FoodApi.createFood, food)) as Food;

        yield put(actions.createFoodSuccess(createdFood));
    }
    catch (error) {
        const { message } = error as Error;
        yield put(actions.createFoodError(message));
    }
}

function* updateFood(): Generator<StrictEffect, void, unknown> {

    try {
        const foodPage = (yield select(extractState)) as FoodPageStore;
        const food = Utils.convertFoodPageIntoFood(foodPage);

        const updatedFood = (yield call(FoodApi.updateFood, food)) as Food;

        yield put(actions.updateFoodSuccess(updatedFood));
    }
    catch (error) {
        const { message } = error as Error;
        yield put(actions.updateFoodError(message));
    }
}

function* watchFetchFood(): SagaIterator {
    yield takeLatest(types.FOOD_FETCH_REQUEST, fetchFood);
}

function* watchCreateFood(): SagaIterator {
    yield takeLatest(types.FOOD_CREATE_REQUEST, createFood);
}

function* watchUpdateFood(): SagaIterator {
    yield takeLatest(types.FOOD_UPDATE_REQUEST, updateFood);
}

export default function* foodSaga(): Generator<AllEffect<SagaIterator>, void, unknown> {
    yield all([
        watchFetchFood(),
        watchCreateFood(),
        watchUpdateFood(),
    ]);
}
