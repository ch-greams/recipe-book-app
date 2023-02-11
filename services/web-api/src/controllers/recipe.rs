use std::{collections::HashMap, iter::zip};

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
        ingredient::{Ingredient, IngredientDetailed},
        instruction::{Instruction, InstructionDetailed},
        instruction_ingredient::InstructionIngredient,
        meta::Nutrient,
        product::Product,
        product_nutrient::ProductNutrient,
        recipe::{CreateRecipePayload, Recipe, UpdateRecipePayload},
    },
};

pub fn scope() -> Scope {
    actix_web::web::scope("recipe")
        .service(find_by_id)
        .service(create_recipe)
    // .service(update_recipe)
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

    let product_nutrients = ProductNutrient::find_by_product_id(*id)
        .fetch_all(&mut txn)
        .await?
        .iter()
        .map(|pn| (pn.name.clone(), pn.amount))
        .collect::<HashMap<String, f32>>();

    // ingredients

    let ingredients = IngredientDetailed::find_by_recipe_id(*id)
        .fetch_all(&mut txn)
        .await?;

    // instructions

    let instructions = InstructionDetailed::find_by_recipe_id(*id)
        .fetch_all(&mut txn)
        .await?;

    let recipe = Recipe::new(
        product,
        &product_nutrients,
        custom_units,
        ingredients,
        &instructions,
    );

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

    let meta_nutrients = Nutrient::get_nutrients().fetch_all(&mut txn).await?;

    let defined_nutrients: HashMap<String, f32> = payload
        .nutrients
        .clone()
        .into_iter()
        .filter_map(|(nutrient_name, opt_value)| opt_value.map(|value| (nutrient_name, value)))
        .collect();

    ProductNutrient::insert_multiple(&defined_nutrients, &meta_nutrients, product.id, &mut txn)
        .await?;

    // ingredients

    Ingredient::insert_multiple(&payload.ingredients, product.id, &mut txn).await?;

    let ingredients = IngredientDetailed::find_by_recipe_id(product.id)
        .fetch_all(&mut txn)
        .await?;

    // instructions

    let created_instructions =
        Instruction::insert_multiple(&payload.instructions, product.id, &mut txn).await?;

    let instruction_ingredients_to_create: Vec<InstructionIngredient> =
        zip(&created_instructions, &payload.instructions)
            .flat_map(|(ci, ip)| InstructionIngredient::from_created_instructions(ci, ip))
            .collect();

    let created_instruction_ingredients =
        InstructionIngredient::insert_multiple(&instruction_ingredients_to_create, &mut txn)
            .await?;

    let instructions_detailed = created_instructions
        .into_iter()
        .map(|created_instruction| {
            let instruction_ingredients = created_instruction_ingredients
                .clone()
                .into_iter()
                .filter(|ii| ii.instruction_id == created_instruction.id)
                .collect::<Vec<InstructionIngredient>>();

            InstructionDetailed::new(&created_instruction, &instruction_ingredients)
        })
        .collect::<Vec<InstructionDetailed>>();

    txn.commit().await?;

    let recipe = Recipe::new(
        product,
        &defined_nutrients,
        custom_units,
        ingredients,
        &instructions_detailed,
    );

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

    let meta_nutrients = Nutrient::get_nutrients().fetch_all(&mut txn).await?;

    let defined_nutrients: HashMap<String, f32> = payload
        .nutrients
        .clone()
        .into_iter()
        .filter_map(|(nutrient_name, opt_value)| opt_value.map(|value| (nutrient_name, value)))
        .collect();

    println!("defined_nutrients: {defined_nutrients:?}");

    ProductNutrient::replace_multiple(&defined_nutrients, &meta_nutrients, product.id, &mut txn)
        .await?;

    // ingredients

    Ingredient::replace_multiple(&payload.ingredients, product.id, &mut txn).await?;

    let ingredients = IngredientDetailed::find_by_recipe_id(product.id)
        .fetch_all(&mut txn)
        .await?;

    // instructions

    let created_instructions =
        Instruction::replace_multiple(&payload.instructions, product.id, &mut txn).await?;

    let instruction_ingredients_to_create: Vec<InstructionIngredient> =
        zip(&created_instructions, &payload.instructions)
            .flat_map(|(ci, ip)| InstructionIngredient::from_updated_instructions(ci, ip))
            .collect();

    // NOTE: No need to replace instruction_ingredients, cascade delete of instructions will take care of it
    let created_instruction_ingredients =
        InstructionIngredient::insert_multiple(&instruction_ingredients_to_create, &mut txn)
            .await?;

    let instructions_detailed = created_instructions
        .into_iter()
        .map(|created_instruction| {
            let instruction_ingredients = created_instruction_ingredients
                .clone()
                .into_iter()
                .filter(|ii| ii.instruction_id == created_instruction.id)
                .collect::<Vec<InstructionIngredient>>();

            InstructionDetailed::new(&created_instruction, &instruction_ingredients)
        })
        .collect::<Vec<InstructionDetailed>>();

    txn.commit().await?;

    let recipe = Recipe::new(
        product,
        &defined_nutrients,
        custom_units,
        ingredients,
        &instructions_detailed,
    );

    Ok(Json(recipe))
}
