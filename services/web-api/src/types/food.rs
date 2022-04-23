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
    pub nutrition_facts: CreateNutritionFactsPayload,
    pub custom_units: Vec<CreateCustomUnitPayload>,
    pub is_private: bool,
}

#[derive(Deserialize, Serialize, Clone, Debug)]
pub struct CreateCustomUnitPayload {
    pub name: String,
    pub amount: f64,
    pub unit: String,
}

#[derive(Deserialize, Serialize, Clone, Debug)]
pub struct CreateNutritionFactsPayload {
    pub energy: Option<f64>,
    pub carbohydrate: Option<f64>,
    pub dietary_fiber: Option<f64>,
    pub starch: Option<f64>,
    pub sugars: Option<f64>,
    pub fat: Option<f64>,
    pub monounsaturated: Option<f64>,
    pub polyunsaturated: Option<f64>,
    pub omega_3: Option<f64>,
    pub omega_6: Option<f64>,
    pub saturated: Option<f64>,
    pub trans_fats: Option<f64>,
    pub cholesterol: Option<f64>,
    pub phytosterol: Option<f64>,
    pub protein: Option<f64>,
    pub tryptophan: Option<f64>,
    pub threonine: Option<f64>,
    pub isoleucine: Option<f64>,
    pub leucine: Option<f64>,
    pub lysine: Option<f64>,
    pub methionine: Option<f64>,
    pub cystine: Option<f64>,
    pub phenylalanine: Option<f64>,
    pub tyrosine: Option<f64>,
    pub valine: Option<f64>,
    pub arginine: Option<f64>,
    pub histidine: Option<f64>,
    pub alanine: Option<f64>,
    pub aspartic_acid: Option<f64>,
    pub glutamic_acid: Option<f64>,
    pub glycine: Option<f64>,
    pub proline: Option<f64>,
    pub serine: Option<f64>,
    pub hydroxyproline: Option<f64>,
    pub vitamin_a: Option<f64>,
    pub vitamin_c: Option<f64>,
    pub vitamin_d: Option<f64>,
    pub vitamin_e: Option<f64>,
    pub vitamin_k: Option<f64>,
    pub vitamin_b1: Option<f64>,
    pub vitamin_b2: Option<f64>,
    pub vitamin_b3: Option<f64>,
    pub vitamin_b5: Option<f64>,
    pub vitamin_b6: Option<f64>,
    pub vitamin_b9: Option<f64>,
    pub vitamin_b12: Option<f64>,
    pub choline: Option<f64>,
    pub betaine: Option<f64>,
    pub calcium: Option<f64>,
    pub iron: Option<f64>,
    pub magnesium: Option<f64>,
    pub phosphorus: Option<f64>,
    pub potassium: Option<f64>,
    pub sodium: Option<f64>,
    pub zinc: Option<f64>,
    pub copper: Option<f64>,
    pub manganese: Option<f64>,
    pub selenium: Option<f64>,
    pub fluoride: Option<f64>,
    pub chromium: Option<f64>,
    pub iodine: Option<f64>,
    pub molybdenum: Option<f64>,
    pub alcohol: Option<f64>,
    pub water: Option<f64>,
    pub ash: Option<f64>,
    pub caffeine: Option<f64>,
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
            is_private: product.is_private,
            created_at: product.created_at,
            updated_at: product.updated_at,
        }
    }
}

#[derive(Deserialize, Serialize)]
pub struct FoodShort {
    pub id: i64,
    pub name: String,
    pub brand: String,
    pub subtitle: String,
    pub is_private: bool,
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
            is_private: product.is_private,
            created_at: product.created_at,
            updated_at: product.updated_at,
        }
    }
}
