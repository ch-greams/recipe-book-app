import { NutritionFactType } from "../../../common/nutritionFacts";
import { Dictionary } from "../../../common/typings";
import { CustomUnitInput, UnitVolume, UnitWeight } from "../../../common/units";


interface IngredientFood {
    id: string;
    name: string;

    nutritionFacts: Dictionary<NutritionFactType, number>;
}

export interface IngredientAlternative {
    amount: number;
    unit: UnitWeight | UnitVolume;

    item: IngredientFood;
}

export interface Ingredient {
    isOpen: boolean;

    item: IngredientFood;
    amount: number;
    unit: UnitWeight | UnitVolume;
    alternatives: IngredientAlternative[];
}

export interface DirectionStep {
    foodId: string;
    amount: number;
}

export interface Direction {
    name: string;
    notes: string[];
    subSteps: DirectionStep[];
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

    ingredients: Ingredient[];
    directions: Direction[];
}



export const RECIPE_ITEM_UPDATE_NAME = "RECIPE_ITEM_UPDATE_NAME";
export const RECIPE_ITEM_UPDATE_BRAND = "RECIPE_ITEM_UPDATE_BRAND";
export const RECIPE_ITEM_UPDATE_SUBTITLE = "RECIPE_ITEM_UPDATE_SUBTITLE";
export const RECIPE_ITEM_UPDATE_DESCRIPTION = "RECIPE_ITEM_UPDATE_DESCRIPTION";

export const RECIPE_ITEM_UPDATE_INGREDIENTS = "RECIPE_ITEM_UPDATE_INGREDIENTS";


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
    payload: Ingredient[];
}

export type RecipeItemActionTypes = (
    UpdateNameAction | UpdateBrandAction | UpdateSubtitleAction | UpdateDescriptionAction |
    UpdateIngredientsAction
);
