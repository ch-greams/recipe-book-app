use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgArguments, query::QueryAs, Postgres, QueryBuilder, Transaction};

use crate::utils::BIND_LIMIT;

use super::error::Error;

#[derive(sqlx::FromRow, Deserialize, Serialize, Debug)]
pub struct JournalGroup {
    pub ui_index: i16,
    pub name: String,
}

impl JournalGroup {
    pub fn find_all_by_user_id(user_id: i64) -> QueryAs<'static, Postgres, Self, PgArguments> {
        sqlx::query_as("SELECT * FROM journal.journal_group WHERE user_id = $1").bind(user_id)
    }

    pub async fn replace_multiple(
        journal_groups: &[JournalGroup],
        user_id: i64,
        txn: &mut Transaction<'_, Postgres>,
    ) -> Result<(), Error> {
        // delete

        let delete_query =
            sqlx::query("DELETE FROM journal.journal_group WHERE user_id = $1").bind(user_id);

        delete_query.fetch_all(&mut *txn).await?;

        // insert

        let mut insert_query_builder: QueryBuilder<Postgres> =
            QueryBuilder::new("INSERT INTO journal.journal_group (ui_index, name, user_id) ");

        insert_query_builder
            .push_values(
                journal_groups.iter().take(BIND_LIMIT / 3),
                |mut builder, journal_group| {
                    builder
                        .push_bind(journal_group.ui_index)
                        .push_bind(journal_group.name.to_string())
                        .push_bind(user_id);
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
    use crate::utils;

    use super::JournalGroup;

    #[tokio::test]
    async fn find_all_by_user_id() {
        let user_id = 1;

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let journal_groups = JournalGroup::find_all_by_user_id(user_id)
            .fetch_all(&mut txn)
            .await
            .unwrap();

        assert_eq!(journal_groups.len(), 3);
    }

    #[tokio::test]
    async fn replace_multiple() {
        let user_id = 1;
        let update_journal_groups_payload: Vec<JournalGroup> =
            utils::read_json("examples/update_journal_groups_payload.json").unwrap();

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        JournalGroup::replace_multiple(&update_journal_groups_payload, user_id, &mut txn)
            .await
            .unwrap();

        txn.rollback().await.unwrap();
    }
}
