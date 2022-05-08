import type { SagaIterator } from "redux-saga";
import type { AllEffect, StrictEffect } from "redux-saga/effects";
import { all, call, put, select, takeLatest } from "redux-saga/effects";

import type { Recipe } from "@common/typings";
import Utils from "@common/utils";
import RecipeApi from "@api/recipeApi";

import * as actions from "./actions";
import { extractState } from "./reducer";
import * as types from "./types";



function* fetchRecipeItem(action: types.RecipeItemFetchRequestAction): Generator<StrictEffect, void, unknown> {

    try {
        const { payload: recipeId } = action;

        const recipeItem = (yield call(RecipeApi.getRecipeItem, recipeId)) as Recipe;

        yield put(actions.fetchRecipeItemSuccess(recipeItem));
    }
    catch (error) {
        const { message } = error as Error;
        yield put(actions.fetchRecipeItemError(message));
    }
}

function* createRecipeItem(): Generator<StrictEffect, void, unknown> {

    try {
        const recipePage = (yield select(extractState)) as types.RecipePageStore;
        const recipeItem = Utils.convertRecipePageIntoRecipe(recipePage);

        const createdRecipeItem = (yield call(RecipeApi.createRecipeItem, recipeItem)) as Recipe;

        yield put(actions.createRecipeItemSuccess(createdRecipeItem));
    }
    catch (error) {
        const { message } = error as Error;
        yield put(actions.createRecipeItemError(message));
    }
}

function* updateRecipeItem(): Generator<StrictEffect, void, unknown> {

    try {
        const recipePage = (yield select(extractState)) as types.RecipePageStore;
        const recipeItem = Utils.convertRecipePageIntoRecipe(recipePage);

        const updatedRecipeItem = (yield call(RecipeApi.updateRecipeItem, recipeItem)) as Recipe;

        yield put(actions.updateRecipeItemSuccess(updatedRecipeItem));
    }
    catch (error) {
        const { message } = error as Error;
        yield put(actions.updateRecipeItemError(message));
    }
}


function* watchFetchRecipeItem(): SagaIterator {
    yield takeLatest(types.RECIPE_ITEM_FETCH_REQUEST, fetchRecipeItem);
}

function* watchCreateRecipeItem(): SagaIterator {
    yield takeLatest(types.RECIPE_ITEM_CREATE_REQUEST, createRecipeItem);
}

function* watchUpdateRecipeItem(): SagaIterator {
    yield takeLatest(types.RECIPE_ITEM_UPDATE_REQUEST, updateRecipeItem);
}


export default function* recipeSaga(): Generator<AllEffect<SagaIterator>, void, unknown> {
    yield all([
        watchFetchRecipeItem(),
        watchCreateRecipeItem(),
        watchUpdateRecipeItem(),
    ]);
}
