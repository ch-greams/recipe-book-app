import type { SagaIterator } from "redux-saga";
import type { AllEffect, StrictEffect } from "redux-saga/effects";
import { all, call, put, takeLatest } from "redux-saga/effects";

import type { Food, IngredientProduct } from "@common/typings";
import { WeightUnit } from "@common/units";
import FoodApi from "@api/foodApi";

import {
    INGREDIENTS_FETCH_ERROR,
    INGREDIENTS_FETCH_REQUEST,
    INGREDIENTS_FETCH_SUCCESS,
} from "./types";



function* fetchIngredients(): Generator<StrictEffect, void, Food[]> {

    try {

        const foodItems = yield call(FoodApi.getFoodItems);

        const ingredients = foodItems.map<IngredientProduct>((foodItem) => ({
            product_id: foodItem.id,
            product_type: "food",
            name: foodItem.name,
            amount: 100,
            unit: WeightUnit.g,
            nutrition_facts: foodItem.nutrition_facts,
        }));

        yield put({ type: INGREDIENTS_FETCH_SUCCESS, payload: ingredients });
    }
    catch (error) {
        const { message } = error as Error;
        yield put({ type: INGREDIENTS_FETCH_ERROR, payload: message });
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
