import superagent from "superagent";

import type { Food, FoodShort } from "@common/typings";


export default class FoodApi {

    public static readonly API_PATH: string = "/api/v1/food";


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

    public static async getFavoriteFoodItems(): Promise<FoodShort[]> {

        const userId = 1;

        const { body: recipeItems } = await superagent.get(`${FoodApi.API_PATH}/favorite/${userId}`);

        return recipeItems;
    }

    public static async getCustomFoodItems(): Promise<FoodShort[]> {

        const userId = 1;

        const { body: recipeItems } = await superagent.get(`${FoodApi.API_PATH}?limit=20&user_id=${userId}`);

        return recipeItems;
    }

    // TODO: Deprecate with RBA-12
    public static async getFoodItemsDetailed(): Promise<Food[]> {

        const { body: foodItems } = await superagent.get(`${FoodApi.API_PATH}/detailed`);

        return foodItems;
    }
}
