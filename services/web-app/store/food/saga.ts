import type { SagaIterator } from "redux-saga";
import type { AllEffect, StrictEffect } from "redux-saga/effects";
import { all, call, put, takeLatest } from "redux-saga/effects";
import * as effects from "redux-saga/effects";

import type { Food } from "@common/typings";
import Utils from "@common/utils";
import FoodApi from "@api/foodApi";

import * as actions from "./actions";
import { extractState } from "./reducer";
import type { FoodPageStore } from "./types";
import * as types from "./types";



function* fetchFoodItem(action: types.FoodItemFetchRequestAction): Generator<StrictEffect, void, unknown> {

    try {

        const { payload: foodId } = action;

        const foodItem = (yield call(FoodApi.getFoodItem, foodId)) as Food;

        yield put(actions.fetchFoodItemSuccess(foodItem));
    }
    catch (error) {
        const { message } = error as Error;
        yield put(actions.fetchFoodItemError(message));
    }
}

function* createFoodItem(): Generator<StrictEffect, void, unknown> {

    try {
        const foodPage = (yield effects.select(extractState)) as FoodPageStore;
        const foodItem = Utils.convertFoodPageIntoFood(foodPage);

        const createdFoodItem = (yield call(FoodApi.createFoodItem, foodItem)) as Food;

        yield put(actions.createFoodItemSuccess(createdFoodItem));
    }
    catch (error) {
        const { message } = error as Error;
        yield put(actions.createFoodItemError(message));
    }
}

function* updateFoodItem(): Generator<StrictEffect, void, unknown> {

    try {
        const foodPage = (yield effects.select(extractState)) as FoodPageStore;
        const foodItem = Utils.convertFoodPageIntoFood(foodPage);

        const updatedFoodItem = (yield call(FoodApi.updateFoodItem, foodItem)) as Food;

        yield put(actions.updateFoodItemSuccess(updatedFoodItem));
    }
    catch (error) {
        const { message } = error as Error;
        yield put(actions.updateFoodItemError(message));
    }
}

function* watchFetchFoodItem(): SagaIterator {
    yield takeLatest(types.FOOD_ITEM_FETCH_REQUEST, fetchFoodItem);
}

function* watchCreateFoodItem(): SagaIterator {
    yield takeLatest(types.FOOD_ITEM_CREATE_REQUEST, createFoodItem);
}

function* watchUpdateFoodItem(): SagaIterator {
    yield takeLatest(types.FOOD_ITEM_UPDATE_REQUEST, updateFoodItem);
}

export default function* foodSaga(): Generator<AllEffect<SagaIterator>, void, unknown> {
    yield all([
        watchFetchFoodItem(),
        watchCreateFoodItem(),
        watchUpdateFoodItem(),
    ]);
}
