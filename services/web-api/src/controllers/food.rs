use std::collections::HashMap;

use actix_web::{
    get, post,
    web::{Data, Json, Path, Query},
    Scope,
};
use serde::Deserialize;
use sqlx::{Pool, Postgres};

use crate::types::{
    custom_unit::CustomUnit,
    error::Error,
    food::{CreateFoodPayload, Food, FoodShort, UpdateFoodPayload},
    nutrition_facts::NutritionFacts,
    product::Product,
};

pub fn scope() -> Scope {
    actix_web::web::scope("food")
        .service(find_all_detailed)
        .service(find_all_favorite)
        .service(find_by_id)
        .service(find_all)
        .service(create_food)
        .service(update_food)
}

#[get("/{id}")]
async fn find_by_id(id: Path<i64>, db_pool: Data<Pool<Postgres>>) -> Result<Json<Food>, Error> {
    let mut txn = db_pool.begin().await?;

    let product = Product::find_food_by_id(*id)
        .fetch_optional(&mut txn)
        .await?
        .ok_or_else(|| Error::not_found(*id))?;

    let custom_units = CustomUnit::find_by_product_id(*id)
        .fetch_all(&mut txn)
        .await?;

    let nutrition_facts = NutritionFacts::find_by_product_id(*id)
        .fetch_optional(&mut txn)
        .await?
        .ok_or_else(|| Error::not_found(*id))?;

    let food = Food::new(&product, &nutrition_facts, custom_units);

    Ok(Json(food))
}

#[post("/create")]
async fn create_food(
    request: Json<CreateFoodPayload>,
    db_pool: Data<Pool<Postgres>>,
) -> Result<Json<Food>, Error> {
    let mut txn = db_pool.begin().await?;

    let product = Product::insert_food(&request, 1, &mut txn).await?;

    let custom_units =
        CustomUnit::insert_mutliple(&request.custom_units, product.id, &mut txn).await?;

    let nutrition_facts =
        NutritionFacts::insert(&request.nutrition_facts, product.id, &mut txn).await?;

    txn.commit().await?;

    let food = Food::new(&product, &nutrition_facts, custom_units);

    Ok(Json(food))
}

#[post("/update")]
async fn update_food(
    request: Json<UpdateFoodPayload>,
    db_pool: Data<Pool<Postgres>>,
) -> Result<Json<Food>, Error> {
    let mut txn = db_pool.begin().await?;

    let product = Product::update_food(&request, &mut txn).await?;

    let custom_units =
        CustomUnit::replace_mutliple(&request.custom_units, product.id, &mut txn).await?;

    let nutrition_facts = NutritionFacts::update(&request.nutrition_facts, &mut txn).await?;

    txn.commit().await?;

    let food = Food::new(&product, &nutrition_facts, custom_units);

    Ok(Json(food))
}

#[derive(Debug, Deserialize)]
pub struct FindAllQuery {
    limit: Option<u32>,
    offset: Option<u32>,
    user_id: Option<i64>,
}

#[get("")]
async fn find_all(
    query: Query<FindAllQuery>,
    db_pool: Data<Pool<Postgres>>,
) -> Result<Json<Vec<FoodShort>>, Error> {
    let mut txn = db_pool.begin().await?;

    let products = if let Some(user_id) = query.user_id {
        Product::find_food_all_created_by_user(
            query.limit.unwrap_or(100),
            query.offset.unwrap_or(0),
            user_id,
        )
        .fetch_all(&mut txn)
        .await?
    } else {
        Product::find_food_all(query.limit.unwrap_or(100), query.offset.unwrap_or(0))
            .fetch_all(&mut txn)
            .await?
    };

    let foods = products.iter().map(FoodShort::new).collect();

    Ok(Json(foods))
}

#[get("/favorite/{user_id}")]
async fn find_all_favorite(
    user_id: Path<i64>,
    query: Query<FindAllQuery>,
    db_pool: Data<Pool<Postgres>>,
) -> Result<Json<Vec<FoodShort>>, Error> {
    let mut txn = db_pool.begin().await?;

    let products = Product::find_food_all_favorite(
        query.limit.unwrap_or(100),
        query.offset.unwrap_or(0),
        *user_id,
    )
    .fetch_all(&mut txn)
    .await?;

    let foods = products.iter().map(FoodShort::new).collect();

    Ok(Json(foods))
}

#[get("/detailed")]
async fn find_all_detailed(
    query: Query<FindAllQuery>,
    db_pool: Data<Pool<Postgres>>,
) -> Result<Json<Vec<Food>>, Error> {
    let mut txn = db_pool.begin().await?;

    let products = Product::find_food_all(query.limit.unwrap_or(100), query.offset.unwrap_or(0))
        .fetch_all(&mut txn)
        .await?;

    let product_ids: Vec<i64> = products.iter().map(|p| p.id).collect();

    let custom_units = CustomUnit::find_by_product_ids(product_ids.clone())
        .fetch_all(&mut txn)
        .await?;

    let nutrition_facts = NutritionFacts::find_by_product_ids(product_ids.clone())
        .fetch_all(&mut txn)
        .await?;

    let nutrition_facts_map = nutrition_facts
        .iter()
        .map(|nf| (nf.product_id, nf))
        .collect::<HashMap<i64, &NutritionFacts>>();

    let foods = products
        .iter()
        .map(|product| {
            Food::new(
                product,
                nutrition_facts_map
                    .get(&product.id)
                    .unwrap_or(&&NutritionFacts::new(product.id)),
                custom_units
                    .iter()
                    .filter(|cu| cu.product_id == product.id)
                    .cloned()
                    .collect(),
            )
        })
        .collect();

    Ok(Json(foods))
}
