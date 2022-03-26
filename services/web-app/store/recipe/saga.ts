import type { SagaIterator } from "redux-saga";
import * as effects from "redux-saga/effects";

import type { Recipe } from "@common/typings";
import type { CustomUnit } from "@common/units";
import Utils from "@common/utils";
import RecipeApi from "@api/recipeApi";

import * as actions from "./actions";
import { extractCustomUnits } from "./reducers";
import * as types from "./types";



function* fetchRecipeItem(action: types.RecipeItemFetchRequestAction): Generator<effects.StrictEffect, void, unknown> {

    try {

        const { payload: recipeId } = action;

        const recipeItem = (yield effects.call(RecipeApi.getRecipeItem, recipeId)) as Recipe;

        yield effects.put(actions.fetchRecipeItemSuccess(recipeItem));
    }
    catch (error) {
        const { message } = error as Error;
        yield effects.put(actions.fetchRecipeItemError(message));
    }
}


function* addCustomUnit(action: types.AddCustomUnitRequestAction): Generator<effects.StrictEffect, void, unknown> {

    try {

        const { payload: customUnit } = action;

        const customUnits = (yield effects.select(extractCustomUnits)) as CustomUnit[];

        if (customUnits.some((cu) => cu.name === customUnit.name) || Utils.isEmptyString(customUnit.name)) {
            throw new Error("Custom Unit name is empty or already exist");
        }

        // TODO: API CALL

        yield effects.put(actions.addCustomUnitSuccess([
            ...customUnits,
            Utils.convertCustomUnitIntoValue(customUnit),
        ]));
    }
    catch (error) {
        const { message } = error as Error;
        yield effects.put(actions.addCustomUnitError(message));
    }
}

function* removeCustomUnit(action: types.RemoveCustomUnitRequestAction): Generator<effects.StrictEffect, void, unknown> {

    try {

        const { payload: customUnitIndex } = action;

        const customUnits = (yield effects.select(extractCustomUnits)) as CustomUnit[];

        // TODO: API CALL

        yield effects.put(actions.removeCustomUnitSuccess(
            customUnits.filter((_customUnit, index) => index !== customUnitIndex),
        ));
    }
    catch (error) {
        const { message } = error as Error;
        yield effects.put(actions.removeCustomUnitError(message));
    }
}

function* updateCustomUnit(action: types.UpdateCustomUnitRequestAction): Generator<effects.StrictEffect, void, unknown> {

    try {

        const { payload: { index: customUnitIndex, customUnit: updatedCustomUnit } } = action;

        const customUnits = (yield effects.select(extractCustomUnits)) as CustomUnit[];

        // TODO: API CALL

        yield effects.put(actions.updateCustomUnitSuccess(
            customUnits.map((customUnit, index) => (
                index === customUnitIndex
                    ? Utils.convertCustomUnitIntoValue(updatedCustomUnit)
                    : customUnit
            )),
        ));
    }
    catch (error) {
        const { message } = error as Error;
        yield effects.put(actions.updateCustomUnitError(message));
    }
}


function* watchFetchRecipeItem(): SagaIterator {
    yield effects.takeLatest(types.RECIPE_ITEM_FETCH_REQUEST, fetchRecipeItem);
}

function* watchAddCustomUnit(): SagaIterator {
    yield effects.takeLatest(types.RECIPE_ITEM_ADD_CUSTOM_UNIT_REQUEST, addCustomUnit);
}

function* watchRemoveCustomUnit(): SagaIterator {
    yield effects.takeLatest(types.RECIPE_ITEM_REMOVE_CUSTOM_UNIT_REQUEST, removeCustomUnit);
}

function* watchUpdateCustomUnit(): SagaIterator {
    yield effects.takeLatest(types.RECIPE_ITEM_UPDATE_CUSTOM_UNIT_REQUEST, updateCustomUnit);
}


export default function* recipeSaga(): Generator<effects.AllEffect<SagaIterator>, void, unknown> {
    yield effects.all([
        watchFetchRecipeItem(),
        watchAddCustomUnit(),
        watchRemoveCustomUnit(),
        watchUpdateCustomUnit(),
    ]);
}
