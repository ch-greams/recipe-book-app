use std::collections::HashMap;

use actix_web::{
    get,
    web::{Data, Json, Path},
    Scope,
};
use sqlx::{Pool, Postgres};

use crate::types::{
    custom_unit::CustomUnit, error::Error, food::Food, nutrition_facts::NutritionFacts,
    product::Product,
};

pub fn scope() -> Scope {
    actix_web::web::scope("food")
        .service(find_by_id)
        .service(find_all)
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

#[get("/")]
async fn find_all(db_pool: Data<Pool<Postgres>>) -> Result<Json<Vec<Food>>, Error> {
    let mut txn = db_pool.begin().await?;

    let products = Product::find_food_all(100).fetch_all(&mut txn).await?;

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
