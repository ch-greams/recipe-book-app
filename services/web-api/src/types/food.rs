use serde::{Deserialize, Serialize};

use super::{custom_unit::CustomUnit, nutrition_facts::NutritionFacts, product::Product};

#[derive(Deserialize, Serialize)]
pub struct Food {
    pub id: i64,
    pub name: String,
    pub brand: Option<String>,
    pub subtitle: Option<String>,
    pub description: Option<String>,
    pub density: f64,
    pub nutrition_facts: NutritionFacts,
    pub custom_units: Vec<CustomUnit>,
}

impl Food {
    pub fn new(
        product: &Product,
        nutrition_facts: &NutritionFacts,
        custom_units: Vec<CustomUnit>,
    ) -> Self {
        Self {
            id: product.id,
            name: product.name.to_owned(),
            brand: product.brand.to_owned(),
            subtitle: product.subtitle.to_owned(),
            description: product.description.to_owned(),
            density: product.density,
            nutrition_facts: nutrition_facts.to_owned(),
            custom_units,
        }
    }
}

#[derive(Deserialize, Serialize)]
pub struct FoodShort {
    pub id: i64,
    pub name: String,
    pub brand: Option<String>,
    pub subtitle: Option<String>,
}

impl FoodShort {
    pub fn new(product: &Product) -> Self {
        Self {
            id: product.id,
            name: product.name.to_owned(),
            brand: product.brand.to_owned(),
            subtitle: product.subtitle.to_owned(),
        }
    }
}
