use std::collections::HashMap;

use chrono::{NaiveDate, NaiveTime};
use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgArguments, query::QueryAs, Executor, Postgres};

use super::{custom_unit::CustomUnit, error::Error, product_nutrient::ProductNutrient};

#[derive(sqlx::FromRow, Deserialize, Serialize, Debug)]
pub struct JournalEntry {
    pub id: i64,
    pub user_id: i64,
    pub entry_date: NaiveDate,
    pub entry_time: NaiveTime,
    pub product_id: i64,
    pub amount: f32,
    pub unit: String,
    pub journal_group_ui_index: Option<i16>,
}

#[derive(sqlx::FromRow, Deserialize, Serialize, Debug)]
pub struct JournalEntryProduct {
    pub id: i64,
    pub user_id: i64,
    pub entry_date: NaiveDate,
    pub entry_time: NaiveTime,
    pub product_id: i64,
    pub product_name: String,
    pub product_density: f64,
    pub amount: f32,
    pub unit: String,
    pub journal_group_ui_index: Option<i16>,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct CreateJournalEntryPayload {
    pub user_id: i64,
    pub entry_date: NaiveDate,
    pub entry_time: NaiveTime,
    pub product_id: i64,
    pub amount: f32,
    pub unit: String,
    pub journal_group_ui_index: Option<i16>,
}

pub type UpdateJournalEntryPayload = JournalEntry;

#[derive(Deserialize, Serialize, Debug)]
pub struct DeleteJournalEntryPayload {
    pub id: i64,
}

impl JournalEntry {
    pub fn find_all_by_date(
        entry_date: NaiveDate,
        user_id: i64,
    ) -> QueryAs<'static, Postgres, JournalEntryProduct, PgArguments> {
        sqlx::query_as(
            r#"
            SELECT
                id,
                user_id,
                entry_date,
                entry_time,
                product_id,
                product_name,
                product_density,
                amount,
                unit,
                journal_group_ui_index
            FROM journal.journal_entry_product
            WHERE entry_date = $1 AND user_id = $2
        "#,
        )
        .bind(entry_date)
        .bind(user_id)
    }

    pub async fn insert_journal_entry(
        create_journal_entry_payload: &CreateJournalEntryPayload,
        txn: impl Executor<'_, Database = Postgres>,
    ) -> Result<JournalEntryProduct, Error> {
        let query = sqlx::query_as(
            r#"
            WITH journal_entry AS (
                INSERT INTO journal.journal_entry (user_id, entry_date, entry_time, product_id, amount, unit, journal_group_ui_index)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id, user_id, entry_date, entry_time, product_id, amount, unit, journal_group_ui_index
            )
            SELECT
                journal_entry.id,
                journal_entry.user_id,
                journal_entry.entry_date,
                journal_entry.entry_time,
                journal_entry.product_id,
                product.name AS product_name,
                product.density AS product_density,
                journal_entry.amount,
                journal_entry.unit,
                journal_entry.journal_group_ui_index
            FROM journal_entry
            JOIN product.product product ON product.id = journal_entry.product_id;
        "#,
        )
            .bind(create_journal_entry_payload.user_id)
            .bind(create_journal_entry_payload.entry_date)
            .bind(create_journal_entry_payload.entry_time)
            .bind(create_journal_entry_payload.product_id)
            .bind(create_journal_entry_payload.amount)
            .bind(create_journal_entry_payload.unit.to_owned())
            .bind(create_journal_entry_payload.journal_group_ui_index);

        let result = query
            .fetch_optional(txn)
            .await?
            .ok_or_else(|| Error::not_created("journal_entry"))?;

        Ok(result)
    }

    pub async fn update_journal_entry(
        update_journal_entry_payload: &UpdateJournalEntryPayload,
        txn: impl Executor<'_, Database = Postgres>,
    ) -> Result<Self, Error> {
        let query = sqlx::query_as(
            r#"
            UPDATE journal.journal_entry SET
                user_id = $1,
                entry_date = $2,
                entry_time = $3,
                product_id = $4,
                amount = $5,
                unit = $6,
                journal_group_ui_index = $7
            WHERE id = $8
            RETURNING id, user_id, entry_date, entry_time, product_id, amount, unit, journal_group_ui_index;
        "#,
        )
            .bind(update_journal_entry_payload.user_id)
            .bind(update_journal_entry_payload.entry_date)
            .bind(update_journal_entry_payload.entry_time)
            .bind(update_journal_entry_payload.product_id)
            .bind(update_journal_entry_payload.amount)
            .bind(update_journal_entry_payload.unit.to_owned())
            .bind(update_journal_entry_payload.journal_group_ui_index)
            .bind(update_journal_entry_payload.id);

        let result = query
            .fetch_optional(txn)
            .await?
            .ok_or_else(|| Error::not_updated("journal_entry", update_journal_entry_payload.id))?;

        Ok(result)
    }

    pub async fn delete_journal_entry(
        journal_entry_id: i64,
        txn: impl Executor<'_, Database = Postgres>,
    ) -> Result<Self, Error> {
        let delete_query = sqlx::query_as(
            r#"
            DELETE FROM journal.journal_entry
            WHERE id = $1
            RETURNING id, user_id, entry_date, entry_time, product_id, amount, unit, journal_group_ui_index;
            "#,
        )
            .bind(journal_entry_id);

        let result = delete_query
            .fetch_optional(txn)
            .await?
            .ok_or_else(|| Error::not_deleted("journal_entry", journal_entry_id))?;

        Ok(result)
    }
}

#[derive(Deserialize, Serialize, Debug)]
pub struct JournalEntryDetailed {
    pub id: i64,
    pub user_id: i64,
    pub entry_date: NaiveDate,
    pub entry_time: NaiveTime,
    pub product_id: i64,
    pub product_name: String,
    pub product_density: f64,
    pub nutrients: HashMap<String, f32>,
    pub custom_units: Vec<CustomUnit>,
    pub amount: f32,
    pub unit: String,
    pub journal_group_ui_index: Option<i16>,
}

impl JournalEntryDetailed {
    pub fn new(
        journal_entry: &JournalEntryProduct,
        nutrients: &[ProductNutrient],
        custom_units: &[CustomUnit],
    ) -> Self {
        let nutrients = nutrients
            .iter()
            .map(|pn| (pn.name.clone(), pn.amount))
            .collect::<HashMap<String, f32>>();

        Self {
            id: journal_entry.id,
            user_id: journal_entry.user_id,
            entry_date: journal_entry.entry_date,
            entry_time: journal_entry.entry_time,
            product_id: journal_entry.product_id,
            product_name: journal_entry.product_name.to_owned(),
            product_density: journal_entry.product_density,
            amount: journal_entry.amount,
            unit: journal_entry.unit.to_owned(),
            journal_group_ui_index: journal_entry.journal_group_ui_index,
            nutrients,
            custom_units: custom_units.to_vec(),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::{CreateJournalEntryPayload, UpdateJournalEntryPayload};
    use crate::{types::journal_entry::JournalEntry, utils};
    use chrono::NaiveDate;

    #[tokio::test]
    async fn find_all_by_date() {
        let entry_date = NaiveDate::from_ymd_opt(2022, 11, 4).unwrap();
        let user_id = 1;

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let journal_entries = JournalEntry::find_all_by_date(entry_date, user_id)
            .fetch_all(&mut txn)
            .await
            .unwrap();

        assert_eq!(journal_entries.len(), 3);
    }

    #[tokio::test]
    async fn insert_journal_entry() {
        let create_journal_entry_payload: CreateJournalEntryPayload =
            utils::read_json("examples/create_journal_entry_payload.json").unwrap();

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let journal_entry_result =
            JournalEntry::insert_journal_entry(&create_journal_entry_payload, &mut txn)
                .await
                .unwrap();

        assert_ne!(
            0, journal_entry_result.id,
            "journal_entry_result should not have a placeholder value for id"
        );

        txn.rollback().await.unwrap();
    }

    #[tokio::test]
    async fn update_journal_entry() {
        let create_journal_entry_payload: CreateJournalEntryPayload =
            utils::read_json("examples/create_journal_entry_payload.json").unwrap();

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let create_product_result =
            JournalEntry::insert_journal_entry(&create_journal_entry_payload, &mut txn)
                .await
                .unwrap();

        assert_ne!(
            0, create_product_result.id,
            "create_product_result should not have a placeholder value for id"
        );

        let mut update_journal_entry_payload: UpdateJournalEntryPayload =
            utils::read_json("examples/update_journal_entry_payload.json").unwrap();

        update_journal_entry_payload.id = create_product_result.id;

        let update_journal_entry_result =
            JournalEntry::update_journal_entry(&update_journal_entry_payload, &mut txn)
                .await
                .unwrap();

        assert_ne!(
            create_journal_entry_payload.amount, update_journal_entry_result.amount,
            "update_journal_entry_result should not have an old amount"
        );

        txn.rollback().await.unwrap();
    }

    #[tokio::test]
    async fn delete_journal_entry() {
        let create_journal_entry_payload: CreateJournalEntryPayload =
            utils::read_json("examples/create_journal_entry_payload.json").unwrap();

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let create_product_result =
            JournalEntry::insert_journal_entry(&create_journal_entry_payload, &mut txn)
                .await
                .unwrap();

        assert_ne!(
            0, create_product_result.id,
            "create_product_result should not have a placeholder value for id"
        );

        let delete_journal_entry_result =
            JournalEntry::delete_journal_entry(create_product_result.id, &mut txn)
                .await
                .unwrap();

        assert_eq!(
            create_product_result.id, delete_journal_entry_result.id,
            "delete_journal_entry_result should have the same id as was provided in args"
        );

        txn.rollback().await.unwrap();
    }
}
