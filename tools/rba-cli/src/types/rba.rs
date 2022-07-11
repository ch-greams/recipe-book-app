use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::hash::{Hash, Hasher};

use super::usda::{BrandedFoodItem, FoodNutrient, FoodPortion, FoundationFoodItem, SurveyFoodItem};

#[derive(sqlx::Type, Serialize, Deserialize, Debug, Clone)]
#[sqlx(type_name = "product_type", rename_all = "snake_case")]
pub enum ProductType {
    Food,
    Recipe,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct Product {
    pub id: i64,
    #[serde(rename = "type")]
    pub product_type: ProductType,
    pub name: String,
    pub brand: String,
    pub subtitle: String,
    pub description: String,
    pub density: f64,
    pub serving_size: f64,
    pub created_by: i64,
    pub is_private: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

fn get_density(food_portion: &FoodPortion) -> f64 {
    match food_portion.measure_unit.abbreviation.as_str() {
        "tsp" => f64::from(food_portion.gram_weight) / 4.92892,
        "tbsp" => f64::from(food_portion.gram_weight) / 14.7868,
        "cup" => f64::from(food_portion.gram_weight) / 240.0,
        _ => 1.0,
    }
}

impl From<&FoundationFoodItem> for Product {
    fn from(foundation_food_item: &FoundationFoodItem) -> Self {
        let std_units = vec!["ml", "tsp", "tbsp", "cup"];
        let std_portion = foundation_food_item
            .food_portions
            .iter()
            .find(|portion| std_units.contains(&portion.measure_unit.abbreviation.as_str()));

        let density = if let Some(food_portion) = std_portion {
            get_density(food_portion)
        } else {
            1.0
        };

        let timestamp = Utc::now();

        Self {
            id: foundation_food_item.fdc_id.into(),
            product_type: ProductType::Food,

            name: foundation_food_item.description.to_owned(),
            brand: "".to_string(),
            subtitle: "".to_string(),
            description: "usda - foundation".to_string(),

            density,
            serving_size: 100.0,

            created_by: 0,
            is_private: false,
            created_at: timestamp,
            updated_at: timestamp,
        }
    }
}

impl From<&SurveyFoodItem> for Product {
    fn from(survey_food_item: &SurveyFoodItem) -> Self {
        let std_units = vec!["ml", "tsp", "tbsp", "cup"];
        let std_portion = survey_food_item
            .food_portions
            .iter()
            .find(|portion| std_units.contains(&portion.measure_unit.abbreviation.as_str()));

        let density = if let Some(food_portion) = std_portion {
            get_density(food_portion)
        } else {
            1.0
        };

        let timestamp = Utc::now();

        Self {
            id: survey_food_item.fdc_id.into(),
            product_type: ProductType::Food,

            name: survey_food_item.description.to_owned(),
            brand: "".to_string(),
            subtitle: "".to_string(),
            description: "usda - survey".to_string(),

            density,
            serving_size: 100.0,

            created_by: 0,
            is_private: false,
            created_at: timestamp,
            updated_at: timestamp,
        }
    }
}

impl From<&BrandedFoodItem> for Product {
    fn from(branded_food_item: &BrandedFoodItem) -> Self {
        let timestamp = Utc::now();

        let brand = if let Some(brand_name) = &branded_food_item.brand_name {
            if brand_name.trim().is_empty() {
                &branded_food_item.brand_owner
            } else {
                brand_name
            }
        } else {
            &branded_food_item.brand_owner
        };

        Self {
            id: branded_food_item.fdc_id.into(),
            product_type: ProductType::Food,

            name: branded_food_item.description.to_owned(),
            brand: brand.to_owned(),
            subtitle: branded_food_item.branded_food_category.to_owned(),
            description: branded_food_item.ingredients.to_owned(),

            density: 1.0,
            serving_size: 100.0,

            created_by: 0,
            is_private: false,
            created_at: timestamp,
            updated_at: timestamp,
        }
    }
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct CustomUnit {
    pub product_id: i64,
    pub name: String,
    pub amount: f64,
    pub unit: String,
}

impl Hash for CustomUnit {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.product_id.hash(state);
        self.name.hash(state);
    }
}

impl PartialEq for CustomUnit {
    fn eq(&self, other: &Self) -> bool {
        (self.product_id == other.product_id) && (self.name == other.name)
    }
}

impl Eq for CustomUnit {}

impl CustomUnit {
    pub fn new(food_portion: &FoodPortion, product_id: i64) -> Self {
        Self {
            product_id,
            name: food_portion.measure_unit.name.to_owned(),
            amount: food_portion.gram_weight.into(),
            unit: "g".to_string(),
        }
    }
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct NutritionFacts {
    pub product_id: i64,
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
    pub vitamin_b7: Option<f64>,
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
    pub chloride: Option<f64>,
    pub chromium: Option<f64>,
    pub iodine: Option<f64>,
    pub molybdenum: Option<f64>,
    pub alcohol: Option<f64>,
    pub water: Option<f64>,
    pub ash: Option<f64>,
    pub caffeine: Option<f64>,
}

fn get_amount(food_nutrients: &[FoodNutrient], nutrient_id: u32) -> Option<f64> {
    food_nutrients
        .iter()
        .find(|food_nutrient| food_nutrient.nutrient.id == nutrient_id)
        .and_then(|food_nutrient| food_nutrient.amount)
        .map(f64::from)
}

fn get_amount_sum(food_nutrients: &[FoodNutrient], nutrient_ids: Vec<u32>) -> Option<f64> {
    let mut values = food_nutrients
        .iter()
        .filter(|food_nutrient| nutrient_ids.contains(&food_nutrient.nutrient.id))
        .map(|food_nutrient| food_nutrient.amount.map(f64::from));

    let result: Option<f64> = if values.all(|n_3| n_3.is_none()) {
        None
    } else {
        values
            .map(|opt| opt.unwrap_or_default())
            .reduce(|sum, current_value| sum + current_value)
    };

    result
}

impl From<&FoundationFoodItem> for NutritionFacts {
    fn from(foundation_food_item: &FoundationFoodItem) -> Self {
        let omega_3: Option<f64> = get_amount_sum(
            &foundation_food_item.food_nutrients,
            vec![1404, 1405, 1280, 1272, 1278],
        );

        let omega_6: Option<f64> = get_amount_sum(
            &foundation_food_item.food_nutrients,
            vec![1316, 1321, 1313, 1406, 1408],
        );

        Self {
            product_id: foundation_food_item.fdc_id.into(),
            energy: get_amount(&foundation_food_item.food_nutrients, 1008),
            carbohydrate: get_amount(&foundation_food_item.food_nutrients, 1005),
            dietary_fiber: get_amount(&foundation_food_item.food_nutrients, 1079),
            starch: get_amount(&foundation_food_item.food_nutrients, 1009),
            sugars: get_amount(&foundation_food_item.food_nutrients, 1063),
            fat: get_amount(&foundation_food_item.food_nutrients, 1004),
            monounsaturated: get_amount(&foundation_food_item.food_nutrients, 1292),
            polyunsaturated: get_amount(&foundation_food_item.food_nutrients, 1293),
            omega_3,
            omega_6,
            saturated: get_amount(&foundation_food_item.food_nutrients, 1258),
            trans_fats: get_amount(&foundation_food_item.food_nutrients, 1257),
            cholesterol: get_amount(&foundation_food_item.food_nutrients, 1253),
            phytosterol: get_amount(&foundation_food_item.food_nutrients, 1298),
            protein: get_amount(&foundation_food_item.food_nutrients, 1003),
            tryptophan: get_amount(&foundation_food_item.food_nutrients, 1210),
            threonine: get_amount(&foundation_food_item.food_nutrients, 1211),
            isoleucine: get_amount(&foundation_food_item.food_nutrients, 1212),
            leucine: get_amount(&foundation_food_item.food_nutrients, 1213),
            lysine: get_amount(&foundation_food_item.food_nutrients, 1214),
            methionine: get_amount(&foundation_food_item.food_nutrients, 1215),
            cystine: get_amount(&foundation_food_item.food_nutrients, 1216),
            phenylalanine: get_amount(&foundation_food_item.food_nutrients, 1217),
            tyrosine: get_amount(&foundation_food_item.food_nutrients, 1218),
            valine: get_amount(&foundation_food_item.food_nutrients, 1219),
            arginine: get_amount(&foundation_food_item.food_nutrients, 1220),
            histidine: get_amount(&foundation_food_item.food_nutrients, 1221),
            alanine: get_amount(&foundation_food_item.food_nutrients, 1222),
            aspartic_acid: get_amount(&foundation_food_item.food_nutrients, 1223),
            glutamic_acid: get_amount(&foundation_food_item.food_nutrients, 1224),
            glycine: get_amount(&foundation_food_item.food_nutrients, 1225),
            proline: get_amount(&foundation_food_item.food_nutrients, 1226),
            serine: get_amount(&foundation_food_item.food_nutrients, 1227),
            hydroxyproline: get_amount(&foundation_food_item.food_nutrients, 1228),
            vitamin_a: get_amount(&foundation_food_item.food_nutrients, 1106),
            vitamin_c: get_amount(&foundation_food_item.food_nutrients, 1162),
            vitamin_d: get_amount(&foundation_food_item.food_nutrients, 1114),
            vitamin_e: get_amount(&foundation_food_item.food_nutrients, 1109),
            vitamin_k: get_amount(&foundation_food_item.food_nutrients, 1185),
            vitamin_b1: get_amount(&foundation_food_item.food_nutrients, 1165),
            vitamin_b2: get_amount(&foundation_food_item.food_nutrients, 1166),
            vitamin_b3: get_amount(&foundation_food_item.food_nutrients, 1167),
            vitamin_b5: get_amount(&foundation_food_item.food_nutrients, 1170),
            vitamin_b6: get_amount(&foundation_food_item.food_nutrients, 1175),
            vitamin_b7: get_amount(&foundation_food_item.food_nutrients, 1176),
            vitamin_b9: get_amount(&foundation_food_item.food_nutrients, 1177),
            vitamin_b12: get_amount(&foundation_food_item.food_nutrients, 1178),
            choline: get_amount(&foundation_food_item.food_nutrients, 1180),
            betaine: get_amount(&foundation_food_item.food_nutrients, 1198),
            calcium: get_amount(&foundation_food_item.food_nutrients, 1087),
            iron: get_amount(&foundation_food_item.food_nutrients, 1089),
            magnesium: get_amount(&foundation_food_item.food_nutrients, 1090),
            phosphorus: get_amount(&foundation_food_item.food_nutrients, 1091),
            potassium: get_amount(&foundation_food_item.food_nutrients, 1092),
            sodium: get_amount(&foundation_food_item.food_nutrients, 1093),
            zinc: get_amount(&foundation_food_item.food_nutrients, 1095),
            copper: get_amount(&foundation_food_item.food_nutrients, 1098),
            manganese: get_amount(&foundation_food_item.food_nutrients, 1101),
            selenium: get_amount(&foundation_food_item.food_nutrients, 1103),
            fluoride: get_amount(&foundation_food_item.food_nutrients, 1099),
            chloride: None,
            chromium: get_amount(&foundation_food_item.food_nutrients, 1096),
            iodine: get_amount(&foundation_food_item.food_nutrients, 1100),
            molybdenum: get_amount(&foundation_food_item.food_nutrients, 1102),
            alcohol: get_amount(&foundation_food_item.food_nutrients, 1018),
            water: get_amount(&foundation_food_item.food_nutrients, 1051),
            ash: get_amount(&foundation_food_item.food_nutrients, 1007),
            caffeine: get_amount(&foundation_food_item.food_nutrients, 1057),
        }
    }
}

impl From<&SurveyFoodItem> for NutritionFacts {
    fn from(survey_food_item: &SurveyFoodItem) -> Self {
        let omega_3: Option<f64> = get_amount_sum(
            &survey_food_item.food_nutrients,
            vec![1404, 1405, 1280, 1272, 1278],
        );

        let omega_6: Option<f64> = get_amount_sum(
            &survey_food_item.food_nutrients,
            vec![1316, 1321, 1313, 1406, 1408],
        );

        Self {
            product_id: survey_food_item.fdc_id.into(),
            energy: get_amount(&survey_food_item.food_nutrients, 1008),
            carbohydrate: get_amount(&survey_food_item.food_nutrients, 1005),
            dietary_fiber: get_amount(&survey_food_item.food_nutrients, 1079),
            starch: get_amount(&survey_food_item.food_nutrients, 1009),
            sugars: get_amount(&survey_food_item.food_nutrients, 1063),
            fat: get_amount(&survey_food_item.food_nutrients, 1004),
            monounsaturated: get_amount(&survey_food_item.food_nutrients, 1292),
            polyunsaturated: get_amount(&survey_food_item.food_nutrients, 1293),
            omega_3,
            omega_6,
            saturated: get_amount(&survey_food_item.food_nutrients, 1258),
            trans_fats: get_amount(&survey_food_item.food_nutrients, 1257),
            cholesterol: get_amount(&survey_food_item.food_nutrients, 1253),
            phytosterol: get_amount(&survey_food_item.food_nutrients, 1298),
            protein: get_amount(&survey_food_item.food_nutrients, 1003),
            tryptophan: get_amount(&survey_food_item.food_nutrients, 1210),
            threonine: get_amount(&survey_food_item.food_nutrients, 1211),
            isoleucine: get_amount(&survey_food_item.food_nutrients, 1212),
            leucine: get_amount(&survey_food_item.food_nutrients, 1213),
            lysine: get_amount(&survey_food_item.food_nutrients, 1214),
            methionine: get_amount(&survey_food_item.food_nutrients, 1215),
            cystine: get_amount(&survey_food_item.food_nutrients, 1216),
            phenylalanine: get_amount(&survey_food_item.food_nutrients, 1217),
            tyrosine: get_amount(&survey_food_item.food_nutrients, 1218),
            valine: get_amount(&survey_food_item.food_nutrients, 1219),
            arginine: get_amount(&survey_food_item.food_nutrients, 1220),
            histidine: get_amount(&survey_food_item.food_nutrients, 1221),
            alanine: get_amount(&survey_food_item.food_nutrients, 1222),
            aspartic_acid: get_amount(&survey_food_item.food_nutrients, 1223),
            glutamic_acid: get_amount(&survey_food_item.food_nutrients, 1224),
            glycine: get_amount(&survey_food_item.food_nutrients, 1225),
            proline: get_amount(&survey_food_item.food_nutrients, 1226),
            serine: get_amount(&survey_food_item.food_nutrients, 1227),
            hydroxyproline: get_amount(&survey_food_item.food_nutrients, 1228),
            vitamin_a: get_amount(&survey_food_item.food_nutrients, 1106),
            vitamin_c: get_amount(&survey_food_item.food_nutrients, 1162),
            vitamin_d: get_amount(&survey_food_item.food_nutrients, 1114),
            vitamin_e: get_amount(&survey_food_item.food_nutrients, 1109),
            vitamin_k: get_amount(&survey_food_item.food_nutrients, 1185),
            vitamin_b1: get_amount(&survey_food_item.food_nutrients, 1165),
            vitamin_b2: get_amount(&survey_food_item.food_nutrients, 1166),
            vitamin_b3: get_amount(&survey_food_item.food_nutrients, 1167),
            vitamin_b5: get_amount(&survey_food_item.food_nutrients, 1170),
            vitamin_b6: get_amount(&survey_food_item.food_nutrients, 1175),
            vitamin_b7: get_amount(&survey_food_item.food_nutrients, 1176),
            vitamin_b9: get_amount(&survey_food_item.food_nutrients, 1177),
            vitamin_b12: get_amount(&survey_food_item.food_nutrients, 1178),
            choline: get_amount(&survey_food_item.food_nutrients, 1180),
            betaine: get_amount(&survey_food_item.food_nutrients, 1198),
            calcium: get_amount(&survey_food_item.food_nutrients, 1087),
            iron: get_amount(&survey_food_item.food_nutrients, 1089),
            magnesium: get_amount(&survey_food_item.food_nutrients, 1090),
            phosphorus: get_amount(&survey_food_item.food_nutrients, 1091),
            potassium: get_amount(&survey_food_item.food_nutrients, 1092),
            sodium: get_amount(&survey_food_item.food_nutrients, 1093),
            zinc: get_amount(&survey_food_item.food_nutrients, 1095),
            copper: get_amount(&survey_food_item.food_nutrients, 1098),
            manganese: get_amount(&survey_food_item.food_nutrients, 1101),
            selenium: get_amount(&survey_food_item.food_nutrients, 1103),
            fluoride: get_amount(&survey_food_item.food_nutrients, 1099),
            chloride: None,
            chromium: get_amount(&survey_food_item.food_nutrients, 1096),
            iodine: get_amount(&survey_food_item.food_nutrients, 1100),
            molybdenum: get_amount(&survey_food_item.food_nutrients, 1102),
            alcohol: get_amount(&survey_food_item.food_nutrients, 1018),
            water: get_amount(&survey_food_item.food_nutrients, 1051),
            ash: get_amount(&survey_food_item.food_nutrients, 1007),
            caffeine: get_amount(&survey_food_item.food_nutrients, 1057),
        }
    }
}

fn get_amount_from_serving(
    food_nutrients: &[FoodNutrient],
    nutrient_id: u32,
    serving_size: f32,
) -> Option<f64> {
    food_nutrients
        .iter()
        .find(|food_nutrient| food_nutrient.nutrient.id == nutrient_id)
        .and_then(|food_nutrient| food_nutrient.amount)
        .map(|amount| amount * (100.0 / serving_size))
        .map(f64::from)
}

fn get_amount_sum_from_serving(
    food_nutrients: &[FoodNutrient],
    nutrient_ids: Vec<u32>,
    serving_size: f32,
) -> Option<f64> {
    let mut values = food_nutrients
        .iter()
        .filter(|food_nutrient| nutrient_ids.contains(&food_nutrient.nutrient.id))
        .map(|food_nutrient| {
            food_nutrient
                .amount
                .map(|amount| f64::from(amount * (100.0 / serving_size)))
        });

    let result: Option<f64> = if values.all(|n_3| n_3.is_none()) {
        None
    } else {
        values
            .map(|opt| opt.unwrap_or_default())
            .reduce(|sum, current_value| sum + current_value)
    };

    result
}

impl From<&BrandedFoodItem> for NutritionFacts {
    fn from(branded_food_item: &BrandedFoodItem) -> Self {
        let serving_size = branded_food_item.serving_size.unwrap_or(100.0);

        let omega_3: Option<f64> = get_amount_sum_from_serving(
            &branded_food_item.food_nutrients,
            vec![1404, 1405, 1280, 1272, 1278],
            serving_size,
        );

        let omega_6: Option<f64> = get_amount_sum_from_serving(
            &branded_food_item.food_nutrients,
            vec![1316, 1321, 1313, 1406, 1408],
            serving_size,
        );

        Self {
            product_id: branded_food_item.fdc_id.into(),
            energy: get_amount_from_serving(&branded_food_item.food_nutrients, 1008, serving_size),
            carbohydrate: get_amount_from_serving(
                &branded_food_item.food_nutrients,
                1005,
                serving_size,
            ),
            dietary_fiber: get_amount_from_serving(
                &branded_food_item.food_nutrients,
                1079,
                serving_size,
            ),
            starch: get_amount_from_serving(&branded_food_item.food_nutrients, 1009, serving_size),
            sugars: get_amount_from_serving(&branded_food_item.food_nutrients, 1063, serving_size),
            fat: get_amount_from_serving(&branded_food_item.food_nutrients, 1004, serving_size),
            monounsaturated: get_amount_from_serving(
                &branded_food_item.food_nutrients,
                1292,
                serving_size,
            ),
            polyunsaturated: get_amount_from_serving(
                &branded_food_item.food_nutrients,
                1293,
                serving_size,
            ),
            omega_3,
            omega_6,
            saturated: get_amount_from_serving(
                &branded_food_item.food_nutrients,
                1258,
                serving_size,
            ),
            trans_fats: get_amount_from_serving(
                &branded_food_item.food_nutrients,
                1257,
                serving_size,
            ),
            cholesterol: get_amount_from_serving(
                &branded_food_item.food_nutrients,
                1253,
                serving_size,
            ),
            phytosterol: get_amount_from_serving(
                &branded_food_item.food_nutrients,
                1298,
                serving_size,
            ),
            protein: get_amount_from_serving(&branded_food_item.food_nutrients, 1003, serving_size),
            tryptophan: get_amount_from_serving(
                &branded_food_item.food_nutrients,
                1210,
                serving_size,
            ),
            threonine: get_amount_from_serving(
                &branded_food_item.food_nutrients,
                1211,
                serving_size,
            ),
            isoleucine: get_amount_from_serving(
                &branded_food_item.food_nutrients,
                1212,
                serving_size,
            ),
            leucine: get_amount_from_serving(&branded_food_item.food_nutrients, 1213, serving_size),
            lysine: get_amount_from_serving(&branded_food_item.food_nutrients, 1214, serving_size),
            methionine: get_amount_from_serving(
                &branded_food_item.food_nutrients,
                1215,
                serving_size,
            ),
            cystine: get_amount_from_serving(&branded_food_item.food_nutrients, 1216, serving_size),
            phenylalanine: get_amount_from_serving(
                &branded_food_item.food_nutrients,
                1217,
                serving_size,
            ),
            tyrosine: get_amount_from_serving(
                &branded_food_item.food_nutrients,
                1218,
                serving_size,
            ),
            valine: get_amount_from_serving(&branded_food_item.food_nutrients, 1219, serving_size),
            arginine: get_amount_from_serving(
                &branded_food_item.food_nutrients,
                1220,
                serving_size,
            ),
            histidine: get_amount_from_serving(
                &branded_food_item.food_nutrients,
                1221,
                serving_size,
            ),
            alanine: get_amount_from_serving(&branded_food_item.food_nutrients, 1222, serving_size),
            aspartic_acid: get_amount_from_serving(
                &branded_food_item.food_nutrients,
                1223,
                serving_size,
            ),
            glutamic_acid: get_amount_from_serving(
                &branded_food_item.food_nutrients,
                1224,
                serving_size,
            ),
            glycine: get_amount_from_serving(&branded_food_item.food_nutrients, 1225, serving_size),
            proline: get_amount_from_serving(&branded_food_item.food_nutrients, 1226, serving_size),
            serine: get_amount_from_serving(&branded_food_item.food_nutrients, 1227, serving_size),
            hydroxyproline: get_amount_from_serving(
                &branded_food_item.food_nutrients,
                1228,
                serving_size,
            ),
            vitamin_a: get_amount_from_serving(
                &branded_food_item.food_nutrients,
                1106,
                serving_size,
            ),
            vitamin_c: get_amount_from_serving(
                &branded_food_item.food_nutrients,
                1162,
                serving_size,
            ),
            vitamin_d: get_amount_from_serving(
                &branded_food_item.food_nutrients,
                1114,
                serving_size,
            ),
            vitamin_e: get_amount_from_serving(
                &branded_food_item.food_nutrients,
                1109,
                serving_size,
            ),
            vitamin_k: get_amount_from_serving(
                &branded_food_item.food_nutrients,
                1185,
                serving_size,
            ),
            vitamin_b1: get_amount_from_serving(
                &branded_food_item.food_nutrients,
                1165,
                serving_size,
            ),
            vitamin_b2: get_amount_from_serving(
                &branded_food_item.food_nutrients,
                1166,
                serving_size,
            ),
            vitamin_b3: get_amount_from_serving(
                &branded_food_item.food_nutrients,
                1167,
                serving_size,
            ),
            vitamin_b5: get_amount_from_serving(
                &branded_food_item.food_nutrients,
                1170,
                serving_size,
            ),
            vitamin_b6: get_amount_from_serving(
                &branded_food_item.food_nutrients,
                1175,
                serving_size,
            ),
            vitamin_b7: get_amount_from_serving(
                &branded_food_item.food_nutrients,
                1176,
                serving_size,
            ),
            vitamin_b9: get_amount_from_serving(
                &branded_food_item.food_nutrients,
                1177,
                serving_size,
            ),
            vitamin_b12: get_amount_from_serving(
                &branded_food_item.food_nutrients,
                1178,
                serving_size,
            ),
            choline: get_amount_from_serving(&branded_food_item.food_nutrients, 1180, serving_size),
            betaine: get_amount_from_serving(&branded_food_item.food_nutrients, 1198, serving_size),
            calcium: get_amount_from_serving(&branded_food_item.food_nutrients, 1087, serving_size),
            iron: get_amount_from_serving(&branded_food_item.food_nutrients, 1089, serving_size),
            magnesium: get_amount_from_serving(
                &branded_food_item.food_nutrients,
                1090,
                serving_size,
            ),
            phosphorus: get_amount_from_serving(
                &branded_food_item.food_nutrients,
                1091,
                serving_size,
            ),
            potassium: get_amount_from_serving(
                &branded_food_item.food_nutrients,
                1092,
                serving_size,
            ),
            sodium: get_amount_from_serving(&branded_food_item.food_nutrients, 1093, serving_size),
            zinc: get_amount_from_serving(&branded_food_item.food_nutrients, 1095, serving_size),
            copper: get_amount_from_serving(&branded_food_item.food_nutrients, 1098, serving_size),
            manganese: get_amount_from_serving(
                &branded_food_item.food_nutrients,
                1101,
                serving_size,
            ),
            selenium: get_amount_from_serving(
                &branded_food_item.food_nutrients,
                1103,
                serving_size,
            ),
            fluoride: get_amount_from_serving(
                &branded_food_item.food_nutrients,
                1099,
                serving_size,
            ),
            chloride: None,
            chromium: get_amount_from_serving(
                &branded_food_item.food_nutrients,
                1096,
                serving_size,
            ),
            iodine: get_amount_from_serving(&branded_food_item.food_nutrients, 1100, serving_size),
            molybdenum: get_amount_from_serving(
                &branded_food_item.food_nutrients,
                1102,
                serving_size,
            ),
            alcohol: get_amount_from_serving(&branded_food_item.food_nutrients, 1018, serving_size),
            water: get_amount_from_serving(&branded_food_item.food_nutrients, 1051, serving_size),
            ash: get_amount_from_serving(&branded_food_item.food_nutrients, 1007, serving_size),
            caffeine: get_amount_from_serving(
                &branded_food_item.food_nutrients,
                1057,
                serving_size,
            ),
        }
    }
}
