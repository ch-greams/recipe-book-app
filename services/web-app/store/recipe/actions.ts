import type { IngredientProduct, ProductShort, Recipe } from "@common/typings";
import type * as units from "@common/units";

import * as types from "./types";

// -----------------------------------------------------------------------------
// Recipe
// -----------------------------------------------------------------------------

export function setEditMode(name: boolean): types.SetEditModeAction {
    return {
        type: types.RECIPE_SET_EDIT_MODE,
        payload: name,
    };
}

export function updateServingSizeAmount(inputValue: string): types.UpdateServingSizeAmountAction {
    return {
        type: types.RECIPE_UPDATE_SERVING_SIZE_AMOUNT,
        payload: inputValue,
    };
}

export function updateServingSizeUnit(unit: units.WeightUnit | units.VolumeUnit): types.UpdateServingSizeUnitAction {
    return {
        type: types.RECIPE_UPDATE_SERVING_SIZE_UNIT,
        payload: unit,
    };
}

export function updateType(type: string): types.UpdateTypeAction {
    return {
        type: types.RECIPE_UPDATE_TYPE,
        payload: type,
    };
}


export function fetchRecipeNew(): types.RecipeFetchNewAction {
    return {
        type: types.RECIPE_FETCH_NEW,
    };
}

export function fetchRecipeRequest(recipeId: number): types.RecipeFetchRequestAction {
    return {
        type: types.RECIPE_FETCH_REQUEST,
        payload: recipeId,
    };
}

export function fetchRecipeSuccess(recipe: Recipe): types.RecipeFetchSuccessAction {
    return {
        type: types.RECIPE_FETCH_SUCCESS,
        payload: recipe,
    };
}

export function fetchRecipeError(error: string): types.RecipeFetchErrorAction {
    return {
        type: types.RECIPE_FETCH_ERROR,
        payload: error,
    };
}

export function addCustomUnitRequest(customUnit: units.CustomUnitInput): types.AddCustomUnitAction {
    return {
        type: types.RECIPE_ADD_CUSTOM_UNIT,
        payload: customUnit,
    };
}

export function removeCustomUnitRequest(index: number): types.RemoveCustomUnitAction {
    return {
        type: types.RECIPE_REMOVE_CUSTOM_UNIT,
        payload: index,
    };
}

export function updateCustomUnitRequest(index: number, customUnit: units.CustomUnitInput): types.UpdateCustomUnitAction {
    return {
        type: types.RECIPE_UPDATE_CUSTOM_UNIT,
        payload: { index, customUnit },
    };
}

export function createRecipeRequest(): types.RecipeCreateRequestAction {
    return {
        type: types.RECIPE_CREATE_REQUEST,
    };
}

export function createRecipeSuccess(food: Recipe): types.RecipeCreateSuccessAction {
    return {
        type: types.RECIPE_CREATE_SUCCESS,
        payload: food,
    };
}

export function createRecipeError(error: string): types.RecipeCreateErrorAction {
    return {
        type: types.RECIPE_CREATE_ERROR,
        payload: error,
    };
}

export function updateRecipeRequest(): types.RecipeUpdateRequestAction {
    return {
        type: types.RECIPE_UPDATE_REQUEST,
    };
}

export function updateRecipeSuccess(food: Recipe): types.RecipeUpdateSuccessAction {
    return {
        type: types.RECIPE_UPDATE_SUCCESS,
        payload: food,
    };
}

export function updateRecipeError(error: string): types.RecipeUpdateErrorAction {
    return {
        type: types.RECIPE_UPDATE_ERROR,
        payload: error,
    };
}

export function updateName(name: string): types.UpdateNameAction {
    return {
        type: types.RECIPE_UPDATE_NAME,
        payload: name,
    };
}

export function updateBrand(brand: string): types.UpdateBrandAction {
    return {
        type: types.RECIPE_UPDATE_BRAND,
        payload: brand,
    };
}

export function updateSubtitle(subtitle: string): types.UpdateSubtitleAction {
    return {
        type: types.RECIPE_UPDATE_SUBTITLE,
        payload: subtitle,
    };
}

export function updateDescription(description: string): types.UpdateDescriptionAction {
    return {
        type: types.RECIPE_UPDATE_DESCRIPTION,
        payload: description,
    };
}

// -----------------------------------------------------------------------------
// Directions
// -----------------------------------------------------------------------------

export function removeDirection(directionIndex: number): types.RemoveDirectionAction {
    return {
        type: types.RECIPE_REMOVE_DIRECTION,
        payload: directionIndex,
    };
}
export function toggleDirectionOpen(directionIndex: number): types.ToggleDirectionOpenAction {
    return {
        type: types.RECIPE_TOGGLE_DIRECTION_OPEN,
        payload: directionIndex,
    };
}
export function toggleDirectionMark(directionIndex: number): types.ToggleDirectionMarkAction {
    return {
        type: types.RECIPE_TOGGLE_DIRECTION_MARK,
        payload: directionIndex,
    };
}

export function updateDirectionStepNumber(directionIndex: number, stepNumber: number): types.UpdateDirectionStepNumberAction {
    return {
        type: types.RECIPE_UPDATE_DIRECTION_STEP_NUMBER,
        payload: { directionIndex, stepNumber },
    };
}

export function updateDirectionName(directionIndex: number, name: string): types.UpdateDirectionNameAction {
    return {
        type: types.RECIPE_UPDATE_DIRECTION_NAME,
        payload: { directionIndex, name },
    };
}

export function updateDirectionTemperatureCount(directionIndex: number, inputValue: string): types.UpdateDirectionTemperatureCountAction {
    return {
        type: types.RECIPE_UPDATE_DIRECTION_TEMPERATURE_COUNT,
        payload: { directionIndex, inputValue },
    };
}

export function updateDirectionTemperatureUnit(directionIndex: number, unit: units.TemperatureUnit): types.UpdateDirectionTemperatureUnitAction {
    return {
        type: types.RECIPE_UPDATE_DIRECTION_TEMPERATURE_UNIT,
        payload: { directionIndex, unit },
    };
}

export function updateDirectionTimeCount(directionIndex: number, inputValue: string): types.UpdateDirectionTimeCountAction {
    return {
        type: types.RECIPE_UPDATE_DIRECTION_TIME_COUNT,
        payload: { directionIndex, inputValue },
    };
}

export function updateDirectionTimeUnit(directionIndex: number, unit: units.TimeUnit): types.UpdateDirectionTimeUnitAction {
    return {
        type: types.RECIPE_UPDATE_DIRECTION_TIME_UNIT,
        payload: { directionIndex, unit },
    };
}

export function updateNewDirectionStepNumber(stepNumber: number): types.UpdateNewDirectionStepNumberAction {
    return {
        type: types.RECIPE_UPDATE_NEW_DIRECTION_STEP_NUMBER,
        payload: stepNumber,
    };
}
export function updateNewDirectionName(name: string): types.UpdateNewDirectionNameAction {
    return {
        type: types.RECIPE_UPDATE_NEW_DIRECTION_NAME,
        payload: name,
    };
}
export function updateNewDirectionTemperatureCount(inputValue: string): types.UpdateNewDirectionTemperatureCountAction {
    return {
        type: types.RECIPE_UPDATE_NEW_DIRECTION_TEMPERATURE_COUNT,
        payload: inputValue,
    };
}
export function updateNewDirectionTemperatureUnit(unit: units.TemperatureUnit): types.UpdateNewDirectionTemperatureUnitAction {
    return {
        type: types.RECIPE_UPDATE_NEW_DIRECTION_TEMPERATURE_UNIT,
        payload: unit,
    };
}
export function updateNewDirectionTimeCount(inputValue: string): types.UpdateNewDirectionTimeCountAction {
    return {
        type: types.RECIPE_UPDATE_NEW_DIRECTION_TIME_COUNT,
        payload: inputValue,
    };
}
export function updateNewDirectionTimeUnit(unit: units.TimeUnit): types.UpdateNewDirectionTimeUnitAction {
    return {
        type: types.RECIPE_UPDATE_NEW_DIRECTION_TIME_UNIT,
        payload: unit,
    };
}
export function createDirection(direction: types.RecipeDirection): types.CreateDirectionAction {
    return {
        type: types.RECIPE_CREATE_DIRECTION,
        payload: direction,
    };
}

export function removeDirectionPart(directionIndex: number, stepNumber: number): types.RemoveDirectionPartAction {
    return {
        type: types.RECIPE_REMOVE_DIRECTION_PART,
        payload: { directionIndex, stepNumber },
    };
}
export function toggleDirectionPartMark(directionIndex: number, stepNumber: number): types.ToggleDirectionPartMarkAction {
    return {
        type: types.RECIPE_TOGGLE_DIRECTION_PART_MARK,
        payload: { directionIndex, stepNumber },
    };
}
export function updateDirectionPartStepNumber(
    directionIndex: number, stepNumber: number, newStepNumber: number,
): types.UpdateDirectionPartStepNumberAction {
    return {
        type: types.RECIPE_UPDATE_DIRECTION_PART_STEP_NUMBER,
        payload: { directionIndex, stepNumber, newStepNumber },
    };
}
export function updateDirectionPartNote(directionIndex: number, stepNumber: number, note: string): types.UpdateDirectionPartNoteAction {
    return {
        type: types.RECIPE_UPDATE_DIRECTION_PART_NOTE,
        payload: { directionIndex, stepNumber, note },
    };
}
export function updateDirectionPartIngredientAmount(
    directionIndex: number, stepNumber: number, inputValue: string,
): types.UpdateDirectionPartIngredientAmountAction {
    return {
        type: types.RECIPE_UPDATE_DIRECTION_PART_INGREDIENT_AMOUNT,
        payload: { directionIndex, stepNumber, inputValue },
    };
}
export function updateDirectionPartIngredientUnit(
    directionIndex: number, stepNumber: number, unit: (units.WeightUnit | units.VolumeUnit),
): types.UpdateDirectionPartIngredientUnitAction {
    return {
        type: types.RECIPE_UPDATE_DIRECTION_PART_INGREDIENT_UNIT,
        payload: { directionIndex, stepNumber, unit },
    };
}
export function createDirectionPartIngredient(directionIndex: number, ingredientId: number): types.CreateDirectionPartIngredientAction {
    return {
        type: types.RECIPE_CREATE_DIRECTION_PART_INGREDIENT,
        payload: { directionIndex, ingredientId },
    };
}
export function createDirectionPartComment(directionIndex: number, type: types.DirectionPartType): types.CreateDirectionPartAction {
    return {
        type: types.RECIPE_CREATE_DIRECTION_PART_COMMENT,
        payload: { directionIndex, type },
    };
}

// -----------------------------------------------------------------------------
// Ingredients
// -----------------------------------------------------------------------------

export function removeIngredient(id: number): types.RemoveIngredientAction {
    return {
        type: types.RECIPE_REMOVE_INGREDIENT,
        payload: id,
    };
}

export function removeIngredientProduct(parentId: number, id: number): types.RemoveIngredientProductAction {
    return {
        type: types.RECIPE_REMOVE_INGREDIENT_PRODUCT,
        payload: { parentId, id },
    };
}

export function replaceIngredientWithAlternative(parentId: number, id: number): types.ReplaceIngredientWithAlternativeAction {
    return {
        type: types.RECIPE_REPLACE_INGREDIENT_WITH_ALTERNATIVE,
        payload: { parentId, id },
    };
}

export function toggleIngredientOpen(id: number): types.ToggleIngredientOpenAction {
    return {
        type: types.RECIPE_TOGGLE_INGREDIENT_OPEN,
        payload: id,
    };
}

export function toggleIngredientMark(id: number): types.ToggleIngredientMarkAction {
    return {
        type: types.RECIPE_TOGGLE_INGREDIENT_MARK,
        payload: id,
    };
}

export function updateIngredientProductAmount(parentId: number, id: number, inputValue: string): types.UpdateIngredientProductAmountAction {
    return {
        type: types.RECIPE_UPDATE_INGREDIENT_PRODUCT_AMOUNT,
        payload: { parentId, id, inputValue },
    };
}

export function updateIngredientProductUnit(
    parentId: number,
    id: number,
    unit: (units.WeightUnit | units.VolumeUnit),
): types.UpdateIngredientProductUnitAction {
    return {
        type: types.RECIPE_UPDATE_INGREDIENT_PRODUCT_UNIT,
        payload: { parentId, id, unit },
    };
}

export function updateAltNutritionFacts(parentId: number, id: number, isSelected: boolean): types.UpdateAltNutritionFactsAction {
    return {
        type: types.RECIPE_UPDATE_ALT_NUTRITION_FACTS,
        payload: { parentId, id, isSelected },
    };
}

export function addIngredientRequest(product: ProductShort): types.AddIngredientRequestAction {
    return {
        type: types.RECIPE_ADD_INGREDIENT_REQUEST,
        payload: product,
    };
}

export function addIngredientSuccess(product: IngredientProduct): types.AddIngredientSuccessAction {
    return {
        type: types.RECIPE_ADD_INGREDIENT_SUCCESS,
        payload: product,
    };
}

export function addIngredientError(error: string): types.AddIngredientErrorAction {
    return {
        type: types.RECIPE_ADD_INGREDIENT_ERROR,
        payload: error,
    };
}

export function addIngredientProductRequest(id: number, product: ProductShort): types.AddIngredientProductRequestAction {
    return {
        type: types.RECIPE_ADD_INGREDIENT_PRODUCT_REQUEST,
        payload: { id, product },
    };
}

export function addIngredientProductSuccess(id: number, product: IngredientProduct): types.AddIngredientProductSuccessAction {
    return {
        type: types.RECIPE_ADD_INGREDIENT_PRODUCT_SUCCESS,
        payload: { id, product },
    };
}

export function addIngredientProductError(error: string): types.AddIngredientProductErrorAction {
    return {
        type: types.RECIPE_ADD_INGREDIENT_PRODUCT_ERROR,
        payload: error,
    };
}
