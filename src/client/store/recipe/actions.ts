import { IngredientItem } from "@common/typings";
import { CustomUnitInput, TemperatureUnit, TimeUnit, VolumeUnit, WeightUnit } from "@common/units";

import * as types from "./types";



export function updateName(name: string): types.UpdateNameAction {
    return {
        type: types.RECIPE_ITEM_UPDATE_NAME,
        payload: name,
    };
}

export function updateBrand(brand: string): types.UpdateBrandAction {
    return {
        type: types.RECIPE_ITEM_UPDATE_BRAND,
        payload: brand,
    };
}

export function updateSubtitle(subtitle: string): types.UpdateSubtitleAction {
    return {
        type: types.RECIPE_ITEM_UPDATE_SUBTITLE,
        payload: subtitle,
    };
}

export function updateDescription(description: string): types.UpdateDescriptionAction {
    return {
        type: types.RECIPE_ITEM_UPDATE_DESCRIPTION,
        payload: description,
    };
}

export function removeDirection(directionIndex: number): types.RemoveDirectionAction {
    return {
        type: types.RECIPE_ITEM_REMOVE_DIRECTION,
        payload: directionIndex,
    };
}

export function toggleDirectionOpen(directionIndex: number): types.ToggleDirectionOpenAction {
    return {
        type: types.RECIPE_ITEM_TOGGLE_DIRECTION_OPEN,
        payload: directionIndex,
    };
}

export function toggleDirectionMark(directionIndex: number): types.ToggleDirectionMarkAction {
    return {
        type: types.RECIPE_ITEM_TOGGLE_DIRECTION_MARK,
        payload: directionIndex,
    };
}

export function removeSubDirection(directionIndex: number, subDirectionIndex: number): types.RemoveSubDirectionAction {
    return {
        type: types.RECIPE_ITEM_REMOVE_SUBDIRECTION,
        payload: { directionIndex, subDirectionIndex },
    };
}

export function toggleSubDirectionMark(directionIndex: number, subDirectionIndex: number): types.ToggleSubDirectionMarkAction {
    return {
        type: types.RECIPE_ITEM_TOGGLE_SUBDIRECTION_MARK,
        payload: { directionIndex, subDirectionIndex },
    };
}

export function updateSubDirectionNote(directionIndex: number, subDirectionIndex: number, note: string): types.UpdateSubDirectionNoteAction {
    return {
        type: types.RECIPE_ITEM_UPDATE_SUBDIRECTION_NOTE,
        payload: { directionIndex, subDirectionIndex, note },
    };
}

export function updateSubDirectionIngredientAmount(
    directionIndex: number, subDirectionIndex: number, inputValue: string,
): types.UpdateSubDirectionIngredientAmountAction {
    return {
        type: types.RECIPE_ITEM_UPDATE_SUBDIRECTION_INGREDIENT_AMOUNT,
        payload: { directionIndex, subDirectionIndex, inputValue },
    };
}

export function updateSubDirectionIngredientUnit(
    directionIndex: number, subDirectionIndex: number, unit: (WeightUnit | VolumeUnit),
): types.UpdateSubDirectionIngredientUnitAction {
    return {
        type: types.RECIPE_ITEM_UPDATE_SUBDIRECTION_INGREDIENT_UNIT,
        payload: { directionIndex, subDirectionIndex, unit },
    };
}

export function createSubDirectionIngredient(directionIndex: number, ingredientId: string): types.CreateSubDirectionIngredientAction {
    return {
        type: types.RECIPE_ITEM_CREATE_SUBDIRECTION_INGREDIENT,
        payload: { directionIndex, ingredientId },
    };
}

export function createSubDirection(directionIndex: number, type: types.SubDirectionType): types.CreateSubDirectionAction {
    return {
        type: types.RECIPE_ITEM_CREATE_SUBDIRECTION,
        payload: { directionIndex, type },
    };
}

export function updateNewSubDirectionType(directionIndex: number, type: types.SubDirectionType): types.UpdateNewSubDirectionTypeAction {
    return {
        type: types.RECIPE_ITEM_UPDATE_NEW_SUBDIRECTION_TYPE,
        payload: { directionIndex, type },
    };
}

export function updateDirectionStepNumber(directionIndex: number, stepNumber: number): types.UpdateDirectionStepNumberAction {
    return {
        type: types.RECIPE_ITEM_UPDATE_DIRECTION_STEP_NUMBER,
        payload: { directionIndex, stepNumber },
    };
}

export function updateDirectionName(directionIndex: number, name: string): types.UpdateDirectionNameAction {
    return {
        type: types.RECIPE_ITEM_UPDATE_DIRECTION_NAME,
        payload: { directionIndex, name },
    };
}

export function updateDirectionTemperatureCount(directionIndex: number, inputValue: string): types.UpdateDirectionTemperatureCountAction {
    return {
        type: types.RECIPE_ITEM_UPDATE_DIRECTION_TEMPERATURE_COUNT,
        payload: { directionIndex, inputValue },
    };
}

export function updateDirectionTemperatureUnit(directionIndex: number, unit: TemperatureUnit): types.UpdateDirectionTemperatureUnitAction {
    return {
        type: types.RECIPE_ITEM_UPDATE_DIRECTION_TEMPERATURE_UNIT,
        payload: { directionIndex, unit },
    };
}

export function updateDirectionTimeCount(directionIndex: number, inputValue: string): types.UpdateDirectionTimeCountAction {
    return {
        type: types.RECIPE_ITEM_UPDATE_DIRECTION_TIME_COUNT,
        payload: { directionIndex, inputValue },
    };
}

export function updateDirectionTimeUnit(directionIndex: number, unit: TimeUnit): types.UpdateDirectionTimeUnitAction {
    return {
        type: types.RECIPE_ITEM_UPDATE_DIRECTION_TIME_UNIT,
        payload: { directionIndex, unit },
    };
}

export function updateNewDirectionStepNumber(stepNumber: number): types.UpdateNewDirectionStepNumberAction {
    return {
        type: types.RECIPE_ITEM_UPDATE_NEW_DIRECTION_STEP_NUMBER,
        payload: stepNumber,
    };
}

export function updateNewDirectionName(name: string): types.UpdateNewDirectionNameAction {
    return {
        type: types.RECIPE_ITEM_UPDATE_NEW_DIRECTION_NAME,
        payload: name,
    };
}

export function updateNewDirectionTemperatureCount(inputValue: string): types.UpdateNewDirectionTemperatureCountAction {
    return {
        type: types.RECIPE_ITEM_UPDATE_NEW_DIRECTION_TEMPERATURE_COUNT,
        payload: inputValue,
    };
}

export function updateNewDirectionTemperatureUnit(unit: TemperatureUnit): types.UpdateNewDirectionTemperatureUnitAction {
    return {
        type: types.RECIPE_ITEM_UPDATE_NEW_DIRECTION_TEMPERATURE_UNIT,
        payload: unit,
    };
}

export function updateNewDirectionTimeCount(inputValue: string): types.UpdateNewDirectionTimeCountAction {
    return {
        type: types.RECIPE_ITEM_UPDATE_NEW_DIRECTION_TIME_COUNT,
        payload: inputValue,
    };
}

export function updateNewDirectionTimeUnit(unit: TimeUnit): types.UpdateNewDirectionTimeUnitAction {
    return {
        type: types.RECIPE_ITEM_UPDATE_NEW_DIRECTION_TIME_UNIT,
        payload: unit,
    };
}

export function createDirection(direction: types.RecipeDirection): types.CreateDirectionAction {
    return {
        type: types.RECIPE_ITEM_CREATE_DIRECTION,
        payload: direction,
    };
}

export function removeIngredient(id: string): types.RemoveIngredientAction {
    return {
        type: types.RECIPE_ITEM_REMOVE_INGREDIENT,
        payload: id,
    };
}

export function removeAltIngredient(parentId: string, id: string): types.RemoveAltIngredientAction {
    return {
        type: types.RECIPE_ITEM_REMOVE_ALT_INGREDIENT,
        payload: { parentId, id },
    };
}

export function replaceIngredientWithAlternative(parentId: string, id: string): types.ReplaceIngredientWithAlternativeAction {
    return {
        type: types.RECIPE_ITEM_REPLACE_INGREDIENT_WITH_ALTERNATIVE,
        payload: { parentId, id },
    };
}

export function toggleIngredientOpen(id: string): types.ToggleIngredientOpenAction {
    return {
        type: types.RECIPE_ITEM_TOGGLE_INGREDIENT_OPEN,
        payload: id,
    };
}

export function toggleIngredientMark(id: string): types.ToggleIngredientMarkAction {
    return {
        type: types.RECIPE_ITEM_TOGGLE_INGREDIENT_MARK,
        payload: id,
    };
}

export function updateIngredientAmount(id: string, inputValue: string): types.UpdateIngredientAmountAction {
    return {
        type: types.RECIPE_ITEM_UPDATE_INGREDIENT_AMOUNT,
        payload: { id, inputValue },
    };
}

export function updateIngredientUnit(id: string, unit: (WeightUnit | VolumeUnit)): types.UpdateIngredientUnitAction {
    return {
        type: types.RECIPE_ITEM_UPDATE_INGREDIENT_UNIT,
        payload: { id, unit },
    };
}

export function updateAltIngredientAmount(parentId: string, id: string, inputValue: string): types.UpdateAltIngredientAmountAction {
    return {
        type: types.RECIPE_ITEM_UPDATE_ALT_INGREDIENT_AMOUNT,
        payload: { parentId, id, inputValue },
    };
}

export function updateAltIngredientUnit(parentId: string, id: string, unit: (WeightUnit | VolumeUnit)): types.UpdateAltIngredientUnitAction {
    return {
        type: types.RECIPE_ITEM_UPDATE_ALT_INGREDIENT_UNIT,
        payload: { parentId, id, unit },
    };
}

export function updateAltNutritionFacts(parentId: string, id: string, isSelected: boolean): types.UpdateAltNutritionFactsAction {
    return {
        type: types.RECIPE_ITEM_UPDATE_ALT_NUTRITION_FACTS,
        payload: { parentId, id, isSelected },
    };
}

export function addIngredient(ingredient: IngredientItem): types.AddIngredientAction {
    return {
        type: types.RECIPE_ITEM_ADD_INGREDIENT,
        payload: ingredient,
    };
}

export function addAltIngredient(id: string, altIngredient: IngredientItem): types.AddAltIngredientAction {
    return {
        type: types.RECIPE_ITEM_ADD_ALT_INGREDIENT,
        payload: { id, altIngredient },
    };
}

export function updateServingSizeAmount(inputValue: string): types.UpdateServingSizeAmountAction {
    return {
        type: types.RECIPE_ITEM_UPDATE_SERVING_SIZE_AMOUNT,
        payload: inputValue,
    };
}

export function updateServingSizeUnit(unit: WeightUnit | VolumeUnit): types.UpdateServingSizeUnitAction {
    return {
        type: types.RECIPE_ITEM_UPDATE_SERVING_SIZE_UNIT,
        payload: unit,
    };
}

export function updateType(type: string): types.UpdateTypeAction {
    return {
        type: types.RECIPE_ITEM_UPDATE_TYPE,
        payload: type,
    };
}

export function updateCustomUnits(customUnits: CustomUnitInput[]): types.UpdateCustomUnitsAction {
    return {
        type: types.RECIPE_ITEM_UPDATE_CUSTOM_UNITS,
        payload: customUnits,
    };
}

export function requestRecipeItem(recipeId: string): types.RecipeItemFetchRequestedAction {
    return {
        type: types.RECIPE_ITEM_FETCH_REQUEST,
        payload: recipeId,
    };
}
