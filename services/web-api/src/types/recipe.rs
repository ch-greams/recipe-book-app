use super::custom_unit::CustomUnit;
use super::direction::DirectionDetails;
use super::ingredient::IngredientDetails;
use super::product::Product;

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
        }
    }
}

#[derive(Deserialize, Serialize)]
pub struct RecipeShort {
    pub id: i64,
    pub name: String,
    pub brand: String,
    pub subtitle: String,
}

impl RecipeShort {
    pub fn new(product: &Product) -> Self {
        Self {
            id: product.id,
            name: product.name.to_owned(),
            brand: product.brand.to_owned(),
            subtitle: product.subtitle.to_owned(),
        }
    }
}
