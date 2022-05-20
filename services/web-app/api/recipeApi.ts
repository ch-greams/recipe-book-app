import superagent from "superagent";

import type { Recipe } from "@common/typings";


export default class RecipeApi {

    private static readonly API_PATH: string = "/api/v1/recipe";


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
}
