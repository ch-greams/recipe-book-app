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
    altNutritionFacts: Dictionary<NutritionFactType, number>;
}


export enum SubDirectionType {
    Tip = "tip",
    Note = "note",
    Warning = "warning",
    Ingredient = "ingredient",
}

export interface RecipeSubDirectionComment {
    stepNumber: number;
    type: SubDirectionType;
    commentText: string;
}

export interface RecipeSubDirectionIngredient {
    stepNumber: number;
    type: SubDirectionType;
    isMarked: boolean;
    ingredientId: number;
    ingredientAmount: number;
    ingredientAmountInput: string;
    ingredientName: string;
    ingredientUnit: units.Units;
}

export interface RecipeDirection {
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

    steps: (RecipeSubDirectionComment | RecipeSubDirectionIngredient)[];
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
    // TODO: Expand to include density inputs just like in Food
    density: number;
    nutritionFacts: Dictionary<NutritionFactType, number>;
    customUnits: units.CustomUnit[];
    isPrivate: boolean;

    // NOTE: INPUTS
    customUnitInputs: units.CustomUnitInput[];

    servingSize: number;
    servingSizeInput: string;
    servingSizeUnit: units.WeightUnit | units.VolumeUnit;

    ingredients: RecipeIngredient[];

    newDirection: RecipeDirection;
    directions: RecipeDirection[];

    // NOTE: NEW RECIPE
    isCreated: boolean;
}



export const RECIPE_ITEM_UPDATE_NAME = "RECIPE_ITEM_UPDATE_NAME";
export const RECIPE_ITEM_UPDATE_BRAND = "RECIPE_ITEM_UPDATE_BRAND";
export const RECIPE_ITEM_UPDATE_SUBTITLE = "RECIPE_ITEM_UPDATE_SUBTITLE";
export const RECIPE_ITEM_UPDATE_DESCRIPTION = "RECIPE_ITEM_UPDATE_DESCRIPTION";
export const RECIPE_ITEM_UPDATE_TYPE = "RECIPE_ITEM_UPDATE_TYPE";
export const RECIPE_ITEM_UPDATE_SERVING_SIZE_AMOUNT = "RECIPE_ITEM_UPDATE_SERVING_SIZE_AMOUNT";
export const RECIPE_ITEM_UPDATE_SERVING_SIZE_UNIT = "RECIPE_ITEM_UPDATE_SERVING_SIZE_UNIT";


export const RECIPE_ITEM_ADD_CUSTOM_UNIT = "RECIPE_ITEM_ADD_CUSTOM_UNIT";
export const RECIPE_ITEM_REMOVE_CUSTOM_UNIT = "RECIPE_ITEM_REMOVE_CUSTOM_UNIT";
export const RECIPE_ITEM_UPDATE_CUSTOM_UNIT = "RECIPE_ITEM_UPDATE_CUSTOM_UNIT";

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
export const RECIPE_ITEM_REMOVE_INGREDIENT_PRODUCT = "RECIPE_ITEM_REMOVE_INGREDIENT_PRODUCT";
export const RECIPE_ITEM_REPLACE_INGREDIENT_WITH_ALTERNATIVE = "RECIPE_ITEM_REPLACE_INGREDIENT_WITH_ALTERNATIVE";
export const RECIPE_ITEM_TOGGLE_INGREDIENT_OPEN = "RECIPE_ITEM_TOGGLE_INGREDIENT_OPEN";
export const RECIPE_ITEM_TOGGLE_INGREDIENT_MARK = "RECIPE_ITEM_TOGGLE_INGREDIENT_MARK";

export const RECIPE_ITEM_UPDATE_INGREDIENT_AMOUNT = "RECIPE_ITEM_UPDATE_INGREDIENT_AMOUNT";
export const RECIPE_ITEM_UPDATE_INGREDIENT_UNIT = "RECIPE_ITEM_UPDATE_INGREDIENT_UNIT";
export const RECIPE_ITEM_UPDATE_INGREDIENT_PRODUCT_AMOUNT = "RECIPE_ITEM_UPDATE_INGREDIENT_PRODUCT_AMOUNT";
export const RECIPE_ITEM_UPDATE_INGREDIENT_PRODUCT_UNIT = "RECIPE_ITEM_UPDATE_INGREDIENT_PRODUCT_UNIT";
export const RECIPE_ITEM_UPDATE_ALT_NUTRITION_FACTS = "RECIPE_ITEM_UPDATE_ALT_NUTRITION_FACTS";

export const RECIPE_ITEM_ADD_INGREDIENT = "RECIPE_ITEM_ADD_INGREDIENT";
export const RECIPE_ITEM_ADD_INGREDIENT_PRODUCT = "RECIPE_ITEM_ADD_INGREDIENT_PRODUCT";


export const RECIPE_ITEM_FETCH_NEW = "RECIPE_ITEM_FETCH_NEW";
export const RECIPE_ITEM_FETCH_REQUEST = "RECIPE_ITEM_FETCH_REQUEST";
export const RECIPE_ITEM_FETCH_SUCCESS = "RECIPE_ITEM_FETCH_SUCCESS";
export const RECIPE_ITEM_FETCH_ERROR = "RECIPE_ITEM_FETCH_ERROR";

export const RECIPE_ITEM_CREATE_REQUEST = "RECIPE_ITEM_CREATE_REQUEST";
export const RECIPE_ITEM_CREATE_SUCCESS = "RECIPE_ITEM_CREATE_SUCCESS";
export const RECIPE_ITEM_CREATE_ERROR = "RECIPE_ITEM_CREATE_ERROR";

export const RECIPE_ITEM_UPDATE_REQUEST = "RECIPE_ITEM_UPDATE_REQUEST";
export const RECIPE_ITEM_UPDATE_SUCCESS = "RECIPE_ITEM_UPDATE_SUCCESS";
export const RECIPE_ITEM_UPDATE_ERROR = "RECIPE_ITEM_UPDATE_ERROR";


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
    payload: { directionIndex: number, stepNumber: number };
}

export interface ToggleSubDirectionMarkAction {
    type: typeof RECIPE_ITEM_TOGGLE_SUBDIRECTION_MARK;
    payload: { directionIndex: number, stepNumber: number };
}

export interface UpdateSubDirectionNoteAction {
    type: typeof RECIPE_ITEM_UPDATE_SUBDIRECTION_NOTE;
    payload: { directionIndex: number, stepNumber: number, note: string };
}

export interface UpdateSubDirectionIngredientAmountAction {
    type: typeof RECIPE_ITEM_UPDATE_SUBDIRECTION_INGREDIENT_AMOUNT;
    payload: { directionIndex: number, stepNumber: number, inputValue: string };
}

export interface UpdateSubDirectionIngredientUnitAction {
    type: typeof RECIPE_ITEM_UPDATE_SUBDIRECTION_INGREDIENT_UNIT;
    payload: { directionIndex: number, stepNumber: number, unit: units.WeightUnit | units.VolumeUnit };
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

export interface RemoveIngredientProductAction {
    type: typeof RECIPE_ITEM_REMOVE_INGREDIENT_PRODUCT;
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

export interface UpdateIngredientProductAmountAction {
    type: typeof RECIPE_ITEM_UPDATE_INGREDIENT_PRODUCT_AMOUNT;
    payload: { parentId: number, id: number, inputValue: string };
}

export interface UpdateIngredientProductUnitAction {
    type: typeof RECIPE_ITEM_UPDATE_INGREDIENT_PRODUCT_UNIT;
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

export interface AddIngredientProductAction {
    type: typeof RECIPE_ITEM_ADD_INGREDIENT_PRODUCT;
    payload: { id: number, ingredientProduct: typings.IngredientProduct };
}

export interface RecipeItemFetchNewAction {
    type: typeof RECIPE_ITEM_FETCH_NEW;
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


export interface AddCustomUnitAction {
    type: typeof RECIPE_ITEM_ADD_CUSTOM_UNIT;
    payload: units.CustomUnitInput;
}

export interface RemoveCustomUnitAction {
    type: typeof RECIPE_ITEM_REMOVE_CUSTOM_UNIT;
    payload: number;
}

export interface UpdateCustomUnitAction {
    type: typeof RECIPE_ITEM_UPDATE_CUSTOM_UNIT;
    payload: {
        index: number;
        customUnit: units.CustomUnitInput;
    };
}

export interface RecipeItemCreateRequestAction {
    type: typeof RECIPE_ITEM_CREATE_REQUEST;
}

export interface RecipeItemCreateSuccessAction {
    type: typeof RECIPE_ITEM_CREATE_SUCCESS;
    payload: Recipe;
}

export interface RecipeItemCreateErrorAction {
    type: typeof RECIPE_ITEM_CREATE_ERROR;
    payload: string;
}

export interface RecipeItemUpdateRequestAction {
    type: typeof RECIPE_ITEM_UPDATE_REQUEST;
}

export interface RecipeItemUpdateSuccessAction {
    type: typeof RECIPE_ITEM_UPDATE_SUCCESS;
    payload: Recipe;
}

export interface RecipeItemUpdateErrorAction {
    type: typeof RECIPE_ITEM_UPDATE_ERROR;
    payload: string;
}

export type RecipeItemActionTypes = (
    UpdateNameAction | UpdateBrandAction | UpdateSubtitleAction | UpdateDescriptionAction | UpdateTypeAction |
    UpdateServingSizeAmountAction | UpdateServingSizeUnitAction |

    RemoveDirectionAction | RemoveSubDirectionAction | ToggleDirectionOpenAction | ToggleDirectionMarkAction |
    ToggleSubDirectionMarkAction | UpdateSubDirectionNoteAction |

    UpdateSubDirectionIngredientAmountAction | UpdateSubDirectionIngredientUnitAction |
    CreateSubDirectionIngredientAction | CreateSubDirectionAction |
    UpdateDirectionStepNumberAction | UpdateDirectionNameAction |
    UpdateDirectionTemperatureCountAction | UpdateDirectionTemperatureUnitAction |
    UpdateDirectionTimeCountAction | UpdateDirectionTimeUnitAction | CreateDirectionAction |

    UpdateNewDirectionStepNumberAction | UpdateNewDirectionNameAction | UpdateNewDirectionTemperatureCountAction |
    UpdateNewDirectionTemperatureUnitAction | UpdateNewDirectionTimeCountAction | UpdateNewDirectionTimeUnitAction |

    RemoveIngredientAction | RemoveIngredientProductAction | ReplaceIngredientWithAlternativeAction |
    ToggleIngredientOpenAction | ToggleIngredientMarkAction |

    UpdateIngredientAmountAction | UpdateIngredientUnitAction | UpdateIngredientProductAmountAction | UpdateIngredientProductUnitAction |
    UpdateAltNutritionFactsAction | AddIngredientAction | AddIngredientProductAction |

    RecipeItemFetchRequestAction | RecipeItemFetchSuccessAction | RecipeItemFetchErrorAction | RecipeItemFetchNewAction |
    AddCustomUnitAction | RemoveCustomUnitAction | UpdateCustomUnitAction |

    RecipeItemCreateRequestAction | RecipeItemCreateSuccessAction | RecipeItemCreateErrorAction |
    RecipeItemUpdateRequestAction | RecipeItemUpdateSuccessAction | RecipeItemUpdateErrorAction
);
