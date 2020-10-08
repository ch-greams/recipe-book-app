
export enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE",
}

export enum HttpStatusSuccess {
    Ok = 200,
    Created = 201,
}

export enum HttpStatusClientError {
    BadRequest = 400,
    Forbidden = 403,
    PreconditionRequired = 428,
}

export enum HttpStatusServerError {
    ServerError = 500,
    ServiceUnavailable = 503,
}
