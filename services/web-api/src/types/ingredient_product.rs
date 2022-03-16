use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgArguments, query::QueryAs, Postgres};

use super::{nutrition_facts::NutritionFacts, product::ProductType};

#[derive(sqlx::FromRow, Serialize, Deserialize, Clone)]
pub struct IngredientProductDetails {
    pub ingredient_id: i64,
    #[serde(rename = "id")]
    #[sqlx(rename = "id")]
    pub product_id: i64,
    pub amount: f64,
    pub unit: String,

    #[serde(rename = "type")]
    #[sqlx(rename = "type")]
    pub product_type: ProductType,
    pub name: String,

    #[serde(rename = "nutritionFacts")]
    pub nutrition_facts: NutritionFacts,
}

impl IngredientProductDetails {
    pub fn find_by_ingredient_ids(
        ingredient_ids: Vec<i64>,
    ) -> QueryAs<'static, Postgres, Self, PgArguments> {
        sqlx::query_as(
            r#"
            SELECT ingredient_id, id, amount, unit, type, name, nutrition_facts
            FROM private.ingredient_product_details
            WHERE ingredient_id = ANY($1)
        "#,
        )
        .bind(ingredient_ids)
    }
}
