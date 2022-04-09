import superagent from "superagent";

import type { Recipe, RecipeShort } from "@common/typings";


export default class RecipeApi {

    public static readonly API_PATH: string = "/api/v1/recipe";


    public static async getRecipeItem(id: number): Promise<Recipe> {

        const { body: recipeItem } = await superagent.get(`${RecipeApi.API_PATH}/${id}`);

        return recipeItem;
    }

    public static async getFavoriteRecipeItems(): Promise<RecipeShort[]> {

        const { body: recipeItems } = await superagent.get(`${RecipeApi.API_PATH}/favorite/1`);

        return recipeItems;
    }

    public static async getCustomRecipeItems(): Promise<RecipeShort[]> {

        const { body: recipeItems } = await superagent.get(`${RecipeApi.API_PATH}?limit=20&user_id=1`);

        return recipeItems;
    }
}
