import { NutritionFactType } from "../../../common/nutritionFacts";
import { Dictionary } from "../../../common/typings";
import { CustomUnitInput, UnitTemperature, UnitTime, UnitVolume, UnitWeight } from "../../../common/units";


export interface IngredientItem {
    id: string;
    name: string;
    nutritionFacts: Dictionary<NutritionFactType, number>;
}

type Ingredient = {
    amount: number;
    unit: UnitWeight | UnitVolume;
    item: IngredientItem;
};

export interface IngredientAlternative extends Ingredient {
    amountInput: string;
}

export interface IngredientDefault extends Ingredient {
    isOpen: boolean;
    isMarked: boolean;
    amountInput: string;
    alternatives: IngredientAlternative[];
    altNutritionFacts: Dictionary<NutritionFactType, number>;
}


interface Time {
    count: number;
    unit: UnitTime;
}

interface Temperature {
    count: number;
    unit: UnitTemperature;
}

export enum SubDirectionType {
    Tip = "Tip",
    Note = "Note",
    Warning = "Warning",
    Ingredient = "Ingredient",
}

export interface SubDirection {
    type: SubDirectionType;
    label: string;
}

export interface SubDirectionIngredient extends SubDirection {
    isMarked: boolean;
    id: string;
    amount: number;
    amountInput: string;
    unit: UnitWeight | UnitVolume;
}

export interface Direction {
    isOpen: boolean;
    isMarked: boolean;
    stepNumber: number;
    name: string;

    time?: Time;
    timeInput: string;

    temperature?: Temperature;
    temperatureInput: string;

    newStep: string;
    steps: (SubDirection | SubDirectionIngredient)[];
}


export interface RecipePageStore {

    isReadOnly: boolean;

    name: string;
    brand: string;
    subtitle: string;
    description: string;

    customUnitInputs: CustomUnitInput[];

    type: string;

    servingSize: number;

    unit: UnitWeight | UnitVolume;

    ingredients: IngredientDefault[];

    newDirection: Direction;
    directions: Direction[];
}



export const RECIPE_ITEM_UPDATE_NAME = "RECIPE_ITEM_UPDATE_NAME";
export const RECIPE_ITEM_UPDATE_BRAND = "RECIPE_ITEM_UPDATE_BRAND";
export const RECIPE_ITEM_UPDATE_SUBTITLE = "RECIPE_ITEM_UPDATE_SUBTITLE";
export const RECIPE_ITEM_UPDATE_DESCRIPTION = "RECIPE_ITEM_UPDATE_DESCRIPTION";

export const RECIPE_ITEM_UPDATE_INGREDIENTS = "RECIPE_ITEM_UPDATE_INGREDIENTS";
export const RECIPE_ITEM_UPDATE_DIRECTIONS = "RECIPE_ITEM_UPDATE_DIRECTIONS";
export const RECIPE_ITEM_REMOVE_DIRECTION = "RECIPE_ITEM_REMOVE_DIRECTION";
export const RECIPE_ITEM_TOGGLE_DIRECTION_OPEN = "RECIPE_ITEM_TOGGLE_DIRECTION_OPEN";
export const RECIPE_ITEM_TOGGLE_DIRECTION_MARK = "RECIPE_ITEM_TOGGLE_DIRECTION_MARK";
export const RECIPE_ITEM_UPDATE_NEW_DIRECTION = "RECIPE_ITEM_UPDATE_NEW_DIRECTION";

export const RECIPE_ITEM_REMOVE_SUBDIRECTION = "RECIPE_ITEM_REMOVE_SUBDIRECTION";
export const RECIPE_ITEM_TOGGLE_SUBDIRECTION_MARK = "RECIPE_ITEM_TOGGLE_SUBDIRECTION_MARK";
export const RECIPE_ITEM_UPDATE_SUBDIRECTION_NOTE = "RECIPE_ITEM_UPDATE_SUBDIRECTION_NOTE";
export const RECIPE_ITEM_UPDATE_SUBDIRECTION_INGREDIENT_AMOUNT = "RECIPE_ITEM_UPDATE_SUBDIRECTION_INGREDIENT_AMOUNT";
export const RECIPE_ITEM_UPDATE_SUBDIRECTION_INGREDIENT_UNIT = "RECIPE_ITEM_UPDATE_SUBDIRECTION_INGREDIENT_UNIT";
export const RECIPE_ITEM_CREATE_SUBDIRECTION_INGREDIENT = "RECIPE_ITEM_CREATE_SUBDIRECTION_INGREDIENT";
export const RECIPE_ITEM_CREATE_SUBDIRECTION = "RECIPE_ITEM_CREATE_SUBDIRECTION";
export const RECIPE_ITEM_UPDATE_NEW_SUBDIRECTION_TYPE = "RECIPE_ITEM_UPDATE_NEW_SUBDIRECTION_TYPE";
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

export interface UpdateIngredientsAction {
    type: typeof RECIPE_ITEM_UPDATE_INGREDIENTS;
    payload: IngredientDefault[];
}

export interface UpdateDirectionsAction {
    type: typeof RECIPE_ITEM_UPDATE_DIRECTIONS;
    payload: Direction[];
}

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

export interface UpdateNewDirectionAction {
    type: typeof RECIPE_ITEM_UPDATE_NEW_DIRECTION;
    payload: Direction;
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
    payload: { directionIndex: number, subDirectionIndex: number, unit: UnitWeight | UnitVolume };
}

export interface CreateSubDirectionIngredientAction {
    type: typeof RECIPE_ITEM_CREATE_SUBDIRECTION_INGREDIENT;
    payload: { directionIndex: number, ingredientId: string };
}
export interface CreateSubDirectionAction {
    type: typeof RECIPE_ITEM_CREATE_SUBDIRECTION;
    payload: { directionIndex: number, type: SubDirectionType };
}

export interface UpdateNewSubDirectionTypeAction {
    type: typeof RECIPE_ITEM_UPDATE_NEW_SUBDIRECTION_TYPE;
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
    payload: { directionIndex: number, unit: UnitTemperature };
}

export interface UpdateDirectionTimeCountAction {
    type: typeof RECIPE_ITEM_UPDATE_DIRECTION_TIME_COUNT;
    payload: { directionIndex: number, inputValue: string };
}

export interface UpdateDirectionTimeUnitAction {
    type: typeof RECIPE_ITEM_UPDATE_DIRECTION_TIME_UNIT;
    payload: { directionIndex: number, unit: UnitTime };
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
    payload: UnitTemperature;
}

export interface UpdateNewDirectionTimeCountAction {
    type: typeof RECIPE_ITEM_UPDATE_NEW_DIRECTION_TIME_COUNT;
    payload: string;
}

export interface UpdateNewDirectionTimeUnitAction {
    type: typeof RECIPE_ITEM_UPDATE_NEW_DIRECTION_TIME_UNIT;
    payload: UnitTime;
}

export type RecipeItemActionTypes = (
    UpdateNameAction | UpdateBrandAction | UpdateSubtitleAction | UpdateDescriptionAction |
    UpdateIngredientsAction | UpdateDirectionsAction | UpdateNewDirectionAction |

    RemoveDirectionAction | RemoveSubDirectionAction | ToggleDirectionOpenAction | ToggleDirectionMarkAction |
    ToggleSubDirectionMarkAction | UpdateSubDirectionNoteAction |
    
    UpdateSubDirectionIngredientAmountAction | UpdateSubDirectionIngredientUnitAction |
    CreateSubDirectionIngredientAction | CreateSubDirectionAction | UpdateNewSubDirectionTypeAction |
    UpdateDirectionStepNumberAction | UpdateDirectionNameAction |
    UpdateDirectionTemperatureCountAction | UpdateDirectionTemperatureUnitAction |
    UpdateDirectionTimeCountAction | UpdateDirectionTimeUnitAction |

    UpdateNewDirectionStepNumberAction | UpdateNewDirectionNameAction | UpdateNewDirectionTemperatureCountAction |
    UpdateNewDirectionTemperatureUnitAction | UpdateNewDirectionTimeCountAction | UpdateNewDirectionTimeUnitAction
);
