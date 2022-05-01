use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgArguments, query::QueryAs, Executor, Postgres};

use super::{
    error::Error,
    ingredient_product::{CreateIngredientProductPayload, IngredientProductDetails},
};

#[derive(sqlx::FromRow, Serialize, Deserialize, Clone)]
pub struct Ingredient {
    pub id: i64,
    pub recipe_id: i64,
    pub product_id: i64,
}

#[derive(Deserialize, Serialize, Clone, Debug)]
pub struct CreateIngredientPayload {
    // NOTE: should store temporary id
    pub id: i64,
    pub product_id: i64,
    pub products: HashMap<i64, CreateIngredientProductPayload>,
}

impl Ingredient {
    pub fn find_by_recipe_id(recipe_id: i64) -> QueryAs<'static, Postgres, Self, PgArguments> {
        sqlx::query_as(
            "SELECT id, recipe_id, product_id FROM private.ingredient WHERE recipe_id = $1",
        )
        .bind(recipe_id)
    }

    pub async fn insert_mutliple(
        create_ingredient_payloads: &[CreateIngredientPayload],
        recipe_id: i64,
        txn: impl Executor<'_, Database = Postgres>,
    ) -> Result<Vec<Self>, Error> {
        let mut recipe_ids: Vec<i64> = Vec::new();
        let mut product_ids: Vec<i64> = Vec::new();
        create_ingredient_payloads
            .iter()
            .for_each(|ingredient_payload| {
                recipe_ids.push(recipe_id);
                product_ids.push(ingredient_payload.product_id);
            });

        let insert_query = sqlx::query_as(
            r#"
            INSERT INTO private.ingredient (recipe_id, product_id)
            SELECT * FROM UNNEST($1, $2)
            RETURNING id, recipe_id, product_id;
        "#,
        )
        .bind(recipe_ids)
        .bind(product_ids);

        let result = insert_query.fetch_all(txn).await?;

        Ok(result)
    }
}

#[derive(Serialize, Deserialize)]
pub struct IngredientDetails {
    pub id: i64,
    pub product_id: i64,

    pub products: HashMap<i64, IngredientProductDetails>,
}

impl IngredientDetails {
    pub fn new(ingredient: &Ingredient, ingredient_products: &[IngredientProductDetails]) -> Self {
        let products = ingredient_products
            .iter()
            .filter(|ip| ip.ingredient_id == ingredient.id)
            .map(|ip| (ip.product_id, ip.to_owned()))
            .collect::<HashMap<i64, IngredientProductDetails>>();

        Self {
            id: ingredient.id.to_owned(),
            product_id: ingredient.product_id.to_owned(),
            products,
        }
    }
}

#[cfg(test)]
mod tests {
    use crate::{config::Config, types::ingredient::Ingredient};
    use sqlx::PgPool;

    #[tokio::test]
    #[ignore]
    async fn find_by_product_id() {
        let recipe_id = 29;

        let config = Config::new().unwrap();
        let mut txn = PgPool::connect_lazy(&config.database_url)
            .unwrap()
            .begin()
            .await
            .unwrap();

        let ingredients = Ingredient::find_by_recipe_id(recipe_id)
            .fetch_all(&mut txn)
            .await
            .unwrap();

        assert_eq!(ingredients.len(), 2);
    }
}
