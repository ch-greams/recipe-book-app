use actix_web::{
    get, post,
    web::{Data, Json, Query},
    HttpRequest, HttpResponse, Scope,
};
use serde::Deserialize;
use sqlx::{Pool, Postgres};

use crate::{
    auth::{authorize, get_user, Certificate},
    types::{
        error::Error,
        food::{Food, FoodShort},
    },
};

pub fn scope() -> Scope {
    actix_web::web::scope("food")
        .service(find_all)
        .service(find_all_created)
        .service(find_all_favorite)
        .service(delete_favorite_by_id)
        .service(delete_by_id)
}

#[derive(Debug, Deserialize)]
pub struct FindAllQuery {
    limit: Option<u32>,
    offset: Option<u32>,
    is_recipe: Option<bool>,
    filter: Option<String>,
}

#[get("")]
async fn find_all(
    query: Query<FindAllQuery>,
    db_pool: Data<Pool<Postgres>>,
    auth_certificate: Data<Certificate>,
    request: HttpRequest,
) -> Result<Json<Vec<FoodShort>>, Error> {
    let user_id = get_user(request, &auth_certificate);

    let mut txn = db_pool.begin().await?;

    let foods = Food::find_all(
        query.limit.unwrap_or(100),
        query.offset.unwrap_or(0),
        user_id,
        query.is_recipe,
        query.filter.clone().unwrap_or_default(),
    )
    .fetch_all(&mut txn)
    .await?;

    let foods_short = foods.iter().map(FoodShort::new).collect();

    Ok(Json(foods_short))
}

#[get("/created")]
async fn find_all_created(
    query: Query<FindAllQuery>,
    db_pool: Data<Pool<Postgres>>,
    auth_certificate: Data<Certificate>,
    request: HttpRequest,
) -> Result<Json<Vec<FoodShort>>, Error> {
    let user_id = authorize(request, &auth_certificate)?;

    let mut txn = db_pool.begin().await?;

    let foods = Food::find_all_created_by_user(
        query.limit.unwrap_or(100),
        query.offset.unwrap_or(0),
        user_id,
        query.is_recipe,
        query.filter.clone().unwrap_or_default(),
    )
    .fetch_all(&mut txn)
    .await?;

    let foods_short = foods.iter().map(FoodShort::new).collect();

    Ok(Json(foods_short))
}

#[get("/favorite")]
async fn find_all_favorite(
    query: Query<FindAllQuery>,
    db_pool: Data<Pool<Postgres>>,
    auth_certificate: Data<Certificate>,
    request: HttpRequest,
) -> Result<Json<Vec<FoodShort>>, Error> {
    let user_id = authorize(request, &auth_certificate)?;

    let mut txn = db_pool.begin().await?;

    let foods = Food::find_all_favorite(
        query.limit.unwrap_or(100),
        query.offset.unwrap_or(0),
        user_id,
        query.is_recipe,
        query.filter.clone().unwrap_or_default(),
    )
    .fetch_all(&mut txn)
    .await?;

    let foods_short = foods.iter().map(FoodShort::new).collect();

    Ok(Json(foods_short))
}

#[derive(Debug, Deserialize)]
pub struct DeleteFoodPayload {
    id: i64,
}

#[post("/favorite/delete")]
async fn delete_favorite_by_id(
    payload: Json<DeleteFoodPayload>,
    db_pool: Data<Pool<Postgres>>,
    auth_certificate: Data<Certificate>,
    request: HttpRequest,
) -> Result<HttpResponse, Error> {
    let user_id = authorize(request, &auth_certificate)?;

    let mut txn = db_pool.begin().await?;

    Food::delete_favorite(user_id, payload.id, &mut txn).await?;

    txn.commit().await?;

    Ok(HttpResponse::NoContent().finish())
}

#[post("/delete")]
async fn delete_by_id(
    payload: Json<DeleteFoodPayload>,
    db_pool: Data<Pool<Postgres>>,
    auth_certificate: Data<Certificate>,
    request: HttpRequest,
) -> Result<HttpResponse, Error> {
    let user_id = authorize(request, &auth_certificate)?;

    let mut txn = db_pool.begin().await?;

    Food::delete_by_id(payload.id, user_id, &mut txn).await?;

    txn.commit().await?;

    Ok(HttpResponse::NoContent().finish())
}
