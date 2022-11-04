use serde::{Deserialize, Serialize};

use super::{foods::SurveyFoodItem, support_custom::FoodAttributeType};

//------------------------------------------------------------------------------
// Utility types
//------------------------------------------------------------------------------

#[derive(sqlx::FromRow, Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Nutrient {
    pub id: u32,
    pub number: String,
    pub name: String,
    pub rank: Option<u32>,
    pub unit_name: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct FoodNutrientSource {
    pub id: Option<i32>,
    pub code: Option<String>,
    pub description: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct FoodNutrientDerivation {
    pub id: Option<i32>,
    pub code: Option<String>,
    pub description: Option<String>,
    pub food_nutrient_source: FoodNutrientSource,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct NutrientAcquisitionDetails {
    pub sample_unit_id: i32,
    pub purchase_date: String,
    pub store_city: String,
    pub store_state: String,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct NutrientAnalysisDetails {
    pub sub_sample_id: i32,
    pub amount: f32,
    pub nutrient_id: i32,
    pub lab_method_description: String,
    pub lab_method_original_description: String,
    pub lab_method_link: String,
    pub lab_method_technique: String,
    pub nutrient_acquisition_details: Vec<NutrientAcquisitionDetails>,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct FoodNutrient {
    pub id: u32,
    pub amount: Option<f32>,
    pub data_points: Option<i32>,
    pub min: Option<f32>,
    pub max: Option<f32>,
    pub median: Option<f32>,
    #[serde(rename = "type")]
    pub _type: String,
    pub nutrient: Nutrient,
    pub food_nutrient_derivation: Option<FoodNutrientDerivation>,
    pub nutrient_analysis_details: Option<NutrientAnalysisDetails>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct FoodCategory {
    pub id: Option<i32>,
    pub code: Option<String>,
    pub description: String,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct FoodComponent {
    pub id: i32,
    pub name: String,
    pub data_points: i32,
    pub gram_weight: f32,
    pub is_refuse: bool,
    pub min_year_acquired: i32,
    pub percent_weight: f32,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct MeasureUnit {
    pub id: i32,
    pub abbreviation: String,
    pub name: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct FoodPortion {
    pub id: i32,
    pub amount: Option<f32>,
    pub data_points: Option<i32>,
    pub gram_weight: f32,
    pub min_year_acquired: Option<i32>,
    pub modifier: Option<String>,
    pub portion_description: Option<String>,
    pub sequence_number: i32,
    pub measure_unit: MeasureUnit,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct SampleFoodItem {
    pub fdc_id: i32,
    pub datatype: Option<String>,
    pub description: String,
    pub food_class: String,
    pub publication_date: String,
    pub food_attributes: Option<Vec<FoodCategory>>,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct InputFoodFoundation {
    pub id: i32,
    pub food_description: String,
    pub input_food: SampleFoodItem,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct NutrientConversionFactors {
    #[serde(rename = "type")]
    pub _type: String,
    pub value: Option<f32>,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct FoodAttribute {
    pub id: i32,
    pub sequence_number: Option<i32>,
    pub value: String,
    pub food_attribute_type: Option<FoodAttributeType>,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct InputFoodSurvey {
    pub id: i32,
    pub amount: f32,
    pub food_description: String,
    pub ingredient_code: i32,
    pub ingredient_description: String,
    pub ingredient_weight: f32,
    pub portion_code: String,
    pub portion_description: String,
    pub sequence_number: i32,
    pub survey_flag: Option<i32>,
    pub unit: String,
    pub input_food: Option<SurveyFoodItem>,
    pub retention_factor: Option<RetentionFactor>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct RetentionFactor {
    pub id: i32,
    pub code: i32,
    pub description: String,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct WweiaFoodCategory {
    pub wweia_food_category_code: i32,
    pub wweia_food_category_description: String,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct FoodUpdateLog {
    pub fdc_id: i32,
    pub available_date: Option<String>,
    pub brand_owner: Option<String>,
    pub data_source: Option<String>,
    pub data_type: String,
    pub description: String,
    pub food_class: String,
    pub gtin_upc: Option<String>,
    pub household_serving_full_text: Option<String>,
    pub ingredients: Option<String>,
    pub modified_date: Option<String>,
    pub publication_date: String,
    pub serving_size: Option<f32>,
    pub serving_size_unit: Option<String>,
    pub branded_food_category: Option<String>,
    pub changes: Option<String>,
    pub food_attributes: Vec<FoodAttribute>,
}
