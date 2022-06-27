use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::postgres::PgArguments;
use sqlx::query::QueryAs;
use sqlx::{Executor, Postgres};

use super::error::Error;
use super::food::{CreateFoodPayload, UpdateFoodPayload};
use super::recipe::{CreateRecipePayload, UpdateRecipePayload};

#[derive(sqlx::Type, Serialize, Deserialize, Debug, Clone)]
#[sqlx(type_name = "product_type", rename_all = "snake_case")]
#[serde(rename_all = "snake_case")]
pub enum ProductType {
    Food,
    Recipe,
}

#[derive(sqlx::Type, Serialize, Deserialize, Clone)]
#[sqlx(type_name = "_product_type")]
struct ProductTypeArray(Vec<ProductType>);

#[derive(sqlx::FromRow, Deserialize, Serialize, Debug, Clone)]
pub struct Product {
    pub id: i64,
    #[sqlx(rename = "type")]
    pub product_type: ProductType,
    pub name: String,
    pub brand: String,
    pub subtitle: String,
    pub description: String,
    pub density: f64,
    pub serving_size: f64,
    pub created_by: i64,
    pub is_private: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Deserialize, Serialize)]
pub struct ProductShort {
    pub id: i64,
    pub product_type: ProductType,
    pub name: String,
    pub brand: String,
    pub subtitle: String,
    pub is_private: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl ProductShort {
    pub fn new(product: &Product) -> Self {
        Self {
            id: product.id,
            product_type: product.product_type.to_owned(),
            name: product.name.to_owned(),
            brand: product.brand.to_owned(),
            subtitle: product.subtitle.to_owned(),
            is_private: product.is_private,
            created_at: product.created_at,
            updated_at: product.updated_at,
        }
    }
}

impl Product {
    pub fn find_food_by_id(id: i64) -> QueryAs<'static, Postgres, Self, PgArguments> {
        sqlx::query_as(
            r#"
            SELECT id, type, name, brand, subtitle, description, density, serving_size, created_by, is_private, created_at, updated_at
            FROM private.product
            WHERE type = 'food' AND id = $1
        "#,
        )
        .bind(id)
    }

    pub fn find_all(
        limit: u32,
        offset: u32,
        user_id: i64,
        types: Vec<ProductType>,
        filter: String,
    ) -> QueryAs<'static, Postgres, Self, PgArguments> {
        sqlx::query_as(
            r#"
            SELECT id, type, name, brand, subtitle, description, density, serving_size, created_by, is_private, created_at, updated_at
            FROM private.product
            WHERE name ILIKE $5 AND type = ANY($4) AND (is_private = false OR created_by = $3)
            LIMIT $1 OFFSET $2
        "#,
        )
        .bind(limit as i32)
        .bind(offset as i32)
        .bind(user_id)
        .bind(ProductTypeArray(types))
        .bind(format!("%{}%", filter))
    }

    pub fn find_all_created_by_user(
        limit: u32,
        offset: u32,
        user_id: i64,
        types: Vec<ProductType>,
        filter: String,
    ) -> QueryAs<'static, Postgres, Self, PgArguments> {
        sqlx::query_as(
            r#"
            SELECT id, type, name, brand, subtitle, description, density, serving_size, created_by, is_private, created_at, updated_at
            FROM private.product
            WHERE name ILIKE $5 AND type = ANY($4) AND created_by = $3
            LIMIT $1 OFFSET $2
        "#,
        )
        .bind(limit as i32)
        .bind(offset as i32)
        .bind(user_id)
        .bind(ProductTypeArray(types))
        .bind(format!("%{}%", filter))
    }

    pub fn find_all_favorite(
        limit: u32,
        offset: u32,
        user_id: i64,
        types: Vec<ProductType>,
        filter: String,
    ) -> QueryAs<'static, Postgres, Self, PgArguments> {
        sqlx::query_as(
            r#"
            SELECT id, type, name, brand, subtitle, description, density, serving_size, created_by, is_private, created_at, updated_at
            FROM private.product
            WHERE name ILIKE $5 AND type = ANY($4)
                AND (is_private = false OR created_by = $3)
                AND product.id IN (SELECT product_id FROM private.favorite_product WHERE user_id = $3)
            LIMIT $1 OFFSET $2
        "#,
        )
        .bind(limit as i32)
        .bind(offset as i32)
        .bind(user_id)
        .bind(ProductTypeArray(types))
        .bind(format!("%{}%", filter))
    }

    pub fn find_recipe_by_id(id: i64) -> QueryAs<'static, Postgres, Self, PgArguments> {
        sqlx::query_as(
            r#"
            SELECT id, type, name, brand, subtitle, description, density, serving_size, created_by, is_private, created_at, updated_at
            FROM private.product
            WHERE type = 'recipe' AND id = $1
        "#,
        )
        .bind(id)
    }

    pub async fn insert_food(
        create_food_payload: &CreateFoodPayload,
        created_by: i64,
        txn: impl Executor<'_, Database = Postgres>,
    ) -> Result<Self, Error> {
        let query = sqlx::query_as(
            r#"
            INSERT INTO private.product (type, name, brand, subtitle, description, density, serving_size, created_by, is_private, created_at, updated_at)
            VALUES ('food', $1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING id, type, name, brand, subtitle, description, density, serving_size, created_by, is_private, created_at, updated_at;
        "#,
        )
            .bind(create_food_payload.name.to_owned())
            .bind(create_food_payload.brand.to_owned())
            .bind(create_food_payload.subtitle.to_owned())
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
            INSERT INTO private.product (type, name, brand, subtitle, description, density, serving_size, created_by, is_private, created_at, updated_at)
            VALUES ('recipe', $1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING id, type, name, brand, subtitle, description, density, serving_size, created_by, is_private, created_at, updated_at;
        "#,
        )
            .bind(create_recipe_payload.name.to_owned())
            .bind(create_recipe_payload.brand.to_owned())
            .bind(create_recipe_payload.subtitle.to_owned())
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
        txn: impl Executor<'_, Database = Postgres>,
    ) -> Result<Self, Error> {
        let query = sqlx::query_as(
            r#"
            UPDATE private.product SET
                type = 'food',
                name = $1,
                brand = $2,
                subtitle = $3,
                description = $4,
                density = $5,
                serving_size = $6,
                is_private = $7,
                updated_at = $8
            WHERE id = $9
            RETURNING id, type, name, brand, subtitle, description, density, serving_size, created_by, is_private, created_at, updated_at;
        "#,
        )
            .bind(update_food_payload.name.to_owned())
            .bind(update_food_payload.brand.to_owned())
            .bind(update_food_payload.subtitle.to_owned())
            .bind(update_food_payload.description.to_owned())
            .bind(update_food_payload.density)
            .bind(update_food_payload.serving_size)
            .bind(update_food_payload.is_private)
            .bind(Utc::now())
            .bind(update_food_payload.id);

        let result = query
            .fetch_optional(txn)
            .await?
            .ok_or_else(|| Error::not_updated("product", update_food_payload.id))?;

        Ok(result)
    }

    pub async fn update_recipe(
        update_recipe_payload: &UpdateRecipePayload,
        txn: impl Executor<'_, Database = Postgres>,
    ) -> Result<Self, Error> {
        let query = sqlx::query_as(
            r#"
            UPDATE private.product SET
                type = 'recipe',
                name = $1,
                brand = $2,
                subtitle = $3,
                description = $4,
                density = $5,
                serving_size = $6,
                is_private = $7,
                updated_at = $8
            WHERE id = $9
            RETURNING id, type, name, brand, subtitle, description, density, serving_size, created_by, is_private, created_at, updated_at;
        "#,
        )
            .bind(update_recipe_payload.name.to_owned())
            .bind(update_recipe_payload.brand.to_owned())
            .bind(update_recipe_payload.subtitle.to_owned())
            .bind(update_recipe_payload.description.to_owned())
            .bind(update_recipe_payload.density)
            .bind(update_recipe_payload.serving_size)
            .bind(update_recipe_payload.is_private)
            .bind(Utc::now())
            .bind(update_recipe_payload.id);

        let result = query
            .fetch_optional(txn)
            .await?
            .ok_or_else(|| Error::not_updated("product", update_recipe_payload.id))?;

        Ok(result)
    }
}

#[cfg(test)]
mod tests {
    use crate::{
        types::{
            food::{CreateFoodPayload, UpdateFoodPayload},
            product::{Product, ProductType},
            recipe::{CreateRecipePayload, UpdateRecipePayload},
        },
        utils,
    };

    #[tokio::test]
    async fn find_food_by_id() {
        let food_id = 1;

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let product = Product::find_food_by_id(food_id)
            .fetch_optional(&mut txn)
            .await
            .unwrap();

        assert!(product.is_some());
    }

    #[tokio::test]
    async fn find_food_all() {
        let food_limit = 10;
        let food_offset = 0;
        let food_user_id = 1;
        let food_type = vec![ProductType::Food];

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let products = Product::find_all(
            food_limit,
            food_offset,
            food_user_id,
            food_type,
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
        let food_type = vec![ProductType::Food];

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let products = Product::find_all_created_by_user(
            food_limit,
            food_offset,
            food_user_id,
            food_type,
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
        let food_type = vec![ProductType::Food];

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let products = Product::find_all_favorite(
            food_limit,
            food_offset,
            food_user_id,
            food_type,
            "".to_string(),
        )
        .fetch_all(&mut txn)
        .await
        .unwrap();

        assert!(!products.is_empty());
    }

    #[tokio::test]
    async fn find_recipe_by_id() {
        let recipe_id = 7;

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let product = Product::find_recipe_by_id(recipe_id)
            .fetch_optional(&mut txn)
            .await
            .unwrap();

        assert!(product.is_some());
    }

    #[tokio::test]
    async fn find_recipe_all() {
        let recipe_limit = 10;
        let recipe_offset = 0;
        let recipe_user_id = 1;
        let recipe_type = vec![ProductType::Recipe];

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let products = Product::find_all(
            recipe_limit,
            recipe_offset,
            recipe_user_id,
            recipe_type,
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
        let recipe_type = vec![ProductType::Recipe];

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let products = Product::find_all_created_by_user(
            recipe_limit,
            recipe_offset,
            recipe_user_id,
            recipe_type,
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
        let recipe_type = vec![ProductType::Recipe];

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let products = Product::find_all_favorite(
            recipe_limit,
            recipe_offset,
            recipe_user_id,
            recipe_type,
            "".to_string(),
        )
        .fetch_all(&mut txn)
        .await
        .unwrap();

        assert!(!products.is_empty());
    }

    #[tokio::test]
    async fn insert_food() {
        let create_product_payload: CreateFoodPayload =
            utils::read_type_from_file("examples/create_food_payload.json").unwrap();

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let product_result = Product::insert_food(&create_product_payload, 1, &mut txn)
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
        let create_product_payload: CreateFoodPayload =
            utils::read_type_from_file("examples/create_food_payload.json").unwrap();

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let create_product_result = Product::insert_food(&create_product_payload, 1, &mut txn)
            .await
            .unwrap();

        assert_ne!(
            0, create_product_result.id,
            "create_product_result should not have a placeholder value for id"
        );

        let mut update_product_payload: UpdateFoodPayload =
            utils::read_type_from_file("examples/update_food_payload.json").unwrap();

        update_product_payload.id = create_product_result.id;

        let update_product_result = Product::update_food(&update_product_payload, &mut txn)
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
            utils::read_type_from_file("examples/create_recipe_payload.json").unwrap();

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

        let mut update_product_payload: UpdateRecipePayload =
            utils::read_type_from_file("examples/update_recipe_payload.json").unwrap();

        update_product_payload.id = create_product_result.id;

        let update_product_result = Product::update_recipe(&update_product_payload, &mut txn)
            .await
            .unwrap();

        assert_ne!(
            create_product_result.name, update_product_result.name,
            "update_product_result should not have an old name"
        );

        txn.rollback().await.unwrap();
    }
}
