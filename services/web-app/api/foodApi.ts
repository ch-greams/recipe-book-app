import { getUrlParams, HttpError } from "@common/http";
import { Header, ResourceType } from "@common/http";
import type { FoodShort } from "@common/typings";


export default class FoodApi {

    private static readonly API_PATH: string = "/api/v1/food";


    public static async getFoodShorts(filter: string): Promise<FoodShort[]> {

        const params = getUrlParams({ limit: 10, filter: filter });

        const response = await fetch(`${FoodApi.API_PATH}?${params}`, {
            method: "GET",
            headers: { [Header.ACCEPT]: ResourceType.JSON },
        });

        if (response.ok) {
            const foods: FoodShort[] = await response.json();
            return foods;
        }
        else {
            throw new HttpError(response.status);
        }
    }

    public static async deleteFavoriteFood(foodId: number): Promise<void> {

        const response = await fetch(`${FoodApi.API_PATH}/favorite/delete`, {
            method: "POST",
            headers: { [Header.CONTENT_TYPE]: ResourceType.JSON },
            body: JSON.stringify({ id: foodId }),
        });

        if (!response.ok) {
            throw new HttpError(response.status);
        }
    }

    public static async deleteFood(foodId: number): Promise<void> {

        const response = await fetch(`${FoodApi.API_PATH}/delete`, {
            method: "POST",
            headers: { [Header.CONTENT_TYPE]: ResourceType.JSON },
            body: JSON.stringify({ id: foodId }),
        });

        if (!response.ok) {
            throw new HttpError(response.status);
        }
    }
}
