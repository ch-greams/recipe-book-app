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
    direction::{Direction, DirectionDetails},
    direction_part::DirectionPart,
    error::Error,
    ingredient::{Ingredient, IngredientDetails},
    ingredient_product::{IngredientProduct, IngredientProductDetails},
    product::Product,
    recipe::{CreateRecipePayload, Recipe, RecipeShort, UpdateRecipePayload},
};

pub fn scope() -> Scope {
    actix_web::web::scope("recipe")
        .service(find_all_favorite)
        .service(find_by_id)
        .service(find_all)
        .service(create_recipe)
        .service(update_recipe)
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

#[post("/create")]
async fn create_recipe(
    request: Json<CreateRecipePayload>,
    db_pool: Data<Pool<Postgres>>,
) -> Result<Json<Recipe>, Error> {
    let mut txn = db_pool.begin().await?;

    let product = Product::insert_recipe(&request, 1, &mut txn).await?;

    let custom_units =
        CustomUnit::insert_mutliple(&request.custom_units, product.id, &mut txn).await?;

    // ingredients

    let ingredients =
        Ingredient::insert_mutliple(&request.ingredients, product.id, &mut txn).await?;

    let mut temporary_to_final_id = HashMap::new();

    for (index, ingredient_payload) in request.ingredients.iter().enumerate() {
        let ingredient = ingredients
            .get(index)
            .ok_or_else(|| Error::not_created("ingredient"))?;
        temporary_to_final_id.insert(ingredient_payload.id, ingredient.id);

        let _ingredient_products = IngredientProduct::insert_mutliple(
            &ingredient_payload.products,
            ingredient.id,
            &mut txn,
        )
        .await?;
    }

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

    let directions = Direction::insert_mutliple(&request.directions, product.id, &mut txn).await?;

    let mut direction_parts: Vec<DirectionPart> = Vec::new();

    for (index, direction_payload) in request.directions.iter().enumerate() {
        let direction = directions
            .get(index)
            .ok_or_else(|| Error::not_created("direction"))?;

        let mut _direction_parts = DirectionPart::insert_mutliple(
            &direction_payload.steps,
            direction.id,
            &temporary_to_final_id,
            &mut txn,
        )
        .await?;

        direction_parts.append(&mut _direction_parts);
    }

    let direction_details: Vec<DirectionDetails> = directions
        .iter()
        .map(|direction| DirectionDetails::new(direction, &direction_parts))
        .collect();

    txn.commit().await?;

    let recipe = Recipe::new(product, custom_units, ingredient_details, direction_details);

    Ok(Json(recipe))
}

#[post("/update")]
async fn update_recipe(
    request: Json<UpdateRecipePayload>,
    db_pool: Data<Pool<Postgres>>,
) -> Result<Json<Recipe>, Error> {
    let mut txn = db_pool.begin().await?;

    let product = Product::update_recipe(&request, &mut txn).await?;

    let custom_units =
        CustomUnit::replace_mutliple(&request.custom_units, product.id, &mut txn).await?;

    // ingredients

    let ingredients =
        Ingredient::replace_mutliple(&request.ingredients, product.id, &mut txn).await?;

    let mut temporary_to_final_id = HashMap::new();

    for (index, ingredient_payload) in request.ingredients.iter().enumerate() {
        let ingredient = ingredients
            .get(index)
            .ok_or_else(|| Error::not_updated("ingredient", ingredient_payload.id))?;
        temporary_to_final_id.insert(ingredient_payload.id, ingredient.id);

        let _ingredient_products = IngredientProduct::insert_mutliple(
            &ingredient_payload.products,
            ingredient.id,
            &mut txn,
        )
        .await?;
    }

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

    let directions = Direction::replace_mutliple(&request.directions, product.id, &mut txn).await?;

    let mut direction_parts: Vec<DirectionPart> = Vec::new();

    for (index, direction_payload) in request.directions.iter().enumerate() {
        let direction = directions
            .get(index)
            .ok_or_else(|| Error::not_updated("direction", direction_payload.id))?;

        let mut _direction_parts = DirectionPart::insert_mutliple(
            &direction_payload.steps,
            direction.id,
            &temporary_to_final_id,
            &mut txn,
        )
        .await?;

        direction_parts.append(&mut _direction_parts);
    }

    let direction_details: Vec<DirectionDetails> = directions
        .iter()
        .map(|direction| DirectionDetails::new(direction, &direction_parts))
        .collect();

    txn.commit().await?;

    let recipe = Recipe::new(product, custom_units, ingredient_details, direction_details);

    Ok(Json(recipe))
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
) -> Result<Json<Vec<RecipeShort>>, Error> {
    let mut txn = db_pool.begin().await?;

    let products = if let Some(user_id) = query.user_id {
        Product::find_recipe_all_created_by_user(
            query.limit.unwrap_or(100),
            query.offset.unwrap_or(0),
            user_id,
        )
        .fetch_all(&mut txn)
        .await?
    } else {
        Product::find_recipe_all(query.limit.unwrap_or(100), query.offset.unwrap_or(0))
            .fetch_all(&mut txn)
            .await?
    };

    let recipes = products.iter().map(RecipeShort::new).collect();

    Ok(Json(recipes))
}

#[get("/favorite/{user_id}")]
async fn find_all_favorite(
    user_id: Path<i64>,
    query: Query<FindAllQuery>,
    db_pool: Data<Pool<Postgres>>,
) -> Result<Json<Vec<RecipeShort>>, Error> {
    let mut txn = db_pool.begin().await?;

    let products = Product::find_recipe_all_favorite(
        query.limit.unwrap_or(100),
        query.offset.unwrap_or(0),
        *user_id,
    )
    .fetch_all(&mut txn)
    .await?;

    let recipes = products.iter().map(RecipeShort::new).collect();

    Ok(Json(recipes))
}
