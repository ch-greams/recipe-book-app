import { HttpError } from "@common/http";
import { getUrlParams, Header, ResourceType } from "@common/http";
import type { FoodShort } from "@common/typings";


export default class ProductApi {

    private static readonly API_PATH: string = "/api/v1/product";


    public static async getProducts(filter: string): Promise<FoodShort[]> {

        const params = getUrlParams({ limit: 10, filter: filter });

        const response = await fetch(`${ProductApi.API_PATH}?${params}`, {
            method: "GET",
            headers: { [Header.ACCEPT]: ResourceType.JSON },
        });

        if (response.ok) {
            const products: FoodShort[] = await response.json();
            return products;
        }
        else {
            throw new HttpError(response.status);
        }
    }

    public static async deleteFavoriteProduct(productId: number): Promise<void> {

        const response = await fetch(`${ProductApi.API_PATH}/favorite/delete`, {
            method: "POST",
            headers: { [Header.CONTENT_TYPE]: ResourceType.JSON },
            body: JSON.stringify({ id: productId }),
        });

        if (!response.ok) {
            throw new HttpError(response.status);
        }
    }

    public static async deleteProduct(productId: number): Promise<void> {

        const response = await fetch(`${ProductApi.API_PATH}/delete`, {
            method: "POST",
            headers: { [Header.CONTENT_TYPE]: ResourceType.JSON },
            body: JSON.stringify({ id: productId }),
        });

        if (!response.ok) {
            throw new HttpError(response.status);
        }
    }
}
