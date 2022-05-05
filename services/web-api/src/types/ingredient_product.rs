use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgArguments, query::QueryAs, Executor, Postgres};

use super::{error::Error, nutrition_facts::NutritionFacts, product::ProductType};

#[derive(sqlx::FromRow, Serialize, Deserialize, Clone, Debug)]
pub struct IngredientProduct {
    pub ingredient_id: i64,
    pub product_id: i64,
    pub amount: f64,
    pub unit: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct IngredientProductPayload {
    pub product_id: i64,
    pub amount: f64,
    pub unit: String,
}

impl IngredientProduct {
    pub async fn insert_mutliple(
        ingredient_product_payloads: &HashMap<i64, IngredientProductPayload>,
        ingredient_id: i64,
        txn: impl Executor<'_, Database = Postgres>,
    ) -> Result<Vec<Self>, Error> {
        let mut ingredient_ids: Vec<i64> = Vec::new();
        let mut product_ids: Vec<i64> = Vec::new();
        let mut amounts: Vec<f64> = Vec::new();
        let mut units: Vec<String> = Vec::new();

        ingredient_product_payloads
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

    use crate::{
        config::Config,
        types::{
            ingredient::Ingredient,
            ingredient_product::{IngredientProduct, IngredientProductDetails},
            product::Product,
            recipe::CreateRecipePayload,
        },
        utils,
    };
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

    #[tokio::test]
    #[ignore]
    async fn insert_mutliple() {
        let create_product_payload: CreateRecipePayload =
            utils::read_type_from_file("examples/create_recipe_payload.json").unwrap();

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let create_product_result = Product::insert_recipe(&create_product_payload, 1, &mut txn)
            .await
            .unwrap();

        assert_ne!(
            0, create_product_result.id,
            "create_product_result should not have a placeholder value for id"
        );

        let create_ingredients_result = Ingredient::insert_mutliple(
            &create_product_payload.ingredients,
            create_product_result.id,
            &mut txn,
        )
        .await
        .unwrap();

        assert_eq!(create_ingredients_result.len(), 2);

        for (index, ingredient_payload) in create_product_payload.ingredients.iter().enumerate() {
            let ingredient = create_ingredients_result.get(index).unwrap();

            let _ingredient_products = IngredientProduct::insert_mutliple(
                &ingredient_payload.products,
                ingredient.id,
                &mut txn,
            )
            .await
            .unwrap();
        }

        let ingredient_ids: Vec<i64> = create_ingredients_result
            .clone()
            .iter()
            .map(|ingredient| ingredient.id)
            .collect();

        let create_ingredient_products_result =
            IngredientProductDetails::find_by_ingredient_ids(ingredient_ids)
                .fetch_all(&mut txn)
                .await
                .unwrap();

        assert_eq!(create_ingredient_products_result.len(), 3);

        txn.rollback().await.unwrap();
    }
}
