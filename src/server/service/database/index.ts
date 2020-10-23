import Logger, { LogLevel } from "../../../common/server/logger";
import { Food, Recipe } from "../../../common/typings";
import { MongoClient, Db, MongoError } from "mongodb";



export default class Database {

    private static readonly DB_NAME: string = "recipe_book_app";
    private static readonly DEFAULT_LIMIT: number = 100;

    private path: string;

    private db: Db;

    public constructor() {

        this.path = process.env.MONGODB_URL;
    }

    public async connect(): Promise<void> {

        try {
            const client = await MongoClient.connect(this.path, { useUnifiedTopology: true });

            Logger.log(LogLevel.INFO, "Database.connect", "Connected successfully to a server");
    
            this.db = client.db(Database.DB_NAME);
    
            // client.close();
        }
        catch (err) {
            const { message } = err as MongoError;
            Logger.log(LogLevel.WARNING, "Database.connect", message);
        }
    }


    public async getFoodRecords(): Promise<Food[]> {

        try {
            const collection = this.db.collection("food");

            const records = await collection.find<Food>()
                .sort({ id: 1 })
                .limit(Database.DEFAULT_LIMIT)
                .toArray();
    
            Logger.log(LogLevel.DEBUG, "Database.getFoodRecords", records);

            return records;
        }
        catch (err) {
            const { message } = err as MongoError;
            Logger.log(LogLevel.WARNING, "Database.getFoodRecords", message);

            return [];
        }
    }

    public async getFoodRecord(id: string): Promise<Food> {

        try {
            const collection = this.db.collection("food");

            const record = await collection.findOne<Food>({ id });
    
            Logger.log(LogLevel.DEBUG, "Database.getFoodRecord", record);

            return record;
        }
        catch (err) {
            const { message } = err as MongoError;
            Logger.log(LogLevel.WARNING, "Database.getFoodRecord", message);

            return null;
        }
    }

    public async getRecipeRecords(): Promise<Recipe[]> {

        try {
            const collection = this.db.collection("recipe");

            const records = await collection.find<Recipe>()
                .sort({ id: 1 })
                .limit(Database.DEFAULT_LIMIT)
                .toArray();
    
            Logger.log(LogLevel.DEBUG, "Database.getRecipeRecords", records);

            return records;
        }
        catch (err) {
            const { message } = err as MongoError;
            Logger.log(LogLevel.WARNING, "Database.getRecipeRecords", message);

            return [];
        }
    }

    public async getRecipeRecord(id: string): Promise<Recipe> {

        try {
            const collection = this.db.collection("recipe");

            const record = await collection.findOne<Recipe>({ id });
    
            Logger.log(LogLevel.DEBUG, "Database.getRecipeRecord", record);

            return record;
        }
        catch (err) {
            const { message } = err as MongoError;
            Logger.log(LogLevel.WARNING, "Database.getRecipeRecord", message);

            return null;
        }
    }
}
