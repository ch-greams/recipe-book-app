import superagent from "superagent";

import type { Recipe } from "@common/typings";


export default class RecipeApi {

    public static readonly API_PATH: string = "/api/v1/recipe";


    public static async getRecipeItem(id: number): Promise<Recipe> {

        const { body: recipeItem } = await superagent.get(`${RecipeApi.API_PATH}/${id}`);

        return recipeItem;
    }

    // public static async getRecipeItems(): Promise<Recipe[]> {

    //     const { body: recipeItems } = await superagent.get(RecipeApi.API_PATH);

    //     return recipeItems;
    // }
}
