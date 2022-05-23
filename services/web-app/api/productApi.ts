import superagent from "superagent";

import type { ProductShort } from "@common/typings";
import type { ProductType } from "@common/utils";
import Utils from "@common/utils";


export default class ProductApi {

    private static readonly API_PATH: string = "/api/v1/product";


    public static async getFavoriteProductItems<T>(productType: ProductType): Promise<T[]> {

        const params = Utils.getUrlParams({ limit: 20, user_id: 1, product_type: productType });

        const { body: ProductItems } = await superagent.get(`${ProductApi.API_PATH}/favorite?${params}`);

        return ProductItems;
    }

    public static async getCustomProductItems<T>(productType: ProductType): Promise<T[]> {

        const params = Utils.getUrlParams({ limit: 20, user_id: 1, product_type: productType });

        const { body: ProductItems } = await superagent.get(`${ProductApi.API_PATH}/created?${params}`);

        return ProductItems;
    }

    public static async getProductItems(filter: string): Promise<ProductShort[]> {

        const params = Utils.getUrlParams({
            limit: 10,
            user_id: 1,
            filter: filter,
        });

        const { body: recipeItems } = await superagent.get(`${ProductApi.API_PATH}?${params}`);

        return recipeItems;
    }
}
