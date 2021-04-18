import { RequestHandler } from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";

import { Food, Option, Recipe } from "@common/typings";
import Database from "@server/service/database";
import QuerySchema from "@server/service/graphql/schemas/query";



export default class GraphQL {

    public static getMiddleware(database: Database, isProduction: boolean): RequestHandler {

        const querySchema = buildSchema(QuerySchema);
    
        const foodsResolver = async (args: { limit: number }): Promise<Food[]> => {
            return await database.getFoodRecords(args.limit);
        };
        const foodResolver = async (args: { id: string }): Promise<Option<Food>> => {
            return await database.getFoodRecord(args.id);
        };

        const recipesResolver = async (args: { limit: number }): Promise<Recipe[]> => {
            return await database.getRecipeRecords(args.limit);
        };

        const recipeResolver = async (args: { id: string }): Promise<Option<Recipe>> => {
            return await database.getRecipeRecord(args.id);
        };

        return graphqlHTTP({
            schema: querySchema,
            rootValue: {
                foods: foodsResolver,
                food: foodResolver,
                recipes: recipesResolver,
                recipe: recipeResolver,
            },
            graphiql: !isProduction,
        });
    }
}
