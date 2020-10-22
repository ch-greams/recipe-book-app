import FileSystem from "../../../common/server/fileSystem";
import Logger, { LogLevel } from "../../../common/server/logger";
import { Food, Recipe } from "../../../common/typings";



export default class Database {

    public static readonly FOOD_DATABASE_PATH: string = "foods.json";
    public static readonly RECIPE_DATABASE_PATH: string = "recipes.json";


    public static async getFoodRecords(): Promise<Food[]> {

        const records = await FileSystem.readJsonFileAsync<Food[]>(
            FileSystem.getPath(Database.FOOD_DATABASE_PATH)
        );

        Logger.log(LogLevel.DEBUG, "Database.getFoodRecords", records);

        return records;
    }

    public static async getFoodRecord(id: string): Promise<Food> {

        const records = await Database.getFoodRecords();

        const record = records.find((item) => item.id === id);

        Logger.log(LogLevel.DEBUG, "Database.getFoodRecord", record);

        return record;
    }

    public static async getRecipeRecords(): Promise<Recipe[]> {

        const records = await FileSystem.readJsonFileAsync<Recipe[]>(
            FileSystem.getPath(Database.RECIPE_DATABASE_PATH)
        );

        Logger.log(LogLevel.DEBUG, "Database.getRecipeRecords", records);

        return records;
    }

    public static async getRecipeRecord(id: string): Promise<Recipe> {

        const records = await Database.getRecipeRecords();

        const record = records.find((item) => item.id === id);

        Logger.log(LogLevel.DEBUG, "Database.getRecipeRecord", record);

        return record;
    }
}
