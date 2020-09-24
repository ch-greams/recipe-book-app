import url from "url";
import superagent from "superagent";
import { Food } from "../../common/typings";


export default class FoodApi {

    public static readonly API_PATH: string = "/api/food/";


    public static async getFoodItem(id: string): Promise<Food> {

        const response = await superagent.get(
            url.resolve(FoodApi.API_PATH, id)
        );

        return response.body;
    }

    public static async getFoodItems(): Promise<Food[]> {

        const response = await superagent.get(
            FoodApi.API_PATH
        );

        return response.body;
    }
}