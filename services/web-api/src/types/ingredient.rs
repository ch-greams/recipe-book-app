use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use sqlx::{
    postgres::PgArguments, query::QueryAs, types::Json, Executor, Postgres, QueryBuilder,
    Transaction,
};

use crate::utils::BIND_LIMIT;

use super::error::Error;

#[derive(sqlx::FromRow, Serialize, Deserialize, Clone)]
pub struct Ingredient {
    pub order_number: i16,
    pub recipe_id: i64,
    pub product_id: i64,
    pub amount: f64,
    pub unit: String,
    pub is_alternative: bool,
}

#[derive(sqlx::FromRow, Serialize, Deserialize, Clone, Debug)]
pub struct IngredientPayload {
    pub order_number: i16,
    pub product_id: i64,
    pub amount: f64,
    pub unit: String,
    pub is_alternative: bool,
}

impl Ingredient {
    pub async fn insert_multiple(
        ingredient_payloads: &[IngredientPayload],
        recipe_id: i64,
        txn: impl Executor<'_, Database = Postgres>,
    ) -> Result<Vec<Self>, Error> {
        let mut insert_query_builder: QueryBuilder<Postgres> = QueryBuilder::new(
            "INSERT INTO product.ingredient (recipe_id, order_number, product_id, amount, unit, is_alternative) ",
        );

        let ingredients = insert_query_builder
            .push_values(
                ingredient_payloads.iter().take(BIND_LIMIT / 5),
                |mut builder, ingredient_payload| {
                    builder
                        .push_bind(recipe_id)
                        .push_bind(ingredient_payload.order_number)
                        .push_bind(ingredient_payload.product_id)
                        .push_bind(ingredient_payload.amount)
                        .push_bind(ingredient_payload.unit.clone())
                        .push_bind(ingredient_payload.is_alternative);
                },
            )
            .push(" RETURNING order_number, recipe_id, product_id, amount, unit, is_alternative;")
            .build_query_as()
            .fetch_all(txn)
            .await?;

        Ok(ingredients)
    }

    pub async fn replace_multiple(
        ingredient_payloads: &[IngredientPayload],
        recipe_id: i64,
        txn: &mut Transaction<'_, Postgres>,
    ) -> Result<Vec<Self>, Error> {
        // delete

        let delete_query =
            sqlx::query("DELETE FROM product.ingredient WHERE recipe_id = $1").bind(recipe_id);

        delete_query.fetch_all(&mut *txn).await?;

        // insert

        let mut insert_query_builder: QueryBuilder<Postgres> = QueryBuilder::new(
            "INSERT INTO product.ingredient (recipe_id, order_number, product_id, amount, unit, is_alternative) ",
        );

        let ingredients = insert_query_builder
            .push_values(
                ingredient_payloads.iter().take(BIND_LIMIT / 5),
                |mut builder, ingredient_payload| {
                    builder
                        .push_bind(recipe_id)
                        .push_bind(ingredient_payload.order_number)
                        .push_bind(ingredient_payload.product_id)
                        .push_bind(ingredient_payload.amount)
                        .push_bind(ingredient_payload.unit.clone())
                        .push_bind(ingredient_payload.is_alternative);
                },
            )
            .push(" RETURNING order_number, recipe_id, product_id, amount, unit, is_alternative;")
            .build_query_as()
            .fetch_all(txn)
            .await?;

        Ok(ingredients)
    }
}

#[derive(sqlx::FromRow, Serialize, Deserialize, Clone)]
pub struct IngredientDetailed {
    pub order_number: i16,
    pub recipe_id: i64,
    pub product_id: i64,
    pub amount: f64,
    pub unit: String,
    pub is_alternative: bool,

    pub is_recipe: bool,
    pub name: String,
    pub density: f64,

    pub nutrients: Json<HashMap<String, f32>>,
}

impl IngredientDetailed {
    pub fn find_by_recipe_id(recipe_id: i64) -> QueryAs<'static, Postgres, Self, PgArguments> {
        sqlx::query_as(
            r#"
                SELECT
                    order_number,
                    recipe_id,
                    product_id,
                    amount,
                    unit,
                    is_alternative,
                    is_recipe,
                    name,
                    density,
                    nutrients
                FROM product.ingredient_detailed
                WHERE recipe_id = $1
            "#,
        )
        .bind(recipe_id)
    }
}

#[cfg(test)]
mod tests {
    use crate::{
        config::Config,
        types::{
            ingredient::{Ingredient, IngredientDetailed},
            product::Product,
            recipe::{CreateRecipePayload, UpdateRecipePayload},
        },
        utils,
    };
    use sqlx::PgPool;

    #[tokio::test]
    async fn find_by_product_id() {
        let recipe_id = 6;

        let config = Config::new().unwrap();
        let mut txn = PgPool::connect_lazy(&config.database_url)
            .unwrap()
            .begin()
            .await
            .unwrap();

        let ingredients = IngredientDetailed::find_by_recipe_id(recipe_id)
            .fetch_all(&mut txn)
            .await
            .unwrap();

        assert_eq!(ingredients.len(), 5);
    }

    #[tokio::test]
    async fn insert_multiple() {
        let create_product_payload: CreateRecipePayload =
            utils::read_json("examples/create_recipe_payload.json").unwrap();

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

        assert_eq!(create_ingredients_result.len(), 3);

        txn.rollback().await.unwrap();
    }

    #[tokio::test]
    async fn replace_multiple() {
        let create_product_payload: CreateRecipePayload =
            utils::read_json("examples/create_recipe_payload.json").unwrap();

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

        assert_eq!(create_ingredients_result.len(), 3);

        let mut update_product_payload: UpdateRecipePayload =
            utils::read_json("examples/update_recipe_payload.json").unwrap();

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

        assert_eq!(update_ingredients_result.len(), 5);

        txn.rollback().await.unwrap();
    }
}
