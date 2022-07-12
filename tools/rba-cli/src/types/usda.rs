use serde::{Deserialize, Serialize};

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
pub struct AbridgedFoodNutrient {
    pub number: u32,
    pub name: String,
    pub amount: f32,
    pub unit_name: String,
    pub derivation_code: String,
    pub derivation_description: String,
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

//------------------------------------------------------------------------------
// Custom types (not directly taken from USDA spec)
//------------------------------------------------------------------------------

#[derive(Serialize, Deserialize, Debug)]
pub struct FoodAttributeType {
    pub id: i32,
    pub name: String,
    pub description: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct LabelNutrient {
    pub value: f32,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct LabelNutrients {
    pub fat: Option<LabelNutrient>,
    pub saturated_fat: Option<LabelNutrient>,
    pub trans_fat: Option<LabelNutrient>,
    pub cholesterol: Option<LabelNutrient>,
    pub sodium: Option<LabelNutrient>,
    pub carbohydrates: Option<LabelNutrient>,
    pub fiber: Option<LabelNutrient>,
    pub sugars: Option<LabelNutrient>,
    pub protein: Option<LabelNutrient>,
    pub calcium: Option<LabelNutrient>,
    pub iron: Option<LabelNutrient>,
    pub potassium: Option<LabelNutrient>,
    pub calories: Option<LabelNutrient>,
}

//------------------------------------------------------------------------------
// Food types
//------------------------------------------------------------------------------

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

//------------------------------------------------------------------------------
// Custom aggregator types (not directly taken from USDA spec)
//------------------------------------------------------------------------------

#[derive(Serialize, Deserialize, Debug)]
pub struct FoundationFoodData {
    #[serde(rename = "FoundationFoods")]
    pub foundation_foods: Vec<FoundationFoodItem>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct SurveyFoodData {
    #[serde(rename = "SurveyFoods")]
    pub survey_foods: Vec<SurveyFoodItem>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct SRLegacyFoodData {
    #[serde(rename = "SRLegacyFoods")]
    pub sr_legacy_foods: Vec<SRLegacyFoodItem>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct BrandedFoodData {
    #[serde(rename = "BrandedFoods")]
    pub branded_foods: Vec<BrandedFoodItem>,
}
