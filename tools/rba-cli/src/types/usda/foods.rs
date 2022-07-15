use serde::{Deserialize, Serialize};

use super::{
    support::{
        AbridgedFoodNutrient, FoodAttribute, FoodCategory, FoodComponent, FoodNutrient,
        FoodPortion, FoodUpdateLog, InputFoodFoundation, InputFoodSurvey,
        NutrientConversionFactors, WweiaFoodCategory,
    },
    support_custom::LabelNutrients,
};

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct FoundationFoodItem {
    pub fdc_id: i32,
    pub data_type: String,
    pub description: String,
    pub food_class: String,
    pub foot_note: Option<String>,
    pub is_historical_reference: bool,
    pub ndb_number: i32,
    pub publication_date: String,
    pub scientific_name: Option<String>,
    pub food_category: FoodCategory,
    pub food_components: Option<Vec<FoodComponent>>,
    pub food_nutrients: Vec<FoodNutrient>,
    pub food_portions: Vec<FoodPortion>,
    pub input_foods: Vec<InputFoodFoundation>,
    pub nutrient_conversion_factors: Vec<NutrientConversionFactors>,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct AbridgedFoodItem {
    pub data_type: String,
    pub description: String,
    pub fdc_id: i32,
    pub food_nutrients: Vec<AbridgedFoodNutrient>,
    pub publication_date: String,
    pub brand_owner: String,
    pub gtin_upc: String,
    pub ndb_number: i32,
    pub food_code: String,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct BrandedFoodItem {
    pub fdc_id: i32,
    pub available_date: Option<String>,
    pub brand_owner: String,
    pub brand_name: Option<String>,
    pub subbrand_name: Option<String>,
    pub data_source: String,
    pub data_type: String,
    pub description: String,
    pub food_class: String,
    pub gtin_upc: String,
    pub household_serving_full_text: Option<String>,
    pub ingredients: String,
    pub modified_date: Option<String>,
    pub publication_date: String,
    pub serving_size: Option<f32>,
    pub serving_size_unit: Option<String>,
    pub preparation_state_code: Option<String>,
    pub branded_food_category: String,
    pub trade_channel: Option<Vec<String>>,
    pub gpc_class_code: Option<i32>,
    pub food_nutrients: Vec<FoodNutrient>,
    pub food_update_log: Vec<FoodUpdateLog>,
    pub label_nutrients: LabelNutrients,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct SRLegacyFoodItem {
    pub fdc_id: i32,
    pub data_type: String,
    pub description: String,
    pub food_class: String,
    pub is_historical_reference: bool,
    pub ndb_number: i32,
    pub publication_date: String,
    pub scientific_name: Option<String>,
    pub food_category: FoodCategory,
    pub food_nutrients: Vec<FoodNutrient>,
    pub food_portions: Vec<FoodPortion>,
    pub nutrient_conversion_factors: Vec<NutrientConversionFactors>,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct SurveyFoodItem {
    pub fdc_id: i32,
    pub datatype: Option<String>,
    pub description: String,
    pub end_date: String,
    pub food_class: String,
    pub food_code: String,
    pub publication_date: String,
    pub start_date: String,
    pub food_attributes: Vec<FoodAttribute>,
    pub food_portions: Vec<FoodPortion>,
    pub input_foods: Vec<InputFoodSurvey>,
    pub wweia_food_category: WweiaFoodCategory,
    pub food_nutrients: Vec<FoodNutrient>,
}
