

export enum Website {
    JamieOliver = "jamieoliver",
    NYTimes = "nytimes",
}

export interface Recipe {
    title: string;
    ingredients: string[];
    instructions: string[];
}

export abstract class PageScraper {

    public document: Document;

    public constructor(document: Document) {
        this.document = document;
    }

    public getRecipe(): Recipe {
        return {
            title: this.getTitle(),
            ingredients: this.getIngredients(),
            instructions: this.getInstructions(),
        };
    }

    public abstract getTitle(): string;

    public abstract getIngredients(): string[];

    public abstract getInstructions(): string[];
}


export abstract class WebsiteScraper {

    public abstract findRecipePages(): Promise<string[]>;
    public abstract saveRecipePages(path: string): Promise<void>;
    public abstract scrapePages(path: string, offset: number, outputFolder: string, override: boolean, limit?: number): Promise<void>;
}
