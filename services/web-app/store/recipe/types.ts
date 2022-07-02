import type { NutritionFactType } from "@common/nutritionFacts";
import type * as typings from "@common/typings";
import type { Recipe } from "@common/typings";
import type * as units from "@common/units";



export interface RecipeIngredientProduct extends typings.IngredientProduct {
    amountInput: string;
}

export interface RecipeIngredient extends typings.Ingredient {
    isOpen: boolean;
    isMarked: boolean;
    products: Dictionary<number, RecipeIngredientProduct>;
    alternativeNutritionFacts: Dictionary<NutritionFactType, number>;
}


export enum DirectionPartType {
    Tip = "tip",
    Note = "note",
    Warning = "warning",
    Ingredient = "ingredient",
}

export interface RecipeDirectionPartComment {
    // NOTE: Used only for component identification, not saved in db
    id: number;
    stepNumber: number;
    type: DirectionPartType;
    commentText: string;
}

export interface RecipeDirectionPartIngredient {
    // NOTE: Used only for component identification, not saved in db
    id: number;
    stepNumber: number;
    type: DirectionPartType;
    isMarked: boolean;
    ingredientId: number;
    ingredientAmount: number;
    ingredientAmountInput: string;
    ingredientName: string;
    ingredientUnit: units.Unit;
    ingredientDensity: number;
}

export interface RecipeDirection {
    id: number;

    stepNumber: number;
    name: string;

    durationValue?: Option<number>;
    durationUnit: units.TimeUnit;
    durationValueInput: string;

    temperatureValue?: Option<number>;
    temperatureUnit: units.TemperatureUnit;
    temperatureValueInput: string;

    isOpen: boolean;
    isMarked: boolean;

    steps: (RecipeDirectionPartComment | RecipeDirectionPartIngredient)[];
}


export interface RecipePageStore {
    isLoaded: boolean;
    isLoadedIngredients: boolean;
    errorMessage?: Option<string>;

    editMode: boolean;

    id: number;
    name: string;
    brand: string;
    subtitle: string;
    description: string;
    type: string;

    density: number;
    densityInput: string;
    densityVolumeUnit: units.VolumeUnit;
    densityWeightUnit: units.WeightUnit;

    nutritionFacts: Dictionary<NutritionFactType, number>;
    customUnits: units.CustomUnitInput[];
    isPrivate: boolean;

    // NOTE: INPUTS
    servingSize: number;
    servingSizeInput: string;
    servingSizeUnit: units.WeightUnit | units.VolumeUnit;

    nutritionFactsByServing: Dictionary<NutritionFactType, number>;
    nutritionFactsByServingInputs: Dictionary<NutritionFactType, string>;

    ingredients: RecipeIngredient[];

    newDirection: RecipeDirection;
    directions: RecipeDirection[];

    // NOTE: NEW RECIPE
    isCreated: boolean;
}


// -----------------------------------------------------------------------------
// Recipe
// -----------------------------------------------------------------------------

export const RECIPE_SET_EDIT_MODE = "RECIPE_SET_EDIT_MODE";

export const RECIPE_FETCH_NEW = "RECIPE_FETCH_NEW";
export const RECIPE_FETCH_REQUEST = "RECIPE_FETCH_REQUEST";
export const RECIPE_FETCH_SUCCESS = "RECIPE_FETCH_SUCCESS";
export const RECIPE_FETCH_ERROR = "RECIPE_FETCH_ERROR";

export const RECIPE_CREATE_REQUEST = "RECIPE_CREATE_REQUEST";
export const RECIPE_CREATE_SUCCESS = "RECIPE_CREATE_SUCCESS";
export const RECIPE_CREATE_ERROR = "RECIPE_CREATE_ERROR";

export const RECIPE_UPDATE_REQUEST = "RECIPE_UPDATE_REQUEST";
export const RECIPE_UPDATE_SUCCESS = "RECIPE_UPDATE_SUCCESS";
export const RECIPE_UPDATE_ERROR = "RECIPE_UPDATE_ERROR";

export const RECIPE_UPDATE_NAME = "RECIPE_UPDATE_NAME";
export const RECIPE_UPDATE_BRAND = "RECIPE_UPDATE_BRAND";
export const RECIPE_UPDATE_SUBTITLE = "RECIPE_UPDATE_SUBTITLE";
export const RECIPE_UPDATE_DESCRIPTION = "RECIPE_UPDATE_DESCRIPTION";
export const RECIPE_UPDATE_TYPE = "RECIPE_UPDATE_TYPE";
export const RECIPE_UPDATE_SERVING_SIZE_AMOUNT = "RECIPE_UPDATE_SERVING_SIZE_AMOUNT";
export const RECIPE_UPDATE_SERVING_SIZE_UNIT = "RECIPE_UPDATE_SERVING_SIZE_UNIT";

export const RECIPE_ADD_CUSTOM_UNIT = "RECIPE_ADD_CUSTOM_UNIT";
export const RECIPE_REMOVE_CUSTOM_UNIT = "RECIPE_REMOVE_CUSTOM_UNIT";
export const RECIPE_UPDATE_CUSTOM_UNIT = "RECIPE_UPDATE_CUSTOM_UNIT";

// -----------------------------------------------------------------------------
// Directions
// -----------------------------------------------------------------------------

export const RECIPE_REMOVE_DIRECTION = "RECIPE_REMOVE_DIRECTION";
export const RECIPE_TOGGLE_DIRECTION_OPEN = "RECIPE_TOGGLE_DIRECTION_OPEN";
export const RECIPE_TOGGLE_DIRECTION_MARK = "RECIPE_TOGGLE_DIRECTION_MARK";
export const RECIPE_UPDATE_DIRECTION_STEP_NUMBER = "RECIPE_UPDATE_DIRECTION_STEP_NUMBER";
export const RECIPE_UPDATE_DIRECTION_NAME = "RECIPE_UPDATE_DIRECTION_NAME";
export const RECIPE_UPDATE_DIRECTION_TEMPERATURE_COUNT = "RECIPE_UPDATE_DIRECTION_TEMPERATURE_COUNT";
export const RECIPE_UPDATE_DIRECTION_TEMPERATURE_UNIT = "RECIPE_UPDATE_DIRECTION_TEMPERATURE_UNIT";
export const RECIPE_UPDATE_DIRECTION_TIME_COUNT = "RECIPE_UPDATE_DIRECTION_TIME_COUNT";
export const RECIPE_UPDATE_DIRECTION_TIME_UNIT = "RECIPE_UPDATE_DIRECTION_TIME_UNIT";

export const RECIPE_UPDATE_NEW_DIRECTION_STEP_NUMBER = "RECIPE_UPDATE_NEW_DIRECTION_STEP_NUMBER";
export const RECIPE_UPDATE_NEW_DIRECTION_NAME = "RECIPE_UPDATE_NEW_DIRECTION_NAME";
export const RECIPE_UPDATE_NEW_DIRECTION_TEMPERATURE_COUNT = "RECIPE_UPDATE_NEW_DIRECTION_TEMPERATURE_COUNT";
export const RECIPE_UPDATE_NEW_DIRECTION_TEMPERATURE_UNIT = "RECIPE_UPDATE_NEW_DIRECTION_TEMPERATURE_UNIT";
export const RECIPE_UPDATE_NEW_DIRECTION_TIME_COUNT = "RECIPE_UPDATE_NEW_DIRECTION_TIME_COUNT";
export const RECIPE_UPDATE_NEW_DIRECTION_TIME_UNIT = "RECIPE_UPDATE_NEW_DIRECTION_TIME_UNIT";
export const RECIPE_CREATE_DIRECTION = "RECIPE_CREATE_DIRECTION";

export const RECIPE_REMOVE_DIRECTION_PART = "RECIPE_REMOVE_DIRECTION_PART";
export const RECIPE_TOGGLE_DIRECTION_PART_MARK = "RECIPE_TOGGLE_DIRECTION_PART_MARK";
export const RECIPE_UPDATE_DIRECTION_PART_STEP_NUMBER = "RECIPE_UPDATE_DIRECTION_PART_STEP_NUMBER";
export const RECIPE_UPDATE_DIRECTION_PART_NOTE = "RECIPE_UPDATE_DIRECTION_PART_NOTE";
export const RECIPE_UPDATE_DIRECTION_PART_INGREDIENT_AMOUNT = "RECIPE_UPDATE_DIRECTION_PART_INGREDIENT_AMOUNT";
export const RECIPE_UPDATE_DIRECTION_PART_INGREDIENT_UNIT = "RECIPE_UPDATE_DIRECTION_PART_INGREDIENT_UNIT";
export const RECIPE_CREATE_DIRECTION_PART_INGREDIENT = "RECIPE_CREATE_DIRECTION_PART_INGREDIENT";
export const RECIPE_CREATE_DIRECTION_PART_COMMENT = "RECIPE_CREATE_DIRECTION_PART_COMMENT";

// -----------------------------------------------------------------------------
// Ingredients
// -----------------------------------------------------------------------------

export const RECIPE_REMOVE_INGREDIENT = "RECIPE_REMOVE_INGREDIENT";
export const RECIPE_REMOVE_INGREDIENT_PRODUCT = "RECIPE_REMOVE_INGREDIENT_PRODUCT";
export const RECIPE_REPLACE_INGREDIENT_WITH_ALTERNATIVE = "RECIPE_REPLACE_INGREDIENT_WITH_ALTERNATIVE";
export const RECIPE_TOGGLE_INGREDIENT_OPEN = "RECIPE_TOGGLE_INGREDIENT_OPEN";
export const RECIPE_TOGGLE_INGREDIENT_MARK = "RECIPE_TOGGLE_INGREDIENT_MARK";

export const RECIPE_UPDATE_INGREDIENT_PRODUCT_AMOUNT = "RECIPE_UPDATE_INGREDIENT_PRODUCT_AMOUNT";
export const RECIPE_UPDATE_INGREDIENT_PRODUCT_UNIT = "RECIPE_UPDATE_INGREDIENT_PRODUCT_UNIT";
export const RECIPE_UPDATE_ALT_NUTRITION_FACTS = "RECIPE_UPDATE_ALT_NUTRITION_FACTS";

export const RECIPE_ADD_INGREDIENT_REQUEST = "RECIPE_ADD_INGREDIENT_REQUEST";
export const RECIPE_ADD_INGREDIENT_SUCCESS = "RECIPE_ADD_INGREDIENT_SUCCESS";
export const RECIPE_ADD_INGREDIENT_ERROR = "RECIPE_ADD_INGREDIENT_ERROR";

export const RECIPE_ADD_INGREDIENT_PRODUCT_REQUEST = "RECIPE_ADD_INGREDIENT_PRODUCT_REQUEST";
export const RECIPE_ADD_INGREDIENT_PRODUCT_SUCCESS = "RECIPE_ADD_INGREDIENT_PRODUCT_SUCCESS";
export const RECIPE_ADD_INGREDIENT_PRODUCT_ERROR = "RECIPE_ADD_INGREDIENT_PRODUCT_ERROR";

// -----------------------------------------------------------------------------
// Recipe
// -----------------------------------------------------------------------------

export interface SetEditModeAction {
    type: typeof RECIPE_SET_EDIT_MODE;
    payload: boolean;
}

export interface RecipeFetchNewAction {
    type: typeof RECIPE_FETCH_NEW;
}

export interface RecipeFetchRequestAction {
    type: typeof RECIPE_FETCH_REQUEST;
    payload: number;
}

export interface RecipeFetchSuccessAction {
    type: typeof RECIPE_FETCH_SUCCESS;
    payload: typings.Recipe;
}

export interface RecipeFetchErrorAction {
    type: typeof RECIPE_FETCH_ERROR;
    payload: string;
}


export interface AddCustomUnitAction {
    type: typeof RECIPE_ADD_CUSTOM_UNIT;
    payload: units.CustomUnitInput;
}

export interface RemoveCustomUnitAction {
    type: typeof RECIPE_REMOVE_CUSTOM_UNIT;
    payload: number;
}

export interface UpdateCustomUnitAction {
    type: typeof RECIPE_UPDATE_CUSTOM_UNIT;
    payload: {
        index: number;
        customUnit: units.CustomUnitInput;
    };
}

export interface RecipeCreateRequestAction {
    type: typeof RECIPE_CREATE_REQUEST;
}

export interface RecipeCreateSuccessAction {
    type: typeof RECIPE_CREATE_SUCCESS;
    payload: Recipe;
}

export interface RecipeCreateErrorAction {
    type: typeof RECIPE_CREATE_ERROR;
    payload: string;
}

export interface RecipeUpdateRequestAction {
    type: typeof RECIPE_UPDATE_REQUEST;
}

export interface RecipeUpdateSuccessAction {
    type: typeof RECIPE_UPDATE_SUCCESS;
    payload: Recipe;
}

export interface RecipeUpdateErrorAction {
    type: typeof RECIPE_UPDATE_ERROR;
    payload: string;
}

export interface UpdateNameAction {
    type: typeof RECIPE_UPDATE_NAME;
    payload: string;
}

export interface UpdateBrandAction {
    type: typeof RECIPE_UPDATE_BRAND;
    payload: string;
}

export interface UpdateSubtitleAction {
    type: typeof RECIPE_UPDATE_SUBTITLE;
    payload: string;
}

export interface UpdateDescriptionAction {
    type: typeof RECIPE_UPDATE_DESCRIPTION;
    payload: string;
}

export interface UpdateServingSizeAmountAction {
    type: typeof RECIPE_UPDATE_SERVING_SIZE_AMOUNT;
    payload: string;
}

export interface UpdateServingSizeUnitAction {
    type: typeof RECIPE_UPDATE_SERVING_SIZE_UNIT;
    payload: units.WeightUnit | units.VolumeUnit;
}

export interface UpdateTypeAction {
    type: typeof RECIPE_UPDATE_TYPE;
    payload: string;
}

// -----------------------------------------------------------------------------
// Directions
// -----------------------------------------------------------------------------

export interface RemoveDirectionAction {
    type: typeof RECIPE_REMOVE_DIRECTION;
    payload: number;
}
export interface ToggleDirectionOpenAction {
    type: typeof RECIPE_TOGGLE_DIRECTION_OPEN;
    payload: number;
}
export interface ToggleDirectionMarkAction {
    type: typeof RECIPE_TOGGLE_DIRECTION_MARK;
    payload: number;
}
export interface UpdateDirectionStepNumberAction {
    type: typeof RECIPE_UPDATE_DIRECTION_STEP_NUMBER;
    payload: { directionIndex: number, stepNumber: number };
}
export interface UpdateDirectionNameAction {
    type: typeof RECIPE_UPDATE_DIRECTION_NAME;
    payload: { directionIndex: number, name: string };
}
export interface UpdateDirectionTemperatureCountAction {
    type: typeof RECIPE_UPDATE_DIRECTION_TEMPERATURE_COUNT;
    payload: { directionIndex: number, inputValue: string };
}
export interface UpdateDirectionTemperatureUnitAction {
    type: typeof RECIPE_UPDATE_DIRECTION_TEMPERATURE_UNIT;
    payload: { directionIndex: number, unit: units.TemperatureUnit };
}
export interface UpdateDirectionTimeCountAction {
    type: typeof RECIPE_UPDATE_DIRECTION_TIME_COUNT;
    payload: { directionIndex: number, inputValue: string };
}
export interface UpdateDirectionTimeUnitAction {
    type: typeof RECIPE_UPDATE_DIRECTION_TIME_UNIT;
    payload: { directionIndex: number, unit: units.TimeUnit };
}

export interface UpdateNewDirectionStepNumberAction {
    type: typeof RECIPE_UPDATE_NEW_DIRECTION_STEP_NUMBER;
    payload: number;
}

export interface UpdateNewDirectionNameAction {
    type: typeof RECIPE_UPDATE_NEW_DIRECTION_NAME;
    payload: string;
}

export interface UpdateNewDirectionTemperatureCountAction {
    type: typeof RECIPE_UPDATE_NEW_DIRECTION_TEMPERATURE_COUNT;
    payload: string;
}
export interface UpdateNewDirectionTemperatureUnitAction {
    type: typeof RECIPE_UPDATE_NEW_DIRECTION_TEMPERATURE_UNIT;
    payload: units.TemperatureUnit;
}
export interface UpdateNewDirectionTimeCountAction {
    type: typeof RECIPE_UPDATE_NEW_DIRECTION_TIME_COUNT;
    payload: string;
}
export interface UpdateNewDirectionTimeUnitAction {
    type: typeof RECIPE_UPDATE_NEW_DIRECTION_TIME_UNIT;
    payload: units.TimeUnit;
}
export interface CreateDirectionAction {
    type: typeof RECIPE_CREATE_DIRECTION;
    payload: RecipeDirection;
}

// DirectionPart

export interface RemoveDirectionPartAction {
    type: typeof RECIPE_REMOVE_DIRECTION_PART;
    payload: { directionIndex: number, directionPartId: number };
}
export interface ToggleDirectionPartMarkAction {
    type: typeof RECIPE_TOGGLE_DIRECTION_PART_MARK;
    payload: { directionIndex: number, directionPartId: number };
}
export interface UpdateDirectionPartStepNumberAction {
    type: typeof RECIPE_UPDATE_DIRECTION_PART_STEP_NUMBER;
    payload: { directionIndex: number, directionPartId: number, stepNumber: number };
}
export interface UpdateDirectionPartNoteAction {
    type: typeof RECIPE_UPDATE_DIRECTION_PART_NOTE;
    payload: { directionIndex: number, directionPartId: number, note: string };
}
export interface UpdateDirectionPartIngredientAmountAction {
    type: typeof RECIPE_UPDATE_DIRECTION_PART_INGREDIENT_AMOUNT;
    payload: { directionIndex: number, directionPartId: number, inputValue: string };
}
export interface UpdateDirectionPartIngredientUnitAction {
    type: typeof RECIPE_UPDATE_DIRECTION_PART_INGREDIENT_UNIT;
    payload: { directionIndex: number, directionPartId: number, unit: units.WeightUnit | units.VolumeUnit };
}
export interface CreateDirectionPartIngredientAction {
    type: typeof RECIPE_CREATE_DIRECTION_PART_INGREDIENT;
    payload: { directionIndex: number, ingredientId: number };
}
export interface CreateDirectionPartAction {
    type: typeof RECIPE_CREATE_DIRECTION_PART_COMMENT;
    payload: { directionIndex: number, type: DirectionPartType };
}

// -----------------------------------------------------------------------------
// Ingredients
// -----------------------------------------------------------------------------

export interface RemoveIngredientAction {
    type: typeof RECIPE_REMOVE_INGREDIENT;
    payload: number;
}

export interface RemoveIngredientProductAction {
    type: typeof RECIPE_REMOVE_INGREDIENT_PRODUCT;
    payload: { parentId: number, id: number };
}

export interface ReplaceIngredientWithAlternativeAction {
    type: typeof RECIPE_REPLACE_INGREDIENT_WITH_ALTERNATIVE;
    payload: { parentId: number, id: number };
}

export interface ToggleIngredientOpenAction {
    type: typeof RECIPE_TOGGLE_INGREDIENT_OPEN;
    payload: number;
}

export interface ToggleIngredientMarkAction {
    type: typeof RECIPE_TOGGLE_INGREDIENT_MARK;
    payload: number;
}


export interface UpdateIngredientProductAmountAction {
    type: typeof RECIPE_UPDATE_INGREDIENT_PRODUCT_AMOUNT;
    payload: { parentId: number, id: number, inputValue: string };
}

export interface UpdateIngredientProductUnitAction {
    type: typeof RECIPE_UPDATE_INGREDIENT_PRODUCT_UNIT;
    payload: { parentId: number, id: number, unit: units.WeightUnit | units.VolumeUnit };
}

export interface UpdateAltNutritionFactsAction {
    type: typeof RECIPE_UPDATE_ALT_NUTRITION_FACTS;
    payload: { parentId: number, id: number, isSelected: boolean };
}

export interface AddIngredientRequestAction {
    type: typeof RECIPE_ADD_INGREDIENT_REQUEST;
    payload: typings.ProductShort;
}

export interface AddIngredientSuccessAction {
    type: typeof RECIPE_ADD_INGREDIENT_SUCCESS;
    payload: typings.IngredientProduct;
}

export interface AddIngredientErrorAction {
    type: typeof RECIPE_ADD_INGREDIENT_ERROR;
    payload: string;
}

export interface AddIngredientProductRequestAction {
    type: typeof RECIPE_ADD_INGREDIENT_PRODUCT_REQUEST;
    payload: { id: number, product: typings.ProductShort };
}

export interface AddIngredientProductSuccessAction {
    type: typeof RECIPE_ADD_INGREDIENT_PRODUCT_SUCCESS;
    payload: { id: number, product: typings.IngredientProduct };
}

export interface AddIngredientProductErrorAction {
    type: typeof RECIPE_ADD_INGREDIENT_PRODUCT_ERROR;
    payload: string;
}


export type RecipeActionTypes = (
    UpdateNameAction | UpdateBrandAction | UpdateSubtitleAction | UpdateDescriptionAction | UpdateTypeAction |
    UpdateServingSizeAmountAction | UpdateServingSizeUnitAction | SetEditModeAction |

    RemoveDirectionAction | RemoveDirectionPartAction | ToggleDirectionOpenAction | ToggleDirectionMarkAction |
    ToggleDirectionPartMarkAction | UpdateDirectionPartNoteAction |

    UpdateDirectionPartIngredientAmountAction | UpdateDirectionPartIngredientUnitAction |
    CreateDirectionPartIngredientAction | CreateDirectionPartAction | UpdateDirectionPartStepNumberAction |
    UpdateDirectionStepNumberAction | UpdateDirectionNameAction |
    UpdateDirectionTemperatureCountAction | UpdateDirectionTemperatureUnitAction |
    UpdateDirectionTimeCountAction | UpdateDirectionTimeUnitAction | CreateDirectionAction |

    UpdateNewDirectionStepNumberAction | UpdateNewDirectionNameAction | UpdateNewDirectionTemperatureCountAction |
    UpdateNewDirectionTemperatureUnitAction | UpdateNewDirectionTimeCountAction | UpdateNewDirectionTimeUnitAction |

    RemoveIngredientAction | RemoveIngredientProductAction | ReplaceIngredientWithAlternativeAction |
    ToggleIngredientOpenAction | ToggleIngredientMarkAction | UpdateIngredientProductAmountAction |
    UpdateIngredientProductUnitAction | UpdateAltNutritionFactsAction |
    AddIngredientRequestAction | AddIngredientSuccessAction | AddIngredientErrorAction |
    AddIngredientProductRequestAction | AddIngredientProductSuccessAction | AddIngredientProductErrorAction |

    RecipeFetchRequestAction | RecipeFetchSuccessAction | RecipeFetchErrorAction | RecipeFetchNewAction |
    AddCustomUnitAction | RemoveCustomUnitAction | UpdateCustomUnitAction |

    RecipeCreateRequestAction | RecipeCreateSuccessAction | RecipeCreateErrorAction |
    RecipeUpdateRequestAction | RecipeUpdateSuccessAction | RecipeUpdateErrorAction
);
