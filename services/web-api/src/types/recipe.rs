use super::custom_unit::CustomUnit;
use super::direction::DirectionDetails;
use super::ingredient::IngredientDetails;
use super::product::Product;

use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
pub struct Recipe {
    pub id: i64,
    pub name: String,
    pub brand: Option<String>,
    pub subtitle: Option<String>,
    pub description: Option<String>,
    pub density: f64,
    #[serde(rename = "customUnits")]
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
        Recipe {
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
