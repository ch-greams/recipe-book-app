use actix_web::{
    get, post,
    web::{Data, Json, Query},
    HttpRequest, HttpResponse, Scope,
};
use chrono::NaiveDate;
use serde::Deserialize;
use sqlx::{Pool, Postgres};

use crate::{
    auth::{authorize, Certificate},
    types::{
        custom_unit::CustomUnit,
        error::Error,
        journal_entry::{
            CreateJournalEntryPayload, DeleteJournalEntryPayload, JournalEntry,
            JournalEntryDetailed, UpdateJournalEntryPayload,
        },
        journal_group::JournalGroup,
        product_nutrient::ProductNutrient,
        user_nutrient::UserNutrient,
    },
};

pub fn scope() -> Scope {
    actix_web::web::scope("journal")
        .service(get_groups)
        .service(update_groups)
        .service(get_entries)
        .service(create_entry)
        .service(update_entry)
        .service(delete_entry)
        .service(get_nutrients)
        .service(upsert_nutrient)
        .service(delete_nutrient)
}

#[get("/groups")]
async fn get_groups(
    db_pool: Data<Pool<Postgres>>,
    auth_certificate: Data<Certificate>,
    request: HttpRequest,
) -> Result<Json<Vec<JournalGroup>>, Error> {
    let user_id = authorize(request, &auth_certificate)?;

    let mut txn = db_pool.begin().await?;

    let journal_groups = JournalGroup::find_all_by_user_id(user_id)
        .fetch_all(&mut txn)
        .await?;

    txn.commit().await?;

    Ok(Json(journal_groups))
}

#[post("/groups/update")]
async fn update_groups(
    payload: Json<Vec<JournalGroup>>,
    db_pool: Data<Pool<Postgres>>,
    auth_certificate: Data<Certificate>,
    request: HttpRequest,
) -> Result<HttpResponse, Error> {
    let user_id = authorize(request, &auth_certificate)?;

    let mut txn = db_pool.begin().await?;

    JournalGroup::replace_multiple(&payload, user_id, &mut txn).await?;

    txn.commit().await?;

    Ok(HttpResponse::Created().finish())
}

#[derive(Debug, Deserialize)]
pub struct FindEntriesQuery {
    entry_date: NaiveDate,
}

#[get("/entry")]
async fn get_entries(
    query: Query<FindEntriesQuery>,
    db_pool: Data<Pool<Postgres>>,
    auth_certificate: Data<Certificate>,
    request: HttpRequest,
) -> Result<HttpResponse, Error> {
    let user_id = authorize(request, &auth_certificate)?;

    let mut txn = db_pool.begin().await?;

    let journal_entries = JournalEntry::find_all_by_date(query.entry_date, user_id)
        .fetch_all(&mut txn)
        .await?;

    let product_ids: Vec<i64> = journal_entries
        .iter()
        .map(|journal_entry| journal_entry.product_id)
        .collect();

    let product_nutrients = ProductNutrient::find_by_product_ids(product_ids.clone())
        .fetch_all(&mut txn)
        .await?;

    let custom_units = CustomUnit::find_by_product_ids(product_ids)
        .fetch_all(&mut txn)
        .await?;

    let journal_entries_detailed: Vec<JournalEntryDetailed> = journal_entries
        .iter()
        .map(|je| {
            JournalEntryDetailed::new(
                je,
                &product_nutrients
                    .iter()
                    .cloned()
                    .filter(|pn| pn.product_id == je.product_id)
                    .collect::<Vec<ProductNutrient>>(),
                &custom_units
                    .iter()
                    .cloned()
                    .filter(|pn| pn.product_id == je.product_id)
                    .collect::<Vec<CustomUnit>>(),
            )
        })
        .collect();

    txn.commit().await?;

    Ok(HttpResponse::Ok().json(journal_entries_detailed))
}

#[post("/entry/create")]
async fn create_entry(
    payload: Json<CreateJournalEntryPayload>,
    db_pool: Data<Pool<Postgres>>,
    auth_certificate: Data<Certificate>,
    request: HttpRequest,
) -> Result<HttpResponse, Error> {
    authorize(request, &auth_certificate)?;

    let mut txn = db_pool.begin().await?;

    let journal_entry = JournalEntry::insert_journal_entry(&payload, &mut txn).await?;

    let product_nutrients = ProductNutrient::find_by_product_id(journal_entry.product_id)
        .fetch_all(&mut txn)
        .await?;

    let custom_units = CustomUnit::find_by_product_id(journal_entry.product_id)
        .fetch_all(&mut txn)
        .await?;

    let journal_entry_detailed =
        JournalEntryDetailed::new(&journal_entry, &product_nutrients, &custom_units);

    txn.commit().await?;

    Ok(HttpResponse::Created().json(journal_entry_detailed))
}

#[post("/entry/update")]
async fn update_entry(
    payload: Json<UpdateJournalEntryPayload>,
    db_pool: Data<Pool<Postgres>>,
    auth_certificate: Data<Certificate>,
    request: HttpRequest,
) -> Result<HttpResponse, Error> {
    authorize(request, &auth_certificate)?;

    let mut txn = db_pool.begin().await?;

    let response = JournalEntry::update_journal_entry(&payload, &mut txn).await?;

    txn.commit().await?;

    Ok(HttpResponse::Ok().json(response))
}

#[post("/entry/delete")]
async fn delete_entry(
    payload: Json<DeleteJournalEntryPayload>,
    db_pool: Data<Pool<Postgres>>,
    auth_certificate: Data<Certificate>,
    request: HttpRequest,
) -> Result<HttpResponse, Error> {
    authorize(request, &auth_certificate)?;

    let mut txn = db_pool.begin().await?;

    JournalEntry::delete_journal_entry(payload.id, &mut txn).await?;

    txn.commit().await?;

    Ok(HttpResponse::NoContent().finish())
}

// NOTE: user_nutrient

#[get("/nutrients")]
async fn get_nutrients(
    db_pool: Data<Pool<Postgres>>,
    auth_certificate: Data<Certificate>,
    request: HttpRequest,
) -> Result<HttpResponse, Error> {
    let user_id = authorize(request, &auth_certificate)?;

    let mut txn = db_pool.begin().await?;

    let user_nutrients = UserNutrient::find_all(user_id).fetch_all(&mut txn).await?;

    txn.commit().await?;

    Ok(HttpResponse::Ok().json(user_nutrients))
}

#[post("/nutrient/upsert")]
async fn upsert_nutrient(
    payload: Json<UserNutrient>,
    db_pool: Data<Pool<Postgres>>,
    auth_certificate: Data<Certificate>,
    request: HttpRequest,
) -> Result<HttpResponse, Error> {
    let user_id = authorize(request, &auth_certificate)?;

    let mut txn = db_pool.begin().await?;

    UserNutrient::upsert_nutrient(&payload, &mut txn).await?;

    let user_nutrient = UserNutrient::find_by_id(user_id, payload.nutrient_id)
        .fetch_optional(&mut txn)
        .await?;

    txn.commit().await?;

    Ok(HttpResponse::Created().json(user_nutrient))
}

#[derive(Debug, Deserialize)]
pub struct DeleteUserNutrientPayload {
    id: i16,
}

#[post("/nutrient/delete")]
async fn delete_nutrient(
    payload: Json<DeleteUserNutrientPayload>,
    db_pool: Data<Pool<Postgres>>,
    auth_certificate: Data<Certificate>,
    request: HttpRequest,
) -> Result<HttpResponse, Error> {
    let user_id = authorize(request, &auth_certificate)?;

    let mut txn = db_pool.begin().await?;

    UserNutrient::delete_user_nutrient(user_id, payload.id, &mut txn).await?;

    txn.commit().await?;

    Ok(HttpResponse::NoContent().finish())
}
