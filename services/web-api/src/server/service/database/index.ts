import type { DatabaseError, PoolClient, QueryResult } from "pg";
import { Pool } from "pg";

import Logger, { LogLevel } from "@common/logger";
import type { Food, Option, Recipe } from "@common/typings";


export default class Database {

    private static readonly DEFAULT_LIMIT: number = 100;

    private pool: Pool;


    public constructor() {

        this.pool = new Pool({
            host: process.env.PG_HOST || "127.0.0.1",
            user: "postgres",
            password: "password",
        });

        this.pool.on("error", (error, client) => {
            Logger.log(LogLevel.ERROR, "Pool.event", error.message);
            client.release();
        });
    }

    private async call<T>(query: (client: PoolClient) => Promise<T>): Promise<Option<T>> {
        return new Promise((resolve, reject) => {

            this.pool.connect((connectionError: Error, client: PoolClient, done: () => void) => {

                if (connectionError) {
                    reject(connectionError);
                }
                else {
                    query(client)
                        .then((value) => {
                            done();
                            resolve(value);
                        })
                        .catch((queryError) => {
                            done();
                            reject(queryError);
                        });
                }
            });
        });
    }

    private getRows<T>(response: Option<QueryResult<T>>): T[] {
        return response?.rows || [];
    }

    public async getFoodRecords(limit: number = Database.DEFAULT_LIMIT): Promise<Food[]> {

        try {

            const response = await this.call(
                (client: PoolClient) => client.query(`SELECT json FROM private.food_json LIMIT ${limit}`),
            );

            Logger.log(LogLevel.DEBUG, "Database.getFoodRecords", response);

            return this.getRows(response).map((row) => row.json);
        }
        catch (err) {
            const { message } = err as DatabaseError;
            Logger.log(LogLevel.ERROR, "Database.getFoodRecords", message);

            return [];
        }
    }

    public async getFoodRecord(id: string): Promise<Option<Food>> {

        try {

            const response = await this.call(
                (client: PoolClient) => client.query(`SELECT json FROM private.food_json WHERE id = ${id}`),
            );
            
            Logger.log(LogLevel.DEBUG, "Database.getFoodRecord", response);

            return this.getRows(response).first()?.json;
        }
        catch (err) {
            const { message } = err as DatabaseError;
            Logger.log(LogLevel.ERROR, "Database.getFoodRecord", message);

            return null;
        }
    }

    public async getRecipeRecords(limit: number = Database.DEFAULT_LIMIT): Promise<Recipe[]> {

        try {

            const response = await this.call(
                (client: PoolClient) => client.query(`SELECT json FROM private.recipe_json LIMIT ${limit}`),
            );
            
            Logger.log(LogLevel.DEBUG, "Database.getRecipeRecords", response);

            return this.getRows(response).map((row) => row.json);
        }
        catch (err) {
            const { message } = err as DatabaseError;
            Logger.log(LogLevel.ERROR, "Database.getRecipeRecords", message);

            return [];
        }
    }

    public async getRecipeRecord(id: string): Promise<Option<Recipe>> {

        try {

            const response = await this.call(
                (client: PoolClient) => client.query(`SELECT json FROM private.recipe_json WHERE id = ${id}`),
            );
            
            Logger.log(LogLevel.DEBUG, "Database.getRecipeRecord", response);

            return this.getRows(response).first()?.json;
        }
        catch (err) {
            const { message } = err as DatabaseError;
            Logger.log(LogLevel.ERROR, "Database.getRecipeRecord", message);

            return null;
        }
    }
}
