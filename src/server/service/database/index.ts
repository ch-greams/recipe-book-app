import Logger, { LogLevel } from "../../../common/server/logger";
import { Food, Recipe } from "../../../common/typings";
import { MongoClient, Db, MongoError } from "mongodb";
import foodSchema from "./schemas/food";
import recipeSchema from "./schemas/recipe";
import { SchemaValidator } from "./schemas/types";



export default class Database {

    private static readonly DB_NAME: string = "recipe_book_app";
    private static readonly DEFAULT_LIMIT: number = 100;

    private path: string;

    private db: Db;

    public constructor() {

        this.path = `mongodb://${process.env.MONGODB_URL}`;
    }

    public async connect(): Promise<void> {

        try {
            const client = await MongoClient.connect(this.path, { useUnifiedTopology: true });

            Logger.log(LogLevel.INFO, "Database.connect", "Connected successfully to a server");
    
            this.db = client.db(Database.DB_NAME);
    
            this.config(foodSchema, recipeSchema);

            // client.close();
        }
        catch (err) {
            const { message } = err as MongoError;
            Logger.log(LogLevel.WARNING, "Database.connect", message);
        }
    }

    private async config(foodSchema: SchemaValidator, recipeSchema: SchemaValidator): Promise<void> {

        Logger.log(LogLevel.INFO, "Database.config", "Updating schema validators for collections...");

        await this.db.command({ collMod: "food", validator: foodSchema });
        await this.db.command({ collMod: "recipe", validator: recipeSchema });

        Logger.log(LogLevel.INFO, "Database.config", "Done");
    }


    public async getFoodRecords(limit: number = Database.DEFAULT_LIMIT): Promise<Food[]> {

        try {
            const collection = this.db.collection("food");

            const options = { sort: { id: 1 }, limit: limit };
            const records = await collection.find<Food>({}, options).toArray();
    
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

    public async getRecipeRecords(limit: number = Database.DEFAULT_LIMIT): Promise<Recipe[]> {

        try {
            const collection = this.db.collection("recipe");

            const options = { sort: { id: 1 }, limit: limit };
            const records = await collection.find<Recipe>({}, options).toArray();
    
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

            // const record = await collection.findOne<Recipe>({ id });
    
            const records = await collection.aggregate([
                {
                    $match: { id },
                },
                {
                    $lookup: {
                        from: "food",
                        let: { "fid": "$references.food" },
                        pipeline: [
                            { $match: { $expr: { $in: [ "$id", "$$fid" ] } } },
                            { $project: { "_id": 0, "customUnits": 0 } },
                        ],
                        as: "references.food",
                    },
                },
            ]).toArray();

            const [ record ] = records;

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
