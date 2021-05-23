import express, { Router } from "express";

import { Food, Option } from "@common/typings";
import Utils from "@common/utils";
import Database from "@server/service/database";
import { HttpStatusClientError } from "@server/service/webApp";


function getFoodRecords(database: Database) {
    
    return async (_request: express.Request, response: express.Response): Promise<void> => {

        const records: Food[] = await database.getFoodRecords();

        response.send(records);
    };
}


function getFoodRecord(database: Database) {
    
    return async (request: express.Request, response: express.Response): Promise<void> => {

        const record: Option<Food> = await database.getFoodRecord(request.params.foodId);

        if (Utils.isSome(record)) {
            response.send(record);
        }
        else {
            response.send(HttpStatusClientError.NotFound);
        }

    };
}

export function foodApiRouter(database: Database): Router {

    const router = express.Router();

    router.get("/", getFoodRecords(database));

    router.get("/:foodId", getFoodRecord(database));

    return router;
}
