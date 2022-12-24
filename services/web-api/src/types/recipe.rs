use super::custom_unit::{CreateCustomUnitPayload, CustomUnit, UpdateCustomUnitPayload};
use super::direction::{CreateDirectionPayload, DirectionDetails, UpdateDirectionPayload};
use super::ingredient::{CreateIngredientPayload, IngredientDetails, UpdateIngredientPayload};
use super::product::Product;

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
pub struct Recipe {
    pub id: i64,
    pub name: String,
    pub brand: String,
    pub description: String,
    pub density: f64,
    pub serving_size: f64,
    pub custom_units: Vec<CustomUnit>,
    pub ingredients: Vec<IngredientDetails>,
    pub directions: Vec<DirectionDetails>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub is_private: bool,
}

#[derive(Deserialize, Serialize, Clone, Debug)]
pub struct CreateRecipePayload {
    pub name: String,
    pub brand: String,
    pub description: String,
    pub density: f64,
    pub serving_size: f64,
    pub custom_units: Vec<CreateCustomUnitPayload>,
    pub ingredients: Vec<CreateIngredientPayload>,
    pub directions: Vec<CreateDirectionPayload>,
    pub is_private: bool,
}

#[derive(Deserialize, Serialize, Clone, Debug)]
pub struct UpdateRecipePayload {
    pub id: i64,
    pub name: String,
    pub brand: String,
    pub description: String,
    pub density: f64,
    pub serving_size: f64,
    pub custom_units: Vec<UpdateCustomUnitPayload>,
    pub ingredients: Vec<UpdateIngredientPayload>,
    pub directions: Vec<UpdateDirectionPayload>,
    pub is_private: bool,
}

impl Recipe {
    pub fn new(
        product: Product,
        custom_units: Vec<CustomUnit>,
        ingredients: Vec<IngredientDetails>,
        directions: Vec<DirectionDetails>,
    ) -> Self {
        Self {
            id: product.id,
            name: product.name,
            brand: product.brand,
            description: product.description,
            density: product.density,
            serving_size: product.serving_size,
            custom_units,
            ingredients,
            directions,
            created_at: product.created_at,
            updated_at: product.updated_at,
            is_private: product.is_private,
        }
    }
}
