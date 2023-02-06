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
    pub ingredient_number: Option<i16>,
    pub ingredient_amount: Option<f64>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct DirectionPartPayload {
    pub step_number: i16,
    pub direction_part_type: DirectionPartType,
    pub comment_text: Option<String>,
    pub ingredient_number: Option<i16>,
    pub ingredient_amount: Option<f64>,
}

impl DirectionPart {
    pub fn find_by_direction_ids(
        direction_ids: Vec<i64>,
    ) -> QueryAs<'static, Postgres, Self, PgArguments> {
        sqlx::query_as(
            r#"
            SELECT direction_id, step_number, direction_part_type, comment_text, ingredient_number, ingredient_amount
            FROM product.direction_part
            WHERE direction_id = ANY($1)
        "#,
        )
        .bind(direction_ids)
    }

    pub async fn insert_multiple(
        direction_part_payloads: &[DirectionPartPayload],
        direction_id: i64,
        txn: impl Executor<'_, Database = Postgres>,
    ) -> Result<Vec<Self>, Error> {
        let mut direction_ids: Vec<i64> = Vec::new();
        let mut step_numbers: Vec<i16> = Vec::new();
        let mut direction_part_types: Vec<DirectionPartType> = Vec::new();
        let mut comment_texts: Vec<Option<String>> = Vec::new();
        let mut ingredient_numbers: Vec<Option<i16>> = Vec::new();
        let mut ingredient_amounts: Vec<Option<f64>> = Vec::new();

        direction_part_payloads
            .iter()
            .for_each(|direction_part_payload| {
                direction_ids.push(direction_id);
                step_numbers.push(direction_part_payload.step_number);
                direction_part_types.push(direction_part_payload.direction_part_type.to_owned());
                comment_texts.push(direction_part_payload.comment_text.to_owned());
                ingredient_numbers.push(direction_part_payload.ingredient_number);
                ingredient_amounts.push(direction_part_payload.ingredient_amount);
            });

        let insert_query = sqlx::query_as(
            r#"
            INSERT INTO product.direction_part (
                direction_id,
                step_number,
                direction_part_type,
                comment_text,
                ingredient_number,
                ingredient_amount
            )
            SELECT * FROM UNNEST($1, $2, $3, $4, $5, $6)
            RETURNING direction_id, step_number, direction_part_type, comment_text, ingredient_number, ingredient_amount;
        "#,
        )
        .bind(direction_ids)
        .bind(step_numbers)
        .bind(DirectionPartTypeArray(direction_part_types))
        .bind(comment_texts)
        .bind(ingredient_numbers)
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
    pub ingredient_number: Option<i16>,
    pub ingredient_amount: Option<f64>,
}

impl DirectionPartDetails {
    pub fn new(direction_part: &DirectionPart) -> Self {
        Self {
            step_number: direction_part.step_number,
            direction_part_type: direction_part.direction_part_type.to_owned(),
            comment_text: direction_part.comment_text.to_owned(),
            ingredient_number: direction_part.ingredient_number,
            ingredient_amount: direction_part.ingredient_amount,
        }
    }
}

#[cfg(test)]
mod tests {

    use crate::{
        config::Config,
        types::{
            direction::Direction, direction_part::DirectionPart,
            product::Product, recipe::CreateRecipePayload, ingredient::Ingredient,
        },
        utils,
    };
    use sqlx::PgPool;

    #[tokio::test]
    async fn find_by_product_ids() {
        let direction_ids = vec![3, 4, 5];

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

        assert_eq!(direction_parts.len(), 10);
    }

    #[tokio::test]
    async fn insert_multiple() {
        let create_product_payload: CreateRecipePayload =
            utils::read_json("examples/create_recipe_payload.json").unwrap();

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

        assert_eq!(create_ingredients_result.len(), 3);

        let create_directions_result = Direction::insert_multiple(
            &create_product_payload.directions,
            create_product_result.id,
            &mut txn,
        )
        .await
        .unwrap();

        assert_eq!(create_directions_result.len(), 2);

        let mut direction_parts: Vec<DirectionPart> = Vec::new();

        for (index, direction_payload) in create_product_payload.directions.iter().enumerate() {
            let direction = create_directions_result.get(index).unwrap();

            let mut _direction_parts = DirectionPart::insert_multiple(
                &direction_payload.steps,
                direction.id,
                &mut txn,
            )
            .await
            .unwrap();

            direction_parts.append(&mut _direction_parts);
        }

        assert_eq!(direction_parts.len(), 3);

        txn.rollback().await.unwrap();
    }
}
