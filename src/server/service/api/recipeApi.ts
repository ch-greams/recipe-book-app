import express, { Router } from "express";

import { Option, Recipe } from "@common/typings";
import Utils from "@common/utils";
import Database from "@server/service/database";
import { HttpStatusClientError } from "@server/service/webApp";


function getRecipeRecords(database: Database) {
    
    return async (_request: express.Request, response: express.Response): Promise<void> => {

        const records: Recipe[] = await database.getRecipeRecords();

        response.send(records);
    };
}


function getRecipeRecord(database: Database) {
    
    return async (request: express.Request, response: express.Response): Promise<void> => {

        const record: Option<Recipe> = await database.getRecipeRecord(request.params.recipeId);

        if (Utils.isSome(record)) {
            response.send(record);
        }
        else {
            response.send(HttpStatusClientError.NotFound);
        }

    };
}

export function recipeApiRouter(database: Database): Router {

    const router = express.Router();

    router.get("/", getRecipeRecords(database));

    router.get("/:recipeId", getRecipeRecord(database));

    return router;
}
