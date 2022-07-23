import { JSDOM } from "jsdom";
import type { ResponseError } from "superagent";
import superagent from "superagent";

import Logger from "./logger";
import { unwrapOr } from "./types";



export const DATA_FOLDER: string = "./data";


export function getText(element: Element): string {
    return unwrapOr(element.textContent, "").trim().replace(/\s\s+/g, " ");
}

export async function getDocument(url: string): Promise<Option<Document>> {

    try {
        const response = await superagent.get(url);
        const page = new JSDOM(response.text);

        return page.window.document;
    }
    catch (error) {
        Logger.error(`Request error ${(error as ResponseError).status}`);
        return null;
    }
}

