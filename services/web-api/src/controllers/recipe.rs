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
        food::Food,
        food_nutrient::FoodNutrient,
        ingredient::{Ingredient, IngredientDetailed},
        instruction::{Instruction, InstructionDetailed},
        instruction_ingredient::InstructionIngredient,
        meta::Nutrient,
        recipe::{CreateRecipePayload, RecipeDetailed, UpdateRecipePayload},
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
) -> Result<Json<RecipeDetailed>, Error> {
    let user_id = get_user(request, &auth_certificate);

    let mut txn = db_pool.begin().await?;

    let food = Food::find_by_id(*id, user_id)
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

    // ingredients

    let ingredients = if food.is_recipe {
        IngredientDetailed::find_by_recipe_id(*id)
            .fetch_all(&mut txn)
            .await?
    } else {
        Vec::new()
    };

    // instructions

    let instructions = if food.is_recipe {
        InstructionDetailed::find_by_recipe_id(*id)
            .fetch_all(&mut txn)
            .await?
    } else {
        Vec::new()
    };

    let recipe = RecipeDetailed::new(
        food,
        &food_nutrients,
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
) -> Result<Json<RecipeDetailed>, Error> {
    let user_id = authorize(request, &auth_certificate)?;

    let mut txn = db_pool.begin().await?;

    let food = Food::insert(&payload.to_owned().into(), true, user_id, &mut txn).await?;

    let custom_units =
        CustomUnit::insert_multiple(&payload.custom_units, food.id, &mut txn).await?;

    let defined_nutrients: HashMap<String, f32> = payload
        .nutrients
        .clone()
        .into_iter()
        .filter_map(|(nutrient_name, opt_value)| opt_value.map(|value| (nutrient_name, value)))
        .collect();

    if !defined_nutrients.is_empty() {
        let meta_nutrients = Nutrient::get_nutrients().fetch_all(&mut txn).await?;

        FoodNutrient::insert_multiple(&defined_nutrients, &meta_nutrients, food.id, &mut txn)
            .await?;
    }

    // ingredients

    let ingredients = if payload.ingredients.is_empty() {
        Vec::new()
    } else {
        Ingredient::insert_multiple(&payload.ingredients, food.id, &mut txn).await?;

        IngredientDetailed::find_by_recipe_id(food.id)
            .fetch_all(&mut txn)
            .await?
    };

    // instructions

    let instructions_detailed: Vec<InstructionDetailed> = if payload.instructions.is_empty() {
        Vec::new()
    } else {
        let created_instructions =
            Instruction::insert_multiple(&payload.instructions, food.id, &mut txn).await?;

        let instruction_ingredients_to_create: Vec<InstructionIngredient> =
            zip(&created_instructions, &payload.instructions)
                .flat_map(|(ci, ip)| InstructionIngredient::from_created_instructions(ci, ip))
                .collect();

        let created_instruction_ingredients =
            InstructionIngredient::insert_multiple(&instruction_ingredients_to_create, &mut txn)
                .await?;

        created_instructions
            .into_iter()
            .map(|created_instruction| {
                let instruction_ingredients = created_instruction_ingredients
                    .clone()
                    .into_iter()
                    .filter(|ii| ii.instruction_id == created_instruction.id)
                    .collect::<Vec<InstructionIngredient>>();

                InstructionDetailed::new(&created_instruction, &instruction_ingredients)
            })
            .collect()
    };

    txn.commit().await?;

    let recipe = RecipeDetailed::new(
        food,
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
) -> Result<Json<RecipeDetailed>, Error> {
    let user_id = authorize(request, &auth_certificate)?;

    let mut txn = db_pool.begin().await?;

    // TODO: Might want to provide a better error when user_id doesn't match
    let food = Food::update(&payload.to_owned().into(), true, user_id, &mut txn).await?;

    let custom_units =
        CustomUnit::replace_multiple(&payload.custom_units, food.id, &mut txn).await?;

    let defined_nutrients: HashMap<String, f32> = payload
        .nutrients
        .clone()
        .into_iter()
        .filter_map(|(nutrient_name, opt_value)| opt_value.map(|value| (nutrient_name, value)))
        .collect();

    let meta_nutrients = Nutrient::get_nutrients().fetch_all(&mut txn).await?;

    FoodNutrient::replace_multiple(&defined_nutrients, &meta_nutrients, food.id, &mut txn).await?;

    // ingredients

    Ingredient::replace_multiple(&payload.ingredients, food.id, &mut txn).await?;

    let ingredients = IngredientDetailed::find_by_recipe_id(food.id)
        .fetch_all(&mut txn)
        .await?;

    // instructions

    let created_instructions =
        Instruction::replace_multiple(&payload.instructions, food.id, &mut txn).await?;

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

    let recipe = RecipeDetailed::new(
        food,
        &defined_nutrients,
        custom_units,
        ingredients,
        &instructions_detailed,
    );

    Ok(Json(recipe))
}
