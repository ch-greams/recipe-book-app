#!/usr/bin/env node

import chalk from "chalk";
import type { OptionValues } from "commander";
import { Command, InvalidArgumentError } from "commander";

import Logger from "./common/logger";
import { DATA_FOLDER } from "./common/utils";
import { Website } from "./common/website-scraper";
import { getWebsiteScraper } from "./scrapers";



function getSupportedValues(): string {
    return Object.values(Website).join(", ");
}

function parseWebsiteEnum(value: string): Website {
    switch (value) {
        case Website.JamieOliver:
            return Website.JamieOliver;
        case Website.NYTimes:
            return Website.NYTimes;
        default:
            throw new InvalidArgumentError("Not a valid Website value.");
    }
}

//------------------------------------------------------------------------------
// recipe-scraper <command>
//------------------------------------------------------------------------------

const cli = new Command();

// Logger.log(chalk.cyan(`>>> ${process.env.npm_package_name} v${process.env.npm_package_version} <<<`));

cli.version(process.env.npm_package_version || "")
    .name("recipe-scraper")
    .description(chalk.blue("A tool for scraping recipes from websites"))
    .usage("<command>");

//------------------------------------------------------------------------------
// find-pages [options] <website>
//------------------------------------------------------------------------------

interface FindPagesOptions extends OptionValues {
    outputFolder: string;
}

cli.command("find-pages")
    .description(chalk.blue("Traverse website and save all recipe page links"))
    .argument<Website>("<website>", `name of the website to use (eg. ${getSupportedValues()})`, parseWebsiteEnum)
    .option("-o, --output-folder <path>", "path to the folder where you want to save recipe URLs", DATA_FOLDER)
    .action(async (website: Website, { outputFolder }: FindPagesOptions) => {
        Logger.info(`outputFolder: ${outputFolder}`);
        await getWebsiteScraper(website).saveRecipePages(outputFolder);
    });


//------------------------------------------------------------------------------
// scrape-recipes [options] <website>
//------------------------------------------------------------------------------

const DEFAULT_BATCH_SIZE: number = 100;

interface ScrapeRecipeOptions extends OptionValues {
    recipeUrls: string;
    offset: number;
    outputFolder: string;
    batchSize: number;
}

cli.command("scrape-recipes")
    .description(chalk.blue("Scrape recipe data from provided pages"))
    .argument<Website>("<website>", `name of the website to use (eg. ${getSupportedValues()})`, parseWebsiteEnum)
    .option("-u, --recipe-urls <path>", "path to the file from where you want to get recipe URLs", `${DATA_FOLDER}/recipe_urls.json`)
    .option("-o, --output-folder <path>", "path to the folder where you want to save recipes", DATA_FOLDER)
    .option<number>("-L, --limit <number>", "amount of the recipe records be file", Number, DEFAULT_BATCH_SIZE)
    .option<number>("-O, --offset <number>", "starting point for recipe scraping", Number, 0)
    .action(async (website: Website, { recipeUrls, offset, outputFolder, limit }: ScrapeRecipeOptions) => {
        Logger.info(`recipeUrls: ${recipeUrls}, offset: ${offset}, outputFolder: ${outputFolder}, limit: ${limit}`);
        const scraper = getWebsiteScraper(website);
        await scraper.scrapePages(recipeUrls, offset, outputFolder, limit);
    });



cli.parse(process.argv);

