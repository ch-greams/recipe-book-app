import { stringify } from "csv/sync";
import fs from "fs";

import Logger from "./common/logger";
import type { Recipe, RecipeDatasetType } from "./common/website-scraper";


//------------------------------------------------------------------------------
// With Context
//------------------------------------------------------------------------------

interface RecipeContext {
    id: number;
}

type TextWithContext<T> = [ string, T ];


export function saveDatasetWithContext(
    datasetType: RecipeDatasetType,
    recipes: Recipe[],
    outputFolder: string,
    format: "json" | "csv",
): void {

    let textToSave: string;

    switch (format) {
        case "csv": {
            textToSave = prepareDatasetWithContextCsv(datasetType, recipes);
            break;
        }
        case "json": {
            textToSave = prepareDatasetWithContextJson(datasetType, recipes);
            break;
        }
    }

    fs.writeFileSync(`${outputFolder}/recipe_${datasetType}.${format}`, textToSave);
}


function prepareDatasetWithContextCsv(datasetType: RecipeDatasetType, recipes: Recipe[]): string {

    const datasetValues = recipes.flatMap(
        (recipe, index) => recipe[datasetType].map(
            (datasetValue) => ({ id: index, [datasetType]: datasetValue }),
        ),
    );
    Logger.debug(`${datasetType}: ${datasetValues.length}`);

    return stringify(
        datasetValues,
        {
            header: true,
            columns: { id: "id", [datasetType]: datasetType },
        },
    );
}

function prepareDatasetWithContextJson(datasetType: RecipeDatasetType, recipes: Recipe[]): string {

    const datasetValues: TextWithContext<RecipeContext>[] = recipes.flatMap(
        (recipe, index) => recipe[datasetType].map<TextWithContext<RecipeContext>>(
            (datasetValue) => ([ datasetValue, { id: index } ]),
        ),
    );
    Logger.debug(`${datasetType}: ${datasetValues.length}`);

    return JSON.stringify(datasetValues);
}

//------------------------------------------------------------------------------
// Without Context
//------------------------------------------------------------------------------

export function saveDataset(datasetType: RecipeDatasetType, recipes: Recipe[], outputFolder: string, format: "json" | "csv"): void {

    let textToSave: string;

    switch (format) {
        case "csv": {
            textToSave = prepareDatasetCsv(datasetType, recipes);
            break;
        }
        case "json": {
            textToSave = prepareDatasetJson(datasetType, recipes);
            break;
        }
    }

    fs.writeFileSync(`${outputFolder}/recipe_${datasetType}.${format}`, textToSave);
}

function prepareDatasetCsv(datasetType: RecipeDatasetType, recipes: Recipe[]): string {

    const datasetValues = recipes.flatMap(
        (recipe) => recipe[datasetType].map( (datasetValue) => ({ [datasetType]: datasetValue }) ),
    );
    Logger.debug(`${datasetType}: ${datasetValues.length}`);

    return stringify(
        datasetValues,
        { header: true, columns: { [datasetType]: datasetType } },
    );
}

function prepareDatasetJson(datasetType: RecipeDatasetType, recipes: Recipe[]): string {

    const datasetValues = recipes.flatMap((recipe) => recipe[datasetType]);
    Logger.debug(`${datasetType}: ${datasetValues.length}`);

    return JSON.stringify(datasetValues);
}
