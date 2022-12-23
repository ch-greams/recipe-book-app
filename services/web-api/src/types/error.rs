use actix_web::{body::BoxBody, http::StatusCode, HttpResponse, ResponseError};
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(tag = "code")]
#[serde(rename_all = "snake_case")]
pub enum ErrorKind {
    Database,
    NotFound,
    Unauthenticated,
    Unauthorized,
    NotCreated,
    NotUpdated,
    NotDeleted,
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

impl From<sqlx::Error> for Error {
    fn from(err: sqlx::Error) -> Self {
        Error {
            kind: ErrorKind::Database,
            text: err.to_string(),
        }
    }
}

impl From<jsonwebtoken::errors::Error> for Error {
    fn from(err: jsonwebtoken::errors::Error) -> Self {
        Error {
            kind: ErrorKind::Unauthenticated,
            text: err.to_string(),
        }
    }
}

impl std::fmt::Display for Error {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}: {}", &self.kind, &self.text)
    }
}

impl ResponseError for Error {
    fn status_code(&self) -> StatusCode {
        match &self.kind {
            ErrorKind::NotFound => StatusCode::NOT_FOUND,
            ErrorKind::Unauthenticated => StatusCode::UNAUTHORIZED,
            ErrorKind::Unauthorized => StatusCode::FORBIDDEN,
            _ => StatusCode::INTERNAL_SERVER_ERROR,
        }
    }

    fn error_response(&self) -> HttpResponse<BoxBody> {
        HttpResponse::with_body(self.status_code(), self.to_string()).map_into_boxed_body()
    }
}

impl Error {
    pub fn not_found(id: i64) -> Error {
        Error {
            kind: ErrorKind::NotFound,
            text: format!("Record with id = {} was not found", id),
        }
    }

    pub fn unauthenticated() -> Error {
        Error {
            kind: ErrorKind::Unauthenticated,
            text: "No valid access_token was found".to_string(),
        }
    }

    pub fn unauthorized() -> Error {
        Error {
            kind: ErrorKind::Unauthorized,
            text: "Current user doesn't have the necessary permissions for this action".to_string(),
        }
    }

    pub fn not_created(table: &str) -> Error {
        Error {
            kind: ErrorKind::NotCreated,
            text: format!("Error during {} creation", table),
        }
    }

    pub fn not_updated(table: &str, id: i64) -> Error {
        Error {
            kind: ErrorKind::NotUpdated,
            text: format!("Error during update of {} with id {}", table, id),
        }
    }

    pub fn not_deleted(table: &str, id: i64) -> Error {
        Error {
            kind: ErrorKind::NotDeleted,
            text: format!("Error during deletion of {} with id {}", table, id),
        }
    }
}
