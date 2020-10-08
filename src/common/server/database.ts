import Logger, { LogLevel } from "./logger";
import FileSystem from "./fileSystem";
import { Food } from "../typings";



export default class Database {

    public static readonly FOOD_DATABASE_PATH: string = "food.json";
    public static readonly RECIPE_DATABASE_PATH: string = "recipe.json";


    public static async getRecords(): Promise<Food[]> {

        const records = await FileSystem.readJsonFileAsync<Food[]>(
            FileSystem.getPath(Database.FOOD_DATABASE_PATH)
        );

        Logger.log(LogLevel.DEBUG, "Database.getRecords", records);

        return records;
    }

    public static async getRecord(id: string): Promise<Food> {

        const records = await Database.getRecords();

        const record = records.find((item) => item.id === id);

        Logger.log(LogLevel.DEBUG, "Database.getRecord", record);

        return record;
    }
}
