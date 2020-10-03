import { CustomUnitInput, UnitVolume, UnitWeight } from "../../../common/units";


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
