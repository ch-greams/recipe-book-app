import { SagaIterator } from "redux-saga";
import { all, AllEffect, call, put, StrictEffect, takeLatest } from "redux-saga/effects";
import {
    INGREDIENTS_FETCH_ERROR,
    INGREDIENTS_FETCH_REQUESTED,
    INGREDIENTS_FETCH_SUCCESS,
} from "./types";
import FoodApi from "../../../api/client/foodApi";
import { Food, IngredientItem } from "../../../common/typings";



function* fetchIngredients(): Generator<StrictEffect, void, Food[]> {

    try {

        const foodItems = yield call(FoodApi.getFoodItems);

        const ingredients = foodItems.map<IngredientItem>((foodItem) => ({
            id: foodItem.id,
            name: foodItem.name,
            nutritionFacts: foodItem.nutritionFactValues,
        }));

        yield put({ type: INGREDIENTS_FETCH_SUCCESS, payload: ingredients });
    }
    catch (error) {

        yield put({ type: INGREDIENTS_FETCH_ERROR, payload: error.message });
    }
}

function* watchFetchIngredients(): SagaIterator {
    yield takeLatest(INGREDIENTS_FETCH_REQUESTED, fetchIngredients);
}


export default function* searchSaga(): Generator<AllEffect<SagaIterator>, void, unknown> {
    yield all([
        watchFetchIngredients(),
    ]);
}
