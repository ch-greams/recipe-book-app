import type { IngredientProduct, ProductShort, Recipe } from "@common/typings";
import type * as units from "@common/units";

import * as types from "./types";

// -----------------------------------------------------------------------------
// Recipe
// -----------------------------------------------------------------------------

export function updateServingSizeAmount(inputValue: string): types.UpdateServingSizeAmountAction {
    return {
        type: types.RECIPE_ITEM_UPDATE_SERVING_SIZE_AMOUNT,
        payload: inputValue,
    };
}

export function updateServingSizeUnit(unit: units.WeightUnit | units.VolumeUnit): types.UpdateServingSizeUnitAction {
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


export function fetchRecipeItemNew(): types.RecipeItemFetchNewAction {
    return {
        type: types.RECIPE_ITEM_FETCH_NEW,
    };
}

export function fetchRecipeItemRequest(recipeId: number): types.RecipeItemFetchRequestAction {
    return {
        type: types.RECIPE_ITEM_FETCH_REQUEST,
        payload: recipeId,
    };
}

export function fetchRecipeItemSuccess(recipe: Recipe): types.RecipeItemFetchSuccessAction {
    return {
        type: types.RECIPE_ITEM_FETCH_SUCCESS,
        payload: recipe,
    };
}

export function fetchRecipeItemError(error: string): types.RecipeItemFetchErrorAction {
    return {
        type: types.RECIPE_ITEM_FETCH_ERROR,
        payload: error,
    };
}

export function addCustomUnitRequest(customUnit: units.CustomUnitInput): types.AddCustomUnitAction {
    return {
        type: types.RECIPE_ITEM_ADD_CUSTOM_UNIT,
        payload: customUnit,
    };
}

export function removeCustomUnitRequest(index: number): types.RemoveCustomUnitAction {
    return {
        type: types.RECIPE_ITEM_REMOVE_CUSTOM_UNIT,
        payload: index,
    };
}

export function updateCustomUnitRequest(index: number, customUnit: units.CustomUnitInput): types.UpdateCustomUnitAction {
    return {
        type: types.RECIPE_ITEM_UPDATE_CUSTOM_UNIT,
        payload: { index, customUnit },
    };
}

export function createRecipeItemRequest(): types.RecipeItemCreateRequestAction {
    return {
        type: types.RECIPE_ITEM_CREATE_REQUEST,
    };
}

export function createRecipeItemSuccess(food: Recipe): types.RecipeItemCreateSuccessAction {
    return {
        type: types.RECIPE_ITEM_CREATE_SUCCESS,
        payload: food,
    };
}

export function createRecipeItemError(error: string): types.RecipeItemCreateErrorAction {
    return {
        type: types.RECIPE_ITEM_CREATE_ERROR,
        payload: error,
    };
}

export function updateRecipeItemRequest(): types.RecipeItemUpdateRequestAction {
    return {
        type: types.RECIPE_ITEM_UPDATE_REQUEST,
    };
}

export function updateRecipeItemSuccess(food: Recipe): types.RecipeItemUpdateSuccessAction {
    return {
        type: types.RECIPE_ITEM_UPDATE_SUCCESS,
        payload: food,
    };
}

export function updateRecipeItemError(error: string): types.RecipeItemUpdateErrorAction {
    return {
        type: types.RECIPE_ITEM_UPDATE_ERROR,
        payload: error,
    };
}

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

// -----------------------------------------------------------------------------
// Directions
// -----------------------------------------------------------------------------

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

export function removeSubDirection(directionIndex: number, stepNumber: number): types.RemoveSubDirectionAction {
    return {
        type: types.RECIPE_ITEM_REMOVE_SUBDIRECTION,
        payload: { directionIndex, stepNumber },
    };
}

export function toggleSubDirectionMark(directionIndex: number, stepNumber: number): types.ToggleSubDirectionMarkAction {
    return {
        type: types.RECIPE_ITEM_TOGGLE_SUBDIRECTION_MARK,
        payload: { directionIndex, stepNumber },
    };
}

export function updateSubDirectionNote(directionIndex: number, stepNumber: number, note: string): types.UpdateSubDirectionNoteAction {
    return {
        type: types.RECIPE_ITEM_UPDATE_SUBDIRECTION_NOTE,
        payload: { directionIndex, stepNumber, note },
    };
}

export function updateSubDirectionIngredientAmount(
    directionIndex: number, stepNumber: number, inputValue: string,
): types.UpdateSubDirectionIngredientAmountAction {
    return {
        type: types.RECIPE_ITEM_UPDATE_SUBDIRECTION_INGREDIENT_AMOUNT,
        payload: { directionIndex, stepNumber, inputValue },
    };
}

export function updateSubDirectionIngredientUnit(
    directionIndex: number, stepNumber: number, unit: (units.WeightUnit | units.VolumeUnit),
): types.UpdateSubDirectionIngredientUnitAction {
    return {
        type: types.RECIPE_ITEM_UPDATE_SUBDIRECTION_INGREDIENT_UNIT,
        payload: { directionIndex, stepNumber, unit },
    };
}

export function createSubDirectionIngredient(directionIndex: number, ingredientId: number): types.CreateSubDirectionIngredientAction {
    return {
        type: types.RECIPE_ITEM_CREATE_SUBDIRECTION_INGREDIENT,
        payload: { directionIndex, ingredientId },
    };
}

export function createSubDirectionComment(directionIndex: number, type: types.SubDirectionType): types.CreateSubDirectionAction {
    return {
        type: types.RECIPE_ITEM_CREATE_SUBDIRECTION_COMMENT,
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

export function updateDirectionTemperatureUnit(directionIndex: number, unit: units.TemperatureUnit): types.UpdateDirectionTemperatureUnitAction {
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

export function updateDirectionTimeUnit(directionIndex: number, unit: units.TimeUnit): types.UpdateDirectionTimeUnitAction {
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

export function updateNewDirectionTemperatureUnit(unit: units.TemperatureUnit): types.UpdateNewDirectionTemperatureUnitAction {
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

export function updateNewDirectionTimeUnit(unit: units.TimeUnit): types.UpdateNewDirectionTimeUnitAction {
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

// -----------------------------------------------------------------------------
// Ingredients
// -----------------------------------------------------------------------------

export function removeIngredient(id: number): types.RemoveIngredientAction {
    return {
        type: types.RECIPE_ITEM_REMOVE_INGREDIENT,
        payload: id,
    };
}

export function removeIngredientProduct(parentId: number, id: number): types.RemoveIngredientProductAction {
    return {
        type: types.RECIPE_ITEM_REMOVE_INGREDIENT_PRODUCT,
        payload: { parentId, id },
    };
}

export function replaceIngredientWithAlternative(parentId: number, id: number): types.ReplaceIngredientWithAlternativeAction {
    return {
        type: types.RECIPE_ITEM_REPLACE_INGREDIENT_WITH_ALTERNATIVE,
        payload: { parentId, id },
    };
}

export function toggleIngredientOpen(id: number): types.ToggleIngredientOpenAction {
    return {
        type: types.RECIPE_ITEM_TOGGLE_INGREDIENT_OPEN,
        payload: id,
    };
}

export function toggleIngredientMark(id: number): types.ToggleIngredientMarkAction {
    return {
        type: types.RECIPE_ITEM_TOGGLE_INGREDIENT_MARK,
        payload: id,
    };
}

export function updateIngredientAmount(id: number, inputValue: string): types.UpdateIngredientAmountAction {
    return {
        type: types.RECIPE_ITEM_UPDATE_INGREDIENT_AMOUNT,
        payload: { id, inputValue },
    };
}

export function updateIngredientUnit(id: number, unit: (units.WeightUnit | units.VolumeUnit)): types.UpdateIngredientUnitAction {
    return {
        type: types.RECIPE_ITEM_UPDATE_INGREDIENT_UNIT,
        payload: { id, unit },
    };
}

export function updateIngredientProductAmount(parentId: number, id: number, inputValue: string): types.UpdateIngredientProductAmountAction {
    return {
        type: types.RECIPE_ITEM_UPDATE_INGREDIENT_PRODUCT_AMOUNT,
        payload: { parentId, id, inputValue },
    };
}

export function updateIngredientProductUnit(
    parentId: number,
    id: number,
    unit: (units.WeightUnit | units.VolumeUnit),
): types.UpdateIngredientProductUnitAction {
    return {
        type: types.RECIPE_ITEM_UPDATE_INGREDIENT_PRODUCT_UNIT,
        payload: { parentId, id, unit },
    };
}

export function updateAltNutritionFacts(parentId: number, id: number, isSelected: boolean): types.UpdateAltNutritionFactsAction {
    return {
        type: types.RECIPE_ITEM_UPDATE_ALT_NUTRITION_FACTS,
        payload: { parentId, id, isSelected },
    };
}

export function addIngredientRequest(product: ProductShort): types.AddIngredientRequestAction {
    return {
        type: types.RECIPE_ITEM_ADD_INGREDIENT_REQUEST,
        payload: product,
    };
}

export function addIngredientSuccess(product: IngredientProduct): types.AddIngredientSuccessAction {
    return {
        type: types.RECIPE_ITEM_ADD_INGREDIENT_SUCCESS,
        payload: product,
    };
}

export function addIngredientError(error: string): types.AddIngredientErrorAction {
    return {
        type: types.RECIPE_ITEM_ADD_INGREDIENT_ERROR,
        payload: error,
    };
}

export function addIngredientProductRequest(id: number, product: ProductShort): types.AddIngredientProductRequestAction {
    return {
        type: types.RECIPE_ITEM_ADD_INGREDIENT_PRODUCT_REQUEST,
        payload: { id, product },
    };
}

export function addIngredientProductSuccess(id: number, product: IngredientProduct): types.AddIngredientProductSuccessAction {
    return {
        type: types.RECIPE_ITEM_ADD_INGREDIENT_PRODUCT_SUCCESS,
        payload: { id, product },
    };
}

export function addIngredientProductError(error: string): types.AddIngredientProductErrorAction {
    return {
        type: types.RECIPE_ITEM_ADD_INGREDIENT_PRODUCT_ERROR,
        payload: error,
    };
}
