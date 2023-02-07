use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::postgres::PgArguments;
use sqlx::query::QueryAs;
use sqlx::{Executor, Postgres};

use super::error::Error;
use super::food::{CreateFoodPayload, UpdateFoodPayload};
use super::recipe::{CreateRecipePayload, UpdateRecipePayload};

#[derive(sqlx::FromRow, Deserialize, Serialize, Debug, Clone)]
pub struct Product {
    pub id: i64,
    pub is_recipe: bool,
    pub name: String,
    pub brand: String,
    pub description: String,
    pub density: f64,
    pub created_by: i64,
    pub is_private: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    // NOTE: Be careful, order of properties matters for some reason
    pub serving_size: f64,
}

#[derive(Deserialize, Serialize)]
pub struct ProductShort {
    pub id: i64,
    pub is_recipe: bool,
    pub name: String,
    pub brand: String,
    pub created_by: i64,
    pub is_private: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl ProductShort {
    pub fn new(product: &Product) -> Self {
        Self {
            id: product.id,
            is_recipe: product.is_recipe.to_owned(),
            name: product.name.to_owned(),
            brand: product.brand.to_owned(),
            created_by: product.created_by,
            is_private: product.is_private,
            created_at: product.created_at,
            updated_at: product.updated_at,
        }
    }
}

impl Product {
    pub fn find_food_by_id(
        id: i64,
        user_id: Option<i64>,
    ) -> QueryAs<'static, Postgres, Self, PgArguments> {
        sqlx::query_as(
            r#"
            SELECT id, is_recipe, name, brand, description, density, serving_size, created_by, is_private, created_at, updated_at
            FROM product.product
            WHERE is_deleted = false AND is_recipe = false AND id = $1 AND (is_private = false OR created_by = $2)
        "#,
        )
        .bind(id)
        .bind(user_id)
    }

    pub fn find_all(
        limit: u32,
        offset: u32,
        user_id: Option<i64>,
        is_recipe: Option<bool>,
        filter: String,
    ) -> QueryAs<'static, Postgres, Self, PgArguments> {
        if let Some(is_recipe) = is_recipe {
            sqlx::query_as(
                r#"
                SELECT id, is_recipe, name, brand, description, density, serving_size, created_by, is_private, created_at, updated_at
                FROM product.product
                WHERE is_deleted = false AND name ILIKE $4 AND is_recipe = $5 AND (is_private = false OR created_by = $3)
                LIMIT $1 OFFSET $2
            "#,
            )
            .bind(limit as i32)
            .bind(offset as i32)
            .bind(user_id)
            .bind(format!("%{filter}%"))
            .bind(is_recipe)
        } else {
            sqlx::query_as(
                r#"
                SELECT id, is_recipe, name, brand, description, density, serving_size, created_by, is_private, created_at, updated_at
                FROM product.product
                WHERE is_deleted = false AND name ILIKE $4 AND (is_private = false OR created_by = $3)
                LIMIT $1 OFFSET $2
            "#,
            )
            .bind(limit as i32)
            .bind(offset as i32)
            .bind(user_id)
            .bind(format!("%{filter}%"))
        }
    }

    pub fn find_all_created_by_user(
        limit: u32,
        offset: u32,
        user_id: i64,
        is_recipe: Option<bool>,
        filter: String,
    ) -> QueryAs<'static, Postgres, Self, PgArguments> {
        if let Some(is_recipe) = is_recipe {
            sqlx::query_as(
                r#"
                SELECT id, is_recipe, name, brand, description, density, serving_size, created_by, is_private, created_at, updated_at
                FROM product.product
                WHERE is_deleted = false AND name ILIKE $4 AND is_recipe = $5 AND created_by = $3
                LIMIT $1 OFFSET $2
            "#,
            )
            .bind(limit as i32)
            .bind(offset as i32)
            .bind(user_id)
            .bind(format!("%{filter}%"))
            .bind(is_recipe)
        } else {
            sqlx::query_as(
                r#"
                SELECT id, is_recipe, name, brand, description, density, serving_size, created_by, is_private, created_at, updated_at
                FROM product.product
                WHERE is_deleted = false AND name ILIKE $4 AND created_by = $3
                LIMIT $1 OFFSET $2
            "#,
            )
            .bind(limit as i32)
            .bind(offset as i32)
            .bind(user_id)
            .bind(format!("%{filter}%"))
        }
    }

    pub fn find_all_favorite(
        limit: u32,
        offset: u32,
        user_id: i64,
        is_recipe: Option<bool>,
        filter: String,
    ) -> QueryAs<'static, Postgres, Self, PgArguments> {
        if let Some(is_recipe) = is_recipe {
            sqlx::query_as(
                r#"
                SELECT id, is_recipe, name, brand, description, density, serving_size, created_by, is_private, created_at, updated_at
                FROM product.product
                WHERE is_deleted = false AND name ILIKE $4 AND is_recipe = $5
                    AND (is_private = false OR created_by = $3)
                    AND product.id IN (SELECT product_id FROM journal.favorite_product WHERE user_id = $3)
                LIMIT $1 OFFSET $2
            "#,
            )
            .bind(limit as i32)
            .bind(offset as i32)
            .bind(user_id)
            .bind(format!("%{filter}%"))
            .bind(is_recipe)
        } else {
            sqlx::query_as(
                r#"
                SELECT id, is_recipe, name, brand, description, density, serving_size, created_by, is_private, created_at, updated_at
                FROM product.product
                WHERE is_deleted = false AND name ILIKE $4
                    AND (is_private = false OR created_by = $3)
                    AND product.id IN (SELECT product_id FROM journal.favorite_product WHERE user_id = $3)
                LIMIT $1 OFFSET $2
            "#,
            )
            .bind(limit as i32)
            .bind(offset as i32)
            .bind(user_id)
            .bind(format!("%{filter}%"))
        }
    }

    pub fn find_recipe_by_id(
        id: i64,
        user_id: Option<i64>,
    ) -> QueryAs<'static, Postgres, Self, PgArguments> {
        sqlx::query_as(
            r#"
            SELECT id, is_recipe, name, brand, description, density, serving_size, created_by, is_private, created_at, updated_at
            FROM product.product
            WHERE is_deleted = false AND is_recipe = true AND id = $1 AND (is_private = false OR created_by = $2)
        "#,
        )
        .bind(id)
        .bind(user_id)
    }

    pub async fn insert_food(
        create_food_payload: &CreateFoodPayload,
        created_by: i64,
        txn: impl Executor<'_, Database = Postgres>,
    ) -> Result<Self, Error> {
        let query = sqlx::query_as(
            r#"
            INSERT INTO product.product (is_recipe, name, brand, description, density, serving_size, created_by, is_private, created_at, updated_at)
            VALUES (false, $1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id, is_recipe, name, brand, description, density, serving_size, created_by, is_private, created_at, updated_at;
        "#,
        )
            .bind(create_food_payload.name.to_owned())
            .bind(create_food_payload.brand.to_owned())
            .bind(create_food_payload.description.to_owned())
            .bind(create_food_payload.density)
            .bind(create_food_payload.serving_size)
            .bind(created_by)
            .bind(create_food_payload.is_private)
            .bind(Utc::now())
            .bind(Utc::now());

        let result = query
            .fetch_optional(txn)
            .await?
            .ok_or_else(|| Error::not_created("product"))?;

        Ok(result)
    }

    pub async fn insert_recipe(
        create_recipe_payload: &CreateRecipePayload,
        created_by: i64,
        txn: impl Executor<'_, Database = Postgres>,
    ) -> Result<Self, Error> {
        let query = sqlx::query_as(
            r#"
            INSERT INTO product.product (is_recipe, name, brand, description, density, serving_size, created_by, is_private, created_at, updated_at)
            VALUES (true, $1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id, is_recipe, name, brand, description, density, serving_size, created_by, is_private, created_at, updated_at;
        "#,
        )
            .bind(create_recipe_payload.name.to_owned())
            .bind(create_recipe_payload.brand.to_owned())
            .bind(create_recipe_payload.description.to_owned())
            .bind(create_recipe_payload.density)
            .bind(create_recipe_payload.serving_size)
            .bind(created_by)
            .bind(create_recipe_payload.is_private)
            .bind(Utc::now())
            .bind(Utc::now());

        let result = query
            .fetch_optional(txn)
            .await?
            .ok_or_else(|| Error::not_created("product"))?;

        Ok(result)
    }

    pub async fn update_food(
        update_food_payload: &UpdateFoodPayload,
        user_id: i64,
        txn: impl Executor<'_, Database = Postgres>,
    ) -> Result<Self, Error> {
        let query = sqlx::query_as(
            r#"
            UPDATE product.product SET
                is_recipe = false,
                name = $1,
                brand = $2,
                description = $3,
                density = $4,
                serving_size = $5,
                is_private = $6,
                updated_at = $7
            WHERE id = $8 AND created_by = $9
            RETURNING id, is_recipe, name, brand, description, density, serving_size, created_by, is_private, created_at, updated_at;
        "#,
        )
            .bind(update_food_payload.name.to_owned())
            .bind(update_food_payload.brand.to_owned())
            .bind(update_food_payload.description.to_owned())
            .bind(update_food_payload.density)
            .bind(update_food_payload.serving_size)
            .bind(update_food_payload.is_private)
            .bind(Utc::now())
            .bind(update_food_payload.id)
            .bind(user_id);

        let result = query
            .fetch_optional(txn)
            .await?
            .ok_or_else(|| Error::not_updated("product", update_food_payload.id))?;

        Ok(result)
    }

    pub async fn update_recipe(
        update_recipe_payload: &UpdateRecipePayload,
        user_id: i64,
        txn: impl Executor<'_, Database = Postgres>,
    ) -> Result<Self, Error> {
        let query = sqlx::query_as(
            r#"
            UPDATE product.product SET
                is_recipe = true,
                name = $1,
                brand = $2,
                description = $3,
                density = $4,
                serving_size = $5,
                is_private = $6,
                updated_at = $7
            WHERE id = $8 AND created_by = $9
            RETURNING id, is_recipe, name, brand, description, density, serving_size, created_by, is_private, created_at, updated_at;
        "#,
        )
            .bind(update_recipe_payload.name.to_owned())
            .bind(update_recipe_payload.brand.to_owned())
            .bind(update_recipe_payload.description.to_owned())
            .bind(update_recipe_payload.density)
            .bind(update_recipe_payload.serving_size)
            .bind(update_recipe_payload.is_private)
            .bind(Utc::now())
            .bind(update_recipe_payload.id)
            .bind(user_id);

        let result = query
            .fetch_optional(txn)
            .await?
            .ok_or_else(|| Error::not_updated("product", update_recipe_payload.id))?;

        Ok(result)
    }

    pub async fn delete_by_id(
        product_id: i64,
        user_id: i64,
        txn: impl Executor<'_, Database = Postgres>,
    ) -> Result<(), Error> {
        let query = sqlx::query(
            r#"
            UPDATE product.product SET is_deleted = true
            WHERE id = $1 AND created_by = $2
            RETURNING id;
        "#,
        )
        .bind(product_id)
        .bind(user_id);

        query.execute(txn).await?;

        Ok(())
    }

    pub async fn delete_favorite(
        user_id: i64,
        product_id: i64,
        txn: impl Executor<'_, Database = Postgres>,
    ) -> Result<(), Error> {
        let query = sqlx::query(
            r#"
            DELETE FROM journal.favorite_product WHERE user_id = $1 AND product_id = $2
            RETURNING user_id, product_id;
        "#,
        )
        .bind(user_id)
        .bind(product_id);

        query.execute(txn).await?;

        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use crate::{
        types::{
            food::{CreateFoodPayload, UpdateFoodPayload},
            product::Product,
            recipe::{CreateRecipePayload, UpdateRecipePayload},
        },
        utils,
    };

    #[tokio::test]
    async fn find_food_by_id() {
        let food_id = 1;
        let user_id = None;

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let product = Product::find_food_by_id(food_id, user_id)
            .fetch_optional(&mut txn)
            .await
            .unwrap();

        assert!(product.is_some());
    }

    #[tokio::test]
    async fn find_food_all() {
        let food_limit = 10;
        let food_offset = 0;
        let food_user_id = Some(1);
        let is_recipe = Some(false);

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let products = Product::find_all(
            food_limit,
            food_offset,
            food_user_id,
            is_recipe,
            "".to_string(),
        )
        .fetch_all(&mut txn)
        .await
        .unwrap();

        assert!(!products.is_empty());
    }

    #[tokio::test]
    async fn find_food_all_created_by_user() {
        let food_limit = 10;
        let food_offset = 0;
        let food_user_id = 1;
        let is_recipe = Some(false);

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let products = Product::find_all_created_by_user(
            food_limit,
            food_offset,
            food_user_id,
            is_recipe,
            "".to_string(),
        )
        .fetch_all(&mut txn)
        .await
        .unwrap();

        assert!(!products.is_empty());
    }

    #[tokio::test]
    async fn find_food_all_favorite() {
        let food_limit = 10;
        let food_offset = 0;
        let food_user_id = 1;
        let is_recipe = Some(false);

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let products = Product::find_all_favorite(
            food_limit,
            food_offset,
            food_user_id,
            is_recipe,
            "".to_string(),
        )
        .fetch_all(&mut txn)
        .await
        .unwrap();

        assert!(!products.is_empty());
    }

    #[tokio::test]
    async fn find_recipe_by_id() {
        let recipe_id = 6;
        let user_id = None;

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let product = Product::find_recipe_by_id(recipe_id, user_id)
            .fetch_optional(&mut txn)
            .await
            .unwrap();

        assert!(product.is_some());
    }

    #[tokio::test]
    async fn find_recipe_all() {
        let recipe_limit = 10;
        let recipe_offset = 0;
        let recipe_user_id = Some(1);
        let is_recipe = Some(true);

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let products = Product::find_all(
            recipe_limit,
            recipe_offset,
            recipe_user_id,
            is_recipe,
            "".to_string(),
        )
        .fetch_all(&mut txn)
        .await
        .unwrap();

        assert!(!products.is_empty());
    }

    #[tokio::test]
    async fn find_recipe_all_created_by_user() {
        let recipe_limit = 10;
        let recipe_offset = 0;
        let recipe_user_id = 1;
        let is_recipe = Some(true);

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let products = Product::find_all_created_by_user(
            recipe_limit,
            recipe_offset,
            recipe_user_id,
            is_recipe,
            "".to_string(),
        )
        .fetch_all(&mut txn)
        .await
        .unwrap();

        assert!(!products.is_empty());
    }

    #[tokio::test]
    async fn find_recipe_all_favorite() {
        let recipe_limit = 10;
        let recipe_offset = 0;
        let recipe_user_id = 1;
        let is_recipe = Some(true);

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let products = Product::find_all_favorite(
            recipe_limit,
            recipe_offset,
            recipe_user_id,
            is_recipe,
            "".to_string(),
        )
        .fetch_all(&mut txn)
        .await
        .unwrap();

        assert!(!products.is_empty());
    }

    #[tokio::test]
    async fn insert_food() {
        let user_id = 1;

        let create_product_payload: CreateFoodPayload =
            utils::read_json("examples/create_food_payload.json").unwrap();

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let product_result = Product::insert_food(&create_product_payload, user_id, &mut txn)
            .await
            .unwrap();

        assert_ne!(
            0, product_result.id,
            "product_result should not have a placeholder value for id"
        );

        txn.rollback().await.unwrap();
    }

    #[tokio::test]
    async fn update_food() {
        let user_id = 1;

        let create_product_payload: CreateFoodPayload =
            utils::read_json("examples/create_food_payload.json").unwrap();

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let create_product_result =
            Product::insert_food(&create_product_payload, user_id, &mut txn)
                .await
                .unwrap();

        assert_ne!(
            0, create_product_result.id,
            "create_product_result should not have a placeholder value for id"
        );

        let mut update_product_payload: UpdateFoodPayload =
            utils::read_json("examples/update_food_payload.json").unwrap();

        update_product_payload.id = create_product_result.id;

        let update_product_result =
            Product::update_food(&update_product_payload, user_id, &mut txn)
                .await
                .unwrap();

        assert_ne!(
            create_product_result.name, update_product_result.name,
            "update_product_result should not have an old name"
        );

        txn.rollback().await.unwrap();
    }

    #[tokio::test]
    async fn insert_recipe() {
        let create_product_payload: CreateRecipePayload =
            utils::read_json("examples/create_recipe_payload.json").unwrap();

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let product_result = Product::insert_recipe(&create_product_payload, 1, &mut txn)
            .await
            .unwrap();

        assert_ne!(
            0, product_result.id,
            "product_result should not have a placeholder value for id"
        );

        txn.rollback().await.unwrap();
    }

    #[tokio::test]
    async fn update_recipe() {
        let user_id = 1;

        let create_product_payload: CreateRecipePayload =
            utils::read_json("examples/create_recipe_payload.json").unwrap();

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let create_product_result =
            Product::insert_recipe(&create_product_payload, user_id, &mut txn)
                .await
                .unwrap();

        assert_ne!(
            0, create_product_result.id,
            "create_product_result should not have a placeholder value for id"
        );

        let mut update_product_payload: UpdateRecipePayload =
            utils::read_json("examples/update_recipe_payload.json").unwrap();

        update_product_payload.id = create_product_result.id;

        let update_product_result =
            Product::update_recipe(&update_product_payload, user_id, &mut txn)
                .await
                .unwrap();

        assert_ne!(
            create_product_result.name, update_product_result.name,
            "update_product_result should not have an old name"
        );

        txn.rollback().await.unwrap();
    }

    #[tokio::test]
    async fn delete_favorite() {
        let user_id = 1;
        let product_id = 5;

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        Product::delete_favorite(user_id, product_id, &mut txn)
            .await
            .unwrap();

        txn.rollback().await.unwrap();
    }

    #[tokio::test]
    async fn delete_by_id() {
        let product_id = 1;
        let user_id = 1;

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        Product::delete_by_id(product_id, user_id, &mut txn)
            .await
            .unwrap();

        txn.rollback().await.unwrap();
    }
}
