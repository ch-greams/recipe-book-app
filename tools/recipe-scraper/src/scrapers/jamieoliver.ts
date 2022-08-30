import Logger from "../common/logger";
import { isSome } from "../common/types";
import { getDocument, getQueryTemplates, getText } from "../common/utils";
import { Website } from "../common/website-scraper";
import { PageScraper, WebsiteScraper } from "../common/website-scraper";

// NOTE: Currently limits to 600 requests per uncertain period of time, use VPN to avoid it

export class JamieOliverPage extends PageScraper {

    public getTitleFromDocument(): string {
        const titleElement = this.document.querySelector("h1");
        return isSome(titleElement) ? getText(titleElement) : "";
    }

    public getIngredientsFromDocument(): string[] {
        // `.ingred-heading` separates ingredients into groups, might be useful later
        return [ ...this.document.querySelectorAll(".ingred-list li:not(.ingred-heading)") ].map(getText);
    }

    public getInstructionsFromDocument(): string[] {
        return [ ...this.document.querySelectorAll(".recipeSteps li") ].map(getText);
    }

    public getTagsFromDocument(): string[] {
        return [ ...this.document.querySelectorAll(".tags-list a") ].map(getText);
    }

    public getServingsFromDocument(): string {
        const servingsNode = this.document.querySelector(".recipe-detail.serves > .detail_desc")?.nextSibling;
        return isSome(servingsNode) ? getText(servingsNode) : "";
    }

    public getTimeFromDocument(): string {
        const timeNode = this.document.querySelector(".recipe-detail.time > .detail_desc")?.nextSibling;
        return isSome(timeNode) ? getText(timeNode) : "";
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

    //--------------------------------------------------------------------------
    // find-recipes
    //--------------------------------------------------------------------------

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

        const recipe_urls = [ ...this.recipe_links ].map((route) => `https://www.jamieoliver.com${route}`);
        Logger.info(`# of recipes: ${recipe_urls.length}`);

        return recipe_urls;
    }

    public async saveRecipePages(): Promise<void> {

        const pgClient = await this.pgPool.connect();

        //----------------------------------------------------------------------
        // Get source_id
        //----------------------------------------------------------------------

        const insertSourceQuery = `
            INSERT INTO recipe_scraper.source (name, url)
            VALUES ($1, $2)
            ON CONFLICT (name) DO UPDATE SET name = $1, url = $2
            RETURNING id;
        `;
        const insertSourceQueryValues = [ "jamieoliver", "https://www.jamieoliver.com" ];

        const insertSourceResponse = await pgClient.query(insertSourceQuery, insertSourceQueryValues);
        const sourceId = insertSourceResponse.rows[0].id;

        //----------------------------------------------------------------------
        // Insert recipe urls
        //----------------------------------------------------------------------

        const recipe_urls = await this.findRecipePages();

        const insertRecipesQuery = `
            INSERT INTO recipe_scraper.recipe (url, source_id)
            VALUES ${getQueryTemplates(recipe_urls.length, [ "text", "bigint" ])}
            ON CONFLICT DO NOTHING
            RETURNING *;
        `;
        const insertRecipesQueryValues = recipe_urls.flatMap((url) => ([ url, sourceId ]));

        const insertRecipesResponse = await pgClient.query(insertRecipesQuery, insertRecipesQueryValues);

        Logger.info(`${insertRecipesResponse.rowCount} out of ${recipe_urls.length} recipe urls are saved.`);

        pgClient.release();
    }

    //--------------------------------------------------------------------------
    // scrape-recipes
    //--------------------------------------------------------------------------

    public async getPageScrapers(limit: number): Promise<JamieOliverPage[]> {

        const recipeLeads = await this.getRecipeLeads(Website.JamieOliver, limit);

        if (recipeLeads.length === 0) {
            Logger.warn("No recipes were found");
            return [];
        }

        let pages: JamieOliverPage[] = [];

        for (const recipe of recipeLeads) {
            const document = await getDocument(recipe.url);

            if (isSome(document)) {
                pages = [ ...pages, new JamieOliverPage(recipe, document) ];
            }

            Logger.info(`Recipes checked: ${pages.length} out of ${recipeLeads.length}`);
        }

        return pages;
    }
}
