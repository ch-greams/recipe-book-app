use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgArguments, query::QueryAs, Postgres};

#[derive(sqlx::Type, Serialize, Deserialize, Clone)]
#[sqlx(type_name = "direction_part_type", rename_all = "snake_case")]
#[serde(rename_all = "snake_case")]
pub enum DirectionPartType {
    Ingredient,
    Note,
    Warning,
    Tip,
}

#[derive(sqlx::FromRow, Serialize, Deserialize, Clone)]
pub struct DirectionPart {
    pub direction_id: i64,
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
        DirectionPartDetails {
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
