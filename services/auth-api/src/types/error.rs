use actix_web::{body::BoxBody, http::StatusCode, HttpResponse, ResponseError};
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(tag = "code")]
#[serde(rename_all = "snake_case")]
pub enum ErrorKind {
    #[serde(with = "http_serde::status_code")]
    Proxy(StatusCode),
    NotFound,
    MissingId,
    Database,
    NotCreated,
}

impl std::fmt::Display for ErrorKind {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{:?}", self)
    }
}

#[derive(Debug)]
pub struct Error {
    kind: ErrorKind,
    text: String,
}

impl std::fmt::Display for Error {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}: {}", &self.kind, &self.text)
    }
}

impl ResponseError for Error {
    fn status_code(&self) -> StatusCode {
        match &self.kind {
            ErrorKind::Proxy(status_code) => *status_code,
            _ => StatusCode::INTERNAL_SERVER_ERROR,
        }
    }

    fn error_response(&self) -> HttpResponse<BoxBody> {
        HttpResponse::with_body(self.status_code(), self.to_string()).map_into_boxed_body()
    }
}

impl From<sqlx::Error> for Error {
    fn from(err: sqlx::Error) -> Self {
        Error {
            kind: ErrorKind::Database,
            text: err.to_string(),
        }
    }
}

impl From<reqwest::Error> for Error {
    fn from(reqwest_error: reqwest::Error) -> Self {
        Error {
            kind: ErrorKind::Proxy(
                reqwest_error
                    .status()
                    .unwrap_or(StatusCode::INTERNAL_SERVER_ERROR),
            ),
            text: "Error during proxy request".to_string(),
        }
    }
}

impl Error {
    pub fn not_found(entity: &str) -> Self {
        Error {
            kind: ErrorKind::NotFound,
            text: format!("Can't find {} with provided parameters", entity),
        }
    }

    pub fn missing_id(action: &str, entity: &str) -> Self {
        Error {
            kind: ErrorKind::MissingId,
            text: format!("Can't {} {} without an id", action, entity),
        }
    }

    pub fn not_created(table: &str) -> Error {
        Error {
            kind: ErrorKind::NotCreated,
            text: format!("Error during {} creation", table),
        }
    }
}
