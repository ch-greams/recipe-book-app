use std::collections::HashMap;

use super::custom_unit::{CreateCustomUnitPayload, CustomUnit, UpdateCustomUnitPayload};
use super::food::Food;
use super::ingredient::{IngredientDetailed, IngredientPayload};
use super::instruction::{InstructionDetailed, InstructionPayload};

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
pub struct RecipeDetailed {
    pub id: i64,
    pub name: String,
    pub brand: String,
    pub description: String,
    pub density: f64,
    pub serving_size: f64,
    pub nutrients: HashMap<String, f32>,
    pub custom_units: Vec<CustomUnit>,
    pub ingredients: Vec<IngredientDetailed>,
    pub instructions: Vec<InstructionDetailed>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub is_private: bool,
    pub is_recipe: bool,
}

#[derive(Deserialize, Serialize, Clone, Debug)]
pub struct CreateRecipePayload {
    pub name: String,
    pub brand: String,
    pub description: String,
    pub density: f64,
    pub serving_size: f64,
    pub nutrients: HashMap<String, Option<f32>>,
    pub custom_units: Vec<CreateCustomUnitPayload>,
    pub ingredients: Vec<IngredientPayload>,
    pub instructions: Vec<InstructionPayload>,
    pub is_private: bool,
    pub is_recipe: bool,
}

#[derive(Deserialize, Serialize, Clone, Debug)]
pub struct UpdateRecipePayload {
    pub id: i64,
    pub name: String,
    pub brand: String,
    pub description: String,
    pub density: f64,
    pub serving_size: f64,
    pub nutrients: HashMap<String, Option<f32>>,
    pub custom_units: Vec<UpdateCustomUnitPayload>,
    pub ingredients: Vec<IngredientPayload>,
    pub instructions: Vec<InstructionPayload>,
    pub is_private: bool,
    pub is_recipe: bool,
}

impl RecipeDetailed {
    pub fn new(
        food: Food,
        nutrients: &HashMap<String, f32>,
        custom_units: Vec<CustomUnit>,
        ingredients: Vec<IngredientDetailed>,
        instructions: &[InstructionDetailed],
    ) -> Self {
        Self {
            id: food.id,
            name: food.name,
            brand: food.brand,
            description: food.description,
            density: food.density,
            serving_size: food.serving_size,
            nutrients: nutrients.to_owned(),
            custom_units,
            ingredients,
            instructions: instructions.to_vec(),
            created_at: food.created_at,
            updated_at: food.updated_at,
            is_private: food.is_private,
            is_recipe: food.is_recipe,
        }
    }
}
