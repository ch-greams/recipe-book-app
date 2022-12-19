use std::collections::HashMap;

use actix_web::{
    get, post,
    web::{Data, Json, Path},
    HttpRequest, Scope,
};
use sqlx::{Pool, Postgres};

use crate::{
    auth::{authorize, get_user, Certificate},
    types::{
        custom_unit::CustomUnit,
        error::Error,
        food::{CreateFoodPayload, Food, UpdateFoodPayload},
        meta::Nutrient,
        product::Product,
        product_nutrient::ProductNutrient,
    },
};

pub fn scope() -> Scope {
    actix_web::web::scope("food")
        .service(find_by_id)
        .service(create_food)
        .service(update_food)
}

#[get("/{id}")]
async fn find_by_id(
    id: Path<i64>,
    db_pool: Data<Pool<Postgres>>,
    auth_certificate: Data<Certificate>,
    request: HttpRequest,
) -> Result<Json<Food>, Error> {
    let user_id = get_user(request, &auth_certificate);

    let mut txn = db_pool.begin().await?;

    let product = Product::find_food_by_id(*id, user_id)
        .fetch_optional(&mut txn)
        .await?
        .ok_or_else(|| Error::not_found(*id))?;

    let custom_units = CustomUnit::find_by_product_id(*id)
        .fetch_all(&mut txn)
        .await?;

    let product_nutrients = ProductNutrient::find_by_product_id(*id)
        .fetch_all(&mut txn)
        .await?
        .iter()
        .map(|pn| (pn.name.clone(), pn.amount))
        .collect::<HashMap<String, f32>>();

    let food = Food::new(&product, &product_nutrients, custom_units);

    Ok(Json(food))
}

#[post("/create")]
async fn create_food(
    payload: Json<CreateFoodPayload>,
    db_pool: Data<Pool<Postgres>>,
    auth_certificate: Data<Certificate>,
    request: HttpRequest,
) -> Result<Json<Food>, Error> {
    let user_id = authorize(request, &auth_certificate)?;

    let mut txn = db_pool.begin().await?;

    let product = Product::insert_food(&payload, user_id, &mut txn).await?;

    let custom_units =
        CustomUnit::insert_multiple(&payload.custom_units, product.id, &mut txn).await?;

    let nutrients = Nutrient::get_nutrients().fetch_all(&mut txn).await?;

    ProductNutrient::insert_multiple(&payload.nutrients, &nutrients, product.id, &mut txn).await?;

    txn.commit().await?;

    let food = Food::new(&product, &payload.nutrients, custom_units);

    Ok(Json(food))
}

#[post("/update")]
async fn update_food(
    payload: Json<UpdateFoodPayload>,
    db_pool: Data<Pool<Postgres>>,
    auth_certificate: Data<Certificate>,
    request: HttpRequest,
) -> Result<Json<Food>, Error> {
    let user_id = authorize(request, &auth_certificate)?;

    let mut txn = db_pool.begin().await?;

    // TODO: Might want to provide a better error when user_id doesn't match
    let product = Product::update_food(&payload, user_id, &mut txn).await?;

    let custom_units =
        CustomUnit::replace_multiple(&payload.custom_units, product.id, &mut txn).await?;

    let nutrients = Nutrient::get_nutrients().fetch_all(&mut txn).await?;

    ProductNutrient::replace_multiple(&payload.nutrients, &nutrients, product.id, &mut txn).await?;

    txn.commit().await?;

    let food = Food::new(&product, &payload.nutrients, custom_units);

    Ok(Json(food))
}
