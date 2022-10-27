import { Pool } from "pg";

import Logger from "./logger";
import { unwrap } from "./types";
import { getQueryTemplates } from "./utils";


export enum Website {
    JamieOliver = "jamieoliver",
    NYTimes = "nytimes",
}

export interface Recipe {
    id: number;
    url: string;
    source_id: number;
    is_scraped: boolean;
    name?: Option<string>;
    time?: Option<string>;
    servings?: Option<string>;
}

export interface Ingredient {
    id?: number;
    text: string;
    recipe_id: number;
}

export interface Instruction {
    id?: number;
    order: number;
    text: string;
    recipe_id: number;
}

export interface Tag {
    id: number;
    name: string;
}


export abstract class PageScraper {

    public recipe: Recipe;
    public document: Document;

    public constructor(recipe: Recipe, document: Document) {
        this.recipe = recipe;
        this.document = document;
    }

    public getRecipe(): Recipe {
        return {
            ...this.recipe,
            name: this.getTitleFromDocument(),
            time: this.getTimeFromDocument(),
            servings: this.getServingsFromDocument(),
        };
    }

    public getIngredients(): Ingredient[] {
        return this.getIngredientsFromDocument().map((text) => ({ text, recipe_id: this.recipe.id }));
    }

    public getInstructions(): Instruction[] {
        return this.getInstructionsFromDocument().map((text, index) => ({
            text,
            order: index,
            recipe_id: this.recipe.id,
        }));
    }


    public abstract getTitleFromDocument(): string;

    public abstract getIngredientsFromDocument(): string[];

    public abstract getInstructionsFromDocument(): string[];

    public abstract getTagsFromDocument(): string[];

    public abstract getServingsFromDocument(): string;

    public abstract getTimeFromDocument(): string;
}


export abstract class WebsiteScraper {

    // public pgClient: Client;
    public pgPool: Pool;

    public constructor(connectionString: string) {
        this.pgPool = new Pool({ connectionString });
    }

    //--------------------------------------------------------------------------
    // generic methods
    //--------------------------------------------------------------------------

    public async getRecipeLeads(website: Website, limit: number): Promise<Recipe[]> {

        const pgClient = await this.pgPool.connect();

        const recipeUrlsQuery = `
            SELECT id, url, source_id, is_scraped
            FROM recipe_scraper.recipe
            WHERE is_scraped = false
                AND source_id = (
                    SELECT id
                    FROM recipe_scraper.source
                    WHERE name = '${website}'
                )
            LIMIT ${limit};
        `;
        const recipeUrlsResponse = await pgClient.query<Recipe>(recipeUrlsQuery);

        pgClient.release();

        return recipeUrlsResponse.rows;
    }

    public async updateRecipes(recipes: Recipe[]): Promise<void> {

        if (recipes.length === 0) {
            Logger.warn("No recipes to update");
            return;
        }

        const pgClient = await this.pgPool.connect();

        const queryTemplates = getQueryTemplates(recipes.length, [ "bigint", "text", "text", "text" ]);
        const query = `
            UPDATE recipe_scraper.recipe AS lead_recipe
            SET name = recipe.name, "time" = recipe."time", servings = recipe.servings, is_scraped = true
            FROM ( VALUES ${queryTemplates} ) AS recipe(id, name, "time", servings) 
            WHERE recipe.id = lead_recipe.id;
        `;
        const queryValues = recipes.flatMap((recipe) => ([ recipe.id, recipe.name, recipe.time, recipe.servings ]));
        const response = await pgClient.query(query, queryValues);

        pgClient.release();

        Logger.info(`updateRecipesResponse = ${response.rowCount}`);
    }

    public async insertIngredients(ingredients: Ingredient[]): Promise<void> {

        if (ingredients.length === 0) {
            Logger.warn("No ingredients to insert");
            return;
        }

        const pgClient = await this.pgPool.connect();

        const query = `
            INSERT INTO recipe_scraper.ingredient (text, recipe_id)
            VALUES ${getQueryTemplates(ingredients.length, [ "text", "bigint" ])}
            ON CONFLICT DO NOTHING
            RETURNING *;
        `;
        const queryValues = ingredients.flatMap((ingredient) => ([
            ingredient.text,
            ingredient.recipe_id,
        ]));

        const response = await pgClient.query(query, queryValues);

        pgClient.release();

        Logger.info(`insertIngredientsResponse = ${response.rowCount}`);
    }

    public async insertInstructions(instructions: Instruction[]): Promise<void> {

        if (instructions.length === 0) {
            Logger.warn("No instructions to insert");
            return;
        }

        const pgClient = await this.pgPool.connect();

        const query = `
            INSERT INTO recipe_scraper.instruction (text, "order", recipe_id)
            VALUES ${getQueryTemplates(instructions.length, [ "text", "smallint", "bigint" ])}
            ON CONFLICT DO NOTHING
            RETURNING *;
        `;
        const queryValues = instructions.flatMap((instruction) => ([
            instruction.text,
            instruction.order,
            instruction.recipe_id,
        ]));
        const response = await pgClient.query(query, queryValues);

        pgClient.release();

        Logger.info(`insertInstructionsResponse = ${response.rowCount}`);
    }

    public async insertTags(tags: string[], recipeTags: [ number, string ][]): Promise<void> {

        if (tags.length === 0) {
            Logger.warn("No tags to insert");
            return;
        }

        const pgClient = await this.pgPool.connect();

        const upsertTagsQuery = `
            INSERT INTO recipe_scraper.tag (name)
            VALUES ${getQueryTemplates(tags.length, [ "text" ])}
            ON CONFLICT (name) DO UPDATE SET name = tag.name
            RETURNING id, name;
        `;
        const upsertTagsResponse = await pgClient.query<Tag>(upsertTagsQuery, tags);
        Logger.info(`upsert_tags_response = ${upsertTagsResponse.rowCount}`);

        const tagMap: Dictionary<string, number> = upsertTagsResponse.rows.reduce((tagNameToId, currentTag) => ({
            ...tagNameToId,
            [currentTag.name]: currentTag.id,
        }), {});

        const insertRecipeTagsQuery = `
            INSERT INTO recipe_scraper.recipe_tag (recipe_id, tag_id)
            VALUES ${getQueryTemplates(recipeTags.length, [ "bigint", "bigint" ])}
            ON CONFLICT DO NOTHING
            RETURNING *;
        `;

        const insertRecipeTagsQueryValues: number[] = recipeTags.flatMap(([ recipe_id, tag_name ]) => ([
            recipe_id,
            unwrap(tagMap[tag_name], "tag_map[tag_name]"),
        ]));

        const insertRecipeTagsResponse = await pgClient.query(insertRecipeTagsQuery, insertRecipeTagsQueryValues);
        Logger.info(`insert_recipe_tags_response = ${insertRecipeTagsResponse.rowCount}`);

        pgClient.release();
    }

    public async scrapePages(limit: number): Promise<void> {

        let recipes: Recipe[] = [];
        let ingredients: Ingredient[] = [];
        let instructions: Instruction[] = [];
        let tags: Set<string> = new Set<string>();
        let recipeTags: [ number, string ][] = [];

        Logger.debug("Starting recipe collection...");

        const recipePages = await this.getPageScrapers(limit);

        for (const page of recipePages) {

            const recipe = page.getRecipe();

            recipes = [ ...recipes, recipe ];
            ingredients = [ ...ingredients, ...page.getIngredients() ];
            instructions = [ ...instructions, ...page.getInstructions() ];

            const page_tags = page.getTagsFromDocument();

            tags = new Set([ ...tags, ...page_tags ]);
            recipeTags = [ ...recipeTags, ...page_tags.map<[ number, string ]>((tag) => ([ recipe.id, tag ])) ];
        }

        Logger.debug("Collected recipes");

        await this.updateRecipes(recipes);

        await this.insertIngredients(ingredients);

        await this.insertInstructions(instructions);

        await this.insertTags([ ...tags ], recipeTags);
    }

    //--------------------------------------------------------------------------
    // abstract methods
    //--------------------------------------------------------------------------

    public abstract getPageScrapers(limit: number): Promise<PageScraper[]>;
    public abstract findRecipePages(): Promise<string[]>;
    public abstract saveRecipePages(): Promise<void>;
}
