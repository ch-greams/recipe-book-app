import superagent from "superagent";

import { NUTRITION_FACT_TYPES_SEPARATED_BY_COMMA } from "@common/nutritionFacts";
import { Food } from "@common/typings";


export default class FoodApi {

    public static readonly API_PATH: string = "/graphql";
    public static readonly FOOD_TYPE_FIELDS: string = `
        id
        name
        brand
        subtitle
        density
        nutritionFacts {
            ${NUTRITION_FACT_TYPES_SEPARATED_BY_COMMA}
        }
        customUnits {
            name, amount, unit
        }
    `;


    public static async getFoodItem(id: string): Promise<Food> {

        const query = `
            {
                food(id: "${id}") {
                    ${FoodApi.FOOD_TYPE_FIELDS}
                }
            }
        `;

        const response = await superagent.get(FoodApi.API_PATH).query({ query });

        const { data: { food: record } } = response.body;

        return record;
    }

    public static async getFoodItems(): Promise<Food[]> {

        const query = `
            {
                foods {
                    ${FoodApi.FOOD_TYPE_FIELDS}
                }
            }
        `;

        const response = await superagent.get(FoodApi.API_PATH).query({ query });

        const { data: { foods: records } } = response.body;

        return records;
    }
}
