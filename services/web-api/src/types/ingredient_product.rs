use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgArguments, query::QueryAs, Executor, Postgres};

use super::{error::Error, nutrition_facts::NutritionFacts, product::ProductType};

#[derive(sqlx::FromRow, Serialize, Deserialize, Clone)]
pub struct IngredientProduct {
    pub ingredient_id: i64,
    pub product_id: i64,
    pub amount: f64,
    pub unit: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct CreateIngredientProductPayload {
    pub product_id: i64,
    pub amount: f64,
    pub unit: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct UpdateIngredientProductPayload {
    pub ingredient_id: i64,
    pub product_id: i64,
    pub amount: f64,
    pub unit: String,
}

impl IngredientProduct {
    pub async fn insert_mutliple(
        create_ingredient_product_payloads: &HashMap<i64, CreateIngredientProductPayload>,
        ingredient_id: i64,
        txn: impl Executor<'_, Database = Postgres>,
    ) -> Result<Vec<Self>, Error> {
        let mut ingredient_ids: Vec<i64> = Vec::new();
        let mut product_ids: Vec<i64> = Vec::new();
        let mut amounts: Vec<f64> = Vec::new();
        let mut units: Vec<String> = Vec::new();

        create_ingredient_product_payloads
            .iter()
            .for_each(|(_key, ingredient_product_payload)| {
                ingredient_ids.push(ingredient_id);
                product_ids.push(ingredient_product_payload.product_id);
                amounts.push(ingredient_product_payload.amount);
                units.push(ingredient_product_payload.unit.to_owned());
            });

        let insert_query = sqlx::query_as(
            r#"
            INSERT INTO private.ingredient_product (
                ingredient_id,
                product_id,
                amount,
                unit
            )
            SELECT * FROM UNNEST($1, $2, $3, $4)
            RETURNING ingredient_id, product_id, amount, unit;
        "#,
        )
        .bind(ingredient_ids)
        .bind(product_ids)
        .bind(amounts)
        .bind(units);

        let result = insert_query.fetch_all(txn).await?;

        Ok(result)
    }

    pub async fn replace_mutliple(
        update_ingredient_product_payloads: &HashMap<i64, UpdateIngredientProductPayload>,
        ingredient_id: i64,
        txn: impl Executor<'_, Database = Postgres>,
    ) -> Result<Vec<Self>, Error> {
        let mut ingredient_ids: Vec<i64> = Vec::new();
        let mut product_ids: Vec<i64> = Vec::new();
        let mut amounts: Vec<f64> = Vec::new();
        let mut units: Vec<String> = Vec::new();

        update_ingredient_product_payloads
            .iter()
            .for_each(|(_key, ingredient_product_payload)| {
                ingredient_ids.push(ingredient_id);
                product_ids.push(ingredient_product_payload.product_id);
                amounts.push(ingredient_product_payload.amount);
                units.push(ingredient_product_payload.unit.to_owned());
            });

        let insert_query = sqlx::query_as(
            r#"
            INSERT INTO private.ingredient_product (
                ingredient_id,
                product_id,
                amount,
                unit
            )
            SELECT * FROM UNNEST($1, $2, $3, $4)
            RETURNING ingredient_id, product_id, amount, unit;
        "#,
        )
        .bind(ingredient_ids)
        .bind(product_ids)
        .bind(amounts)
        .bind(units);

        let result = insert_query.fetch_all(txn).await?;

        Ok(result)
    }
}

#[derive(sqlx::FromRow, Serialize, Deserialize, Clone)]
pub struct IngredientProductDetails {
    pub ingredient_id: i64,
    pub product_id: i64,
    pub amount: f64,
    pub unit: String,

    pub product_type: ProductType,
    pub name: String,

    pub nutrition_facts: NutritionFacts,
}

impl IngredientProductDetails {
    pub fn find_by_ingredient_ids(
        ingredient_ids: Vec<i64>,
    ) -> QueryAs<'static, Postgres, Self, PgArguments> {
        sqlx::query_as(
            r#"
            SELECT ingredient_id, product_id, amount, unit, product_type, name, nutrition_facts
            FROM private.ingredient_product_details
            WHERE ingredient_id = ANY($1)
        "#,
        )
        .bind(ingredient_ids)
    }
}

#[cfg(test)]
mod tests {
    use crate::{config::Config, types::ingredient_product::IngredientProductDetails};
    use sqlx::PgPool;

    #[tokio::test]
    #[ignore]
    async fn find_by_product_ids() {
        let ingredient_ids = vec![10, 11];

        let config = Config::new().unwrap();
        let mut txn = PgPool::connect_lazy(&config.database_url)
            .unwrap()
            .begin()
            .await
            .unwrap();

        let ingredient_products = IngredientProductDetails::find_by_ingredient_ids(ingredient_ids)
            .fetch_all(&mut txn)
            .await
            .unwrap();

        assert_eq!(ingredient_products.len(), 4);
    }
}
