import { getKeys } from "./object";


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


export class HttpError extends Error {

    public status: HttpStatus;

    public constructor(status: HttpStatus) {
        super(getErrorMessageFromStatus(status));

        this.name = "HttpError";
        this.status = status;
    }

    public static getStatus(error: unknown): HttpStatus {
        return (
            (error instanceof HttpError)
                ? error.status
                : HttpStatus.InternalServerError
        );
    }
}
