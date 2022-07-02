use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgArguments, query::QueryAs, Executor, Postgres, Transaction};

use super::{
    direction_part::{DirectionPart, DirectionPartDetails, DirectionPartPayload},
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
    pub steps: Vec<DirectionPartPayload>,
}

#[derive(Deserialize, Serialize, Clone, Debug)]
pub struct UpdateDirectionPayload {
    pub id: i64,
    pub step_number: i16,
    pub name: String,
    pub temperature_value: Option<i16>,
    pub temperature_unit: String,
    pub duration_value: Option<i32>,
    pub duration_unit: String,
    pub steps: Vec<DirectionPartPayload>,
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

    pub async fn insert_multiple(
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

    pub async fn replace_multiple(
        update_direction_payloads: &[UpdateDirectionPayload],
        recipe_id: i64,
        txn: &mut Transaction<'_, Postgres>,
    ) -> Result<Vec<Self>, Error> {
        let mut recipe_ids: Vec<i64> = Vec::new();
        let mut step_numbers: Vec<i16> = Vec::new();
        let mut names: Vec<String> = Vec::new();
        let mut temperature_values: Vec<Option<i16>> = Vec::new();
        let mut temperature_units: Vec<String> = Vec::new();
        let mut duration_values: Vec<Option<i32>> = Vec::new();
        let mut duration_units: Vec<String> = Vec::new();

        update_direction_payloads
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

        let delete_query = sqlx::query_as(
            r#"
            DELETE FROM private.direction
            WHERE recipe_id = $1
            RETURNING id, recipe_id, step_number, name, temperature_value, temperature_unit, duration_value, duration_unit;
            "#,
        )
        .bind(recipe_id);

        let _delete_query_result: Vec<Self> = delete_query.fetch_all(&mut *txn).await?;

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
    use crate::{
        config::Config,
        types::{
            direction::Direction,
            ingredient::Ingredient,
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

        let directions = Direction::find_by_recipe_id(recipe_id)
            .fetch_all(&mut txn)
            .await
            .unwrap();

        assert_eq!(directions.len(), 3);
    }

    #[tokio::test]
    async fn insert_multiple() {
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

        let create_ingredients_result = Ingredient::insert_multiple(
            &create_product_payload.ingredients,
            create_product_result.id,
            &mut txn,
        )
        .await
        .unwrap();

        assert_eq!(create_ingredients_result.len(), 2);

        let create_directions_result = Direction::insert_multiple(
            &create_product_payload.directions,
            create_product_result.id,
            &mut txn,
        )
        .await
        .unwrap();

        assert_eq!(create_directions_result.len(), 2);

        txn.rollback().await.unwrap();
    }

    #[tokio::test]
    async fn replace_multiple() {
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

        let create_ingredients_result = Ingredient::insert_multiple(
            &create_product_payload.ingredients,
            create_product_result.id,
            &mut txn,
        )
        .await
        .unwrap();

        assert_eq!(create_ingredients_result.len(), 2);

        let create_directions_result = Direction::insert_multiple(
            &create_product_payload.directions,
            create_product_result.id,
            &mut txn,
        )
        .await
        .unwrap();

        assert_eq!(create_directions_result.len(), 2);

        let update_product_payload: UpdateRecipePayload =
            utils::read_type_from_file("examples/update_recipe_payload.json").unwrap();

        let update_directions_result = Direction::replace_multiple(
            &update_product_payload.directions,
            create_product_result.id,
            &mut txn,
        )
        .await
        .unwrap();

        assert_eq!(update_directions_result.len(), 3);

        txn.rollback().await.unwrap();
    }
}
