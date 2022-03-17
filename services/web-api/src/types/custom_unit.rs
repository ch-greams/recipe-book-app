use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgArguments, query::QueryAs, Postgres};

#[derive(sqlx::FromRow, Deserialize, Serialize, Clone)]
pub struct CustomUnit {
    pub name: String,
    pub amount: f64,
    pub unit: String, // WeightUnit,
    pub product_id: i64,
}

impl CustomUnit {
    pub fn find_by_product_id(product_id: i64) -> QueryAs<'static, Postgres, Self, PgArguments> {
        sqlx::query_as(
            r#"
            SELECT name, amount, unit, product_id
            FROM private.custom_unit
            WHERE product_id = $1
        "#,
        )
        .bind(product_id)
    }

    pub fn find_by_product_ids(
        product_ids: Vec<i64>,
    ) -> QueryAs<'static, Postgres, Self, PgArguments> {
        sqlx::query_as(
            r#"
            SELECT name, amount, unit, product_id
            FROM private.custom_unit
            WHERE product_id = ANY($1)
        "#,
        )
        .bind(product_ids)
    }
}

#[cfg(test)]
mod tests {
    use crate::{config::Config, types::custom_unit::CustomUnit};
    use sqlx::{PgPool, Pool, Postgres};

    fn get_pool() -> Pool<Postgres> {
        let config = Config::new().unwrap();
        PgPool::connect_lazy(&config.database_url).unwrap()
    }

    #[tokio::test]
    #[ignore]
    async fn find_by_product_id() {
        let food_id = 1;

        let mut txn = get_pool().begin().await.unwrap();

        let custom_units = CustomUnit::find_by_product_id(food_id)
            .fetch_all(&mut txn)
            .await
            .unwrap();

        assert_eq!(custom_units.len(), 2);
    }

    #[tokio::test]
    #[ignore]
    async fn find_by_product_ids() {
        let product_ids = vec![1, 2];

        let mut txn = get_pool().begin().await.unwrap();

        let custom_units = CustomUnit::find_by_product_ids(product_ids)
            .fetch_all(&mut txn)
            .await
            .unwrap();

        assert_eq!(custom_units.len(), 3);
    }
}
