use serde::{Deserialize, Serialize};
use sqlx::postgres::PgArguments;
use sqlx::query::QueryAs;
use sqlx::Postgres;

#[derive(sqlx::Type, Serialize, Deserialize, Clone)]
#[sqlx(type_name = "product_type", rename_all = "snake_case")]
#[serde(rename_all = "snake_case")]
pub enum ProductType {
    Food,
    Recipe,
}

#[derive(sqlx::FromRow, Deserialize, Serialize, Clone)]
pub struct Product {
    pub id: i64,
    pub name: String,
    pub brand: Option<String>,
    pub subtitle: Option<String>,
    pub description: Option<String>,
    pub density: f64,
}

impl Product {
    pub fn find_food_by_id(id: i64) -> QueryAs<'static, Postgres, Self, PgArguments> {
        sqlx::query_as(
            r#"
            SELECT id, name, brand, subtitle, description, density
            FROM private.product
            WHERE type = 'food' AND id = $1
        "#,
        )
        .bind(id)
    }

    pub fn find_food_all(limit: u32, offset: u32) -> QueryAs<'static, Postgres, Self, PgArguments> {
        sqlx::query_as(
            r#"
            SELECT id, name, brand, subtitle, description, density
            FROM private.product
            WHERE type = 'food' LIMIT $1 OFFSET $2
        "#,
        )
        .bind(limit)
        .bind(offset)
    }

    pub fn find_recipe_by_id(id: i64) -> QueryAs<'static, Postgres, Self, PgArguments> {
        sqlx::query_as(
            r#"
            SELECT id, name, brand, subtitle, description, density
            FROM private.product
            WHERE type = 'recipe' AND id = $1
        "#,
        )
        .bind(id)
    }

    pub fn find_recipe_all(
        limit: u32,
        offset: u32,
    ) -> QueryAs<'static, Postgres, Self, PgArguments> {
        sqlx::query_as(
            r#"
            SELECT id, name, brand, subtitle, description, density
            FROM private.product
            WHERE type = 'recipe' LIMIT $1 OFFSET $2
        "#,
        )
        .bind(limit)
        .bind(offset)
    }
}

#[cfg(test)]
mod tests {
    use crate::{config::Config, types::product::Product};
    use sqlx::{PgPool, Pool, Postgres};

    fn get_pool() -> Pool<Postgres> {
        let config = Config::new().unwrap();
        PgPool::connect_lazy(&config.database_url).unwrap()
    }

    #[tokio::test]
    #[ignore]
    async fn find_food_by_id() {
        let food_id = 1;

        let mut txn = get_pool().begin().await.unwrap();

        let product = Product::find_food_by_id(food_id)
            .fetch_optional(&mut txn)
            .await
            .unwrap();

        assert!(product.is_some());
    }

    #[tokio::test]
    #[ignore]
    async fn find_food_all() {
        let food_limit = 10;
        let food_offset = 0;

        let mut txn = get_pool().begin().await.unwrap();

        let products = Product::find_food_all(food_limit, food_offset)
            .fetch_all(&mut txn)
            .await
            .unwrap();

        assert!(!products.is_empty());
    }

    #[tokio::test]
    #[ignore]
    async fn find_recipe_by_id() {
        let recipe_id = 29;

        let mut txn = get_pool().begin().await.unwrap();

        let product = Product::find_recipe_by_id(recipe_id)
            .fetch_optional(&mut txn)
            .await
            .unwrap();

        assert!(product.is_some());
    }

    #[tokio::test]
    #[ignore]
    async fn find_recipe_all() {
        let recipe_limit = 10;
        let recipe_offset = 0;

        let mut txn = get_pool().begin().await.unwrap();

        let products = Product::find_recipe_all(recipe_limit, recipe_offset)
            .fetch_all(&mut txn)
            .await
            .unwrap();

        assert!(!products.is_empty());
    }
}
