use actix_web::{
    get, post,
    web::{Data, Json, Path},
    Scope,
};
use sqlx::{Pool, Postgres};

use crate::types::{
    custom_unit::CustomUnit,
    error::Error,
    food::{CreateFoodPayload, Food, UpdateFoodPayload},
    nutrition_facts::NutritionFacts,
    product::Product,
};

pub fn scope() -> Scope {
    actix_web::web::scope("food")
        .service(find_by_id)
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
