import {
    RECIPE_ITEM_UPDATE_NAME,
    RecipeItemActionTypes,
    RecipeItem,
} from "./types";



const initialState: RecipeItem = {

    name: "Cocoa Muffins",

    // eslint-disable-next-line max-len
    description: "These cocoa muffins, made with flour, sugar, cocoa, eggs, oil, and vanilla, are moist and have a not-too-sweet and in intense cocoa flavor. For those with more restrained chocolate cravings.",

};


export default function recipeItemReducer(state = initialState, action: RecipeItemActionTypes): RecipeItem {

    switch (action.type) {

        case RECIPE_ITEM_UPDATE_NAME: {
            return {
                ...state,
                name: action.payload,
            };
        }

        default:
            return state;
    }
}
