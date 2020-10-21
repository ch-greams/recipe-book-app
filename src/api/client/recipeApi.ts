import superagent from "superagent";
import { Recipe } from "../../common/typings";


export default class RecipeApi {

    public static readonly API_PATH: string = "/api/recipe/";


    public static async getRecipeItem(id: string): Promise<Recipe> {

        const response = await superagent.get(`${RecipeApi.API_PATH}${id}`);

        return response.body;
    }

    public static async getRecipeItems(): Promise<Recipe[]> {

        const response = await superagent.get(RecipeApi.API_PATH);

        return response.body;
    }
}