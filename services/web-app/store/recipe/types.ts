import type { NutritionFactType } from "@common/nutritionFacts";
import type * as typings from "@common/typings";
import type * as units from "@common/units";



export interface RecipeIngredientProduct extends typings.IngredientProduct {
    amountInput: string;
}

export interface RecipeIngredient extends typings.Ingredient {
    isOpen: boolean;
    isMarked: boolean;
    products: Dictionary<number, RecipeIngredientProduct>;
    altNutritionFacts: Dictionary<NutritionFactType, number>;
}


export enum SubDirectionType {
    Tip = "tip",
    Note = "note",
    Warning = "warning",
    Ingredient = "ingredient",
}

export interface RecipeSubDirectionIngredient extends typings.SubDirectionIngredient {
    isMarked: boolean;
    amountInput: string;
}

export interface RecipeDirection extends typings.Direction {
    isOpen: boolean;
    isMarked: boolean;
    durationInput: string;
    temperatureInput: string;
    steps: (typings.SubDirection | RecipeSubDirectionIngredient)[];
}


export interface RecipePageStore {
    isLoaded: boolean;
    errorMessage?: Option<string>;
    isReadOnly: boolean;

    id: number;
    name: string;
    brand: string;
    subtitle: string;
    description: string;
    type: string;
    nutritionFacts: Dictionary<NutritionFactType, number>;
    customUnits: units.CustomUnit[];

    // NOTE: INPUTS
    customUnitInputs: units.CustomUnitInput[];

    servingSize: number;
    servingSizeInput: string;
    servingSizeUnit: units.WeightUnit | units.VolumeUnit;

    ingredients: RecipeIngredient[];

    newDirection: RecipeDirection;
    directions: RecipeDirection[];
}



export const RECIPE_ITEM_UPDATE_NAME = "RECIPE_ITEM_UPDATE_NAME";
export const RECIPE_ITEM_UPDATE_BRAND = "RECIPE_ITEM_UPDATE_BRAND";
export const RECIPE_ITEM_UPDATE_SUBTITLE = "RECIPE_ITEM_UPDATE_SUBTITLE";
export const RECIPE_ITEM_UPDATE_DESCRIPTION = "RECIPE_ITEM_UPDATE_DESCRIPTION";
export const RECIPE_ITEM_UPDATE_TYPE = "RECIPE_ITEM_UPDATE_TYPE";
export const RECIPE_ITEM_UPDATE_CUSTOM_UNITS = "RECIPE_ITEM_UPDATE_CUSTOM_UNITS";
export const RECIPE_ITEM_UPDATE_SERVING_SIZE_AMOUNT = "RECIPE_ITEM_UPDATE_SERVING_SIZE_AMOUNT";
export const RECIPE_ITEM_UPDATE_SERVING_SIZE_UNIT = "RECIPE_ITEM_UPDATE_SERVING_SIZE_UNIT";


export const RECIPE_ITEM_ADD_CUSTOM_UNIT_REQUEST = "RECIPE_ITEM_ADD_CUSTOM_UNIT_REQUEST";
export const RECIPE_ITEM_ADD_CUSTOM_UNIT_SUCCESS = "RECIPE_ITEM_ADD_CUSTOM_UNIT_SUCCESS";
export const RECIPE_ITEM_ADD_CUSTOM_UNIT_ERROR = "RECIPE_ITEM_ADD_CUSTOM_UNIT_ERROR";
export const RECIPE_ITEM_REMOVE_CUSTOM_UNIT_REQUEST = "RECIPE_ITEM_REMOVE_CUSTOM_UNIT_REQUEST";
export const RECIPE_ITEM_REMOVE_CUSTOM_UNIT_SUCCESS = "RECIPE_ITEM_REMOVE_CUSTOM_UNIT_SUCCESS";
export const RECIPE_ITEM_REMOVE_CUSTOM_UNIT_ERROR = "RECIPE_ITEM_REMOVE_CUSTOM_UNIT_ERROR";
export const RECIPE_ITEM_UPDATE_CUSTOM_UNIT_REQUEST = "RECIPE_ITEM_UPDATE_CUSTOM_UNIT_REQUEST";
export const RECIPE_ITEM_UPDATE_CUSTOM_UNIT_SUCCESS = "RECIPE_ITEM_UPDATE_CUSTOM_UNIT_SUCCESS";
export const RECIPE_ITEM_UPDATE_CUSTOM_UNIT_ERROR = "RECIPE_ITEM_UPDATE_CUSTOM_UNIT_ERROR";

// NOTE: Directions

export const RECIPE_ITEM_REMOVE_DIRECTION = "RECIPE_ITEM_REMOVE_DIRECTION";
export const RECIPE_ITEM_TOGGLE_DIRECTION_OPEN = "RECIPE_ITEM_TOGGLE_DIRECTION_OPEN";
export const RECIPE_ITEM_TOGGLE_DIRECTION_MARK = "RECIPE_ITEM_TOGGLE_DIRECTION_MARK";

export const RECIPE_ITEM_REMOVE_SUBDIRECTION = "RECIPE_ITEM_REMOVE_SUBDIRECTION";
export const RECIPE_ITEM_TOGGLE_SUBDIRECTION_MARK = "RECIPE_ITEM_TOGGLE_SUBDIRECTION_MARK";
export const RECIPE_ITEM_UPDATE_SUBDIRECTION_NOTE = "RECIPE_ITEM_UPDATE_SUBDIRECTION_NOTE";
export const RECIPE_ITEM_UPDATE_SUBDIRECTION_INGREDIENT_AMOUNT = "RECIPE_ITEM_UPDATE_SUBDIRECTION_INGREDIENT_AMOUNT";
export const RECIPE_ITEM_UPDATE_SUBDIRECTION_INGREDIENT_UNIT = "RECIPE_ITEM_UPDATE_SUBDIRECTION_INGREDIENT_UNIT";
export const RECIPE_ITEM_CREATE_SUBDIRECTION_INGREDIENT = "RECIPE_ITEM_CREATE_SUBDIRECTION_INGREDIENT";
export const RECIPE_ITEM_CREATE_SUBDIRECTION_COMMENT = "RECIPE_ITEM_CREATE_SUBDIRECTION_COMMENT";
export const RECIPE_ITEM_UPDATE_DIRECTION_STEP_NUMBER = "RECIPE_ITEM_UPDATE_DIRECTION_STEP_NUMBER";
export const RECIPE_ITEM_UPDATE_DIRECTION_NAME = "RECIPE_ITEM_UPDATE_DIRECTION_NAME";
export const RECIPE_ITEM_UPDATE_DIRECTION_TEMPERATURE_COUNT = "RECIPE_ITEM_UPDATE_DIRECTION_TEMPERATURE_COUNT";
export const RECIPE_ITEM_UPDATE_DIRECTION_TEMPERATURE_UNIT = "RECIPE_ITEM_UPDATE_DIRECTION_TEMPERATURE_UNIT";
export const RECIPE_ITEM_UPDATE_DIRECTION_TIME_COUNT = "RECIPE_ITEM_UPDATE_DIRECTION_TIME_COUNT";
export const RECIPE_ITEM_UPDATE_DIRECTION_TIME_UNIT = "RECIPE_ITEM_UPDATE_DIRECTION_TIME_UNIT";

export const RECIPE_ITEM_UPDATE_NEW_DIRECTION_STEP_NUMBER = "RECIPE_ITEM_UPDATE_NEW_DIRECTION_STEP_NUMBER";
export const RECIPE_ITEM_UPDATE_NEW_DIRECTION_NAME = "RECIPE_ITEM_UPDATE_NEW_DIRECTION_NAME";
export const RECIPE_ITEM_UPDATE_NEW_DIRECTION_TEMPERATURE_COUNT = "RECIPE_ITEM_UPDATE_NEW_DIRECTION_TEMPERATURE_COUNT";
export const RECIPE_ITEM_UPDATE_NEW_DIRECTION_TEMPERATURE_UNIT = "RECIPE_ITEM_UPDATE_NEW_DIRECTION_TEMPERATURE_UNIT";
export const RECIPE_ITEM_UPDATE_NEW_DIRECTION_TIME_COUNT = "RECIPE_ITEM_UPDATE_NEW_DIRECTION_TIME_COUNT";
export const RECIPE_ITEM_UPDATE_NEW_DIRECTION_TIME_UNIT = "RECIPE_ITEM_UPDATE_NEW_DIRECTION_TIME_UNIT";
export const RECIPE_ITEM_CREATE_DIRECTION = "RECIPE_ITEM_CREATE_DIRECTION";

// NOTE: Ingredients

export const RECIPE_ITEM_REMOVE_INGREDIENT = "RECIPE_ITEM_REMOVE_INGREDIENT";
export const RECIPE_ITEM_REMOVE_ALT_INGREDIENT = "RECIPE_ITEM_REMOVE_ALT_INGREDIENT";
export const RECIPE_ITEM_REPLACE_INGREDIENT_WITH_ALTERNATIVE = "RECIPE_ITEM_REPLACE_INGREDIENT_WITH_ALTERNATIVE";
export const RECIPE_ITEM_TOGGLE_INGREDIENT_OPEN = "RECIPE_ITEM_TOGGLE_INGREDIENT_OPEN";
export const RECIPE_ITEM_TOGGLE_INGREDIENT_MARK = "RECIPE_ITEM_TOGGLE_INGREDIENT_MARK";

export const RECIPE_ITEM_UPDATE_INGREDIENT_AMOUNT = "RECIPE_ITEM_UPDATE_INGREDIENT_AMOUNT";
export const RECIPE_ITEM_UPDATE_INGREDIENT_UNIT = "RECIPE_ITEM_UPDATE_INGREDIENT_UNIT";
export const RECIPE_ITEM_UPDATE_ALT_INGREDIENT_AMOUNT = "RECIPE_ITEM_UPDATE_ALT_INGREDIENT_AMOUNT";
export const RECIPE_ITEM_UPDATE_ALT_INGREDIENT_UNIT = "RECIPE_ITEM_UPDATE_ALT_INGREDIENT_UNIT";
export const RECIPE_ITEM_UPDATE_ALT_NUTRITION_FACTS = "RECIPE_ITEM_UPDATE_ALT_NUTRITION_FACTS";

export const RECIPE_ITEM_ADD_INGREDIENT = "RECIPE_ITEM_ADD_INGREDIENT";
export const RECIPE_ITEM_ADD_ALT_INGREDIENT = "RECIPE_ITEM_ADD_ALT_INGREDIENT";


export const RECIPE_ITEM_FETCH_REQUEST = "RECIPE_ITEM_FETCH_REQUEST";
export const RECIPE_ITEM_FETCH_SUCCESS = "RECIPE_ITEM_FETCH_SUCCESS";
export const RECIPE_ITEM_FETCH_ERROR = "RECIPE_ITEM_FETCH_ERROR";


export interface UpdateNameAction {
    type: typeof RECIPE_ITEM_UPDATE_NAME;
    payload: string;
}

export interface UpdateBrandAction {
    type: typeof RECIPE_ITEM_UPDATE_BRAND;
    payload: string;
}

export interface UpdateSubtitleAction {
    type: typeof RECIPE_ITEM_UPDATE_SUBTITLE;
    payload: string;
}

export interface UpdateDescriptionAction {
    type: typeof RECIPE_ITEM_UPDATE_DESCRIPTION;
    payload: string;
}

export interface UpdateServingSizeAmountAction {
    type: typeof RECIPE_ITEM_UPDATE_SERVING_SIZE_AMOUNT;
    payload: string;
}

export interface UpdateServingSizeUnitAction {
    type: typeof RECIPE_ITEM_UPDATE_SERVING_SIZE_UNIT;
    payload: units.WeightUnit | units.VolumeUnit;
}

export interface UpdateTypeAction {
    type: typeof RECIPE_ITEM_UPDATE_TYPE;
    payload: string;
}

export interface UpdateCustomUnitsAction {
    type: typeof RECIPE_ITEM_UPDATE_CUSTOM_UNITS;
    payload: units.CustomUnitInput[];
}

// NOTE: Directions

export interface RemoveDirectionAction {
    type: typeof RECIPE_ITEM_REMOVE_DIRECTION;
    payload: number;
}

export interface ToggleDirectionOpenAction {
    type: typeof RECIPE_ITEM_TOGGLE_DIRECTION_OPEN;
    payload: number;
}

export interface ToggleDirectionMarkAction {
    type: typeof RECIPE_ITEM_TOGGLE_DIRECTION_MARK;
    payload: number;
}

export interface RemoveSubDirectionAction {
    type: typeof RECIPE_ITEM_REMOVE_SUBDIRECTION;
    payload: { directionIndex: number, subDirectionIndex: number };
}

export interface ToggleSubDirectionMarkAction {
    type: typeof RECIPE_ITEM_TOGGLE_SUBDIRECTION_MARK;
    payload: { directionIndex: number, subDirectionIndex: number };
}

export interface UpdateSubDirectionNoteAction {
    type: typeof RECIPE_ITEM_UPDATE_SUBDIRECTION_NOTE;
    payload: { directionIndex: number, subDirectionIndex: number, note: string };
}

export interface UpdateSubDirectionIngredientAmountAction {
    type: typeof RECIPE_ITEM_UPDATE_SUBDIRECTION_INGREDIENT_AMOUNT;
    payload: { directionIndex: number, subDirectionIndex: number, inputValue: string };
}

export interface UpdateSubDirectionIngredientUnitAction {
    type: typeof RECIPE_ITEM_UPDATE_SUBDIRECTION_INGREDIENT_UNIT;
    payload: { directionIndex: number, subDirectionIndex: number, unit: units.WeightUnit | units.VolumeUnit };
}

export interface CreateSubDirectionIngredientAction {
    type: typeof RECIPE_ITEM_CREATE_SUBDIRECTION_INGREDIENT;
    payload: { directionIndex: number, ingredientId: number };
}
export interface CreateSubDirectionAction {
    type: typeof RECIPE_ITEM_CREATE_SUBDIRECTION_COMMENT;
    payload: { directionIndex: number, type: SubDirectionType };
}

export interface UpdateDirectionStepNumberAction {
    type: typeof RECIPE_ITEM_UPDATE_DIRECTION_STEP_NUMBER;
    payload: { directionIndex: number, stepNumber: number };
}

export interface UpdateDirectionNameAction {
    type: typeof RECIPE_ITEM_UPDATE_DIRECTION_NAME;
    payload: { directionIndex: number, name: string };
}

export interface UpdateDirectionTemperatureCountAction {
    type: typeof RECIPE_ITEM_UPDATE_DIRECTION_TEMPERATURE_COUNT;
    payload: { directionIndex: number, inputValue: string };
}

export interface UpdateDirectionTemperatureUnitAction {
    type: typeof RECIPE_ITEM_UPDATE_DIRECTION_TEMPERATURE_UNIT;
    payload: { directionIndex: number, unit: units.TemperatureUnit };
}

export interface UpdateDirectionTimeCountAction {
    type: typeof RECIPE_ITEM_UPDATE_DIRECTION_TIME_COUNT;
    payload: { directionIndex: number, inputValue: string };
}

export interface UpdateDirectionTimeUnitAction {
    type: typeof RECIPE_ITEM_UPDATE_DIRECTION_TIME_UNIT;
    payload: { directionIndex: number, unit: units.TimeUnit };
}

export interface UpdateNewDirectionStepNumberAction {
    type: typeof RECIPE_ITEM_UPDATE_NEW_DIRECTION_STEP_NUMBER;
    payload: number;
}

export interface UpdateNewDirectionNameAction {
    type: typeof RECIPE_ITEM_UPDATE_NEW_DIRECTION_NAME;
    payload: string;
}

export interface UpdateNewDirectionTemperatureCountAction {
    type: typeof RECIPE_ITEM_UPDATE_NEW_DIRECTION_TEMPERATURE_COUNT;
    payload: string;
}

export interface UpdateNewDirectionTemperatureUnitAction {
    type: typeof RECIPE_ITEM_UPDATE_NEW_DIRECTION_TEMPERATURE_UNIT;
    payload: units.TemperatureUnit;
}

export interface UpdateNewDirectionTimeCountAction {
    type: typeof RECIPE_ITEM_UPDATE_NEW_DIRECTION_TIME_COUNT;
    payload: string;
}

export interface UpdateNewDirectionTimeUnitAction {
    type: typeof RECIPE_ITEM_UPDATE_NEW_DIRECTION_TIME_UNIT;
    payload: units.TimeUnit;
}

export interface CreateDirectionAction {
    type: typeof RECIPE_ITEM_CREATE_DIRECTION;
    payload: RecipeDirection;
}

// NOTE: Ingredients

export interface RemoveIngredientAction {
    type: typeof RECIPE_ITEM_REMOVE_INGREDIENT;
    payload: number;
}

export interface RemoveAltIngredientAction {
    type: typeof RECIPE_ITEM_REMOVE_ALT_INGREDIENT;
    payload: { parentId: number, id: number };
}

export interface ReplaceIngredientWithAlternativeAction {
    type: typeof RECIPE_ITEM_REPLACE_INGREDIENT_WITH_ALTERNATIVE;
    payload: { parentId: number, id: number };
}

export interface ToggleIngredientOpenAction {
    type: typeof RECIPE_ITEM_TOGGLE_INGREDIENT_OPEN;
    payload: number;
}

export interface ToggleIngredientMarkAction {
    type: typeof RECIPE_ITEM_TOGGLE_INGREDIENT_MARK;
    payload: number;
}


export interface UpdateIngredientAmountAction {
    type: typeof RECIPE_ITEM_UPDATE_INGREDIENT_AMOUNT;
    payload: { id: number, inputValue: string };
}

export interface UpdateIngredientUnitAction {
    type: typeof RECIPE_ITEM_UPDATE_INGREDIENT_UNIT;
    payload: { id: number, unit: units.WeightUnit | units.VolumeUnit };
}

export interface UpdateAltIngredientAmountAction {
    type: typeof RECIPE_ITEM_UPDATE_ALT_INGREDIENT_AMOUNT;
    payload: { parentId: number, id: number, inputValue: string };
}

export interface UpdateAltIngredientUnitAction {
    type: typeof RECIPE_ITEM_UPDATE_ALT_INGREDIENT_UNIT;
    payload: { parentId: number, id: number, unit: units.WeightUnit | units.VolumeUnit };
}

export interface UpdateAltNutritionFactsAction {
    type: typeof RECIPE_ITEM_UPDATE_ALT_NUTRITION_FACTS;
    payload: { parentId: number, id: number, isSelected: boolean };
}

export interface AddIngredientAction {
    type: typeof RECIPE_ITEM_ADD_INGREDIENT;
    payload: typings.IngredientProduct;
}

export interface AddAltIngredientAction {
    type: typeof RECIPE_ITEM_ADD_ALT_INGREDIENT;
    payload: { id: number, altIngredientProduct: typings.IngredientProduct };
}


export interface RecipeItemFetchRequestAction {
    type: typeof RECIPE_ITEM_FETCH_REQUEST;
    payload: number;
}

export interface RecipeItemFetchSuccessAction {
    type: typeof RECIPE_ITEM_FETCH_SUCCESS;
    payload: typings.Recipe;
}

export interface RecipeItemFetchErrorAction {
    type: typeof RECIPE_ITEM_FETCH_ERROR;
    payload: string;
}


export interface AddCustomUnitRequestAction {
    type: typeof RECIPE_ITEM_ADD_CUSTOM_UNIT_REQUEST;
    payload: units.CustomUnitInput;
}

export interface AddCustomUnitSuccessAction {
    type: typeof RECIPE_ITEM_ADD_CUSTOM_UNIT_SUCCESS;
    payload: units.CustomUnit[];
}

export interface AddCustomUnitErrorAction {
    type: typeof RECIPE_ITEM_ADD_CUSTOM_UNIT_ERROR;
    payload: string;
}

export interface RemoveCustomUnitRequestAction {
    type: typeof RECIPE_ITEM_REMOVE_CUSTOM_UNIT_REQUEST;
    payload: number;
}

export interface RemoveCustomUnitSuccessAction {
    type: typeof RECIPE_ITEM_REMOVE_CUSTOM_UNIT_SUCCESS;
    payload: units.CustomUnit[];
}

export interface RemoveCustomUnitErrorAction {
    type: typeof RECIPE_ITEM_REMOVE_CUSTOM_UNIT_ERROR;
    payload: string;
}

export interface UpdateCustomUnitRequestAction {
    type: typeof RECIPE_ITEM_UPDATE_CUSTOM_UNIT_REQUEST;
    payload: {
        index: number;
        customUnit: units.CustomUnitInput;
    };
}

export interface UpdateCustomUnitSuccessAction {
    type: typeof RECIPE_ITEM_UPDATE_CUSTOM_UNIT_SUCCESS;
    payload: units.CustomUnit[];
}

export interface UpdateCustomUnitErrorAction {
    type: typeof RECIPE_ITEM_UPDATE_CUSTOM_UNIT_ERROR;
    payload: string;
}


export type RecipeItemActionTypes = (
    UpdateNameAction | UpdateBrandAction | UpdateSubtitleAction | UpdateDescriptionAction | UpdateTypeAction |
    UpdateServingSizeAmountAction | UpdateServingSizeUnitAction | UpdateCustomUnitsAction |

    RemoveDirectionAction | RemoveSubDirectionAction | ToggleDirectionOpenAction | ToggleDirectionMarkAction |
    ToggleSubDirectionMarkAction | UpdateSubDirectionNoteAction |
    
    UpdateSubDirectionIngredientAmountAction | UpdateSubDirectionIngredientUnitAction |
    CreateSubDirectionIngredientAction | CreateSubDirectionAction |
    UpdateDirectionStepNumberAction | UpdateDirectionNameAction |
    UpdateDirectionTemperatureCountAction | UpdateDirectionTemperatureUnitAction |
    UpdateDirectionTimeCountAction | UpdateDirectionTimeUnitAction | CreateDirectionAction |

    UpdateNewDirectionStepNumberAction | UpdateNewDirectionNameAction | UpdateNewDirectionTemperatureCountAction |
    UpdateNewDirectionTemperatureUnitAction | UpdateNewDirectionTimeCountAction | UpdateNewDirectionTimeUnitAction |

    RemoveIngredientAction | RemoveAltIngredientAction | ReplaceIngredientWithAlternativeAction |
    ToggleIngredientOpenAction | ToggleIngredientMarkAction |

    UpdateIngredientAmountAction | UpdateIngredientUnitAction | UpdateAltIngredientAmountAction | UpdateAltIngredientUnitAction |
    UpdateAltNutritionFactsAction | AddIngredientAction | AddAltIngredientAction |

    RecipeItemFetchRequestAction | RecipeItemFetchSuccessAction | RecipeItemFetchErrorAction |

    AddCustomUnitRequestAction | AddCustomUnitSuccessAction | AddCustomUnitErrorAction |
    RemoveCustomUnitRequestAction | RemoveCustomUnitSuccessAction | RemoveCustomUnitErrorAction |
    UpdateCustomUnitRequestAction | UpdateCustomUnitSuccessAction | UpdateCustomUnitErrorAction
);
