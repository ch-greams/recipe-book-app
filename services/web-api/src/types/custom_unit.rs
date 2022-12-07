use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgArguments, query::QueryAs, Executor, Postgres, Transaction};

use super::error::Error;

#[derive(sqlx::FromRow, Deserialize, Serialize, Debug, Clone)]
pub struct CustomUnit {
    pub name: String,
    pub amount: f64,
    pub unit: String, // WeightUnit,
    pub product_id: i64,
}

#[derive(Deserialize, Serialize, Clone, Debug)]
pub struct CreateCustomUnitPayload {
    pub name: String,
    pub amount: f64,
    pub unit: String,
}

pub type UpdateCustomUnitPayload = CustomUnit;

impl CustomUnit {
    pub fn find_by_product_id(product_id: i64) -> QueryAs<'static, Postgres, Self, PgArguments> {
        sqlx::query_as(
            r#"
            SELECT name, amount, unit, product_id
            FROM product.custom_unit
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
            FROM product.custom_unit
            WHERE product_id = ANY($1)
        "#,
        )
        .bind(product_ids)
    }

    pub async fn insert_multiple(
        custom_unit_payloads: &[CreateCustomUnitPayload],
        product_id: i64,
        txn: impl Executor<'_, Database = Postgres>,
    ) -> Result<Vec<Self>, Error> {
        let mut names: Vec<String> = Vec::new();
        let mut amounts: Vec<f64> = Vec::new();
        let mut units: Vec<String> = Vec::new();
        let mut product_ids: Vec<i64> = Vec::new();
        custom_unit_payloads.iter().for_each(|cu_payload| {
            names.push(cu_payload.name.to_owned());
            amounts.push(cu_payload.amount);
            units.push(cu_payload.unit.to_owned());
            product_ids.push(product_id);
        });

        let insert_query = sqlx::query_as(
            r#"
            INSERT INTO product.custom_unit (name, amount, unit, product_id)
            SELECT * FROM UNNEST($1, $2, $3, $4)
            RETURNING name, amount, unit, product_id;
        "#,
        )
        .bind(names)
        .bind(amounts)
        .bind(units)
        .bind(product_ids);

        let result = insert_query.fetch_all(txn).await?;

        Ok(result)
    }

    pub async fn replace_multiple(
        custom_unit_payloads: &[UpdateCustomUnitPayload],
        product_id: i64,
        txn: &mut Transaction<'_, Postgres>,
    ) -> Result<Vec<Self>, Error> {
        let mut names: Vec<String> = Vec::new();
        let mut amounts: Vec<f64> = Vec::new();
        let mut units: Vec<String> = Vec::new();
        let mut product_ids: Vec<i64> = Vec::new();
        custom_unit_payloads.iter().for_each(|cu_payload| {
            names.push(cu_payload.name.to_owned());
            amounts.push(cu_payload.amount);
            units.push(cu_payload.unit.to_owned());
            product_ids.push(cu_payload.product_id);
        });

        let delete_query = sqlx::query_as(
            r#"
            DELETE FROM product.custom_unit
            WHERE product_id = $1
            RETURNING name, amount, unit, product_id;
            "#,
        )
        .bind(product_id);

        let _delete_query_result: Vec<Self> = delete_query.fetch_all(&mut *txn).await?;

        let insert_query = sqlx::query_as(
            r#"
            INSERT INTO product.custom_unit (name, amount, unit, product_id)
            SELECT * FROM UNNEST($1, $2, $3, $4)
            RETURNING name, amount, unit, product_id;
        "#,
        )
        .bind(names)
        .bind(amounts)
        .bind(units)
        .bind(product_ids);

        let result = insert_query.fetch_all(&mut *txn).await?;

        Ok(result)
    }
}

#[cfg(test)]
mod tests {
    use crate::{
        types::{
            custom_unit::CustomUnit,
            food::{CreateFoodPayload, UpdateFoodPayload},
            product::Product,
        },
        utils,
    };

    #[tokio::test]
    async fn find_by_product_id() {
        let food_id = 1;

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let custom_units = CustomUnit::find_by_product_id(food_id)
            .fetch_all(&mut txn)
            .await
            .unwrap();

        assert_eq!(custom_units.len(), 2);
    }

    #[tokio::test]
    async fn find_by_product_ids() {
        let food_id = vec![1, 3];

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let custom_units = CustomUnit::find_by_product_ids(food_id)
            .fetch_all(&mut txn)
            .await
            .unwrap();

        assert_eq!(custom_units.len(), 3);
    }

    #[tokio::test]
    async fn insert_multiple() {
        let create_product_payload: CreateFoodPayload =
            utils::read_json("examples/create_food_payload.json").unwrap();

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let create_product_result = Product::insert_food(&create_product_payload, 1, &mut txn)
            .await
            .unwrap();

        assert_ne!(
            0, create_product_result.id,
            "create_product_result should not have a placeholder value for id"
        );

        let custom_units_result = CustomUnit::insert_multiple(
            &create_product_payload.custom_units,
            create_product_result.id,
            &mut txn,
        )
        .await
        .unwrap();

        assert_eq!(custom_units_result.len(), 2);

        txn.rollback().await.unwrap();
    }

    #[tokio::test]
    async fn replace_multiple() {
        let create_product_payload: CreateFoodPayload =
            utils::read_json("examples/create_food_payload.json").unwrap();

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let create_product_result = Product::insert_food(&create_product_payload, 1, &mut txn)
            .await
            .unwrap();

        assert_ne!(
            0, create_product_result.id,
            "create_product_result should not have a placeholder value for id"
        );

        let create_custom_units_result = CustomUnit::insert_multiple(
            &create_product_payload.custom_units,
            create_product_result.id,
            &mut txn,
        )
        .await
        .unwrap();

        assert_eq!(create_custom_units_result.len(), 2);

        let mut update_product_payload: UpdateFoodPayload =
            utils::read_json("examples/update_food_payload.json").unwrap();

        for custom_unit in &mut update_product_payload.custom_units {
            custom_unit.product_id = create_product_result.id;
        }

        let update_custom_units_result = CustomUnit::replace_multiple(
            &update_product_payload.custom_units,
            create_product_result.id,
            &mut txn,
        )
        .await
        .unwrap();

        assert_eq!(update_custom_units_result.len(), 1);

        txn.rollback().await.unwrap();
    }
}
