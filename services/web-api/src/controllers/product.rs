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
        product::{Product, ProductShort, ProductType},
    },
};

pub fn scope() -> Scope {
    actix_web::web::scope("product")
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
    product_type: Option<ProductType>,
    filter: Option<String>,
}

#[get("")]
async fn find_all(
    query: Query<FindAllQuery>,
    db_pool: Data<Pool<Postgres>>,
    auth_certificate: Data<Certificate>,
    request: HttpRequest,
) -> Result<Json<Vec<ProductShort>>, Error> {
    let user_id = get_user(request, &auth_certificate);

    let mut txn = db_pool.begin().await?;

    let types: Vec<ProductType> = match &query.product_type {
        Some(product_type) => vec![product_type.to_owned()],
        None => vec![ProductType::Recipe, ProductType::Food],
    };

    let products = Product::find_all(
        query.limit.unwrap_or(100),
        query.offset.unwrap_or(0),
        user_id,
        types,
        query.filter.clone().unwrap_or_default(),
    )
    .fetch_all(&mut txn)
    .await?;

    let foods = products.iter().map(ProductShort::new).collect();

    Ok(Json(foods))
}

#[get("/created")]
async fn find_all_created(
    query: Query<FindAllQuery>,
    db_pool: Data<Pool<Postgres>>,
    auth_certificate: Data<Certificate>,
    request: HttpRequest,
) -> Result<Json<Vec<ProductShort>>, Error> {
    let user_id = authorize(request, &auth_certificate)?;

    let mut txn = db_pool.begin().await?;

    let types: Vec<ProductType> = match &query.product_type {
        Some(product_type) => vec![product_type.to_owned()],
        None => vec![ProductType::Recipe, ProductType::Food],
    };

    let products = Product::find_all_created_by_user(
        query.limit.unwrap_or(100),
        query.offset.unwrap_or(0),
        user_id,
        types,
        query.filter.clone().unwrap_or_default(),
    )
    .fetch_all(&mut txn)
    .await?;

    let foods = products.iter().map(ProductShort::new).collect();

    Ok(Json(foods))
}

#[get("/favorite")]
async fn find_all_favorite(
    query: Query<FindAllQuery>,
    db_pool: Data<Pool<Postgres>>,
    auth_certificate: Data<Certificate>,
    request: HttpRequest,
) -> Result<Json<Vec<ProductShort>>, Error> {
    let user_id = authorize(request, &auth_certificate)?;

    let mut txn = db_pool.begin().await?;

    let types: Vec<ProductType> = match &query.product_type {
        Some(product_type) => vec![product_type.to_owned()],
        None => vec![ProductType::Recipe, ProductType::Food],
    };

    let products = Product::find_all_favorite(
        query.limit.unwrap_or(100),
        query.offset.unwrap_or(0),
        user_id,
        types,
        query.filter.clone().unwrap_or_default(),
    )
    .fetch_all(&mut txn)
    .await?;

    let foods = products.iter().map(ProductShort::new).collect();

    Ok(Json(foods))
}

#[derive(Debug, Deserialize)]
pub struct DeleteProductPayload {
    id: i64,
}

#[post("/favorite/delete")]
async fn delete_favorite_by_id(
    payload: Json<DeleteProductPayload>,
    db_pool: Data<Pool<Postgres>>,
    auth_certificate: Data<Certificate>,
    request: HttpRequest,
) -> Result<HttpResponse, Error> {
    let user_id = authorize(request, &auth_certificate)?;

    let mut txn = db_pool.begin().await?;

    Product::delete_favorite(user_id, payload.id, &mut txn).await?;

    txn.commit().await?;

    Ok(HttpResponse::NoContent().finish())
}

#[post("/delete")]
async fn delete_by_id(
    payload: Json<DeleteProductPayload>,
    db_pool: Data<Pool<Postgres>>,
    auth_certificate: Data<Certificate>,
    request: HttpRequest,
) -> Result<HttpResponse, Error> {
    let user_id = authorize(request, &auth_certificate)?;

    let mut txn = db_pool.begin().await?;

    Product::delete_by_id(payload.id, user_id, &mut txn).await?;

    txn.commit().await?;

    Ok(HttpResponse::NoContent().finish())
}
