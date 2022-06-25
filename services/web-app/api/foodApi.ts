import superagent from "superagent";

import type { Food } from "@common/typings";


export default class FoodApi {

    private static readonly API_PATH: string = "/api/v1/food";


    public static async getFood(id: number): Promise<Food> {

        const { body: food } = await superagent.get(`${FoodApi.API_PATH}/${id}`);

        return food;
    }

    public static async createFood(food: Food): Promise<Food> {

        const { body: createdFood } = await superagent.post(`${FoodApi.API_PATH}/create`)
            .send(food);

        return createdFood;
    }

    public static async updateFood(food: Food): Promise<Food> {

        const { body: updatedFood } = await superagent.post(`${FoodApi.API_PATH}/update`)
            .send(food);

        return updatedFood;
    }
}
