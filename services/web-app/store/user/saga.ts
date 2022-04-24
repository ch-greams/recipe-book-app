import type { SagaIterator } from "redux-saga";
import type { AllEffect, StrictEffect } from "redux-saga/effects";
import { all, call, put, takeLatest } from "redux-saga/effects";

import type { FoodShort, RecipeShort } from "@common/typings";
import FoodApi from "@api/foodApi";
import RecipeApi from "@api/recipeApi";

import type { UserFoodsFetchSuccessAction, UserRecipesFetchSuccessAction } from "./types";
import {
    USER_FOODS_FETCH_ERROR,
    USER_FOODS_FETCH_REQUEST,
    USER_FOODS_FETCH_SUCCESS,
    USER_RECIPES_FETCH_ERROR,
    USER_RECIPES_FETCH_REQUEST,
    USER_RECIPES_FETCH_SUCCESS,
} from "./types";



function* fetchRecipes(): Generator<StrictEffect, void, RecipeShort[]> {

    try {
        const favoriteRecipeItems = yield call(RecipeApi.getFavoriteRecipeItems);
        const customRecipeItems = yield call(RecipeApi.getCustomRecipeItems);

        const payload: UserRecipesFetchSuccessAction = {
            type: USER_RECIPES_FETCH_SUCCESS,
            payload: {
                favoriteRecipes: favoriteRecipeItems,
                customRecipes: customRecipeItems,
            },
        };

        yield put(payload);
    }
    catch (error) {
        const { message } = error as Error;
        yield put({ type: USER_RECIPES_FETCH_ERROR, payload: message });
    }
}

function* fetchFoods(): Generator<StrictEffect, void, FoodShort[]> {

    try {
        const favoriteFoodItems = yield call(FoodApi.getFavoriteFoodItems);
        const customFoodItems = yield call(FoodApi.getCustomFoodItems);

        const payload: UserFoodsFetchSuccessAction = {
            type: USER_FOODS_FETCH_SUCCESS,
            payload: {
                favoriteFoods: favoriteFoodItems,
                customFoods: customFoodItems,
            },
        };

        yield put(payload);
    }
    catch (error) {
        const { message } = error as Error;
        yield put({ type: USER_FOODS_FETCH_ERROR, payload: message });
    }
}

function* watchFetchRecipes(): SagaIterator {
    yield takeLatest(USER_RECIPES_FETCH_REQUEST, fetchRecipes);
}

function* watchFetchFoods(): SagaIterator {
    yield takeLatest(USER_FOODS_FETCH_REQUEST, fetchFoods);
}


export default function* searchSaga(): Generator<AllEffect<SagaIterator>, void, unknown> {
    yield all([
        watchFetchRecipes(),
        watchFetchFoods(),
    ]);
}