use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgArguments, query::QueryAs, Postgres};

use super::direction_part::{DirectionPart, DirectionPartDetails};

#[derive(sqlx::Type, Serialize, Deserialize, Clone)]
pub struct Temperature {
    pub value: f64,
    pub unit: String,
}

#[derive(sqlx::Type, Serialize, Deserialize, Clone)]
pub struct Duration {
    pub value: f64,
    pub unit: String,
}

#[derive(sqlx::FromRow, Serialize, Deserialize, Clone)]
pub struct Direction {
    pub id: i64,
    pub recipe_id: i64,
    pub step_number: i16,
    pub name: String,
    pub temperature: Option<Temperature>,
    pub duration: Option<Duration>,
}

impl Direction {
    pub fn find_by_recipe_id(recipe_id: i64) -> QueryAs<'static, Postgres, Self, PgArguments> {
        sqlx::query_as(
            r#"
            SELECT id, recipe_id, step_number, name, temperature, duration
            FROM private.direction
            WHERE recipe_id = $1
        "#,
        )
        .bind(recipe_id)
    }
}

#[derive(Serialize, Deserialize)]
pub struct DirectionDetails {
    pub id: i64,
    pub step_number: i16,
    pub name: String,
    pub temperature: Option<Temperature>,
    pub duration: Option<Duration>,
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
            temperature: direction.temperature.to_owned(),
            duration: direction.duration.to_owned(),
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
