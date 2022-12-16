import { getKeys } from "./object";
import { isSome } from "./types";


export enum Header {
    ACCEPT = "Accept",
    CONTENT_TYPE = "Content-Type",
}

export enum HttpStatus {
    Ok = 200,
    Created = 201,
    NoContent = 204,

    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,

    InternalServerError = 500,
}

export enum ResourceType {
    JSON = "application/json",
    X_WWW_FORM_URLENCODED = "application/x-www-form-urlencoded",
}

export interface Response<T> {
    status: HttpStatus;
    body: Option<T>;
}

export function isSuccess<T>(status: HttpStatus, body: Option<T>): body is T {
    const isOk = [ HttpStatus.Ok, HttpStatus.Created, HttpStatus.NoContent ].includes(status);
    return isOk || isSome(body);
}


export function getErrorMessageFromStatus(status: Option<HttpStatus>): string {
    switch (status) {
        case HttpStatus.Unauthorized:
            return "Session expired";
        case HttpStatus.Forbidden:
            return "Restricted access";
        case HttpStatus.NotFound:
            return "Nothing found";
        default:
            return "Something went wrong";
    }
}

export function getUrlParams(obj: object): string {
    return getKeys(obj).map((key) => `${key}=${obj[key]}`).join("&");
}
