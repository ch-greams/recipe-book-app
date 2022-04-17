use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgArguments, query::QueryAs, Postgres};

#[derive(sqlx::FromRow, Deserialize, Serialize, Debug, Clone)]
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

    pub fn insert_mutliple(
        custom_units: Vec<CustomUnit>,
    ) -> QueryAs<'static, Postgres, Self, PgArguments> {
        let mut names: Vec<String> = Vec::new();
        let mut amounts: Vec<f64> = Vec::new();
        let mut units: Vec<String> = Vec::new();
        let mut product_ids: Vec<i64> = Vec::new();
        custom_units.into_iter().for_each(|cu| {
            names.push(cu.name);
            amounts.push(cu.amount);
            units.push(cu.unit);
            product_ids.push(cu.product_id);
        });

        sqlx::query_as(
            r#"
            INSERT INTO private.custom_unit (name, amount, unit, product_id)
            SELECT * FROM UNNEST($1, $2, $3, $4)
            RETURNING name, amount, unit, product_id;
        "#,
        )
        .bind(names)
        .bind(amounts)
        .bind(units)
        .bind(product_ids)
    }
}

#[cfg(test)]
mod tests {
    use crate::{
        config::Config,
        types::{custom_unit::CustomUnit, product::Product},
    };
    use chrono::Utc;
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

    #[tokio::test]
    #[ignore]
    async fn insert_mutliple() {
        let product = Product {
            id: 0,
            name: "test-name".to_string(),
            brand: "test-brand".to_string(),
            subtitle: "test-subtitle".to_string(),
            description: "test-description".to_string(),
            density: 1.0,
            created_by: 1,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        };

        let mut txn = get_pool().begin().await.unwrap();

        let product_result = product.insert_food(&mut txn).await.unwrap();

        assert_ne!(
            0, product_result.id,
            "product_result should not have a placeholder value for id"
        );

        let custom_units = vec![
            CustomUnit {
                name: "test-name-1".to_string(),
                amount: 100.0,
                unit: "test-unit".to_string(),
                product_id: product_result.id,
            },
            CustomUnit {
                name: "test-name-2".to_string(),
                amount: 200.0,
                unit: "test-unit".to_string(),
                product_id: product_result.id,
            },
        ];

        let custom_units_result = CustomUnit::insert_mutliple(custom_units)
            .fetch_all(&mut txn)
            .await
            .unwrap();

        assert_eq!(custom_units_result.len(), 2);

        txn.rollback().await.unwrap();
    }
}
