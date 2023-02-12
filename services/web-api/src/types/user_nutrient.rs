use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgArguments, query::QueryAs, Executor, Postgres};

use super::error::Error;

#[derive(sqlx::FromRow, Deserialize, Serialize, Debug)]
pub struct UserNutrient {
    pub nutrient_id: i16,
    pub is_featured: bool,
    pub daily_target_amount: Option<f32>,
    pub ui_index: i16,
}

#[derive(sqlx::FromRow, Deserialize, Serialize, Debug)]
pub struct UserNutrientDetailed {
    pub nutrient_id: i16,
    pub is_featured: bool,
    pub daily_target_amount: Option<f32>,
    pub ui_index: i16,
    pub nutrient_name: String,
    pub nutrient_daily_value: Option<f32>,
    pub nutrient_unit: String,
    pub nutrient_group: String,
    pub nutrient_parent_name: Option<String>,
}

impl UserNutrient {
    pub fn find_all(user_id: i64) -> QueryAs<'static, Postgres, UserNutrientDetailed, PgArguments> {
        sqlx::query_as(
            r#"
            SELECT
                nutrient_id,
                is_featured,
                daily_target_amount,
                ui_index,
                nutrient_name,
                nutrient_daily_value,
                nutrient_unit,
                nutrient_group,
                nutrient_parent_name
            FROM journal.user_nutrient_detailed
            WHERE user_id = $1
        "#,
        )
        .bind(user_id)
    }

    pub fn find_by_id(
        user_id: i64,
        nutrient_id: i16,
    ) -> QueryAs<'static, Postgres, UserNutrientDetailed, PgArguments> {
        sqlx::query_as(
            r#"
            SELECT
                nutrient_id,
                is_featured,
                daily_target_amount,
                ui_index,
                nutrient_name,
                nutrient_daily_value,
                nutrient_unit,
                nutrient_group,
                nutrient_parent_name
            FROM journal.user_nutrient_detailed
            WHERE user_id = $1 AND nutrient_id = $2
        "#,
        )
        .bind(user_id)
        .bind(nutrient_id)
    }

    pub async fn upsert_nutrient(
        user_id: i64,
        user_nutrient: &Self,
        txn: impl Executor<'_, Database = Postgres>,
    ) -> Result<Self, Error> {
        let query = sqlx::query_as(
            r#"
            INSERT INTO journal.user_nutrient (user_id, nutrient_id, is_featured, daily_target_amount, ui_index)
            VALUES ($1, $2, $3, $4, $5) 
            ON CONFLICT (user_id, nutrient_id)
            DO 
               UPDATE SET is_featured = $3, daily_target_amount = $4, ui_index = $5
            RETURNING nutrient_id, is_featured, daily_target_amount, ui_index;
        "#,
        )
            .bind(user_id)
            .bind(user_nutrient.nutrient_id)
            .bind(user_nutrient.is_featured)
            .bind(user_nutrient.daily_target_amount)
            .bind(user_nutrient.ui_index);

        let result = query
            .fetch_optional(txn)
            .await?
            .ok_or_else(|| Error::not_updated("user_nutrient", user_id))?;

        Ok(result)
    }

    pub async fn delete_user_nutrient(
        user_id: i64,
        nutrient_id: i16,
        txn: impl Executor<'_, Database = Postgres>,
    ) -> Result<Self, Error> {
        let delete_query = sqlx::query_as(
            r#"
            DELETE FROM journal.user_nutrient
            WHERE user_id = $1 AND nutrient_id = $2
            RETURNING nutrient_id, is_featured, daily_target_amount, ui_index;
            "#,
        )
        .bind(user_id)
        .bind(nutrient_id);

        let result = delete_query
            .fetch_optional(txn)
            .await?
            .ok_or_else(|| Error::not_deleted("user_nutrient", user_id))?;

        Ok(result)
    }
}

#[cfg(test)]
mod tests {
    use super::UserNutrient;
    use crate::utils;

    #[tokio::test]
    async fn find_all() {
        let user_id = 1;

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let user_nutrients = UserNutrient::find_all(user_id)
            .fetch_all(&mut txn)
            .await
            .unwrap();

        assert!(
            user_nutrients.len() > 1,
            "should be more than 1 user_nutrient"
        );

        txn.rollback().await.unwrap();
    }

    #[tokio::test]
    async fn find_by_id() {
        let user_id = 1;
        let nutrient_id = 5;

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let user_nutrient = UserNutrient::find_by_id(user_id, nutrient_id)
            .fetch_optional(&mut txn)
            .await
            .unwrap();

        assert!(user_nutrient.is_some(), "should find a user_nutrient");

        txn.rollback().await.unwrap();
    }

    #[tokio::test]
    async fn upsert_user_nutrient() {
        let user_id = 1;
        let upsert_user_nutrient_payload: UserNutrient =
            utils::read_json("examples/upsert_user_nutrient.json").unwrap();

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let insert_result =
            UserNutrient::upsert_nutrient(user_id, &upsert_user_nutrient_payload, &mut txn).await;

        assert!(insert_result.is_ok(), "insert_result should be ok");

        let update_result =
            UserNutrient::upsert_nutrient(user_id, &upsert_user_nutrient_payload, &mut txn).await;

        assert!(update_result.is_ok(), "update_result should be ok");

        txn.rollback().await.unwrap();
    }

    #[tokio::test]
    async fn delete_user_nutrient() {
        let user_id = 1;
        let upsert_user_nutrient_payload: UserNutrient =
            utils::read_json("examples/upsert_user_nutrient.json").unwrap();

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let upsert_result =
            UserNutrient::upsert_nutrient(user_id, &upsert_user_nutrient_payload, &mut txn).await;

        assert!(upsert_result.is_ok(), "upsert_result should be ok");

        let delete_result = UserNutrient::delete_user_nutrient(
            user_id,
            upsert_user_nutrient_payload.nutrient_id,
            &mut txn,
        )
        .await;

        assert!(delete_result.is_ok(), "delete_result should be ok");

        txn.rollback().await.unwrap();
    }
}
