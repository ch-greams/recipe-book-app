import type { SagaIterator } from "redux-saga";
import type { AllEffect, StrictEffect } from "redux-saga/effects";
import { all, call, put, takeLatest } from "redux-saga/effects";

import type { ProductShort } from "@common/typings";
import ProductApi from "@api/productApi";

import type { SearchProductsFetchRequestedAction } from "./types";
import {
    SEARCH_PRODUCTS_FETCH_ERROR,
    SEARCH_PRODUCTS_FETCH_REQUEST,
    SEARCH_PRODUCTS_FETCH_SUCCESS,
} from "./types";



function* fetchProducts(action: SearchProductsFetchRequestedAction): Generator<StrictEffect, void, ProductShort[]> {

    try {
        const { payload: filter } = action;

        const productItems = yield call(ProductApi.getProducts, filter);

        yield put({ type: SEARCH_PRODUCTS_FETCH_SUCCESS, payload: productItems });
    }
    catch (error) {
        const { message } = error as Error;
        yield put({ type: SEARCH_PRODUCTS_FETCH_ERROR, payload: message });
    }
}

function* watchFetchIngredients(): SagaIterator {
    yield takeLatest(SEARCH_PRODUCTS_FETCH_REQUEST, fetchProducts);
}


export default function* searchSaga(): Generator<AllEffect<SagaIterator>, void, unknown> {
    yield all([
        watchFetchIngredients(),
    ]);
}
