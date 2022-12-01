import superagent from "superagent";

import type { ProductShort } from "@common/typings";
import type { ProductType } from "@common/utils";
import Utils from "@common/utils";


export default class ProductApi {

    private static readonly API_PATH: string = "/api/v1/product";


    public static async getFavoriteProducts<T>(productType: ProductType): Promise<T[]> {

        const params = Utils.getUrlParams({ limit: 20, user_id: 1, product_type: productType });

        const { body: products } = await superagent.get(`${ProductApi.API_PATH}/favorite?${params}`);

        return products;
    }

    public static async getCustomProducts<T>(productType: ProductType): Promise<T[]> {

        const params = Utils.getUrlParams({ limit: 20, user_id: 1, product_type: productType });

        const { body: products } = await superagent.get(`${ProductApi.API_PATH}/created?${params}`);

        return products;
    }

    public static async getProducts(filter: string): Promise<ProductShort[]> {

        const params = Utils.getUrlParams({ limit: 10, user_id: 1, filter: filter });

        const { body: products } = await superagent.get(`${ProductApi.API_PATH}?${params}`);

        return products;
    }

    public static async deleteFavoriteProduct(productId: number): Promise<void> {

        const params = Utils.getUrlParams({ user_id: 1 });

        await superagent.post(`${ProductApi.API_PATH}/favorite/delete?${params}`).send({ id: productId });
    }

    public static async deleteProduct(productId: number): Promise<void> {

        await superagent.post(`${ProductApi.API_PATH}/delete`).send({ id: productId });
    }
}
