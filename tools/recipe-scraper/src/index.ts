#!/usr/bin/env node
import chalk from "chalk";
import type { OptionValues } from "commander";
import { Command, InvalidArgumentError } from "commander";

import { DEFAULT_DB } from "./common/utils";
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
// find-recipes [options] <website>
//------------------------------------------------------------------------------

interface FindPagesOptions extends OptionValues {
    db: string;
}

cli.command("find-recipes")
    .description("Traverse website and save all recipe page links")
    .argument<Website>("<website>", `name of the website to use (eg. ${getSupportedValues()})`, parseWebsiteEnum)
    .option("-d, --db <path>", "connection string for the postgres database", DEFAULT_DB)
    .action(async (website: Website, { db }: FindPagesOptions) => {
        await getWebsiteScraper(website, db).saveRecipePages();
    });

//------------------------------------------------------------------------------
// scrape-recipes [options] <website>
//------------------------------------------------------------------------------

interface ScrapeRecipeOptions extends OptionValues {
    db: string;
    limit: number;
}

cli.command("scrape-recipes")
    .description([
        "Scrape recipe data from provided pages.",
        "HINT: Identify website's limit and use vpn after reaching it.",
    ].join("\n"))
    .argument<Website>("<website>", `name of the website to use (eg. ${getSupportedValues()})`, parseWebsiteEnum)
    .option("-d, --db <path>", "connection string for the postgres database", DEFAULT_DB)
    .option<number>("-l, --limit <number>", "amount of the recipe records be file", Number, 1)
    .action(async (website: Website, { db, limit }: ScrapeRecipeOptions) => {
        await getWebsiteScraper(website, db).scrapePages(limit);
    });

//------------------------------------------------------------------------------

cli.parse(process.argv);

