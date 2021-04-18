import bodyParser from "body-parser";
import express from "express";
import path from "path";

import Logger, { LogLevel } from "@common/server/logger";
import Utils from "@common/utils";
import Database from "@server/service/database";
import GraphQL from "@server/service/graphql";
import { HttpStatusSuccess } from "@server/service/webApp";


export * from "./enums";

export default class WebApp {

    private static readonly DEFAULT_PORT: number = 8080;

    private app: express.Application;

    private port: number;


    public constructor(database: Database, isProduction: boolean = false) {

        this.app = express();

        this.port = (parseInt(Utils.unwrap(process.env.PORT, ""), 10) || WebApp.DEFAULT_PORT);

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

    private static log(request: express.Request, _response: express.Response, next: express.NextFunction): void {

        Logger.log(LogLevel.INFO, "WebApp.log", `${request.method} ${request.url}`);

        next();
    }


    private routes(database: Database, isProduction: boolean): void {

        // WebApp Endpoints

        this.app.get("/status", WebApp.log, WebApp.getStatusEndpoint);

        this.app.use("/graphql", GraphQL.getMiddleware(database, isProduction));

        this.app.get("*", WebApp.log, (_req, res) => {
            res.sendFile( path.join(__dirname, "..", "..", "view", "index.html") );
        });
    }
}
