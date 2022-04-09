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
            WHERE type = 'food' AND is_private = false
            LIMIT $1 OFFSET $2
        "#,
        )
        .bind(limit)
        .bind(offset)
    }

    pub fn find_food_all_created_by_user(
        limit: u32,
        offset: u32,
        user_id: i64,
    ) -> QueryAs<'static, Postgres, Self, PgArguments> {
        sqlx::query_as(
            r#"
            SELECT id, name, brand, subtitle, description, density
            FROM private.product
            WHERE type = 'food' AND created_by = $3
            LIMIT $1 OFFSET $2
        "#,
        )
        .bind(limit)
        .bind(offset)
        .bind(user_id)
    }

    pub fn find_food_all_favorite(
        limit: u32,
        offset: u32,
        user_id: i64,
    ) -> QueryAs<'static, Postgres, Self, PgArguments> {
        sqlx::query_as(
            r#"
            SELECT id, name, brand, subtitle, description, density
            FROM private.product
            WHERE type = 'food'
                AND (is_private = false OR created_by = $3)
                AND product.id IN (SELECT product_id FROM private.favorite_product WHERE user_id = $3)
            LIMIT $1 OFFSET $2
        "#,
        )
        .bind(limit)
        .bind(offset)
        .bind(user_id)
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
            WHERE type = 'recipe' AND is_private = false
            LIMIT $1 OFFSET $2
        "#,
        )
        .bind(limit)
        .bind(offset)
    }

    pub fn find_recipe_all_created_by_user(
        limit: u32,
        offset: u32,
        user_id: i64,
    ) -> QueryAs<'static, Postgres, Self, PgArguments> {
        sqlx::query_as(
            r#"
            SELECT id, name, brand, subtitle, description, density
            FROM private.product
            WHERE type = 'recipe' AND created_by = $3
            LIMIT $1 OFFSET $2
        "#,
        )
        .bind(limit)
        .bind(offset)
        .bind(user_id)
    }

    pub fn find_recipe_all_favorite(
        limit: u32,
        offset: u32,
        user_id: i64,
    ) -> QueryAs<'static, Postgres, Self, PgArguments> {
        sqlx::query_as(
            r#"
            SELECT id, name, brand, subtitle, description, density
            FROM private.product
            WHERE type = 'recipe' 
                AND (is_private = false OR created_by = $3)
                AND product.id IN (SELECT product_id FROM private.favorite_product WHERE user_id = $3)
            LIMIT $1 OFFSET $2
        "#,
        )
        .bind(limit)
        .bind(offset)
        .bind(user_id)
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
    async fn find_food_all_created_by_user() {
        let food_limit = 10;
        let food_offset = 0;
        let food_user_id = 1;

        let mut txn = get_pool().begin().await.unwrap();

        let products =
            Product::find_food_all_created_by_user(food_limit, food_offset, food_user_id)
                .fetch_all(&mut txn)
                .await
                .unwrap();

        assert!(!products.is_empty());
    }

    #[tokio::test]
    #[ignore]
    async fn find_food_all_favorite() {
        let food_limit = 10;
        let food_offset = 0;
        let food_user_id = 1;

        let mut txn = get_pool().begin().await.unwrap();

        let products = Product::find_food_all_favorite(food_limit, food_offset, food_user_id)
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

    #[tokio::test]
    #[ignore]
    async fn find_recipe_all_created_by_user() {
        let recipe_limit = 10;
        let recipe_offset = 0;
        let recipe_user_id = 1;

        let mut txn = get_pool().begin().await.unwrap();

        let products =
            Product::find_recipe_all_created_by_user(recipe_limit, recipe_offset, recipe_user_id)
                .fetch_all(&mut txn)
                .await
                .unwrap();

        assert!(!products.is_empty());
    }

    #[tokio::test]
    #[ignore]
    async fn find_recipe_all_favorite() {
        let recipe_limit = 10;
        let recipe_offset = 0;
        let recipe_user_id = 1;

        let mut txn = get_pool().begin().await.unwrap();

        let products =
            Product::find_recipe_all_favorite(recipe_limit, recipe_offset, recipe_user_id)
                .fetch_all(&mut txn)
                .await
                .unwrap();

        assert!(!products.is_empty());
    }
}
