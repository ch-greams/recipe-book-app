use actix_web::{
    get, post,
    web::{Data, Json, Query},
    HttpResponse, Scope,
};
use chrono::NaiveDate;
use serde::Deserialize;
use sqlx::{Pool, Postgres};

use crate::types::{
    error::Error,
    journal_entry::{
        CreateJournalEntryPayload, DeleteJournalEntryPayload, JournalEntry,
        UpdateJournalEntryPayload,
    },
    journal_group::JournalGroup,
};

pub fn scope() -> Scope {
    actix_web::web::scope("journal")
        .service(get_groups)
        .service(update_groups)
        .service(get_entries)
        .service(create_entry)
        .service(update_entry)
        .service(delete_entry)
}

#[derive(Debug, Deserialize)]
pub struct FindGroupsQuery {
    // TODO: Move into auth cookies
    user_id: i64,
}

#[get("/groups")]
async fn get_groups(
    query: Query<FindGroupsQuery>,
    db_pool: Data<Pool<Postgres>>,
) -> Result<Json<Vec<JournalGroup>>, Error> {
    let mut txn = db_pool.begin().await?;

    let journal_groups = JournalGroup::find_all_by_user_id(query.user_id)
        .fetch_all(&mut txn)
        .await?;

    txn.commit().await?;

    Ok(Json(journal_groups))
}

#[post("/groups/update")]
async fn update_groups(
    request: Json<Vec<JournalGroup>>,
    db_pool: Data<Pool<Postgres>>,
) -> Result<HttpResponse, Error> {
    let mut txn = db_pool.begin().await?;

    let user_id = 1;
    JournalGroup::replace_multiple(&request, user_id, &mut txn).await?;

    txn.commit().await?;

    Ok(HttpResponse::Created().finish())
}

#[derive(Debug, Deserialize)]
pub struct FindEntriesQuery {
    entry_date: NaiveDate,
    // TODO: Move into auth cookies
    user_id: i64,
}

#[get("/entry")]
async fn get_entries(
    query: Query<FindEntriesQuery>,
    db_pool: Data<Pool<Postgres>>,
) -> Result<HttpResponse, Error> {
    let mut txn = db_pool.begin().await?;

    let journal_entries = JournalEntry::find_all_by_date(query.entry_date, query.user_id)
        .fetch_all(&mut txn)
        .await?;

    txn.commit().await?;

    Ok(HttpResponse::Ok().json(journal_entries))
}

#[post("/entry/create")]
async fn create_entry(
    request: Json<CreateJournalEntryPayload>,
    db_pool: Data<Pool<Postgres>>,
) -> Result<HttpResponse, Error> {
    let mut txn = db_pool.begin().await?;

    let response = JournalEntry::insert_journal_entry(&request, &mut txn).await?;

    txn.commit().await?;

    Ok(HttpResponse::Created().json(response))
}

#[post("/entry/update")]
async fn update_entry(
    request: Json<UpdateJournalEntryPayload>,
    db_pool: Data<Pool<Postgres>>,
) -> Result<HttpResponse, Error> {
    let mut txn = db_pool.begin().await?;

    let response = JournalEntry::update_journal_entry(&request, &mut txn).await?;

    txn.commit().await?;

    Ok(HttpResponse::Ok().json(response))
}

#[post("/entry/delete")]
async fn delete_entry(
    request: Json<DeleteJournalEntryPayload>,
    db_pool: Data<Pool<Postgres>>,
) -> Result<HttpResponse, Error> {
    let mut txn = db_pool.begin().await?;

    let _response = JournalEntry::delete_journal_entry(request.id, &mut txn).await?;

    txn.commit().await?;

    Ok(HttpResponse::NoContent().finish())
}
