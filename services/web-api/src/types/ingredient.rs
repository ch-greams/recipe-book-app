use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgArguments, query::QueryAs, Executor, Postgres, Transaction};

use super::{
    error::Error,
    ingredient_product::{IngredientProductDetails, IngredientProductPayload},
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
    pub products: HashMap<i64, IngredientProductPayload>,
}

#[derive(Deserialize, Serialize, Clone, Debug)]
pub struct UpdateIngredientPayload {
    pub id: i64,
    pub product_id: i64,
    pub products: HashMap<i64, IngredientProductPayload>,
}

impl Ingredient {
    pub fn find_by_recipe_id(recipe_id: i64) -> QueryAs<'static, Postgres, Self, PgArguments> {
        sqlx::query_as(
            "SELECT id, recipe_id, product_id FROM private.ingredient WHERE recipe_id = $1",
        )
        .bind(recipe_id)
    }

    pub async fn insert_multiple(
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

    pub async fn replace_multiple(
        update_ingredient_payloads: &[UpdateIngredientPayload],
        recipe_id: i64,
        txn: &mut Transaction<'_, Postgres>,
    ) -> Result<Vec<Self>, Error> {
        let mut recipe_ids: Vec<i64> = Vec::new();
        let mut product_ids: Vec<i64> = Vec::new();
        update_ingredient_payloads
            .iter()
            .for_each(|ingredient_payload| {
                recipe_ids.push(recipe_id);
                product_ids.push(ingredient_payload.product_id);
            });

        let delete_query = sqlx::query_as(
            r#"
            DELETE FROM private.ingredient
            WHERE recipe_id = $1
            RETURNING id, recipe_id, product_id;
            "#,
        )
        .bind(recipe_id);

        let _delete_query_result: Vec<Self> = delete_query.fetch_all(&mut *txn).await?;

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
    use crate::{
        config::Config,
        types::{
            ingredient::Ingredient,
            product::Product,
            recipe::{CreateRecipePayload, UpdateRecipePayload},
        },
        utils,
    };
    use sqlx::PgPool;

    #[tokio::test]
    async fn find_by_product_id() {
        let recipe_id = 7;

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

        assert_eq!(ingredients.len(), 5);
    }

    #[tokio::test]
    async fn insert_multiple() {
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

        let create_ingredients_result = Ingredient::insert_multiple(
            &create_product_payload.ingredients,
            create_product_result.id,
            &mut txn,
        )
        .await
        .unwrap();

        assert_eq!(create_ingredients_result.len(), 2);

        txn.rollback().await.unwrap();
    }

    #[tokio::test]
    async fn replace_multiple() {
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

        let create_ingredients_result = Ingredient::insert_multiple(
            &create_product_payload.ingredients,
            create_product_result.id,
            &mut txn,
        )
        .await
        .unwrap();

        assert_eq!(create_ingredients_result.len(), 2);

        let mut update_product_payload: UpdateRecipePayload =
            utils::read_type_from_file("examples/update_recipe_payload.json").unwrap();

        for ingredient in &mut update_product_payload.ingredients {
            ingredient.product_id = create_product_result.id;
        }

        let update_ingredients_result = Ingredient::replace_multiple(
            &update_product_payload.ingredients,
            create_product_result.id,
            &mut txn,
        )
        .await
        .unwrap();

        assert_eq!(update_ingredients_result.len(), 3);

        txn.rollback().await.unwrap();
    }
}
