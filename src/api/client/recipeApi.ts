import superagent from "superagent";
import { NUTRITION_FACT_TYPES_SEPARATED_BY_COMMA } from "../../common/nutritionFacts";
import { Recipe } from "../../common/typings";


export default class RecipeApi {

    public static readonly API_PATH: string = "/graphql";

    public static readonly INGREDIENT_TYPE_FIELDS: string = `
        amount
        unit

        item {
            id
            name
            nutritionFacts {
                ${NUTRITION_FACT_TYPES_SEPARATED_BY_COMMA}
            }
        }

        alternatives {

            amount
            unit

            item {
                id
                name
                nutritionFacts {
                    ${NUTRITION_FACT_TYPES_SEPARATED_BY_COMMA}
                }
            }
        }
    `;
    public static readonly DIRECTION_TYPE_FIELDS: string = `
        stepNumber
        name

        time {
            count, unit
        }

        temperature {
            count, unit
        }

        steps {
            type, label, id, amount
        }
    `;
    public static readonly RECIPE_TYPE_FIELDS: string = `
        id
        name
        brand
        subtitle
        description
        type

        customUnits {
            name, amount, unit
        }

        ingredients {
            ${RecipeApi.INGREDIENT_TYPE_FIELDS}
        }

        directions {
            ${RecipeApi.DIRECTION_TYPE_FIELDS}
        }
    `;


    public static async getRecipeItem(id: string): Promise<Recipe> {

        const query = `
            {
                recipe(id: "${id}") {
                    ${RecipeApi.RECIPE_TYPE_FIELDS}
                }
            }
        `;

        const response = await superagent.get(RecipeApi.API_PATH).query({ query });

        const { data: { recipe: record } } = response.body;

        return record;
    }

    public static async getRecipeItems(): Promise<Recipe[]> {

        const query = `
            {
                recipes {
                    ${RecipeApi.RECIPE_TYPE_FIELDS}
                }
            }
        `;

        const response = await superagent.get(RecipeApi.API_PATH).query({ query });

        const { data: { recipes: records } } = response.body;

        return records;
    }
}
