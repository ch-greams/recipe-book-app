import superagent from "superagent";

import type { Recipe, RecipeShort } from "@common/typings";


export default class RecipeApi {

    public static readonly API_PATH: string = "/api/v1/recipe";


    public static async getRecipeItem(id: number): Promise<Recipe> {

        const { body: recipeItem } = await superagent.get(`${RecipeApi.API_PATH}/${id}`);

        return recipeItem;
    }

    public static async createRecipeItem(recipeItem: Recipe): Promise<Recipe> {

        const { body: createdRecipeItem } = await superagent.post(`${RecipeApi.API_PATH}/create`)
            .send(recipeItem);

        return createdRecipeItem;
    }

    public static async updateRecipeItem(recipeItem: Recipe): Promise<Recipe> {

        const { body: updatedRecipeItem } = await superagent.post(`${RecipeApi.API_PATH}/update`)
            .send(recipeItem);

        return updatedRecipeItem;
    }

    public static async getFavoriteRecipeItems(): Promise<RecipeShort[]> {

        const userId = 1;

        const { body: recipeItems } = await superagent.get(`${RecipeApi.API_PATH}/favorite/${userId}`);

        return recipeItems;
    }

    public static async getCustomRecipeItems(): Promise<RecipeShort[]> {

        const userId = 1;

        const { body: recipeItems } = await superagent.get(`${RecipeApi.API_PATH}?limit=20&user_id=${userId}`);

        return recipeItems;
    }
}
