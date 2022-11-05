use std::collections::HashMap;

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

use super::{
    custom_unit::{CreateCustomUnitPayload, CustomUnit, UpdateCustomUnitPayload},
    product::Product,
};

#[derive(Deserialize, Serialize, Debug)]
pub struct Food {
    pub id: i64,
    pub name: String,
    pub brand: String,
    pub subtitle: String,
    pub description: String,
    pub density: f64,
    pub serving_size: f64,
    pub nutrients: HashMap<String, f32>,
    pub custom_units: Vec<CustomUnit>,
    pub is_private: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Deserialize, Serialize, Clone, Debug)]
pub struct CreateFoodPayload {
    pub name: String,
    pub brand: String,
    pub subtitle: String,
    pub description: String,
    pub density: f64,
    pub serving_size: f64,
    pub nutrients: HashMap<String, f32>,
    pub custom_units: Vec<CreateCustomUnitPayload>,
    pub is_private: bool,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct UpdateFoodPayload {
    pub id: i64,
    pub name: String,
    pub brand: String,
    pub subtitle: String,
    pub description: String,
    pub density: f64,
    pub serving_size: f64,
    pub nutrients: HashMap<String, f32>,
    pub custom_units: Vec<UpdateCustomUnitPayload>,
    pub is_private: bool,
}

impl Food {
    pub fn new(
        product: &Product,
        nutrients: &HashMap<String, f32>,
        custom_units: Vec<CustomUnit>,
    ) -> Self {
        Self {
            id: product.id,
            name: product.name.to_owned(),
            brand: product.brand.to_owned(),
            subtitle: product.subtitle.to_owned(),
            description: product.description.to_owned(),
            density: product.density,
            serving_size: product.serving_size,
            nutrients: nutrients.to_owned(),
            custom_units,
            is_private: product.is_private,
            created_at: product.created_at,
            updated_at: product.updated_at,
        }
    }
}
