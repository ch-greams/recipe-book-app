use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use sqlx::{Executor, Postgres};

#[derive(sqlx::FromRow, Deserialize, Serialize, Debug, Clone)]
pub struct Nutrient {
    pub id: i16,
    pub name: String,
}

impl Nutrient {
    pub async fn get_nutrient_mapping(
        txn: impl Executor<'_, Database = Postgres>,
    ) -> HashMap<String, i16> {
        let nutrients: Vec<Self> = sqlx::query_as("SELECT id, name FROM meta.nutrient")
            .fetch_all(txn)
            .await
            .unwrap();

        nutrients
            .iter()
            .map(|nutrient| (nutrient.name.clone(), nutrient.id))
            .collect::<HashMap<String, i16>>()
    }
}
