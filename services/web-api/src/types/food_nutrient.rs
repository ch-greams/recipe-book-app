use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgArguments, query::QueryAs, Executor, Postgres, QueryBuilder, Transaction};

use crate::utils::BIND_LIMIT;

use super::{error::Error, meta::Nutrient};

#[derive(sqlx::FromRow, Serialize, Deserialize, Debug, Clone)]
pub struct FoodNutrient {
    pub food_id: i64,
    pub name: String,
    pub amount: f32,
}

impl FoodNutrient {
    pub fn find_by_food_id(food_id: i64) -> QueryAs<'static, Postgres, Self, PgArguments> {
        sqlx::query_as(
            r#"
            SELECT fn.food_id, n.name, fn.amount
            FROM recipe.food_nutrient fn 
            LEFT JOIN meta.nutrient n ON n.id = fn.nutrient_id 
            WHERE fn.food_id = $1
        "#,
        )
        .bind(food_id)
    }

    pub fn find_by_food_ids(food_ids: Vec<i64>) -> QueryAs<'static, Postgres, Self, PgArguments> {
        sqlx::query_as(
            r#"
            SELECT fn.food_id, n.name, fn.amount
            FROM recipe.food_nutrient fn 
            LEFT JOIN meta.nutrient n ON n.id = fn.nutrient_id 
            WHERE fn.food_id = ANY($1)
        "#,
        )
        .bind(food_ids)
    }

    pub async fn insert_multiple(
        food_nutrients: &HashMap<String, f32>,
        nutrients: &[Nutrient],
        food_id: i64,
        txn: impl Executor<'_, Database = Postgres>,
    ) -> Result<(), Error> {
        let nutrient_mapping = nutrients
            .iter()
            .map(|nutrient| (nutrient.name.clone(), nutrient.id))
            .collect::<HashMap<String, i16>>();

        let mut insert_query_builder: QueryBuilder<Postgres> =
            QueryBuilder::new("INSERT INTO recipe.food_nutrient (food_id, nutrient_id, amount) ");

        insert_query_builder
            .push_values(
                food_nutrients.iter().take(BIND_LIMIT / 3),
                |mut builder, (name, amount)| {
                    builder
                        .push_bind(food_id)
                        .push_bind(nutrient_mapping.get(name))
                        .push_bind(amount);
                },
            )
            .build()
            .execute(txn)
            .await?;

        Ok(())
    }

    pub async fn replace_multiple(
        food_nutrients: &HashMap<String, f32>,
        nutrients: &[Nutrient],
        food_id: i64,
        txn: &mut Transaction<'_, Postgres>,
    ) -> Result<(), Error> {
        // delete

        let delete_query =
            sqlx::query("DELETE FROM recipe.food_nutrient WHERE food_id = $1").bind(food_id);

        delete_query.fetch_all(&mut *txn).await?;

        // insert

        let nutrient_mapping = nutrients
            .iter()
            .map(|nutrient| (nutrient.name.clone(), nutrient.id))
            .collect::<HashMap<String, i16>>();

        let mut insert_query_builder: QueryBuilder<Postgres> =
            QueryBuilder::new("INSERT INTO recipe.food_nutrient (food_id, nutrient_id, amount) ");

        insert_query_builder
            .push_values(
                food_nutrients.iter().take(BIND_LIMIT / 3),
                |mut builder, (name, amount)| {
                    builder
                        .push_bind(food_id)
                        .push_bind(nutrient_mapping.get(name))
                        .push_bind(amount);
                },
            )
            .build()
            .execute(txn)
            .await?;

        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use std::collections::HashMap;

    use crate::{
        types::{
            food::Food,
            food_nutrient::FoodNutrient,
            meta::Nutrient,
            recipe::{CreateRecipePayload, UpdateRecipePayload},
        },
        utils,
    };

    #[tokio::test]
    async fn find_by_food_id() {
        let food_id = 1;

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let nutrients = FoodNutrient::find_by_food_id(food_id)
            .fetch_all(&mut txn)
            .await
            .unwrap();

        assert_eq!(nutrients.len(), 5);
    }

    #[tokio::test]
    async fn insert_multiple() {
        let create_food_payload: CreateRecipePayload =
            utils::read_json("examples/create_food_payload.json").unwrap();

        let create_food_payload_nutrients: HashMap<String, f32> = create_food_payload
            .nutrients
            .clone()
            .into_iter()
            .filter_map(|(nutrient_name, opt_value)| opt_value.map(|value| (nutrient_name, value)))
            .collect();

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let create_food_result = Food::insert(&create_food_payload, 1, &mut txn)
            .await
            .unwrap();

        assert_ne!(
            0, create_food_result.id,
            "create_food_result should not have a placeholder value for id"
        );

        let nutrients = Nutrient::get_nutrients().fetch_all(&mut txn).await.unwrap();

        FoodNutrient::insert_multiple(
            &create_food_payload_nutrients,
            &nutrients,
            create_food_result.id,
            &mut txn,
        )
        .await
        .unwrap();

        txn.rollback().await.unwrap();
    }

    #[tokio::test]
    async fn replace_multiple() {
        let create_food_payload: CreateRecipePayload =
            utils::read_json("examples/create_food_payload.json").unwrap();

        let create_food_payload_nutrients: HashMap<String, f32> = create_food_payload
            .nutrients
            .clone()
            .into_iter()
            .filter_map(|(nutrient_name, opt_value)| opt_value.map(|value| (nutrient_name, value)))
            .collect();

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let create_food_result = Food::insert(&create_food_payload, 1, &mut txn)
            .await
            .unwrap();

        assert_ne!(
            0, create_food_result.id,
            "create_food_result should not have a placeholder value for id"
        );

        let nutrients = Nutrient::get_nutrients().fetch_all(&mut txn).await.unwrap();

        FoodNutrient::insert_multiple(
            &create_food_payload_nutrients,
            &nutrients,
            create_food_result.id,
            &mut txn,
        )
        .await
        .unwrap();

        let update_food_payload: UpdateRecipePayload =
            utils::read_json("examples/update_food_payload.json").unwrap();

        let update_food_payload_nutrients: HashMap<String, f32> = update_food_payload
            .nutrients
            .clone()
            .into_iter()
            .filter_map(|(nutrient_name, opt_value)| opt_value.map(|value| (nutrient_name, value)))
            .collect();

        FoodNutrient::replace_multiple(
            &update_food_payload_nutrients,
            &nutrients,
            create_food_result.id,
            &mut txn,
        )
        .await
        .unwrap();

        txn.rollback().await.unwrap();
    }
}
