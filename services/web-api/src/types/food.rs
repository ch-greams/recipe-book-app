use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

use super::{custom_unit::CustomUnit, nutrition_facts::NutritionFacts, product::Product};

#[derive(Deserialize, Serialize, Debug)]
pub struct Food {
    pub id: i64,
    pub name: String,
    pub brand: String,
    pub subtitle: String,
    pub description: String,
    pub density: f64,
    pub nutrition_facts: NutritionFacts,
    pub custom_units: Vec<CustomUnit>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
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
            created_at: product.created_at,
            updated_at: product.updated_at,
        }
    }

    pub fn get_product(&self, user_id: i64) -> Product {
        Product {
            id: 0,
            name: self.name.clone(),
            brand: self.brand.clone(),
            subtitle: self.subtitle.clone(),
            description: self.description.clone(),
            density: self.density,
            created_by: user_id,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        }
    }

    pub fn get_custom_units(&self, product_id: i64) -> Vec<CustomUnit> {
        self.custom_units
            .iter()
            .map(|cu| CustomUnit {
                name: cu.name.clone(),
                amount: cu.amount,
                unit: cu.unit.clone(),
                product_id,
            })
            .collect()
    }
}

#[derive(Deserialize, Serialize)]
pub struct FoodShort {
    pub id: i64,
    pub name: String,
    pub brand: String,
    pub subtitle: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl FoodShort {
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
