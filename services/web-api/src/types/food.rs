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
    #[serde(rename = "nutritionFacts")]
    pub nutrition_facts: NutritionFacts,
    #[serde(rename = "customUnits")]
    pub custom_units: Vec<CustomUnit>,
}

impl Food {
    pub fn new(
        product: &Product,
        nutrition_facts: &NutritionFacts,
        custom_units: Vec<CustomUnit>,
    ) -> Self {
        Food {
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
