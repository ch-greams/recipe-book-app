import superagent from "superagent";

import type { Food } from "@common/typings";


export default class FoodApi {

    private static readonly API_PATH: string = "/api/v1/food";


    public static async getFoodItem(id: number): Promise<Food> {

        const { body: foodItem } = await superagent.get(`${FoodApi.API_PATH}/${id}`);

        return foodItem;
    }

    public static async createFoodItem(foodItem: Food): Promise<Food> {

        const { body: createdFoodItem } = await superagent.post(`${FoodApi.API_PATH}/create`)
            .send(foodItem);

        return createdFoodItem;
    }

    public static async updateFoodItem(foodItem: Food): Promise<Food> {

        const { body: updatedFoodItem } = await superagent.post(`${FoodApi.API_PATH}/update`)
            .send(foodItem);

        return updatedFoodItem;
    }
}
