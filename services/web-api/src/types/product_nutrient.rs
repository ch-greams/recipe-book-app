use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgArguments, query::QueryAs, Executor, Postgres, QueryBuilder, Transaction};

use crate::utils::BIND_LIMIT;

use super::{error::Error, meta::Nutrient};

#[derive(sqlx::FromRow, Serialize, Deserialize, Debug, Clone)]
pub struct ProductNutrient {
    pub product_id: i64,
    pub name: String,
    pub amount: f32,
}

impl ProductNutrient {
    pub fn find_by_product_id(product_id: i64) -> QueryAs<'static, Postgres, Self, PgArguments> {
        sqlx::query_as(
            r#"
            SELECT pn.product_id, n.name, pn.amount
            FROM private.product_nutrient pn 
            LEFT JOIN meta.nutrient n ON n.id = pn.nutrient_id 
            WHERE pn.product_id = $1
        "#,
        )
        .bind(product_id)
    }

    pub fn find_by_product_ids(
        product_ids: Vec<i64>,
    ) -> QueryAs<'static, Postgres, Self, PgArguments> {
        sqlx::query_as(
            r#"
            SELECT pn.product_id, n.name, pn.amount
            FROM private.product_nutrient pn 
            LEFT JOIN meta.nutrient n ON n.id = pn.nutrient_id 
            WHERE pn.product_id = ANY($1)
        "#,
        )
        .bind(product_ids)
    }

    pub async fn insert_multiple(
        product_nutrients: &HashMap<String, f32>,
        nutrients: &[Nutrient],
        product_id: i64,
        txn: impl Executor<'_, Database = Postgres>,
    ) -> Result<(), Error> {
        let nutrient_mapping = nutrients
            .iter()
            .map(|nutrient| (nutrient.name.clone(), nutrient.id))
            .collect::<HashMap<String, i16>>();

        let mut insert_query_builder: QueryBuilder<Postgres> = QueryBuilder::new(
            "INSERT INTO private.product_nutrient (product_id, nutrient_id, amount) ",
        );

        insert_query_builder
            .push_values(
                product_nutrients.iter().take(BIND_LIMIT / 3),
                |mut builder, (name, amount)| {
                    builder
                        .push_bind(product_id)
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
        product_nutrients: &HashMap<String, f32>,
        nutrients: &[Nutrient],
        product_id: i64,
        txn: &mut Transaction<'_, Postgres>,
    ) -> Result<(), Error> {
        // delete

        let delete_query =
            sqlx::query("DELETE FROM private.product_nutrient WHERE product_id = $1")
                .bind(product_id);

        delete_query.fetch_all(&mut *txn).await?;

        // insert

        let nutrient_mapping = nutrients
            .iter()
            .map(|nutrient| (nutrient.name.clone(), nutrient.id))
            .collect::<HashMap<String, i16>>();

        let mut insert_query_builder: QueryBuilder<Postgres> = QueryBuilder::new(
            "INSERT INTO private.product_nutrient (product_id, nutrient_id, amount) ",
        );

        insert_query_builder
            .push_values(
                product_nutrients.iter().take(BIND_LIMIT / 3),
                |mut builder, (name, amount)| {
                    builder
                        .push_bind(product_id)
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
    use crate::{
        types::{
            food::{CreateFoodPayload, UpdateFoodPayload},
            meta::Nutrient,
            product::Product,
            product_nutrient::ProductNutrient,
        },
        utils,
    };

    #[tokio::test]
    async fn find_by_product_id() {
        let food_id = 1;

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let nutrients = ProductNutrient::find_by_product_id(food_id)
            .fetch_all(&mut txn)
            .await
            .unwrap();

        assert_eq!(nutrients.len(), 5);
    }

    #[tokio::test]
    async fn insert_multiple() {
        let create_product_payload: CreateFoodPayload =
            utils::read_type_from_file("examples/create_food_payload.json").unwrap();

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let create_product_result = Product::insert_food(&create_product_payload, 1, &mut txn)
            .await
            .unwrap();

        assert_ne!(
            0, create_product_result.id,
            "create_product_result should not have a placeholder value for id"
        );

        let nutrients = Nutrient::get_nutrients().fetch_all(&mut txn).await.unwrap();

        ProductNutrient::insert_multiple(
            &create_product_payload.nutrients,
            &nutrients,
            create_product_result.id,
            &mut txn,
        )
        .await
        .unwrap();

        txn.rollback().await.unwrap();
    }

    #[tokio::test]
    async fn replace_multiple() {
        let create_product_payload: CreateFoodPayload =
            utils::read_type_from_file("examples/create_food_payload.json").unwrap();

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let create_product_result = Product::insert_food(&create_product_payload, 1, &mut txn)
            .await
            .unwrap();

        assert_ne!(
            0, create_product_result.id,
            "create_product_result should not have a placeholder value for id"
        );

        let nutrients = Nutrient::get_nutrients().fetch_all(&mut txn).await.unwrap();

        ProductNutrient::insert_multiple(
            &create_product_payload.nutrients,
            &nutrients,
            create_product_result.id,
            &mut txn,
        )
        .await
        .unwrap();

        let update_product_payload: UpdateFoodPayload =
            utils::read_type_from_file("examples/update_food_payload.json").unwrap();

        ProductNutrient::replace_multiple(
            &update_product_payload.nutrients,
            &nutrients,
            create_product_result.id,
            &mut txn,
        )
        .await
        .unwrap();

        txn.rollback().await.unwrap();
    }
}
