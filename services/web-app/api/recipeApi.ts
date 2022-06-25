import superagent from "superagent";

import type { Recipe } from "@common/typings";


export default class RecipeApi {

    private static readonly API_PATH: string = "/api/v1/recipe";


    public static async getRecipe(id: number): Promise<Recipe> {

        const { body: recipe } = await superagent.get(`${RecipeApi.API_PATH}/${id}`);

        return recipe;
    }

    public static async createRecipe(recipe: Recipe): Promise<Recipe> {

        const { body: createdRecipe } = await superagent.post(`${RecipeApi.API_PATH}/create`)
            .send(recipe);

        return createdRecipe;
    }

    public static async updateRecipe(recipe: Recipe): Promise<Recipe> {

        const { body: updatedRecipe } = await superagent.post(`${RecipeApi.API_PATH}/update`)
            .send(recipe);

        return updatedRecipe;
    }
}
