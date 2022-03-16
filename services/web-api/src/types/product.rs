use serde::{Deserialize, Serialize};
use sqlx::postgres::PgArguments;
use sqlx::query::QueryAs;
use sqlx::Postgres;

#[derive(sqlx::Type, Serialize, Deserialize, Clone)]
#[sqlx(type_name = "product_type", rename_all = "snake_case")]
pub enum ProductType {
    Food,
    Recipe,
}

#[derive(sqlx::FromRow, Deserialize, Serialize, Clone)]
pub struct Product {
    pub id: i64,
    pub name: String,
    pub brand: Option<String>,
    pub subtitle: Option<String>,
    pub description: Option<String>,
    pub density: f64,
}

impl Product {
    pub fn find_food_by_id(id: i64) -> QueryAs<'static, Postgres, Self, PgArguments> {
        sqlx::query_as(
            r#"
            SELECT id, name, brand, subtitle, description, density
            FROM private.product
            WHERE type = 'food' AND id = $1
        "#,
        )
        .bind(id)
    }

    pub fn find_food_all(limit: u32) -> QueryAs<'static, Postgres, Self, PgArguments> {
        sqlx::query_as(
            r#"
            SELECT id, name, brand, subtitle, description, density
            FROM private.product
            WHERE type = 'food' LIMIT $1
        "#,
        )
        .bind(limit)
    }

    pub fn find_recipe_by_id(id: i64) -> QueryAs<'static, Postgres, Self, PgArguments> {
        sqlx::query_as(
            r#"
            SELECT id, name, brand, subtitle, description, density
            FROM private.product
            WHERE type = 'recipe' AND id = $1
        "#,
        )
        .bind(id)
    }
}
