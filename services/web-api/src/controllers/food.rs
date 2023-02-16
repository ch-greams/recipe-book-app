use std::collections::HashMap;

use actix_web::{
    get, post,
    web::{Data, Json, Path, Query},
    HttpRequest, HttpResponse, Scope,
};
use serde::Deserialize;
use sqlx::{Pool, Postgres};

use crate::{
    auth::{authorize, get_user, Certificate},
    types::{
        custom_unit::CustomUnit,
        error::Error,
        food::{CreateFoodPayload, Food, FoodDetailed, FoodShort, UpdateFoodPayload},
        food_nutrient::FoodNutrient,
        meta::Nutrient,
    },
};

pub fn scope() -> Scope {
    actix_web::web::scope("food")
        .service(create_food)
        .service(update_food)
        .service(find_all)
        .service(find_all_created)
        .service(find_all_favorite)
        .service(delete_favorite_by_id)
        .service(delete_by_id)
        .service(find_by_id)
}

#[get("/{id}")]
async fn find_by_id(
    id: Path<i64>,
    db_pool: Data<Pool<Postgres>>,
    auth_certificate: Data<Certificate>,
    request: HttpRequest,
) -> Result<Json<FoodDetailed>, Error> {
    let user_id = get_user(request, &auth_certificate);

    let mut txn = db_pool.begin().await?;

    let food = Food::find_food_by_id(*id, user_id)
        .fetch_optional(&mut txn)
        .await?
        .ok_or_else(|| Error::not_found(*id))?;

    let custom_units = CustomUnit::find_by_food_id(*id).fetch_all(&mut txn).await?;

    let food_nutrients = FoodNutrient::find_by_food_id(*id)
        .fetch_all(&mut txn)
        .await?
        .iter()
        .map(|pn| (pn.name.clone(), pn.amount))
        .collect::<HashMap<String, f32>>();

    let food_detailed = FoodDetailed::new(&food, &food_nutrients, custom_units);

    Ok(Json(food_detailed))
}

#[post("/create")]
async fn create_food(
    payload: Json<CreateFoodPayload>,
    db_pool: Data<Pool<Postgres>>,
    auth_certificate: Data<Certificate>,
    request: HttpRequest,
) -> Result<Json<FoodDetailed>, Error> {
    let user_id = authorize(request, &auth_certificate)?;

    let mut txn = db_pool.begin().await?;

    let food = Food::insert(&payload, false, user_id, &mut txn).await?;

    let custom_units =
        CustomUnit::insert_multiple(&payload.custom_units, food.id, &mut txn).await?;

    if !payload.nutrients.is_empty() {
        let meta_nutrients = Nutrient::get_nutrients().fetch_all(&mut txn).await?;

        FoodNutrient::insert_multiple(&payload.nutrients, &meta_nutrients, food.id, &mut txn)
            .await?;
    }

    txn.commit().await?;

    let food_detailed = FoodDetailed::new(&food, &payload.nutrients, custom_units);

    Ok(Json(food_detailed))
}

#[post("/update")]
async fn update_food(
    payload: Json<UpdateFoodPayload>,
    db_pool: Data<Pool<Postgres>>,
    auth_certificate: Data<Certificate>,
    request: HttpRequest,
) -> Result<Json<FoodDetailed>, Error> {
    let user_id = authorize(request, &auth_certificate)?;

    let mut txn = db_pool.begin().await?;

    // TODO: Might want to provide a better error when user_id doesn't match
    let food = Food::update(&payload, false, user_id, &mut txn).await?;

    let custom_units =
        CustomUnit::replace_multiple(&payload.custom_units, food.id, &mut txn).await?;

    let meta_nutrients = Nutrient::get_nutrients().fetch_all(&mut txn).await?;

    FoodNutrient::replace_multiple(&payload.nutrients, &meta_nutrients, food.id, &mut txn).await?;

    txn.commit().await?;

    let food_detailed = FoodDetailed::new(&food, &payload.nutrients, custom_units);

    Ok(Json(food_detailed))
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
