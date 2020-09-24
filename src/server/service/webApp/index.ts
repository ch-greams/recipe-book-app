import bodyParser from "body-parser";
import express from "express";
import path from "path";
import Database from "../../../common/server/database";
import Logger, { LogLevel } from "../../../common/server/logger";
import { HttpStatusSuccess } from "../webApp";


export * from "./enums";

export default class WebApp {

    private app: express.Application;

    private port: number;


    public constructor() {

        const DEFAULT_PORT = 8080;

        this.app = express();

        this.port = (parseInt(process.env.PORT, 10) || DEFAULT_PORT);

        this.config();
        this.routes();
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

    private static async getFoodRecordsEndpoint(_request: express.Request, response: express.Response): Promise<void> {

        const records = await Database.getRecords();

        response.send(records);
    }

    private static async getFoodRecordEndpoint(request: express.Request, response: express.Response): Promise<void> {

        const { params: { id } } = request;

        const record = await Database.getRecord(id);

        response.send(record);
    }

    private static log(request: express.Request, _response: express.Response, next: express.NextFunction): void {

        Logger.log(LogLevel.INFO, "WebApp.log", `${request.method} ${request.url}`);

        next();
    }



    private routes(): void {

        // WebApp Endpoints

        this.app.get("/status", WebApp.log, WebApp.getStatusEndpoint);

        this.app.get("/api/food", WebApp.log, WebApp.getFoodRecordsEndpoint);

        this.app.get("/api/food/:id", WebApp.log, WebApp.getFoodRecordEndpoint);

        this.app.get("*", WebApp.log, (_req, res) => {
            res.sendFile( path.join(__dirname, "..", "..", "view", "index.html") );
        });
    }
}
