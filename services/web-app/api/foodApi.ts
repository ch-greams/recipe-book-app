import superagent from "superagent";

import type { Food } from "@common/typings";


export default class FoodApi {

    public static readonly API_PATH: string = "/api/food";

    public static async getFoodItem(id: string): Promise<Food> {

        const { body: foodItem } = await superagent.get(`${FoodApi.API_PATH}/${id}`);

        return foodItem;
    }

    public static async getFoodItems(): Promise<Food[]> {

        const { body: foodItems } = await superagent.get(FoodApi.API_PATH);

        return foodItems;
    }
}