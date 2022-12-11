import { getKeys } from "./object";


export enum Header {
    ACCEPT = "Accept",
    CONTENT_TYPE = "Content-Type",
}

export enum ResourceType {
    JSON = "application/json",
    X_WWW_FORM_URLENCODED = "application/x-www-form-urlencoded",
}


export function getUrlParams(obj: object): string {
    return getKeys(obj).map((key) => `${key}=${obj[key]}`).join("&");
}
