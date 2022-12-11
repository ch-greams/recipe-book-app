import { getUrlParams, Header, ResourceType } from "@common/http";
import type { ProductShort } from "@common/typings";
import type { ProductType } from "@common/utils";


export default class ProductApi {

    private static readonly API_PATH: string = "/api/v1/product";


    public static async getFavoriteProducts<T>(productType: ProductType): Promise<T[]> {

        const params = getUrlParams({ limit: 20, user_id: 1, product_type: productType });

        const response = await fetch(`${ProductApi.API_PATH}/favorite?${params}`, {
            method: "GET",
            headers: { [Header.ACCEPT]: ResourceType.JSON },
        });

        const products: T[] = await response.json();

        return products;
    }

    public static async getCustomProducts<T>(productType: ProductType): Promise<T[]> {

        const params = getUrlParams({ limit: 20, user_id: 1, product_type: productType });

        const response = await fetch(`${ProductApi.API_PATH}/created?${params}`, {
            method: "GET",
            headers: { [Header.ACCEPT]: ResourceType.JSON },
        });

        const products: T[] = await response.json();

        return products;
    }

    public static async getProducts(filter: string): Promise<ProductShort[]> {

        const params = getUrlParams({ limit: 10, user_id: 1, filter: filter });

        const response = await fetch(`${ProductApi.API_PATH}?${params}`, {
            method: "GET",
            headers: { [Header.ACCEPT]: ResourceType.JSON },
        });

        const products: ProductShort[] = await response.json();

        return products;
    }

    public static async deleteFavoriteProduct(productId: number): Promise<void> {

        const params = getUrlParams({ user_id: 1 });

        await fetch(`${ProductApi.API_PATH}/favorite/delete?${params}`, {
            method: "POST",
            headers: { [Header.CONTENT_TYPE]: ResourceType.JSON },
            body: JSON.stringify({ id: productId }),
        });
    }

    public static async deleteProduct(productId: number): Promise<void> {

        await fetch(`${ProductApi.API_PATH}/delete`, {
            method: "POST",
            headers: { [Header.CONTENT_TYPE]: ResourceType.JSON },
            body: JSON.stringify({ id: productId }),
        });
    }
}
