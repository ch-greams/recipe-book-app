import { UnitWeight, UnitVolume, UnitTemperature, UnitTime } from "../../../common/units";
import {
    CreateSubDirectionAction,
    CreateSubDirectionIngredientAction,
    Direction,
    IngredientDefault,
    RECIPE_ITEM_CREATE_SUBDIRECTION,
    RECIPE_ITEM_CREATE_SUBDIRECTION_INGREDIENT,
    RECIPE_ITEM_REMOVE_DIRECTION,
    RECIPE_ITEM_REMOVE_SUBDIRECTION,
    RECIPE_ITEM_TOGGLE_DIRECTION_MARK,
    RECIPE_ITEM_TOGGLE_DIRECTION_OPEN,
    RECIPE_ITEM_TOGGLE_SUBDIRECTION_MARK,
    RECIPE_ITEM_UPDATE_BRAND,
    RECIPE_ITEM_UPDATE_DESCRIPTION,
    RECIPE_ITEM_UPDATE_DIRECTION_NAME,
    RECIPE_ITEM_UPDATE_DIRECTION_STEP_NUMBER,
    RECIPE_ITEM_UPDATE_DIRECTION_TEMPERATURE_COUNT,
    RECIPE_ITEM_UPDATE_DIRECTION_TEMPERATURE_UNIT,
    RECIPE_ITEM_UPDATE_DIRECTION_TIME_COUNT,
    RECIPE_ITEM_UPDATE_DIRECTION_TIME_UNIT,
    RECIPE_ITEM_UPDATE_NEW_DIRECTION_NAME,
    RECIPE_ITEM_UPDATE_NEW_DIRECTION_STEP_NUMBER,
    RECIPE_ITEM_UPDATE_NEW_DIRECTION_TEMPERATURE_COUNT,
    RECIPE_ITEM_UPDATE_NEW_DIRECTION_TEMPERATURE_UNIT,
    RECIPE_ITEM_UPDATE_NEW_DIRECTION_TIME_COUNT,
    RECIPE_ITEM_UPDATE_NEW_DIRECTION_TIME_UNIT,
    RECIPE_ITEM_UPDATE_INGREDIENTS,
    RECIPE_ITEM_UPDATE_NAME,
    RECIPE_ITEM_UPDATE_NEW_SUBDIRECTION_TYPE,
    RECIPE_ITEM_UPDATE_SUBDIRECTION_INGREDIENT_AMOUNT,
    RECIPE_ITEM_UPDATE_SUBDIRECTION_INGREDIENT_UNIT,
    RECIPE_ITEM_UPDATE_SUBDIRECTION_NOTE,
    RECIPE_ITEM_UPDATE_SUBTITLE,
    RemoveDirectionAction,
    RemoveSubDirectionAction,
    SubDirectionType,
    ToggleDirectionMarkAction,
    ToggleDirectionOpenAction,
    ToggleSubDirectionMarkAction,
    UpdateBrandAction,
    UpdateDescriptionAction,
    UpdateDirectionNameAction,
    UpdateDirectionStepNumberAction,
    UpdateDirectionTemperatureCountAction,
    UpdateDirectionTemperatureUnitAction,
    UpdateDirectionTimeCountAction,
    UpdateDirectionTimeUnitAction,
    UpdateNewDirectionNameAction,
    UpdateNewDirectionStepNumberAction,
    UpdateNewDirectionTemperatureCountAction,
    UpdateNewDirectionTemperatureUnitAction,
    UpdateNewDirectionTimeCountAction,
    UpdateNewDirectionTimeUnitAction,
    UpdateIngredientsAction,
    UpdateNameAction,
    UpdateNewSubDirectionTypeAction,
    UpdateSubDirectionIngredientAmountAction,
    UpdateSubDirectionIngredientUnitAction,
    UpdateSubDirectionNoteAction,
    UpdateSubtitleAction,
    CreateDirectionAction,
    RECIPE_ITEM_CREATE_DIRECTION,
    RemoveIngredientAction,
    RECIPE_ITEM_REMOVE_INGREDIENT,
    RemoveAltIngredientAction,
    RECIPE_ITEM_REMOVE_ALT_INGREDIENT,
    RECIPE_ITEM_REPLACE_INGREDIENT_WITH_ALTERNATIVE,
    ReplaceIngredientWithAlternativeAction,
    ToggleIngredientOpenAction,
    RECIPE_ITEM_TOGGLE_INGREDIENT_OPEN,
    RECIPE_ITEM_TOGGLE_INGREDIENT_MARK,
    ToggleIngredientMarkAction,
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

export function updateIngredients(ingredients: IngredientDefault[]): UpdateIngredientsAction {
    return {
        type: RECIPE_ITEM_UPDATE_INGREDIENTS,
        payload: ingredients,
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
    directionIndex: number, subDirectionIndex: number, unit: (UnitWeight | UnitVolume),
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

export function updateDirectionTemperatureUnit(directionIndex: number, unit: UnitTemperature): UpdateDirectionTemperatureUnitAction {
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

export function updateDirectionTimeUnit(directionIndex: number, unit: UnitTime): UpdateDirectionTimeUnitAction {
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

export function updateNewDirectionTemperatureUnit(unit: UnitTemperature): UpdateNewDirectionTemperatureUnitAction {
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

export function updateNewDirectionTimeUnit(unit: UnitTime): UpdateNewDirectionTimeUnitAction {
    return {
        type: RECIPE_ITEM_UPDATE_NEW_DIRECTION_TIME_UNIT,
        payload: unit,
    };
}

export function createDirection(direction: Direction): CreateDirectionAction {
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
