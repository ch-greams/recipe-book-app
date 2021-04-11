import { IngredientItem } from "@common/typings";
import { CustomUnitInput,TemperatureUnit, TimeUnit, VolumeUnit, WeightUnit } from "@common/units";

import {
    AddAltIngredientAction,
    AddIngredientAction,
    CreateDirectionAction,
    CreateSubDirectionAction,
    CreateSubDirectionIngredientAction,
    RECIPE_ITEM_ADD_ALT_INGREDIENT,
    RECIPE_ITEM_ADD_INGREDIENT,
    RECIPE_ITEM_CREATE_DIRECTION,
    RECIPE_ITEM_CREATE_SUBDIRECTION,
    RECIPE_ITEM_CREATE_SUBDIRECTION_INGREDIENT,
    RECIPE_ITEM_FETCH_REQUESTED,
    RECIPE_ITEM_REMOVE_ALT_INGREDIENT,
    RECIPE_ITEM_REMOVE_DIRECTION,
    RECIPE_ITEM_REMOVE_INGREDIENT,
    RECIPE_ITEM_REMOVE_SUBDIRECTION,
    RECIPE_ITEM_REPLACE_INGREDIENT_WITH_ALTERNATIVE,
    RECIPE_ITEM_TOGGLE_DIRECTION_MARK,
    RECIPE_ITEM_TOGGLE_DIRECTION_OPEN,
    RECIPE_ITEM_TOGGLE_INGREDIENT_MARK,
    RECIPE_ITEM_TOGGLE_INGREDIENT_OPEN,
    RECIPE_ITEM_TOGGLE_SUBDIRECTION_MARK,
    RECIPE_ITEM_UPDATE_ALT_INGREDIENT_AMOUNT,
    RECIPE_ITEM_UPDATE_ALT_INGREDIENT_UNIT,
    RECIPE_ITEM_UPDATE_ALT_NUTRITION_FACTS,
    RECIPE_ITEM_UPDATE_BRAND,
    RECIPE_ITEM_UPDATE_CUSTOM_UNITS,
    RECIPE_ITEM_UPDATE_DESCRIPTION,
    RECIPE_ITEM_UPDATE_DIRECTION_NAME,
    RECIPE_ITEM_UPDATE_DIRECTION_STEP_NUMBER,
    RECIPE_ITEM_UPDATE_DIRECTION_TEMPERATURE_COUNT,
    RECIPE_ITEM_UPDATE_DIRECTION_TEMPERATURE_UNIT,
    RECIPE_ITEM_UPDATE_DIRECTION_TIME_COUNT,
    RECIPE_ITEM_UPDATE_DIRECTION_TIME_UNIT,
    RECIPE_ITEM_UPDATE_INGREDIENT_AMOUNT,
    RECIPE_ITEM_UPDATE_INGREDIENT_UNIT,
    RECIPE_ITEM_UPDATE_NAME,
    RECIPE_ITEM_UPDATE_NEW_DIRECTION_NAME,
    RECIPE_ITEM_UPDATE_NEW_DIRECTION_STEP_NUMBER,
    RECIPE_ITEM_UPDATE_NEW_DIRECTION_TEMPERATURE_COUNT,
    RECIPE_ITEM_UPDATE_NEW_DIRECTION_TEMPERATURE_UNIT,
    RECIPE_ITEM_UPDATE_NEW_DIRECTION_TIME_COUNT,
    RECIPE_ITEM_UPDATE_NEW_DIRECTION_TIME_UNIT,
    RECIPE_ITEM_UPDATE_NEW_SUBDIRECTION_TYPE,
    RECIPE_ITEM_UPDATE_SERVING_SIZE_AMOUNT,
    RECIPE_ITEM_UPDATE_SERVING_SIZE_UNIT,
    RECIPE_ITEM_UPDATE_SUBDIRECTION_INGREDIENT_AMOUNT,
    RECIPE_ITEM_UPDATE_SUBDIRECTION_INGREDIENT_UNIT,
    RECIPE_ITEM_UPDATE_SUBDIRECTION_NOTE,
    RECIPE_ITEM_UPDATE_SUBTITLE,
    RECIPE_ITEM_UPDATE_TYPE,
    RecipeDirection,
    RecipeItemFetchRequestedAction,
    RemoveAltIngredientAction,
    RemoveDirectionAction,
    RemoveIngredientAction,
    RemoveSubDirectionAction,
    ReplaceIngredientWithAlternativeAction,
    SubDirectionType,
    ToggleDirectionMarkAction,
    ToggleDirectionOpenAction,
    ToggleIngredientMarkAction,
    ToggleIngredientOpenAction,
    ToggleSubDirectionMarkAction,
    UpdateAltIngredientAmountAction,
    UpdateAltIngredientUnitAction,
    UpdateAltNutritionFactsAction,
    UpdateBrandAction,
    UpdateCustomUnitsAction,
    UpdateDescriptionAction,
    UpdateDirectionNameAction,
    UpdateDirectionStepNumberAction,
    UpdateDirectionTemperatureCountAction,
    UpdateDirectionTemperatureUnitAction,
    UpdateDirectionTimeCountAction,
    UpdateDirectionTimeUnitAction,
    UpdateIngredientAmountAction,
    UpdateIngredientUnitAction,
    UpdateNameAction,
    UpdateNewDirectionNameAction,
    UpdateNewDirectionStepNumberAction,
    UpdateNewDirectionTemperatureCountAction,
    UpdateNewDirectionTemperatureUnitAction,
    UpdateNewDirectionTimeCountAction,
    UpdateNewDirectionTimeUnitAction,
    UpdateNewSubDirectionTypeAction,
    UpdateServingSizeAmountAction,
    UpdateServingSizeUnitAction,
    UpdateSubDirectionIngredientAmountAction,
    UpdateSubDirectionIngredientUnitAction,
    UpdateSubDirectionNoteAction,
    UpdateSubtitleAction,
    UpdateTypeAction,
} from "./types";



export function updateName(name: string): UpdateNameAction {
    return {
        type: RECIPE_ITEM_UPDATE_NAME,
        payload: name,
    };
}

export function updateBrand(brand: string): UpdateBrandAction {
    return {
        type: RECIPE_ITEM_UPDATE_BRAND,
        payload: brand,
    };
}

export function updateSubtitle(subtitle: string): UpdateSubtitleAction {
    return {
        type: RECIPE_ITEM_UPDATE_SUBTITLE,
        payload: subtitle,
    };
}

export function updateDescription(description: string): UpdateDescriptionAction {
    return {
        type: RECIPE_ITEM_UPDATE_DESCRIPTION,
        payload: description,
    };
}

export function removeDirection(directionIndex: number): RemoveDirectionAction {
    return {
        type: RECIPE_ITEM_REMOVE_DIRECTION,
        payload: directionIndex,
    };
}

export function toggleDirectionOpen(directionIndex: number): ToggleDirectionOpenAction {
    return {
        type: RECIPE_ITEM_TOGGLE_DIRECTION_OPEN,
        payload: directionIndex,
    };
}

export function toggleDirectionMark(directionIndex: number): ToggleDirectionMarkAction {
    return {
        type: RECIPE_ITEM_TOGGLE_DIRECTION_MARK,
        payload: directionIndex,
    };
}

export function removeSubDirection(directionIndex: number, subDirectionIndex: number): RemoveSubDirectionAction {
    return {
        type: RECIPE_ITEM_REMOVE_SUBDIRECTION,
        payload: { directionIndex, subDirectionIndex },
    };
}

export function toggleSubDirectionMark(directionIndex: number, subDirectionIndex: number): ToggleSubDirectionMarkAction {
    return {
        type: RECIPE_ITEM_TOGGLE_SUBDIRECTION_MARK,
        payload: { directionIndex, subDirectionIndex },
    };
}

export function updateSubDirectionNote(directionIndex: number, subDirectionIndex: number, note: string): UpdateSubDirectionNoteAction {
    return {
        type: RECIPE_ITEM_UPDATE_SUBDIRECTION_NOTE,
        payload: { directionIndex, subDirectionIndex, note },
    };
}

export function updateSubDirectionIngredientAmount(
    directionIndex: number, subDirectionIndex: number, inputValue: string,
): UpdateSubDirectionIngredientAmountAction {
    return {
        type: RECIPE_ITEM_UPDATE_SUBDIRECTION_INGREDIENT_AMOUNT,
        payload: { directionIndex, subDirectionIndex, inputValue },
    };
}

export function updateSubDirectionIngredientUnit(
    directionIndex: number, subDirectionIndex: number, unit: (WeightUnit | VolumeUnit),
): UpdateSubDirectionIngredientUnitAction {
    return {
        type: RECIPE_ITEM_UPDATE_SUBDIRECTION_INGREDIENT_UNIT,
        payload: { directionIndex, subDirectionIndex, unit },
    };
}

export function createSubDirectionIngredient(directionIndex: number, ingredientId: string): CreateSubDirectionIngredientAction {
    return {
        type: RECIPE_ITEM_CREATE_SUBDIRECTION_INGREDIENT,
        payload: { directionIndex, ingredientId },
    };
}

export function createSubDirection(directionIndex: number, type: SubDirectionType): CreateSubDirectionAction {
    return {
        type: RECIPE_ITEM_CREATE_SUBDIRECTION,
        payload: { directionIndex, type },
    };
}

export function updateNewSubDirectionType(directionIndex: number, type: SubDirectionType): UpdateNewSubDirectionTypeAction {
    return {
        type: RECIPE_ITEM_UPDATE_NEW_SUBDIRECTION_TYPE,
        payload: { directionIndex, type },
    };
}

export function updateDirectionStepNumber(directionIndex: number, stepNumber: number): UpdateDirectionStepNumberAction {
    return {
        type: RECIPE_ITEM_UPDATE_DIRECTION_STEP_NUMBER,
        payload: { directionIndex, stepNumber },
    };
}

export function updateDirectionName(directionIndex: number, name: string): UpdateDirectionNameAction {
    return {
        type: RECIPE_ITEM_UPDATE_DIRECTION_NAME,
        payload: { directionIndex, name },
    };
}

export function updateDirectionTemperatureCount(directionIndex: number, inputValue: string): UpdateDirectionTemperatureCountAction {
    return {
        type: RECIPE_ITEM_UPDATE_DIRECTION_TEMPERATURE_COUNT,
        payload: { directionIndex, inputValue },
    };
}

export function updateDirectionTemperatureUnit(directionIndex: number, unit: TemperatureUnit): UpdateDirectionTemperatureUnitAction {
    return {
        type: RECIPE_ITEM_UPDATE_DIRECTION_TEMPERATURE_UNIT,
        payload: { directionIndex, unit },
    };
}

export function updateDirectionTimeCount(directionIndex: number, inputValue: string): UpdateDirectionTimeCountAction {
    return {
        type: RECIPE_ITEM_UPDATE_DIRECTION_TIME_COUNT,
        payload: { directionIndex, inputValue },
    };
}

export function updateDirectionTimeUnit(directionIndex: number, unit: TimeUnit): UpdateDirectionTimeUnitAction {
    return {
        type: RECIPE_ITEM_UPDATE_DIRECTION_TIME_UNIT,
        payload: { directionIndex, unit },
    };
}

export function updateNewDirectionStepNumber(stepNumber: number): UpdateNewDirectionStepNumberAction {
    return {
        type: RECIPE_ITEM_UPDATE_NEW_DIRECTION_STEP_NUMBER,
        payload: stepNumber,
    };
}

export function updateNewDirectionName(name: string): UpdateNewDirectionNameAction {
    return {
        type: RECIPE_ITEM_UPDATE_NEW_DIRECTION_NAME,
        payload: name,
    };
}

export function updateNewDirectionTemperatureCount(inputValue: string): UpdateNewDirectionTemperatureCountAction {
    return {
        type: RECIPE_ITEM_UPDATE_NEW_DIRECTION_TEMPERATURE_COUNT,
        payload: inputValue,
    };
}

export function updateNewDirectionTemperatureUnit(unit: TemperatureUnit): UpdateNewDirectionTemperatureUnitAction {
    return {
        type: RECIPE_ITEM_UPDATE_NEW_DIRECTION_TEMPERATURE_UNIT,
        payload: unit,
    };
}

export function updateNewDirectionTimeCount(inputValue: string): UpdateNewDirectionTimeCountAction {
    return {
        type: RECIPE_ITEM_UPDATE_NEW_DIRECTION_TIME_COUNT,
        payload: inputValue,
    };
}

export function updateNewDirectionTimeUnit(unit: TimeUnit): UpdateNewDirectionTimeUnitAction {
    return {
        type: RECIPE_ITEM_UPDATE_NEW_DIRECTION_TIME_UNIT,
        payload: unit,
    };
}

export function createDirection(direction: RecipeDirection): CreateDirectionAction {
    return {
        type: RECIPE_ITEM_CREATE_DIRECTION,
        payload: direction,
    };
}

export function removeIngredient(id: string): RemoveIngredientAction {
    return {
        type: RECIPE_ITEM_REMOVE_INGREDIENT,
        payload: id,
    };
}

export function removeAltIngredient(parentId: string, id: string): RemoveAltIngredientAction {
    return {
        type: RECIPE_ITEM_REMOVE_ALT_INGREDIENT,
        payload: { parentId, id },
    };
}

export function replaceIngredientWithAlternative(parentId: string, id: string): ReplaceIngredientWithAlternativeAction {
    return {
        type: RECIPE_ITEM_REPLACE_INGREDIENT_WITH_ALTERNATIVE,
        payload: { parentId, id },
    };
}

export function toggleIngredientOpen(id: string): ToggleIngredientOpenAction {
    return {
        type: RECIPE_ITEM_TOGGLE_INGREDIENT_OPEN,
        payload: id,
    };
}

export function toggleIngredientMark(id: string): ToggleIngredientMarkAction {
    return {
        type: RECIPE_ITEM_TOGGLE_INGREDIENT_MARK,
        payload: id,
    };
}

export function updateIngredientAmount(id: string, inputValue: string): UpdateIngredientAmountAction {
    return {
        type: RECIPE_ITEM_UPDATE_INGREDIENT_AMOUNT,
        payload: { id, inputValue },
    };
}

export function updateIngredientUnit(id: string, unit: (WeightUnit | VolumeUnit)): UpdateIngredientUnitAction {
    return {
        type: RECIPE_ITEM_UPDATE_INGREDIENT_UNIT,
        payload: { id, unit },
    };
}

export function updateAltIngredientAmount(parentId: string, id: string, inputValue: string): UpdateAltIngredientAmountAction {
    return {
        type: RECIPE_ITEM_UPDATE_ALT_INGREDIENT_AMOUNT,
        payload: { parentId, id, inputValue },
    };
}

export function updateAltIngredientUnit(parentId: string, id: string, unit: (WeightUnit | VolumeUnit)): UpdateAltIngredientUnitAction {
    return {
        type: RECIPE_ITEM_UPDATE_ALT_INGREDIENT_UNIT,
        payload: { parentId, id, unit },
    };
}

export function updateAltNutritionFacts(parentId: string, id: string, isSelected: boolean): UpdateAltNutritionFactsAction {
    return {
        type: RECIPE_ITEM_UPDATE_ALT_NUTRITION_FACTS,
        payload: { parentId, id, isSelected },
    };
}

export function addIngredient(ingredient: IngredientItem): AddIngredientAction {
    return {
        type: RECIPE_ITEM_ADD_INGREDIENT,
        payload: ingredient,
    };
}

export function addAltIngredient(id: string, altIngredient: IngredientItem): AddAltIngredientAction {
    return {
        type: RECIPE_ITEM_ADD_ALT_INGREDIENT,
        payload: { id, altIngredient },
    };
}

export function updateServingSizeAmount(inputValue: string): UpdateServingSizeAmountAction {
    return {
        type: RECIPE_ITEM_UPDATE_SERVING_SIZE_AMOUNT,
        payload: inputValue,
    };
}

export function updateServingSizeUnit(unit: WeightUnit | VolumeUnit): UpdateServingSizeUnitAction {
    return {
        type: RECIPE_ITEM_UPDATE_SERVING_SIZE_UNIT,
        payload: unit,
    };
}

export function updateType(type: string): UpdateTypeAction {
    return {
        type: RECIPE_ITEM_UPDATE_TYPE,
        payload: type,
    };
}

export function updateCustomUnits(customUnits: CustomUnitInput[]): UpdateCustomUnitsAction {
    return {
        type: RECIPE_ITEM_UPDATE_CUSTOM_UNITS,
        payload: customUnits,
    };
}

export function requestRecipeItem(recipeId: string): RecipeItemFetchRequestedAction {
    return {
        type: RECIPE_ITEM_FETCH_REQUESTED,
        payload: recipeId,
    };
}
