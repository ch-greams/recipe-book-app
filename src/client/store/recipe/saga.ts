import { SagaIterator } from "redux-saga";
import { all, AllEffect, call, put, StrictEffect, takeLatest } from "redux-saga/effects";
import {
    RecipeItemFetchRequestedAction,
    RECIPE_ITEM_FETCH_ERROR,
    RECIPE_ITEM_FETCH_REQUESTED,
    RECIPE_ITEM_FETCH_SUCCESS,
} from "./types";
import RecipeApi from "../../../api/client/recipeApi";
import { Recipe } from "../../../common/typings";



function* fetchRecipeItem(action: RecipeItemFetchRequestedAction): Generator<StrictEffect, void, Recipe> {

    try {

        const { payload: recipeId } = action;

        const recipeItem = yield call(RecipeApi.getRecipeItem, recipeId);

        yield put({ type: RECIPE_ITEM_FETCH_SUCCESS, payload: recipeItem });
    }
    catch (error) {

        yield put({ type: RECIPE_ITEM_FETCH_ERROR, payload: error.message });
    }
}

function* watchFetchRecipeItem(): SagaIterator {
    yield takeLatest(RECIPE_ITEM_FETCH_REQUESTED, fetchRecipeItem);
}


export default function* recipeSaga(): Generator<AllEffect<SagaIterator>, void, unknown> {
    yield all([
        watchFetchRecipeItem(),
    ]);
}
