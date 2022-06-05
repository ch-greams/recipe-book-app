import type { SagaIterator } from "redux-saga";
import type { AllEffect, StrictEffect } from "redux-saga/effects";
import { all, call, put, select, takeLatest } from "redux-saga/effects";

import type { Food, IngredientProduct, Recipe } from "@common/typings";
import Utils, { ProductType } from "@common/utils";
import FoodApi from "@api/foodApi";
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

function* addIngredient(action: types.AddIngredientRequestAction): Generator<StrictEffect, void, unknown> {

    try {
        const { payload: product } = action;

        let ingredientProduct: IngredientProduct;

        if (product.product_type === ProductType.Food) {
            const foodItem = (yield call(FoodApi.getFoodItem, product.id)) as Food;
            ingredientProduct = Utils.convertFoodToIngredientProduct(foodItem);
        }
        else {
            const recipeItem = (yield call(RecipeApi.getRecipeItem, product.id)) as Recipe;
            ingredientProduct = Utils.convertRecipeToIngredientProduct(recipeItem);
        }

        yield put(actions.addIngredientSuccess(ingredientProduct));
    }
    catch (error) {
        const { message } = error as Error;
        yield put(actions.addIngredientError(message));
    }
}

function* addIngredientProduct(action: types.AddIngredientProductRequestAction): Generator<StrictEffect, void, unknown> {

    try {
        const { payload: { id, product } } = action;

        let ingredientProduct: IngredientProduct;

        if (product.product_type === ProductType.Food) {
            const foodItem = (yield call(FoodApi.getFoodItem, product.id)) as Food;
            ingredientProduct = Utils.convertFoodToIngredientProduct(foodItem);
        }
        else {
            const recipeItem = (yield call(RecipeApi.getRecipeItem, product.id)) as Recipe;
            ingredientProduct = Utils.convertRecipeToIngredientProduct(recipeItem);
        }

        yield put(actions.addIngredientProductSuccess(id, ingredientProduct));
    }
    catch (error) {
        const { message } = error as Error;
        yield put(actions.addIngredientProductError(message));
    }
}

function* watchFetchRecipeItem(): SagaIterator {
    yield takeLatest(types.RECIPE_FETCH_REQUEST, fetchRecipeItem);
}

function* watchCreateRecipeItem(): SagaIterator {
    yield takeLatest(types.RECIPE_CREATE_REQUEST, createRecipeItem);
}

function* watchUpdateRecipeItem(): SagaIterator {
    yield takeLatest(types.RECIPE_UPDATE_REQUEST, updateRecipeItem);
}

function* watchAddIngredient(): SagaIterator {
    yield takeLatest(types.RECIPE_ADD_INGREDIENT_REQUEST, addIngredient);
}

function* watchAddIngredientProduct(): SagaIterator {
    yield takeLatest(types.RECIPE_ADD_INGREDIENT_PRODUCT_REQUEST, addIngredientProduct);
}


export default function* recipeSaga(): Generator<AllEffect<SagaIterator>, void, unknown> {
    yield all([
        watchFetchRecipeItem(),
        watchCreateRecipeItem(),
        watchUpdateRecipeItem(),
        watchAddIngredient(),
        watchAddIngredientProduct(),
    ]);
}
