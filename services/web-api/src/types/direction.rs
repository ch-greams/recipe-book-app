use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgArguments, query::QueryAs, Executor, Postgres};

use super::{
    direction_part::{CreateDirectionPartPayload, DirectionPart, DirectionPartDetails},
    error::Error,
};

#[derive(sqlx::FromRow, Serialize, Deserialize, Clone)]
pub struct Direction {
    pub id: i64,
    pub recipe_id: i64,
    pub step_number: i16,
    pub name: String,
    pub temperature_value: Option<i16>,
    pub temperature_unit: String,
    pub duration_value: Option<i32>,
    pub duration_unit: String,
}

#[derive(Deserialize, Serialize, Clone, Debug)]
pub struct CreateDirectionPayload {
    pub step_number: i16,
    pub name: String,
    pub temperature_value: Option<i16>,
    pub temperature_unit: String,
    pub duration_value: Option<i32>,
    pub duration_unit: String,
    pub steps: Vec<CreateDirectionPartPayload>,
}

impl Direction {
    pub fn find_by_recipe_id(recipe_id: i64) -> QueryAs<'static, Postgres, Self, PgArguments> {
        sqlx::query_as(
            r#"
            SELECT id, recipe_id, step_number, name, temperature_value, temperature_unit, duration_value, duration_unit
            FROM private.direction
            WHERE recipe_id = $1
        "#,
        )
        .bind(recipe_id)
    }

    pub async fn insert_mutliple(
        create_direction_payloads: &[CreateDirectionPayload],
        recipe_id: i64,
        txn: impl Executor<'_, Database = Postgres>,
    ) -> Result<Vec<Self>, Error> {
        let mut recipe_ids: Vec<i64> = Vec::new();
        let mut step_numbers: Vec<i16> = Vec::new();
        let mut names: Vec<String> = Vec::new();
        let mut temperature_values: Vec<Option<i16>> = Vec::new();
        let mut temperature_units: Vec<String> = Vec::new();
        let mut duration_values: Vec<Option<i32>> = Vec::new();
        let mut duration_units: Vec<String> = Vec::new();

        create_direction_payloads
            .iter()
            .for_each(|direction_payload| {
                recipe_ids.push(recipe_id);
                step_numbers.push(direction_payload.step_number);
                names.push(direction_payload.name.to_owned());
                temperature_values.push(direction_payload.temperature_value);
                temperature_units.push(direction_payload.temperature_unit.to_owned());
                duration_values.push(direction_payload.duration_value);
                duration_units.push(direction_payload.duration_unit.to_owned());
            });

        let insert_query = sqlx::query_as(
            r#"
            INSERT INTO private.direction (
                recipe_id,
                step_number,
                name,
                temperature_value,
                temperature_unit,
                duration_value,
                duration_unit
            )
            SELECT * FROM UNNEST($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, recipe_id, step_number, name, temperature_value, temperature_unit, duration_value, duration_unit;
        "#,
        )
        .bind(recipe_ids)
        .bind(step_numbers)
        .bind(names)
        .bind(temperature_values)
        .bind(temperature_units)
        .bind(duration_values)
        .bind(duration_units);

        let result = insert_query.fetch_all(txn).await?;

        Ok(result)
    }
}

#[derive(Serialize, Deserialize)]
pub struct DirectionDetails {
    pub id: i64,
    pub step_number: i16,
    pub name: String,
    pub temperature_value: Option<i16>,
    pub temperature_unit: String,
    pub duration_value: Option<i32>,
    pub duration_unit: String,
    pub steps: Vec<DirectionPartDetails>,
}

impl DirectionDetails {
    pub fn new(direction: &Direction, direction_parts: &[DirectionPart]) -> Self {
        let steps: Vec<DirectionPartDetails> = direction_parts
            .iter()
            .filter(|dp| dp.direction_id == direction.id)
            .map(DirectionPartDetails::new)
            .collect();

        Self {
            id: direction.id,
            step_number: direction.step_number,
            name: direction.name.to_owned(),
            temperature_value: direction.temperature_value,
            temperature_unit: direction.temperature_unit.to_owned(),
            duration_value: direction.duration_value,
            duration_unit: direction.duration_unit.to_owned(),
            steps,
        }
    }
}

#[cfg(test)]
mod tests {
    use crate::{config::Config, types::direction::Direction};
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

        let directions = Direction::find_by_recipe_id(recipe_id)
            .fetch_all(&mut txn)
            .await
            .unwrap();

        assert_eq!(directions.len(), 2);
    }
}
