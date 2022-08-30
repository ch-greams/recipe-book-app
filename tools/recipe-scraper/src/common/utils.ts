import { JSDOM } from "jsdom";
import type { ResponseError } from "superagent";
import superagent from "superagent";

import Logger from "./logger";
import { unwrapOr } from "./types";



export const DEFAULT_DB: string = "postgres://postgres:password@localhost";


export function getText(element: Element | ChildNode): string {
    return unwrapOr(element.textContent, "").trim().replace(/\s\s+/g, " ");
}

export async function getDocument(url: string): Promise<Option<Document>> {

    try {
        const response = await superagent.get(url);
        const page = new JSDOM(response.text);

        return page.window.document;
    }
    catch (error) {
        // TODO: Handle 404 so you can mark wrong leads as scraped
        Logger.error(`Request error ${(error as ResponseError).status}`);
        return null;
    }
}

export function getQueryTemplates(rowCount: number, columns: string[]): string {
    let index = 1;
    return Array(rowCount).fill(0)
        .map(() => `(${columns.map((type) => `$${index++}::${type}`).join(", ")})`)
        .join(", ");
}
