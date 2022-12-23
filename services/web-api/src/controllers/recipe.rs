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
        direction::{Direction, DirectionDetails},
        direction_part::DirectionPart,
        error::Error,
        ingredient::{Ingredient, IngredientDetails},
        ingredient_product::{IngredientProduct, IngredientProductDetails},
        product::Product,
        product_nutrient::ProductNutrient,
        recipe::{CreateRecipePayload, Recipe, UpdateRecipePayload},
    },
};

pub fn scope() -> Scope {
    actix_web::web::scope("recipe")
        .service(find_by_id)
        .service(create_recipe)
        .service(update_recipe)
}

#[get("/{id}")]
async fn find_by_id(
    id: Path<i64>,
    db_pool: Data<Pool<Postgres>>,
    auth_certificate: Data<Certificate>,
    request: HttpRequest,
) -> Result<Json<Recipe>, Error> {
    let user_id = get_user(request, &auth_certificate);

    let mut txn = db_pool.begin().await?;

    let product = Product::find_recipe_by_id(*id, user_id)
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

    let product_ids = ingredient_products
        .iter()
        .map(|ingredient_product| ingredient_product.product_id)
        .collect();

    let product_nutrients = ProductNutrient::find_by_product_ids(product_ids)
        .fetch_all(&mut txn)
        .await?;

    let ingredient_details: Vec<IngredientDetails> = ingredients
        .iter()
        .map(|i| IngredientDetails::new(i, &ingredient_products, &product_nutrients))
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
    payload: Json<CreateRecipePayload>,
    db_pool: Data<Pool<Postgres>>,
    auth_certificate: Data<Certificate>,
    request: HttpRequest,
) -> Result<Json<Recipe>, Error> {
    let user_id = authorize(request, &auth_certificate)?;

    let mut txn = db_pool.begin().await?;

    let product = Product::insert_recipe(&payload, user_id, &mut txn).await?;

    let custom_units =
        CustomUnit::insert_multiple(&payload.custom_units, product.id, &mut txn).await?;

    // ingredients

    let ingredients =
        Ingredient::insert_multiple(&payload.ingredients, product.id, &mut txn).await?;

    let mut temporary_to_final_id = HashMap::new();

    for (index, ingredient_payload) in payload.ingredients.iter().enumerate() {
        let ingredient = ingredients
            .get(index)
            .ok_or_else(|| Error::not_created("ingredient"))?;
        temporary_to_final_id.insert(ingredient_payload.id, ingredient.id);

        let _ingredient_products = IngredientProduct::insert_multiple(
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

    let product_ids = ingredient_products
        .iter()
        .map(|ingredient_product| ingredient_product.product_id)
        .collect();

    let product_nutrients = ProductNutrient::find_by_product_ids(product_ids)
        .fetch_all(&mut txn)
        .await?;

    let ingredient_details: Vec<IngredientDetails> = ingredients
        .iter()
        .map(|i| IngredientDetails::new(i, &ingredient_products, &product_nutrients))
        .collect();

    // directions

    let directions = Direction::insert_multiple(&payload.directions, product.id, &mut txn).await?;

    let mut direction_parts: Vec<DirectionPart> = Vec::new();

    for (index, direction_payload) in payload.directions.iter().enumerate() {
        let direction = directions
            .get(index)
            .ok_or_else(|| Error::not_created("direction"))?;

        let mut _direction_parts = DirectionPart::insert_multiple(
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
    payload: Json<UpdateRecipePayload>,
    db_pool: Data<Pool<Postgres>>,
    auth_certificate: Data<Certificate>,
    request: HttpRequest,
) -> Result<Json<Recipe>, Error> {
    let user_id = authorize(request, &auth_certificate)?;

    let mut txn = db_pool.begin().await?;

    // TODO: Might want to provide a better error when user_id doesn't match
    let product = Product::update_recipe(&payload, user_id, &mut txn).await?;

    let custom_units =
        CustomUnit::replace_multiple(&payload.custom_units, product.id, &mut txn).await?;

    // ingredients

    let ingredients =
        Ingredient::replace_multiple(&payload.ingredients, product.id, &mut txn).await?;

    let mut temporary_to_final_id = HashMap::new();

    for (index, ingredient_payload) in payload.ingredients.iter().enumerate() {
        let ingredient = ingredients
            .get(index)
            .ok_or_else(|| Error::not_updated("ingredient", ingredient_payload.id))?;
        temporary_to_final_id.insert(ingredient_payload.id, ingredient.id);

        let _ingredient_products = IngredientProduct::insert_multiple(
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

    let product_ids = ingredient_products
        .iter()
        .map(|ingredient_product| ingredient_product.product_id)
        .collect();

    let product_nutrients = ProductNutrient::find_by_product_ids(product_ids)
        .fetch_all(&mut txn)
        .await?;

    let ingredient_details: Vec<IngredientDetails> = ingredients
        .iter()
        .map(|i| IngredientDetails::new(i, &ingredient_products, &product_nutrients))
        .collect();

    // directions

    let directions = Direction::replace_multiple(&payload.directions, product.id, &mut txn).await?;

    let mut direction_parts: Vec<DirectionPart> = Vec::new();

    for (index, direction_payload) in payload.directions.iter().enumerate() {
        let direction = directions
            .get(index)
            .ok_or_else(|| Error::not_updated("direction", direction_payload.id))?;

        let mut _direction_parts = DirectionPart::insert_multiple(
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
