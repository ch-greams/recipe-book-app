import express from "express";

import Logger, { LogLevel } from "@common/logger";
import Utils from "@common/utils";
import { foodApiRouter } from "@server/service/api/foodApi";
import { recipeApiRouter } from "@server/service/api/recipeApi";
import type Database from "@server/service/database";
import { HttpStatusSuccess } from "@server/service/webApp";


export * from "./enums";

export default class WebApp {

    private static readonly DEFAULT_PORT: number = 8080;

    private app: express.Application;

    private port: number;


    public constructor(database: Database) {

        this.app = express();

        this.port = (parseInt(Utils.unwrap(process.env.PORT, ""), 10) || WebApp.DEFAULT_PORT);

        this.config();
        this.routes(database);
    }

    public run(): void {
        this.app.listen(this.port, () => Logger.log(LogLevel.INFO, "WebApp.run", `App started on port ${this.port}`));
    }

    private config(): void {

        this.app.use(express.static("view"));
        this.app.use(express.static("out/client"));

        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
    }

    private static getStatusEndpoint(_request: express.Request, response: express.Response): void {

        response.sendStatus(HttpStatusSuccess.Ok);
    }

    private static log(request: express.Request, _response: express.Response, next: express.NextFunction): void {

        Logger.log(LogLevel.INFO, "WebApp.log", `${request.method} ${request.url}`);

        next();
    }


    private routes(database: Database): void {

        // WebApp Endpoints

        this.app.get("/status", WebApp.log, WebApp.getStatusEndpoint);

        this.app.use("/api/food", foodApiRouter(database));

        this.app.use("/api/recipe", recipeApiRouter(database));
    }
}