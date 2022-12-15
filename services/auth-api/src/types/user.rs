use serde::{Deserialize, Serialize};
use sqlx::{Executor, Postgres};

use super::error::Error;

#[derive(sqlx::FromRow, Serialize, Deserialize, Debug, Clone)]
pub struct User {
    pub id: i64,
    pub email: String,
    pub first_name: String,
    pub last_name: String,
}

pub struct CreateUserPayload {
    pub email: String,
    pub first_name: String,
    pub last_name: String,
}

impl User {
    pub async fn create(
        create_user_payload: &CreateUserPayload,
        txn: impl Executor<'_, Database = Postgres>,
    ) -> Result<Self, Error> {
        let query = sqlx::query_as(
            r#"
            INSERT INTO journal.user (email, first_name, last_name)
            VALUES ($1, $2, $3)
            RETURNING id, email, first_name, last_name;
        "#,
        )
        .bind(create_user_payload.email.to_owned())
        .bind(create_user_payload.first_name.to_owned())
        .bind(create_user_payload.last_name.to_owned());

        let result = query
            .fetch_optional(txn)
            .await?
            .ok_or_else(|| Error::not_created("user"))?;

        Ok(result)
    }
}
