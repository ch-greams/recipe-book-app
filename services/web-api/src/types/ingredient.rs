use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgArguments, query::QueryAs, Postgres};

use super::ingredient_product::IngredientProductDetails;

#[derive(sqlx::FromRow, Serialize, Deserialize, Clone)]
pub struct Ingredient {
    pub id: i64,
    pub recipe_id: i64,
    pub product_id: i64,
}

impl Ingredient {
    pub fn find_by_recipe_id(recipe_id: i64) -> QueryAs<'static, Postgres, Self, PgArguments> {
        sqlx::query_as(
            "SELECT id, recipe_id, product_id FROM private.ingredient WHERE recipe_id = $1",
        )
        .bind(recipe_id)
    }
}

#[derive(Serialize, Deserialize)]
pub struct IngredientDetails {
    pub id: i64,
    pub product_id: i64,

    pub products: HashMap<i64, IngredientProductDetails>,
}

impl IngredientDetails {
    pub fn new(ingredient: &Ingredient, ingredient_products: &[IngredientProductDetails]) -> Self {
        let products = ingredient_products
            .iter()
            .filter(|ip| ip.ingredient_id == ingredient.id)
            .map(|ip| (ip.product_id, ip.to_owned()))
            .collect::<HashMap<i64, IngredientProductDetails>>();

        Self {
            id: ingredient.id.to_owned(),
            product_id: ingredient.product_id.to_owned(),
            products,
        }
    }
}

#[cfg(test)]
mod tests {
    use crate::{config::Config, types::ingredient::Ingredient};
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

        let ingredients = Ingredient::find_by_recipe_id(recipe_id)
            .fetch_all(&mut txn)
            .await
            .unwrap();

        assert_eq!(ingredients.len(), 2);
    }
}
