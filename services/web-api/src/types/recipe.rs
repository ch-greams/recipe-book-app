use super::custom_unit::{CreateCustomUnitPayload, CustomUnit};
use super::direction::{CreateDirectionPayload, DirectionDetails};
use super::ingredient::{CreateIngredientPayload, IngredientDetails};
use super::product::Product;

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
pub struct Recipe {
    pub id: i64,
    pub name: String,
    pub brand: String,
    pub subtitle: String,
    pub description: String,
    pub density: f64,
    pub custom_units: Vec<CustomUnit>,
    pub ingredients: Vec<IngredientDetails>,
    pub directions: Vec<DirectionDetails>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Deserialize, Serialize, Clone, Debug)]
pub struct CreateRecipePayload {
    pub name: String,
    pub brand: String,
    pub subtitle: String,
    pub description: String,
    pub density: f64,
    pub custom_units: Vec<CreateCustomUnitPayload>,
    pub ingredients: Vec<CreateIngredientPayload>,
    pub directions: Vec<CreateDirectionPayload>,
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
            subtitle: product.subtitle,
            description: product.description,
            density: product.density,
            custom_units,
            ingredients,
            directions,
            created_at: product.created_at,
            updated_at: product.updated_at,
        }
    }
}

#[derive(Deserialize, Serialize)]
pub struct RecipeShort {
    pub id: i64,
    pub name: String,
    pub brand: String,
    pub subtitle: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl RecipeShort {
    pub fn new(product: &Product) -> Self {
        Self {
            id: product.id,
            name: product.name.to_owned(),
            brand: product.brand.to_owned(),
            subtitle: product.subtitle.to_owned(),
            created_at: product.created_at,
            updated_at: product.updated_at,
        }
    }
}
