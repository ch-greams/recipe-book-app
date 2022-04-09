import type { SagaIterator } from "redux-saga";
import type { AllEffect, StrictEffect } from "redux-saga/effects";
import { all, call, put, select, takeLatest } from "redux-saga/effects";

import type { Food } from "@common/typings";
import type { CustomUnit } from "@common/units";
import Utils from "@common/utils";
import FoodApi from "@api/foodApi";

import * as actions from "./actions";
import { extractCustomUnits } from "./reducer";
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

function* addCustomUnit(action: types.AddCustomUnitRequestAction): Generator<StrictEffect, void, unknown> {

    try {

        const { payload: customUnit } = action;

        const customUnits = (yield select(extractCustomUnits)) as CustomUnit[];

        if (customUnits.some((cu) => cu.name === customUnit.name) || Utils.isEmptyString(customUnit.name)) {
            throw new Error("Custom Unit name is empty or already exist");
        }

        // TODO: API CALL

        yield put(actions.addCustomUnitSuccess([
            ...customUnits,
            Utils.convertCustomUnitIntoValue(customUnit),
        ]));
    }
    catch (error) {
        const { message } = error as Error;
        yield put(actions.addCustomUnitError(message));
    }
}

function* removeCustomUnit(action: types.RemoveCustomUnitRequestAction): Generator<StrictEffect, void, unknown> {

    try {

        const { payload: customUnitIndex } = action;

        const customUnits = (yield select(extractCustomUnits)) as CustomUnit[];

        // TODO: API CALL

        yield put(actions.removeCustomUnitSuccess(
            customUnits.filter((_customUnit, index) => index !== customUnitIndex),
        ));
    }
    catch (error) {
        const { message } = error as Error;
        yield put(actions.removeCustomUnitError(message));
    }
}

function* updateCustomUnit(action: types.UpdateCustomUnitRequestAction): Generator<StrictEffect, void, unknown> {

    try {

        const { payload: { index: customUnitIndex, customUnit: updatedCustomUnit } } = action;

        const customUnits = (yield select(extractCustomUnits)) as CustomUnit[];

        // TODO: API CALL

        yield put(actions.updateCustomUnitSuccess(
            customUnits.map((customUnit, index) => (
                index === customUnitIndex
                    ? Utils.convertCustomUnitIntoValue(updatedCustomUnit)
                    : customUnit
            )),
        ));
    }
    catch (error) {
        const { message } = error as Error;
        yield put(actions.updateCustomUnitError(message));
    }
}


function* watchFetchFoodItem(): SagaIterator {
    yield takeLatest(types.FOOD_ITEM_FETCH_REQUEST, fetchFoodItem);
}

function* watchAddCustomUnit(): SagaIterator {
    yield takeLatest(types.FOOD_ITEM_ADD_CUSTOM_UNIT_REQUEST, addCustomUnit);
}

function* watchRemoveCustomUnit(): SagaIterator {
    yield takeLatest(types.FOOD_ITEM_REMOVE_CUSTOM_UNIT_REQUEST, removeCustomUnit);
}

function* watchUpdateCustomUnit(): SagaIterator {
    yield takeLatest(types.FOOD_ITEM_UPDATE_CUSTOM_UNIT_REQUEST, updateCustomUnit);
}


export default function* foodSaga(): Generator<AllEffect<SagaIterator>, void, unknown> {
    yield all([
        watchFetchFoodItem(),
        watchAddCustomUnit(),
        watchRemoveCustomUnit(),
        watchUpdateCustomUnit(),
    ]);
}
