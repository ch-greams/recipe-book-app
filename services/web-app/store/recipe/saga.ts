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


function* fetchRecipe(action: types.RecipeFetchRequestAction): Generator<StrictEffect, void, unknown> {

    try {
        const { payload: recipeId } = action;

        const recipe = (yield call(RecipeApi.getRecipe, recipeId)) as Recipe;

        yield put(actions.fetchRecipeSuccess(recipe));
    }
    catch (error) {
        const { message } = error as Error;
        yield put(actions.fetchRecipeError(message));
    }
}

function* createRecipe(): Generator<StrictEffect, void, unknown> {

    try {
        const recipePage = (yield select(extractState)) as types.RecipePageStore;
        const recipe = Utils.convertRecipePageIntoRecipe(recipePage);

        const createdRecipe = (yield call(RecipeApi.createRecipe, recipe)) as Recipe;

        yield put(actions.createRecipeSuccess(createdRecipe));
    }
    catch (error) {
        const { message } = error as Error;
        yield put(actions.createRecipeError(message));
    }
}

function* updateRecipe(): Generator<StrictEffect, void, unknown> {

    try {
        const recipePage = (yield select(extractState)) as types.RecipePageStore;
        const recipe = Utils.convertRecipePageIntoRecipe(recipePage);

        const updatedRecipe = (yield call(RecipeApi.updateRecipe, recipe)) as Recipe;

        yield put(actions.updateRecipeSuccess(updatedRecipe));
    }
    catch (error) {
        const { message } = error as Error;
        yield put(actions.updateRecipeError(message));
    }
}

function* addIngredient(action: types.AddIngredientRequestAction): Generator<StrictEffect, void, unknown> {

    try {
        const { payload: product } = action;

        let ingredientProduct: IngredientProduct;

        if (product.product_type === ProductType.Food) {
            const food = (yield call(FoodApi.getFood, product.id)) as Food;
            ingredientProduct = Utils.convertFoodToIngredientProduct(food);
        }
        else {
            const recipe = (yield call(RecipeApi.getRecipe, product.id)) as Recipe;
            ingredientProduct = Utils.convertRecipeToIngredientProduct(recipe);
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
            const food = (yield call(FoodApi.getFood, product.id)) as Food;
            ingredientProduct = Utils.convertFoodToIngredientProduct(food);
        }
        else {
            const recipe = (yield call(RecipeApi.getRecipe, product.id)) as Recipe;
            ingredientProduct = Utils.convertRecipeToIngredientProduct(recipe);
        }

        yield put(actions.addIngredientProductSuccess(id, ingredientProduct));
    }
    catch (error) {
        const { message } = error as Error;
        yield put(actions.addIngredientProductError(message));
    }
}

function* watchFetchRecipe(): SagaIterator {
    yield takeLatest(types.RECIPE_FETCH_REQUEST, fetchRecipe);
}

function* watchCreateRecipe(): SagaIterator {
    yield takeLatest(types.RECIPE_CREATE_REQUEST, createRecipe);
}

function* watchUpdateRecipe(): SagaIterator {
    yield takeLatest(types.RECIPE_UPDATE_REQUEST, updateRecipe);
}

function* watchAddIngredient(): SagaIterator {
    yield takeLatest(types.RECIPE_ADD_INGREDIENT_REQUEST, addIngredient);
}

function* watchAddIngredientProduct(): SagaIterator {
    yield takeLatest(types.RECIPE_ADD_INGREDIENT_PRODUCT_REQUEST, addIngredientProduct);
}


export default function* recipeSaga(): Generator<AllEffect<SagaIterator>, void, unknown> {
    yield all([
        watchFetchRecipe(),
        watchCreateRecipe(),
        watchUpdateRecipe(),
        watchAddIngredient(),
        watchAddIngredientProduct(),
    ]);
}
