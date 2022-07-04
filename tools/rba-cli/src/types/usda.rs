use serde::{Deserialize};


//------------------------------------------------------------------------------
// Utility types
//------------------------------------------------------------------------------

#[derive(Deserialize, Debug)]
pub struct Nutrient {
    pub id: u32,
    pub number: String,
    pub name: String,
    pub rank: Option<u32>,
    #[serde(rename = "unitName")]
    pub unit_name: Option<String>,
}

#[derive(Deserialize, Debug)]
pub struct FoodNutrientSource {
    pub id: Option<i32>,
    pub code: Option<String>,
    pub description: Option<String>,
}

#[derive(Deserialize, Debug)]
pub struct FoodNutrientDerivation {
    pub id: Option<i32>,
    pub code: Option<String>,
    pub description: Option<String>,
    #[serde(rename = "foodNutrientSource")]
    pub food_nutrient_source: FoodNutrientSource,
}

#[derive(Deserialize, Debug)]
pub struct NutrientAcquisitionDetails {
    #[serde(rename = "sampleUnitId")]
    pub sample_unit_id: i32,
    #[serde(rename = "purchaseDate")]
    pub purchase_date: String,
    #[serde(rename = "storeCity")]
    pub store_city: String,
    #[serde(rename = "storeState")]
    pub store_state: String,
}

#[derive(Deserialize, Debug)]
pub struct NutrientAnalysisDetails {
    #[serde(rename = "subSampleId")]
    pub sub_sample_id: i32,
    pub amount: f32,
    #[serde(rename = "nutrientId")]
    pub nutrient_id: i32,
    #[serde(rename = "labMethodDescription")]
    pub lab_method_description: String,
    #[serde(rename = "labMethodOriginalDescription")]
    pub lab_method_original_description: String,
    #[serde(rename = "labMethodLink")]
    pub lab_method_link: String,
    #[serde(rename = "labMethodTechnique")]
    pub lab_method_technique: String,
    #[serde(rename = "nutrientAcquisitionDetails")]
    pub nutrient_acquisition_details: Vec<NutrientAcquisitionDetails>,
}

#[derive(Deserialize, Debug)]
pub struct FoodNutrient {
    pub id: u32,
    pub amount: Option<f32>,
    #[serde(rename = "dataPoints")]
    pub data_points: Option<i32>,
    pub min: Option<f32>,
    pub max: Option<f32>,
    pub median: Option<f32>,
    #[serde(rename = "type")]
    pub _type: String,
    pub nutrient: Nutrient,
    #[serde(rename = "foodNutrientDerivation")]
    pub food_nutrient_derivation: FoodNutrientDerivation,
    #[serde(rename = "nutrientAnalysisDetails")]
    pub nutrient_analysis_details: Option<NutrientAnalysisDetails>,
}

#[derive(Deserialize, Debug)]
pub struct FoodCategory {
    pub id: Option<i32>,
    pub code: Option<String>,
    pub description: String,
}

#[derive(Deserialize, Debug)]
pub struct FoodComponent {
    pub id: i32,
    pub name: String,
    #[serde(rename = "dataPoints")]
    pub data_points: i32,
    #[serde(rename = "gramWeight")]
    pub gram_weight: f32,
    #[serde(rename = "isRefuse")]
    pub is_refuse: bool,
    #[serde(rename = "minYearAcquired")]
    pub min_year_acquired: i32,
    #[serde(rename = "percentWeight")]
    pub percent_weight: f32,
}

#[derive(Deserialize, Debug)]
pub struct MeasureUnit {
    pub id: i32,
    pub abbreviation: String,
    pub name: String,
}

#[derive(Deserialize, Debug)]
pub struct FoodPortion {
    pub id: i32,
    pub amount: Option<f32>,
    #[serde(rename = "dataPoints")]
    pub data_points: Option<i32>,
    #[serde(rename = "gramWeight")]
    pub gram_weight: f32,
    #[serde(rename = "minYearAcquired")]
    pub min_year_acquired: Option<i32>,
    pub modifier: Option<String>,
    #[serde(rename = "portionDescription")]
    pub portion_description: Option<String>,
    #[serde(rename = "sequenceNumber")]
    pub sequence_number: i32,
    #[serde(rename = "measureUnit")]
    pub measure_unit: MeasureUnit,
}

#[derive(Deserialize, Debug)]
pub struct SampleFoodItem {
    #[serde(rename = "fdcId")]
    pub fdc_id: i32,
    pub datatype: Option<String>,
    pub description: String,
    #[serde(rename = "foodClass")]
    pub food_class: String,
    #[serde(rename = "publicationDate")]
    pub publication_date: String,
    #[serde(rename = "foodAttributes")]
    pub food_attributes: Option<Vec<FoodCategory>>,
}

#[derive(Deserialize, Debug)]
pub struct InputFoodFoundation {
    pub id: i32,
    #[serde(rename = "foodDescription")]
    pub food_description: String,
    #[serde(rename = "inputFood")]
    pub input_food: SampleFoodItem,
}

#[derive(Deserialize, Debug)]
pub struct NutrientConversionFactors {
    #[serde(rename = "type")]
    pub _type: String,
    pub value: Option<f32>,
}

#[derive(Deserialize, Debug)]
pub struct AbridgedFoodNutrient {
    pub number: u32,
    pub name: String,
    pub amount: f32,
    #[serde(rename = "unitName")]
    pub unit_name: String,
    #[serde(rename = "derivationCode")]
    pub derivation_code: String,
    #[serde(rename = "derivationDescription")]
    pub derivation_description: String,
}

#[derive(Deserialize, Debug)]
pub struct FoodAttribute {
    pub id: i32,
    #[serde(rename = "sequenceNumber")]
    pub sequence_number: Option<i32>,
    pub value: String,
    #[serde(rename = "FoodAttributeType")]
    pub food_attribute_type: Option<FoodAttributeType>,
}

#[derive(Deserialize, Debug)]
pub struct InputFoodSurvey {
    pub id: i32,
    pub amount: f32,
    #[serde(rename = "foodDescription")]
    pub food_description: String,
    #[serde(rename = "ingredientCode")]
    pub ingredient_code: i32,
    #[serde(rename = "ingredientDescription")]
    pub ingredient_description: String,
    #[serde(rename = "ingredientWeight")]
    pub ingredient_weight: f32,
    #[serde(rename = "portionCode")]
    pub portion_code: String,
    #[serde(rename = "portionDescription")]
    pub portion_description: String,
    #[serde(rename = "sequenceNumber")]
    pub sequence_number: i32,
    #[serde(rename = "surveyFlag")]
    pub survey_flag: Option<i32>,
    pub unit: String,
    #[serde(rename = "inputFood")]
    pub input_food: Option<SurveyFoodItem>,
    #[serde(rename = "retentionFactor")]
    pub retention_factor: Option<RetentionFactor>,
}

#[derive(Deserialize, Debug)]
pub struct RetentionFactor {
    pub id: i32,
    pub code: i32,
    pub description: String,
}


#[derive(Deserialize, Debug)]
pub struct WweiaFoodCategory {
    #[serde(rename = "wweiaFoodCategoryCode")]
    pub wweia_food_category_code: i32,
    #[serde(rename = "wweiaFoodCategoryDescription")]
    pub wweia_food_category_description: String,
}

#[derive(Deserialize, Debug)]
pub struct FoodUpdateLog {
    #[serde(rename = "fdcId")]
    pub fdc_id: i32,
    #[serde(rename = "availableDate")]
    pub available_date: Option<String>,
    #[serde(rename = "brandOwner")]
    pub brand_owner: Option<String>,
    #[serde(rename = "dataSource")]
    pub data_source: Option<String>,
    #[serde(rename = "dataType")]
    pub data_type: String,
    pub description: String,
    #[serde(rename = "foodClass")]
    pub food_class: String,
    #[serde(rename = "gtinUpc")]
    pub gtin_upc: Option<String>,
    #[serde(rename = "householdServingFullText")]
    pub household_serving_full_text: Option<String>,
    pub ingredients: Option<String>,
    #[serde(rename = "modifiedDate")]
    pub modified_date: Option<String>,
    #[serde(rename = "publicationDate")]
    pub publication_date: String,
    #[serde(rename = "servingSize")]
    pub serving_size: Option<f32>,
    #[serde(rename = "servingSizeUnit")]
    pub serving_size_unit: Option<String>,
    #[serde(rename = "brandedFoodCategory")]
    pub branded_food_category: Option<String>,
    pub changes: Option<String>,
    #[serde(rename = "foodAttributes")]
    pub food_attributes: Vec<FoodAttribute>,  
}

//------------------------------------------------------------------------------
// Custom types (not directly taken from USDA spec)
//------------------------------------------------------------------------------

#[derive(Deserialize, Debug)]
pub struct FoodAttributeType {
    pub id: i32,
    pub name: String,
    pub description: String,
}

#[derive(Deserialize, Debug)]
pub struct LabelNutrient {
    pub value: f32,
}

#[derive(Deserialize, Debug)]
pub struct LabelNutrients {
    pub fat: Option<LabelNutrient>,
    #[serde(rename = "saturatedFat")]
    pub saturated_fat: Option<LabelNutrient>,
    #[serde(rename = "transFat")]
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

#[derive(Deserialize, Debug)]
pub struct FoundationFoodItem {
    #[serde(rename = "fdcId")]
    pub fdc_id: i32,
    #[serde(rename = "dataType")]
    pub data_type: String,
    pub description: String,
    #[serde(rename = "foodClass")]
    pub food_class: String,
    #[serde(rename = "footNote")]
    pub foot_note: Option<String>,
    #[serde(rename = "isHistoricalReference")]
    pub is_historical_reference: bool,
    #[serde(rename = "ndbNumber")]
    pub ndb_number: i32,
    #[serde(rename = "publicationDate")]
    pub publication_date: String,
    #[serde(rename = "scientificName")]
    pub scientific_name: Option<String>,
    #[serde(rename = "foodCategory")]
    pub food_category: FoodCategory,
    #[serde(rename = "foodComponents")]
    pub food_components: Option<Vec<FoodComponent>>,
    #[serde(rename = "foodNutrients")]
    pub food_nutrients: Vec<FoodNutrient>,
    #[serde(rename = "foodPortions")]
    pub food_portions: Vec<FoodPortion>,
    #[serde(rename = "inputFoods")]
    pub input_foods: Vec<InputFoodFoundation>,
    #[serde(rename = "nutrientConversionFactors")]
    pub nutrient_conversion_factors: Vec<NutrientConversionFactors>,
}

#[derive(Deserialize, Debug)]
pub struct AbridgedFoodItem {
    #[serde(rename = "dataType")]
    pub data_type: String,
    pub description: String,
    #[serde(rename = "fdcId")]
    pub fdc_id: i32,
    #[serde(rename = "foodNutrients")]
    pub food_nutrients: Vec<AbridgedFoodNutrient>,
    #[serde(rename = "publicationDate")]
    pub publication_date: String,
    #[serde(rename = "brandOwner")]
    pub brand_owner: String,
    #[serde(rename = "gtinUpc")]
    pub gtin_upc: String,
    #[serde(rename = "ndbNumber")]
    pub ndb_number: i32,
    #[serde(rename = "foodCode")]
    pub food_code: String,  
}

#[derive(Deserialize, Debug)]
pub struct BrandedFoodItem {
    #[serde(rename = "fdcId")]
    pub fdc_id: i32,
    #[serde(rename = "availableDate")]
    pub available_date: Option<String>,
    #[serde(rename = "brandOwner")]
    pub brand_owner: String,
    #[serde(rename = "dataSource")]
    pub data_source: String,
    #[serde(rename = "dataType")]
    pub data_type: String,
    pub description: String,
    #[serde(rename = "foodClass")]
    pub food_class: String,
    #[serde(rename = "gtinUpc")]
    pub gtin_upc: String,
    #[serde(rename = "householdServingFullText")]
    pub household_serving_full_text: Option<String>,
    pub ingredients: String,
    #[serde(rename = "modifiedDate")]
    pub modified_date: Option<String>,
    #[serde(rename = "publicationDate")]
    pub publication_date: String,
    #[serde(rename = "servingSize")]
    pub serving_size: Option<f32>,
    #[serde(rename = "servingSizeUnit")]
    pub serving_size_unit: Option<String>,
    #[serde(rename = "preparationStateCode")]
    pub preparation_state_code: Option<String>,
    #[serde(rename = "brandedFoodCategory")]
    pub branded_food_category: String,
    #[serde(rename = "tradeChannel")]
    pub trade_channel: Option<Vec<String>>,
    #[serde(rename = "gpcClassCode")]
    pub gpc_class_code: Option<i32>,
    #[serde(rename = "foodNutrients")]
    pub food_nutrients: Vec<FoodNutrient>,
    #[serde(rename = "foodUpdateLog")]
    pub food_update_log: Vec<FoodUpdateLog>,
    #[serde(rename = "labelNutrients")]
    pub label_nutrients: LabelNutrients,  
}

#[derive(Deserialize, Debug)]
pub struct SRLegacyFoodItem {
    #[serde(rename = "fdcId")]
    pub fdc_id: i32,
    #[serde(rename = "dataType")]
    pub data_type: String,
    pub description: String,
    #[serde(rename = "foodClass")]
    pub food_class: String,
    #[serde(rename = "isHistoricalReference")]
    pub is_historical_reference: bool,
    #[serde(rename = "ndbNumber")]
    pub ndb_number: i32,
    #[serde(rename = "publicationDate")]
    pub publication_date: String,
    #[serde(rename = "scientificName")]
    pub scientific_name: Option<String>,
    #[serde(rename = "foodCategory")]
    pub food_category: FoodCategory,
    #[serde(rename = "foodNutrients")]
    pub food_nutrients: Vec<FoodNutrient>,
    #[serde(rename = "nutrientConversionFactors")]
    pub nutrient_conversion_factors: Vec<NutrientConversionFactors>,
}

#[derive(Deserialize, Debug)]
pub struct SurveyFoodItem {
    #[serde(rename = "fdcId")]
    pub fdc_id: i32,
    pub datatype: Option<String>,
    pub description: String,
    #[serde(rename = "endDate")]
    pub end_date: String,
    #[serde(rename = "foodClass")]
    pub food_class: String,
    #[serde(rename = "foodCode")]
    pub food_code: String,
    #[serde(rename = "publicationDate")]
    pub publication_date: String,
    #[serde(rename = "startDate")]
    pub start_date: String,
    #[serde(rename = "foodAttributes")]
    pub food_attributes: Vec<FoodAttribute>,
    #[serde(rename = "foodPortions")]
    pub food_portions: Vec<FoodPortion>,
    #[serde(rename = "inputFoods")]
    pub input_foods: Vec<InputFoodSurvey>,
    #[serde(rename = "wweiaFoodCategory")]
    pub wweia_food_category: WweiaFoodCategory,  
}

//------------------------------------------------------------------------------
// Custom aggregator types (not directly taken from USDA spec)
//------------------------------------------------------------------------------

#[derive(Deserialize, Debug)]
pub struct FoundationFoodData {
    #[serde(rename = "FoundationFoods")]
    pub foundation_foods: Vec<FoundationFoodItem>,
}

#[derive(Deserialize, Debug)]
pub struct SurveyFoodData {
    #[serde(rename = "SurveyFoods")]
    pub survey_foods: Vec<SurveyFoodItem>,
}

#[derive(Deserialize, Debug)]
pub struct SRLegacyFoodData {
    #[serde(rename = "SRLegacyFoods")]
    pub sr_legacy_foods: Vec<SRLegacyFoodItem>,
}

#[derive(Deserialize, Debug)]
pub struct BrandedFoodData {
    #[serde(rename = "BrandedFoods")]
    pub branded_foods: Vec<BrandedFoodItem>,
}
