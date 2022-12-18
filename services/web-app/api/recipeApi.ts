import { HttpError } from "@common/http";
import { Header, ResourceType } from "@common/http";
import type { Recipe } from "@common/typings";


export default class RecipeApi {

    private static readonly API_PATH: string = "/api/v1/recipe";


    public static async getRecipe(id: number): Promise<Recipe> {

        const response = await fetch(`${RecipeApi.API_PATH}/${id}`, {
            method: "GET",
            headers: { [Header.ACCEPT]: ResourceType.JSON },
        });

        if (response.ok) {
            const recipe: Recipe = await response.json();
            return recipe;
        }
        else {
            throw new HttpError(response.status);
        }
    }

    public static async createRecipe(recipe: Recipe): Promise<Recipe> {

        const response = await fetch(`${RecipeApi.API_PATH}/create`, {
            method: "POST",
            headers: {
                [Header.ACCEPT]: ResourceType.JSON,
                [Header.CONTENT_TYPE]: ResourceType.JSON,
            },
            body: JSON.stringify(recipe),
        });

        if (response.ok) {
            const createdRecipe: Recipe = await response.json();
            return createdRecipe;
        }
        else {
            throw new HttpError(response.status);
        }
    }

    public static async updateRecipe(recipe: Recipe): Promise<Recipe> {

        const response = await fetch(`${RecipeApi.API_PATH}/update`, {
            method: "POST",
            headers: {
                [Header.ACCEPT]: ResourceType.JSON,
                [Header.CONTENT_TYPE]: ResourceType.JSON,
            },
            body: JSON.stringify(recipe),
        });

        if (response.ok) {
            const updatedRecipe: Recipe = await response.json();
            return updatedRecipe;
        }
        else {
            throw new HttpError(response.status);
        }
    }
}
