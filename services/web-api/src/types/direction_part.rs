use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgArguments, query::QueryAs, Executor, Postgres};

use super::error::Error;

#[derive(sqlx::Type, Serialize, Deserialize, Clone, Debug)]
#[sqlx(type_name = "direction_part_type", rename_all = "snake_case")]
#[serde(rename_all = "snake_case")]
pub enum DirectionPartType {
    Ingredient,
    Note,
    Warning,
    Tip,
}

#[derive(sqlx::Type, Serialize, Deserialize, Clone)]
#[sqlx(type_name = "_direction_part_type")]
struct DirectionPartTypeArray(Vec<DirectionPartType>);

#[derive(sqlx::FromRow, Serialize, Deserialize, Clone)]
pub struct DirectionPart {
    pub direction_id: i64,
    pub step_number: i16,
    pub direction_part_type: DirectionPartType,
    pub comment_text: Option<String>,
    pub ingredient_id: Option<i64>,
    pub ingredient_amount: Option<f64>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct CreateDirectionPartPayload {
    pub step_number: i16,
    pub direction_part_type: DirectionPartType,
    pub comment_text: Option<String>,
    pub ingredient_id: Option<i64>,
    pub ingredient_amount: Option<f64>,
}

impl DirectionPart {
    pub fn find_by_direction_ids(
        direction_ids: Vec<i64>,
    ) -> QueryAs<'static, Postgres, Self, PgArguments> {
        sqlx::query_as(
            r#"
            SELECT direction_id, step_number, direction_part_type, comment_text, ingredient_id, ingredient_amount
            FROM private.direction_part
            WHERE direction_id = ANY($1)
        "#,
        )
        .bind(direction_ids)
    }

    pub async fn insert_mutliple(
        create_direction_part_payloads: &[CreateDirectionPartPayload],
        direction_id: i64,
        temporary_to_final_id: &HashMap<i64, i64>,
        txn: impl Executor<'_, Database = Postgres>,
    ) -> Result<Vec<Self>, Error> {
        let mut direction_ids: Vec<i64> = Vec::new();
        let mut step_numbers: Vec<i16> = Vec::new();
        let mut direction_part_types: Vec<DirectionPartType> = Vec::new();
        let mut comment_texts: Vec<Option<String>> = Vec::new();
        let mut ingredient_ids: Vec<Option<i64>> = Vec::new();
        let mut ingredient_amounts: Vec<Option<f64>> = Vec::new();

        create_direction_part_payloads
            .iter()
            .for_each(|direction_part_payload| {
                direction_ids.push(direction_id);
                step_numbers.push(direction_part_payload.step_number);
                direction_part_types.push(direction_part_payload.direction_part_type.to_owned());
                comment_texts.push(direction_part_payload.comment_text.to_owned());
                let ingredient_id =
                    if let Some(temporary_ingredient_id) = direction_part_payload.ingredient_id {
                        temporary_to_final_id.get(&temporary_ingredient_id).copied()
                    } else {
                        None
                    };
                ingredient_ids.push(ingredient_id);
                ingredient_amounts.push(direction_part_payload.ingredient_amount);
            });

        let insert_query = sqlx::query_as(
            r#"
            INSERT INTO private.direction_part (
                direction_id,
                step_number,
                direction_part_type,
                comment_text,
                ingredient_id,
                ingredient_amount
            )
            SELECT * FROM UNNEST($1, $2, $3, $4, $5, $6)
            RETURNING direction_id, step_number, direction_part_type, comment_text, ingredient_id, ingredient_amount;
        "#,
        )
        .bind(direction_ids)
        .bind(step_numbers)
        .bind(DirectionPartTypeArray(direction_part_types))
        .bind(comment_texts)
        .bind(ingredient_ids)
        .bind(ingredient_amounts);

        let result = insert_query.fetch_all(txn).await?;

        Ok(result)
    }
}

#[derive(Serialize, Deserialize, Clone)]
pub struct DirectionPartDetails {
    pub step_number: i16,
    pub direction_part_type: DirectionPartType,
    pub comment_text: Option<String>,
    pub ingredient_id: Option<i64>,
    pub ingredient_amount: Option<f64>,
}

impl DirectionPartDetails {
    pub fn new(direction_part: &DirectionPart) -> Self {
        Self {
            step_number: direction_part.step_number,
            direction_part_type: direction_part.direction_part_type.to_owned(),
            comment_text: direction_part.comment_text.to_owned(),
            ingredient_id: direction_part.ingredient_id,
            ingredient_amount: direction_part.ingredient_amount,
        }
    }
}

#[cfg(test)]
mod tests {
    use crate::{config::Config, types::direction_part::DirectionPart};
    use sqlx::PgPool;

    #[tokio::test]
    #[ignore]
    async fn find_by_product_ids() {
        let direction_ids = vec![1, 3];

        let config = Config::new().unwrap();
        let mut txn = PgPool::connect_lazy(&config.database_url)
            .unwrap()
            .begin()
            .await
            .unwrap();

        let direction_parts = DirectionPart::find_by_direction_ids(direction_ids)
            .fetch_all(&mut txn)
            .await
            .unwrap();

        assert_eq!(direction_parts.len(), 2);
    }
}
