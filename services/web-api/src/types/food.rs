use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgArguments, query::QueryAs, Executor, Postgres};

use super::{
    error::Error,
    recipe::{CreateRecipePayload, UpdateRecipePayload},
};

#[derive(sqlx::FromRow, Deserialize, Serialize, Debug, Clone)]
pub struct Food {
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
    pub serving_size: f64,
}

#[derive(Deserialize, Serialize)]
pub struct FoodShort {
    pub id: i64,
    pub is_recipe: bool,
    pub name: String,
    pub brand: String,
    pub created_by: i64,
    pub is_private: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl FoodShort {
    pub fn new(food: &Food) -> Self {
        Self {
            id: food.id,
            is_recipe: food.is_recipe.to_owned(),
            name: food.name.to_owned(),
            brand: food.brand.to_owned(),
            created_by: food.created_by,
            is_private: food.is_private,
            created_at: food.created_at,
            updated_at: food.updated_at,
        }
    }
}

impl Food {
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
                FROM recipe.food
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
                FROM recipe.food
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
                FROM recipe.food
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
                FROM recipe.food
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
                FROM recipe.food
                WHERE is_deleted = false AND name ILIKE $4 AND is_recipe = $5
                    AND (is_private = false OR created_by = $3)
                    AND food.id IN (SELECT food_id FROM journal.favorite_food WHERE user_id = $3)
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
                FROM recipe.food
                WHERE is_deleted = false AND name ILIKE $4
                    AND (is_private = false OR created_by = $3)
                    AND food.id IN (SELECT food_id FROM journal.favorite_food WHERE user_id = $3)
                LIMIT $1 OFFSET $2
            "#,
            )
            .bind(limit as i32)
            .bind(offset as i32)
            .bind(user_id)
            .bind(format!("%{filter}%"))
        }
    }

    pub fn find_by_id(
        id: i64,
        user_id: Option<i64>,
    ) -> QueryAs<'static, Postgres, Self, PgArguments> {
        sqlx::query_as(
            r#"
            SELECT id, is_recipe, name, brand, description, density, serving_size, created_by, is_private, created_at, updated_at
            FROM recipe.food
            WHERE is_deleted = false AND id = $1 AND (is_private = false OR created_by = $2)
        "#,
        )
        .bind(id)
        .bind(user_id)
    }

    pub async fn insert(
        create_food_payload: &CreateRecipePayload,
        created_by: i64,
        txn: impl Executor<'_, Database = Postgres>,
    ) -> Result<Self, Error> {
        let query = sqlx::query_as(
            r#"
            INSERT INTO recipe.food (is_recipe, name, brand, description, density, serving_size, created_by, is_private, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING id, is_recipe, name, brand, description, density, serving_size, created_by, is_private, created_at, updated_at;
        "#,
        )
            .bind(create_food_payload.is_recipe)
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
            .ok_or_else(|| Error::not_created("food"))?;

        Ok(result)
    }

    pub async fn update(
        update_food_payload: &UpdateRecipePayload,
        is_recipe: bool,
        user_id: i64,
        txn: impl Executor<'_, Database = Postgres>,
    ) -> Result<Self, Error> {
        let query = sqlx::query_as(
            r#"
            UPDATE recipe.food SET
                is_recipe = $1,
                name = $2,
                brand = $3,
                description = $4,
                density = $5,
                serving_size = $6,
                is_private = $7,
                updated_at = $8
            WHERE id = $9 AND created_by = $10
            RETURNING id, is_recipe, name, brand, description, density, serving_size, created_by, is_private, created_at, updated_at;
        "#,
        )
            .bind(is_recipe)
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
            .ok_or_else(|| Error::not_updated("food", update_food_payload.id))?;

        Ok(result)
    }

    pub async fn delete_by_id(
        food_id: i64,
        user_id: i64,
        txn: impl Executor<'_, Database = Postgres>,
    ) -> Result<(), Error> {
        let query = sqlx::query(
            r#"
            UPDATE recipe.food SET is_deleted = true
            WHERE id = $1 AND created_by = $2
            RETURNING id;
        "#,
        )
        .bind(food_id)
        .bind(user_id);

        query.execute(txn).await?;

        Ok(())
    }

    pub async fn delete_favorite(
        user_id: i64,
        food_id: i64,
        txn: impl Executor<'_, Database = Postgres>,
    ) -> Result<(), Error> {
        let query = sqlx::query(
            r#"
            DELETE FROM journal.favorite_food WHERE user_id = $1 AND food_id = $2
            RETURNING user_id, food_id;
        "#,
        )
        .bind(user_id)
        .bind(food_id);

        query.execute(txn).await?;

        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use crate::{
        types::{
            food::Food,
            recipe::{CreateRecipePayload, UpdateRecipePayload},
        },
        utils,
    };

    #[tokio::test]
    async fn find_food_all() {
        let food_limit = 10;
        let food_offset = 0;
        let food_user_id = Some(1);
        let is_recipe = Some(false);

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let foods = Food::find_all(
            food_limit,
            food_offset,
            food_user_id,
            is_recipe,
            "".to_string(),
        )
        .fetch_all(&mut txn)
        .await
        .unwrap();

        assert!(!foods.is_empty());
    }

    #[tokio::test]
    async fn find_food_all_created_by_user() {
        let food_limit = 10;
        let food_offset = 0;
        let food_user_id = 1;
        let is_recipe = Some(false);

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let foods = Food::find_all_created_by_user(
            food_limit,
            food_offset,
            food_user_id,
            is_recipe,
            "".to_string(),
        )
        .fetch_all(&mut txn)
        .await
        .unwrap();

        assert!(!foods.is_empty());
    }

    #[tokio::test]
    async fn find_food_all_favorite() {
        let food_limit = 10;
        let food_offset = 0;
        let food_user_id = 1;
        let is_recipe = Some(false);

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let foods = Food::find_all_favorite(
            food_limit,
            food_offset,
            food_user_id,
            is_recipe,
            "".to_string(),
        )
        .fetch_all(&mut txn)
        .await
        .unwrap();

        assert!(!foods.is_empty());
    }

    #[tokio::test]
    async fn find_recipe_by_id() {
        let recipe_id = 6;
        let user_id = None;

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let food = Food::find_by_id(recipe_id, user_id)
            .fetch_optional(&mut txn)
            .await
            .unwrap();

        assert!(food.is_some());
    }

    #[tokio::test]
    async fn find_recipe_all() {
        let recipe_limit = 10;
        let recipe_offset = 0;
        let recipe_user_id = Some(1);
        let is_recipe = Some(true);

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let foods = Food::find_all(
            recipe_limit,
            recipe_offset,
            recipe_user_id,
            is_recipe,
            "".to_string(),
        )
        .fetch_all(&mut txn)
        .await
        .unwrap();

        assert!(!foods.is_empty());
    }

    #[tokio::test]
    async fn find_recipe_all_created_by_user() {
        let recipe_limit = 10;
        let recipe_offset = 0;
        let recipe_user_id = 1;
        let is_recipe = Some(true);

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let foods = Food::find_all_created_by_user(
            recipe_limit,
            recipe_offset,
            recipe_user_id,
            is_recipe,
            "".to_string(),
        )
        .fetch_all(&mut txn)
        .await
        .unwrap();

        assert!(!foods.is_empty());
    }

    #[tokio::test]
    async fn find_recipe_all_favorite() {
        let recipe_limit = 10;
        let recipe_offset = 0;
        let recipe_user_id = 1;
        let is_recipe = Some(true);

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let foods = Food::find_all_favorite(
            recipe_limit,
            recipe_offset,
            recipe_user_id,
            is_recipe,
            "".to_string(),
        )
        .fetch_all(&mut txn)
        .await
        .unwrap();

        assert!(!foods.is_empty());
    }

    #[tokio::test]
    async fn insert_food() {
        let user_id = 1;

        let create_food_payload: CreateRecipePayload =
            utils::read_json("examples/create_food_payload.json").unwrap();

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let food_result = Food::insert(&create_food_payload, user_id, &mut txn)
            .await
            .unwrap();

        assert_ne!(
            0, food_result.id,
            "food_result should not have a placeholder value for id"
        );

        txn.rollback().await.unwrap();
    }

    #[tokio::test]
    async fn update_food() {
        let user_id = 1;

        let create_food_payload: CreateRecipePayload =
            utils::read_json("examples/create_food_payload.json").unwrap();

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let create_food_result = Food::insert(&create_food_payload, user_id, &mut txn)
            .await
            .unwrap();

        assert_ne!(
            0, create_food_result.id,
            "create_food_result should not have a placeholder value for id"
        );

        let mut update_food_payload: UpdateRecipePayload =
            utils::read_json("examples/update_food_payload.json").unwrap();

        update_food_payload.id = create_food_result.id;

        let update_food_result = Food::update(&update_food_payload, false, user_id, &mut txn)
            .await
            .unwrap();

        assert_ne!(
            create_food_result.name, update_food_result.name,
            "update_food_result should not have an old name"
        );

        txn.rollback().await.unwrap();
    }

    #[tokio::test]
    async fn insert_recipe() {
        let create_food_payload: CreateRecipePayload =
            utils::read_json("examples/create_recipe_payload.json").unwrap();

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let food_result = Food::insert(&create_food_payload.to_owned(), 1, &mut txn)
            .await
            .unwrap();

        assert_ne!(
            0, food_result.id,
            "food_result should not have a placeholder value for id"
        );

        txn.rollback().await.unwrap();
    }

    #[tokio::test]
    async fn update_recipe() {
        let user_id = 1;

        let create_food_payload: CreateRecipePayload =
            utils::read_json("examples/create_recipe_payload.json").unwrap();

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let create_food_result =
            Food::insert(&create_food_payload.to_owned(), user_id, &mut txn)
                .await
                .unwrap();

        assert_ne!(
            0, create_food_result.id,
            "create_food_result should not have a placeholder value for id"
        );

        let mut update_food_payload: UpdateRecipePayload =
            utils::read_json("examples/update_recipe_payload.json").unwrap();

        update_food_payload.id = create_food_result.id;

        let update_food_result = Food::update(
            &update_food_payload.to_owned(),
            true,
            user_id,
            &mut txn,
        )
        .await
        .unwrap();

        assert_ne!(
            create_food_result.name, update_food_result.name,
            "update_food_result should not have an old name"
        );

        txn.rollback().await.unwrap();
    }

    #[tokio::test]
    async fn delete_favorite() {
        let user_id = 1;
        let food_id = 5;

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        Food::delete_favorite(user_id, food_id, &mut txn)
            .await
            .unwrap();

        txn.rollback().await.unwrap();
    }

    #[tokio::test]
    async fn delete_by_id() {
        let food_id = 1;
        let user_id = 1;

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        Food::delete_by_id(food_id, user_id, &mut txn)
            .await
            .unwrap();

        txn.rollback().await.unwrap();
    }
}
