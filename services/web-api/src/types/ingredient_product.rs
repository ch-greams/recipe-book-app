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

#[cfg(test)]
mod tests {
    use crate::{config::Config, types::ingredient_product::IngredientProductDetails};
    use sqlx::PgPool;

    #[tokio::test]
    #[ignore]
    async fn find_by_product_ids() {
        let ingredient_ids = vec![10, 11];

        let config = Config::new().unwrap();
        let mut txn = PgPool::connect_lazy(&config.database_url)
            .unwrap()
            .begin()
            .await
            .unwrap();

        let ingredient_products = IngredientProductDetails::find_by_ingredient_ids(ingredient_ids)
            .fetch_all(&mut txn)
            .await
            .unwrap();

        assert_eq!(ingredient_products.len(), 4);
    }
}
