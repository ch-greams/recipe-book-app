import { NutritionFactType } from "../../../common/nutritionFacts";
import { Dictionary } from "../../../common/typings";
import { CustomUnitInput, UnitVolume, UnitWeight } from "../../../common/units";


interface IngredientFood {
    id: string;
    name: string;

    nutritionFacts: Dictionary<NutritionFactType, number>;
}

export interface IngredientReference {
    id: string;
    amount: number;
}

export interface Ingredient {
    isOpen?: boolean;
    foodItem: IngredientFood;
    amount: number;
    alternatives: IngredientReference[];
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
}



export const RECIPE_ITEM_UPDATE_NAME = "RECIPE_ITEM_UPDATE_NAME";
export const RECIPE_ITEM_UPDATE_BRAND = "RECIPE_ITEM_UPDATE_BRAND";
export const RECIPE_ITEM_UPDATE_SUBTITLE = "RECIPE_ITEM_UPDATE_SUBTITLE";


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


export type RecipeItemActionTypes = (
    UpdateNameAction | UpdateBrandAction | UpdateSubtitleAction
);
