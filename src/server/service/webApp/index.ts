import bodyParser from "body-parser";
import express, { RequestHandler } from "express";
import path from "path";
import Logger, { LogLevel } from "../../../common/server/logger";
import Database from "../database";
import { HttpStatusSuccess } from "../webApp";
import GraphQL from "../graphql";


export * from "./enums";

export default class WebApp {

    private static readonly DEFAULT_PORT: number = 8080;

    private app: express.Application;

    private port: number;


    public constructor(database: Database, isProduction: boolean = false) {

        this.app = express();

        this.port = (parseInt(process.env.PORT, 10) || WebApp.DEFAULT_PORT);

        this.config();
        this.routes(database, isProduction);
    }

    public run(): void {
        this.app.listen(this.port, () => Logger.log(LogLevel.INFO, "WebApp.run", `App started on port ${this.port}`));
    }

    private config(): void {

        this.app.use(express.static("view"));
        this.app.use(express.static("out/client"));

        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }

    private static getStatusEndpoint(_request: express.Request, response: express.Response): void {

        response.sendStatus(HttpStatusSuccess.Ok);
    }


    private static getFoodRecordsEndpoint(database: Database): RequestHandler {

        return async (_request, response) => {

            const records = await database.getFoodRecords();

            response.send(records);
        };
    }

    private static getFoodRecordEndpoint(database: Database): RequestHandler {

        return async (request, response) => {

            const { params: { id } } = request;

            const record = await database.getFoodRecord(id);
    
            response.send(record);
        };
    }

    private static getRecipeRecordsEndpoint(database: Database): RequestHandler {

        return async (_request, response) => {

            const records = await database.getRecipeRecords();

            response.send(records);
        };
    }

    private static getRecipeRecordEndpoint(database: Database): RequestHandler {

        return async (request, response) => {

            const { params: { id } } = request;

            const record = await database.getRecipeRecord(id);
    
            response.send(record);
        };
    }

    private static log(request: express.Request, _response: express.Response, next: express.NextFunction): void {

        Logger.log(LogLevel.INFO, "WebApp.log", `${request.method} ${request.url}`);

        next();
    }



    private routes(database: Database, isProduction: boolean): void {

        // WebApp Endpoints

        this.app.get("/status", WebApp.log, WebApp.getStatusEndpoint);

        this.app.use("/graphql", GraphQL.getMiddleware(database, isProduction));

        this.app.get("/api/food", WebApp.log, WebApp.getFoodRecordsEndpoint(database));

        this.app.get("/api/food/:id", WebApp.log, WebApp.getFoodRecordEndpoint(database));

        this.app.get("/api/recipe", WebApp.log, WebApp.getRecipeRecordsEndpoint(database));

        this.app.get("/api/recipe/:id", WebApp.log, WebApp.getRecipeRecordEndpoint(database));

        this.app.get("*", WebApp.log, (_req, res) => {
            res.sendFile( path.join(__dirname, "..", "..", "view", "index.html") );
        });
    }
}
