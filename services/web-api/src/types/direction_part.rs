use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgArguments, query::QueryAs, Postgres};

#[derive(sqlx::Type, Serialize, Deserialize, Clone)]
#[sqlx(type_name = "direction_part_type", rename_all = "snake_case")]
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
    pub label: String,
    pub product_id: Option<i64>,
    pub product_amount: Option<f64>,
    #[sqlx(rename = "type")]
    pub direction_part_type: DirectionPartType,
}

impl DirectionPart {
    pub fn find_by_direction_ids(
        direction_ids: Vec<i64>,
    ) -> QueryAs<'static, Postgres, Self, PgArguments> {
        sqlx::query_as(
            r#"
            SELECT direction_id, step_number, label, product_id, product_amount, type
            FROM private.direction_part
            WHERE direction_id = ANY($1)
        "#,
        )
        .bind(direction_ids)
    }
}

#[derive(Serialize, Deserialize, Clone)]
pub struct DirectionPartDetails {
    #[serde(rename = "stepNumber")]
    pub step_number: i16,
    pub label: String,
    #[serde(rename = "id")]
    pub product_id: Option<i64>,
    #[serde(rename = "amount")]
    pub product_amount: Option<f64>,
    #[serde(rename = "type")]
    pub direction_part_type: DirectionPartType,
}

impl DirectionPartDetails {
    pub fn new(direction_part: &DirectionPart) -> Self {
        DirectionPartDetails {
            step_number: direction_part.step_number,
            label: direction_part.label.to_owned(),
            product_id: direction_part.product_id,
            product_amount: direction_part.product_amount,
            direction_part_type: direction_part.direction_part_type.to_owned(),
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
