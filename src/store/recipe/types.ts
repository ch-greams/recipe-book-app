

export interface RecipeItem {
    name: string;
    description: string;
}



export const RECIPE_ITEM_UPDATE_NAME = "RECIPE_ITEM_UPDATE_NAME";


interface UpdateNameAction {
    type: typeof RECIPE_ITEM_UPDATE_NAME;
    payload: string;
}


export type RecipeItemActionTypes = (
    UpdateNameAction
);
