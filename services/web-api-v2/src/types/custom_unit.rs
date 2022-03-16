use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgArguments, query::QueryAs, Postgres};

#[derive(sqlx::FromRow, Deserialize, Serialize, Clone)]
pub struct CustomUnit {
    pub name: String,
    pub amount: f64,
    pub unit: String, // WeightUnit,
    pub product_id: i64,
}

impl CustomUnit {
    pub fn find_by_product_id(product_id: i64) -> QueryAs<'static, Postgres, Self, PgArguments> {
        sqlx::query_as(
            r#"
            SELECT name, amount, unit, product_id
            FROM private.custom_unit
            WHERE product_id = $1
        "#,
        )
        .bind(product_id)
    }

    pub fn find_by_product_ids(
        product_ids: Vec<i64>,
    ) -> QueryAs<'static, Postgres, Self, PgArguments> {
        sqlx::query_as(
            r#"
            SELECT name, amount, unit, product_id
            FROM private.custom_unit
            WHERE product_id = ANY($1)
        "#,
        )
        .bind(product_ids)
    }
}
