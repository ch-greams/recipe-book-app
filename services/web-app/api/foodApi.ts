import { HttpError } from "@common/http";
import { Header, ResourceType } from "@common/http";
import type { Food } from "@common/typings";


export default class FoodApi {

    private static readonly API_PATH: string = "/api/v1/food";


    public static async getFood(id: number): Promise<Food> {

        const response = await fetch(`${FoodApi.API_PATH}/${id}`, {
            method: "GET",
            headers: { [Header.ACCEPT]: ResourceType.JSON },
        });

        if (response.ok) {
            const food: Food = await response.json();
            return food;
        }
        else {
            throw new HttpError(response.status);
        }
    }

    public static async createFood(food: Food): Promise<Food> {

        const response = await fetch(`${FoodApi.API_PATH}/create`, {
            method: "POST",
            headers: {
                [Header.ACCEPT]: ResourceType.JSON,
                [Header.CONTENT_TYPE]: ResourceType.JSON,
            },
            body: JSON.stringify(food),
        });

        if (response.ok) {
            const createdFood: Food = await response.json();
            return createdFood;
        }
        else {
            throw new HttpError(response.status);
        }
    }

    public static async updateFood(food: Food): Promise<Food> {

        const response = await fetch(`${FoodApi.API_PATH}/update`, {
            method: "POST",
            headers: {
                [Header.ACCEPT]: ResourceType.JSON,
                [Header.CONTENT_TYPE]: ResourceType.JSON,
            },
            body: JSON.stringify(food),
        });

        if (response.ok) {
            const updatedFood: Food = await response.json();
            return updatedFood;
        }
        else {
            throw new HttpError(response.status);
        }
    }
}
