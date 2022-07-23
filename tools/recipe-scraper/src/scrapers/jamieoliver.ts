import fs from "fs";

import Logger from "../common/logger";
import { isSome } from "../common/types";
import { getDocument, getText } from "../common/utils";
import { PageScraper, Website, WebsiteScraper } from "../common/website-scraper";



export class JamieOliverPage extends PageScraper {

    // TODO: add page url

    public getTitle(): string {
        const titleElement = this.document.querySelector("h1");
        return isSome(titleElement) ? getText(titleElement) : "";
    }

    public getIngredients(): string[] {
        return [ ...this.document.querySelectorAll(".ingred-list li") ].map(getText);
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


    private static getRecipeUrls(path: string, offset: number): string[] {
        const recipe_urls = JSON.parse(fs.readFileSync(path, { encoding: "utf8" }));
        return recipe_urls.slice(offset);
    }

    public async scrapePages(path: string, offset: number, outputFolder: string, limit: number): Promise<void> {

        const recipe_urls = JamieOliverWebsite.getRecipeUrls(path, offset);

        let recipes = [];
        let recipe_urls_checked = offset;
        let last_batch_end = offset;

        for (const recipe_url of recipe_urls) {

            const recipe_document = await getDocument(recipe_url);

            if (isSome(recipe_document)) {
                const page = new JamieOliverPage(recipe_document);
                recipes.push(page.getRecipe());
            }

            Logger.info(`recipe_urls_checked: ${++recipe_urls_checked}`);

            if (( recipe_urls_checked - last_batch_end === limit ) || ( (recipe_urls_checked - offset) === recipe_urls.length )) {
                const recipeRange = `${last_batch_end}-${recipe_urls_checked}`;
                const fileName = `recipes_${Website.JamieOliver}_${recipeRange}.json`;
                fs.writeFileSync(`${outputFolder}/${fileName}`, JSON.stringify(recipes));

                recipes = [];
                last_batch_end = recipe_urls_checked;

                break;
            }
        }
    }
}
