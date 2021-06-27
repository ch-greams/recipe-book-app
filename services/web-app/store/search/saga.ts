import type { SagaIterator } from "redux-saga";
import type { AllEffect, StrictEffect } from "redux-saga/effects";
import { all, call, put, takeLatest } from "redux-saga/effects";

import type { Food, IngredientItem } from "@common/typings";
import FoodApi from "@api/foodApi";

import {
    INGREDIENTS_FETCH_ERROR,
    INGREDIENTS_FETCH_REQUEST,
    INGREDIENTS_FETCH_SUCCESS,
} from "./types";



function* fetchIngredients(): Generator<StrictEffect, void, Food[]> {

    try {

        const foodItems = yield call(FoodApi.getFoodItems);

        const ingredients = foodItems.map<IngredientItem>((foodItem) => ({
            id: foodItem.id,
            name: foodItem.name,
            nutritionFacts: foodItem.nutritionFacts,
        }));

        yield put({ type: INGREDIENTS_FETCH_SUCCESS, payload: ingredients });
    }
    catch (error) {

        yield put({ type: INGREDIENTS_FETCH_ERROR, payload: error.message });
    }
}

function* watchFetchIngredients(): SagaIterator {
    yield takeLatest(INGREDIENTS_FETCH_REQUEST, fetchIngredients);
}


export default function* searchSaga(): Generator<AllEffect<SagaIterator>, void, unknown> {
    yield all([
        watchFetchIngredients(),
    ]);
}
