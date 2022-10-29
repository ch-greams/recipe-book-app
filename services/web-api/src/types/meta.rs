use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgArguments, query::QueryAs, Postgres};

#[derive(sqlx::FromRow, Serialize, Deserialize, Debug, Clone)]
#[sqlx(type_name = "nutrient_details")]
pub struct Nutrient {
    pub id: i64,
    pub name: String,
    pub daily_value: Option<f32>,
    pub unit: String,
    pub nutrient_group: String,
    pub parent_name: Option<String>,
}

impl Nutrient {
    pub fn get_nutrients() -> QueryAs<'static, Postgres, Self, PgArguments> {
        sqlx::query_as("SELECT * FROM meta.nutrient_details")
    }
}

#[cfg(test)]
mod tests {
    use crate::{
        types::meta::Nutrient,
        utils,
    };

    #[tokio::test]
    async fn get_nutrients() {
        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let nutrients = Nutrient::get_nutrients()
            .fetch_all(&mut txn)
            .await
            .unwrap();

        assert!(!nutrients.is_empty());
    }
}
