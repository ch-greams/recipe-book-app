import fs from "fs";

import Logger from "../common/logger";
import { isSome } from "../common/types";
import { getDocument, getText } from "../common/utils";
import type { Recipe } from "../common/website-scraper";
import { PageScraper, Website, WebsiteScraper } from "../common/website-scraper";

// NOTE: Currently limits to 600 requests per uncertain period of time, use VPN to avoid it

export class JamieOliverPage extends PageScraper {

    public getTitle(): string {
        const titleElement = this.document.querySelector("h1");
        return isSome(titleElement) ? getText(titleElement) : "";
    }

    public getIngredients(): string[] {
        // `.ingred-heading` separates ingredients into groups, might be useful later
        return [ ...this.document.querySelectorAll(".ingred-list li:not(.ingred-heading)") ].map(getText);
    }

    public getInstructions(): string[] {
        return [ ...this.document.querySelectorAll(".recipeSteps li") ].map(getText);
    }

    public getTags(): string[] {
        return [ ...this.document.querySelectorAll(".tags-list a") ].map(getText);
    }
}

export class JamieOliverWebsite extends WebsiteScraper {

    private getCategories(document: Document): string[] {
        return [ ...document.querySelectorAll<HTMLLinkElement>(".recipe-block a") ]
            .map((link) => link.href);
    }

    private getRecipes(document: Document): string[] {
        return [ ...document.querySelectorAll<HTMLLinkElement>("a[id^='gtm_recipe_'][href^='/recipes']") ]
            .map((link) => link.href);
    }


    private recipe_links: Set<string> = new Set();
    private categories_checked: number = 0;

    /**
     * recursive function
     */
    private async getRecipePages(url: string): Promise<void> {

        const document = await getDocument(url);

        if (isSome(document)) {
            const recipes = this.getRecipes(document);

            if (recipes.length > 0) {
                // NOTE: recipes

                this.recipe_links = new Set([ ...this.recipe_links, ...recipes ]);
                Logger.debug(`category # ${++this.categories_checked} | recipe count: ${this.recipe_links.size}`);
            }
            else {
                // NOTE: categories

                const categories = this.getCategories(document);
                // Logger.debug(`categories: ${categories.length}`);

                for (const category of categories) {
                    await this.getRecipePages(category);
                }
            }
        }
    }

    public async findRecipePages(): Promise<string[]> {
        await this.getRecipePages("https://www.jamieoliver.com/recipes/category/ingredient/");

        const recipe_links_full = [ ...this.recipe_links ].map((route) => `https://www.jamieoliver.com${route}`);
        Logger.info(`# of recipes: ${recipe_links_full.length}`);

        return recipe_links_full;
    }
    public async saveRecipePages(outputFolder: string): Promise<void> {
        const recipe_links_full = await this.findRecipePages();
        fs.writeFileSync(`${outputFolder}/recipe_urls.json`, JSON.stringify(recipe_links_full));
    }


    private static getRecipeUrls(path: string, offset: number, limit?: number): string[] {
        const recipe_urls: string[] = JSON.parse(fs.readFileSync(path, { encoding: "utf8" }));
        return recipe_urls.slice(offset, limit && (offset + limit));
    }

    private static saveRecipes(recipes: Recipe[], outputFolder: string, fileName: string, suffix?: string): void {

        if (isSome(suffix)) {
            const filePath = `${outputFolder}/${fileName}_${suffix}.json`;

            fs.writeFileSync(filePath, JSON.stringify(recipes));

            Logger.info(`Recipes saved in ${filePath}`);
        }
        else {
            const filePath = `${outputFolder}/${fileName}.json`;

            const prev_recipes: Recipe[] = (
                fs.existsSync(filePath)
                    ? JSON.parse(fs.readFileSync(filePath, { encoding: "utf8" }))
                    : []
            );

            fs.writeFileSync(filePath, JSON.stringify([ ...prev_recipes, ...recipes ]));

            Logger.info(`Recipes saved in ${filePath}`);
        }
    }

    public async scrapePages(
        path: string,
        offset: number,
        outputFolder: string,
        override: boolean,
        limit?: number,
    ): Promise<void> {

        const recipe_urls = JamieOliverWebsite.getRecipeUrls(path, offset, limit);

        const recipes: Recipe[] = [];
        let recipe_urls_checked = 0;

        for (const recipe_url of recipe_urls) {

            const recipe_document = await getDocument(recipe_url);

            if (isSome(recipe_document)) {
                const page = new JamieOliverPage(recipe_document);
                recipes.push(page.getRecipe());
            }

            Logger.info(`recipe_urls_checked: ${++recipe_urls_checked}`);
        }

        const fileName = `recipes_${Website.JamieOliver}`;

        if (override) {
            JamieOliverWebsite.saveRecipes(recipes, outputFolder, fileName);
        }
        else {
            const recipeRange = `${offset}-${offset + recipe_urls_checked}`;
            JamieOliverWebsite.saveRecipes(recipes, outputFolder, fileName, recipeRange);
        }
    }
}
