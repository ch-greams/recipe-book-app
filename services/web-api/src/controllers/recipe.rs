use actix_web::{
    get,
    web::{Data, Json, Path, Query},
    Scope,
};
use serde::Deserialize;
use sqlx::{Pool, Postgres};

use crate::types::{
    custom_unit::CustomUnit,
    direction::{Direction, DirectionDetails},
    direction_part::DirectionPart,
    error::Error,
    ingredient::{Ingredient, IngredientDetails},
    ingredient_product::IngredientProductDetails,
    product::Product,
    recipe::{Recipe, RecipeShort},
};

pub fn scope() -> Scope {
    actix_web::web::scope("recipe")
        .service(find_by_id)
        .service(find_all)
}

#[get("/{id}")]
async fn find_by_id(id: Path<i64>, db_pool: Data<Pool<Postgres>>) -> Result<Json<Recipe>, Error> {
    let mut txn = db_pool.begin().await?;

    let product = Product::find_recipe_by_id(*id)
        .fetch_optional(&mut txn)
        .await?
        .ok_or_else(|| Error::not_found(*id))?;

    let custom_units = CustomUnit::find_by_product_id(*id)
        .fetch_all(&mut txn)
        .await?;

    // ingredients

    let ingredients = Ingredient::find_by_recipe_id(*id)
        .fetch_all(&mut txn)
        .await?;

    let ingredient_ids: Vec<i64> = ingredients
        .clone()
        .iter()
        .map(|ingredient| ingredient.id)
        .collect();

    let ingredient_products = IngredientProductDetails::find_by_ingredient_ids(ingredient_ids)
        .fetch_all(&mut txn)
        .await?;

    let ingredient_details: Vec<IngredientDetails> = ingredients
        .iter()
        .map(|i| IngredientDetails::new(i, &ingredient_products))
        .collect();

    // directions

    let directions = Direction::find_by_recipe_id(*id)
        .fetch_all(&mut txn)
        .await?;

    let direction_ids: Vec<i64> = directions
        .clone()
        .iter()
        .map(|direction| direction.id)
        .collect();

    let direction_parts = DirectionPart::find_by_direction_ids(direction_ids)
        .fetch_all(&mut txn)
        .await?;

    let direction_details = directions
        .iter()
        .map(|direction| DirectionDetails::new(direction, &direction_parts))
        .collect();

    let recipe = Recipe::new(product, custom_units, ingredient_details, direction_details);

    Ok(Json(recipe))
}

#[derive(Debug, Deserialize)]
pub struct FindAllQuery {
    limit: Option<u32>,
    offset: Option<u32>,
}

#[get("")]
async fn find_all(
    query: Query<FindAllQuery>,
    db_pool: Data<Pool<Postgres>>,
) -> Result<Json<Vec<RecipeShort>>, Error> {
    let mut txn = db_pool.begin().await?;

    let products = Product::find_recipe_all(query.limit.unwrap_or(100), query.offset.unwrap_or(0))
        .fetch_all(&mut txn)
        .await?;

    let recipes = products.iter().map(RecipeShort::new).collect();

    Ok(Json(recipes))
}
