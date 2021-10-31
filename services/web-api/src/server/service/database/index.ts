import type { DatabaseError } from "pg";
import { Client } from "pg";

import Logger, { LogLevel } from "@common/logger";
import type { Food, Option, Recipe } from "@common/typings";


export default class Database {

    private static readonly DEFAULT_LIMIT: number = 100;

    private client: Client;


    public constructor() {

        this.client = new Client({
            user: "postgres",
            password: "password",
        });
    }

    public async connect(): Promise<void> {

        try {
            await this.client.connect();

            Logger.log(LogLevel.INFO, "Database.connect", "Connected successfully to a server");
    
            // await this.client.end();
        }
        catch (err) {
            const { message } = err as DatabaseError;
            Logger.log(LogLevel.WARNING, "Database.connect", message);
        }
    }

    public async getFoodRecords(limit: number = Database.DEFAULT_LIMIT): Promise<Food[]> {

        try {

            const response = await this.client.query(`SELECT json FROM private.food_json LIMIT ${limit}`);
            
            Logger.log(LogLevel.DEBUG, "Database.getFoodRecords", response);

            return response.rows.map((row) => row.json);
        }
        catch (err) {
            const { message } = err as DatabaseError;
            Logger.log(LogLevel.WARNING, "Database.getFoodRecords", message);

            return [];
        }
    }

    public async getFoodRecord(id: string): Promise<Option<Food>> {

        try {

            const response = await this.client.query(`SELECT json FROM private.food_json WHERE id = ${id}`);
            
            Logger.log(LogLevel.DEBUG, "Database.getFoodRecord", response);

            return response?.rows?.first()?.json;
        }
        catch (err) {
            const { message } = err as DatabaseError;
            Logger.log(LogLevel.WARNING, "Database.getFoodRecord", message);

            return null;
        }
    }

    public async getRecipeRecords(limit: number = Database.DEFAULT_LIMIT): Promise<Recipe[]> {

        try {

            const response = await this.client.query(`SELECT json FROM private.recipe_json LIMIT ${limit}`);
            
            Logger.log(LogLevel.DEBUG, "Database.getRecipeRecords", response);

            return response.rows.map((row) => row.json);
        }
        catch (err) {
            const { message } = err as DatabaseError;
            Logger.log(LogLevel.WARNING, "Database.getRecipeRecords", message);

            return [];
        }
    }

    public async getRecipeRecord(id: string): Promise<Option<Recipe>> {

        try {

            const response = await this.client.query(`SELECT json FROM private.recipe_json WHERE id = ${id}`);
            
            Logger.log(LogLevel.DEBUG, "Database.getRecipeRecord", response);

            return response?.rows?.first()?.json;
        }
        catch (err) {
            const { message } = err as DatabaseError;
            Logger.log(LogLevel.WARNING, "Database.getRecipeRecord", message);

            return null;
        }
    }
}
