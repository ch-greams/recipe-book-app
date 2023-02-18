use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use sqlx::{Executor, Postgres, QueryBuilder};

use crate::{types::usda, utils::BIND_LIMIT};

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct FoodNutrient {
    pub food_id: i64,
    pub nutrient_name: String,
    pub amount: f32,
}

impl FoodNutrient {
    pub fn new(nutrient_name: &str, food_id: i64, amount: f32) -> Self {
        FoodNutrient {
            food_id,
            nutrient_name: nutrient_name.to_string(),
            amount,
        }
    }

    pub fn from_usda_food_nutrients(
        food_nutrients: &[usda::support::FoodNutrient],
        food_id: i64,
    ) -> Vec<Self> {
        let mut omega_3: Vec<f32> = vec![];
        let mut omega_6: Vec<f32> = vec![];

        let mut nutrients: Vec<FoodNutrient> = food_nutrients
            .iter()
            .filter_map(
                |food_nutrient| match (food_nutrient.nutrient.id, food_nutrient.amount) {
                    (1008, Some(amount)) => Some(FoodNutrient::new("energy", food_id, amount)),
                    (1005, Some(amount)) => {
                        Some(FoodNutrient::new("carbohydrate", food_id, amount))
                    }
                    (1079, Some(amount)) => {
                        Some(FoodNutrient::new("dietary_fiber", food_id, amount))
                    }
                    (1009, Some(amount)) => Some(FoodNutrient::new("starch", food_id, amount)),
                    (1063, Some(amount)) => Some(FoodNutrient::new("sugars", food_id, amount)),
                    (1004, Some(amount)) => Some(FoodNutrient::new("fat", food_id, amount)),
                    (1292, Some(amount)) => {
                        Some(FoodNutrient::new("monounsaturated", food_id, amount))
                    }
                    (1293, Some(amount)) => {
                        Some(FoodNutrient::new("polyunsaturated", food_id, amount))
                    }
                    (1258, Some(amount)) => Some(FoodNutrient::new("saturated", food_id, amount)),
                    (1257, Some(amount)) => Some(FoodNutrient::new("trans_fats", food_id, amount)),
                    (1253, Some(amount)) => Some(FoodNutrient::new("cholesterol", food_id, amount)),
                    (1298, Some(amount)) => Some(FoodNutrient::new("phytosterol", food_id, amount)),
                    (1003, Some(amount)) => Some(FoodNutrient::new("protein", food_id, amount)),
                    (1210, Some(amount)) => Some(FoodNutrient::new("tryptophan", food_id, amount)),
                    (1211, Some(amount)) => Some(FoodNutrient::new("threonine", food_id, amount)),
                    (1212, Some(amount)) => Some(FoodNutrient::new("isoleucine", food_id, amount)),
                    (1213, Some(amount)) => Some(FoodNutrient::new("leucine", food_id, amount)),
                    (1214, Some(amount)) => Some(FoodNutrient::new("lysine", food_id, amount)),
                    (1215, Some(amount)) => Some(FoodNutrient::new("methionine", food_id, amount)),
                    (1216, Some(amount)) => Some(FoodNutrient::new("cystine", food_id, amount)),
                    (1217, Some(amount)) => {
                        Some(FoodNutrient::new("phenylalanine", food_id, amount))
                    }
                    (1218, Some(amount)) => Some(FoodNutrient::new("tyrosine", food_id, amount)),
                    (1219, Some(amount)) => Some(FoodNutrient::new("valine", food_id, amount)),
                    (1220, Some(amount)) => Some(FoodNutrient::new("arginine", food_id, amount)),
                    (1221, Some(amount)) => Some(FoodNutrient::new("histidine", food_id, amount)),
                    (1222, Some(amount)) => Some(FoodNutrient::new("alanine", food_id, amount)),
                    (1223, Some(amount)) => {
                        Some(FoodNutrient::new("aspartic_acid", food_id, amount))
                    }
                    (1224, Some(amount)) => {
                        Some(FoodNutrient::new("glutamic_acid", food_id, amount))
                    }
                    (1225, Some(amount)) => Some(FoodNutrient::new("glycine", food_id, amount)),
                    (1226, Some(amount)) => Some(FoodNutrient::new("proline", food_id, amount)),
                    (1227, Some(amount)) => Some(FoodNutrient::new("serine", food_id, amount)),
                    (1228, Some(amount)) => {
                        Some(FoodNutrient::new("hydroxyproline", food_id, amount))
                    }
                    (1106, Some(amount)) => Some(FoodNutrient::new("vitamin_a", food_id, amount)),
                    (1162, Some(amount)) => Some(FoodNutrient::new("vitamin_c", food_id, amount)),
                    (1114, Some(amount)) => Some(FoodNutrient::new("vitamin_d", food_id, amount)),
                    (1109, Some(amount)) => Some(FoodNutrient::new("vitamin_e", food_id, amount)),
                    (1185, Some(amount)) => Some(FoodNutrient::new("vitamin_k", food_id, amount)),
                    (1165, Some(amount)) => Some(FoodNutrient::new("vitamin_b1", food_id, amount)),
                    (1166, Some(amount)) => Some(FoodNutrient::new("vitamin_b2", food_id, amount)),
                    (1167, Some(amount)) => Some(FoodNutrient::new("vitamin_b3", food_id, amount)),
                    (1170, Some(amount)) => Some(FoodNutrient::new("vitamin_b5", food_id, amount)),
                    (1175, Some(amount)) => Some(FoodNutrient::new("vitamin_b6", food_id, amount)),
                    (1176, Some(amount)) => Some(FoodNutrient::new("vitamin_b7", food_id, amount)),
                    (1177, Some(amount)) => Some(FoodNutrient::new("vitamin_b9", food_id, amount)),
                    (1178, Some(amount)) => Some(FoodNutrient::new("vitamin_b12", food_id, amount)),
                    (1180, Some(amount)) => Some(FoodNutrient::new("choline", food_id, amount)),
                    (1198, Some(amount)) => Some(FoodNutrient::new("betaine", food_id, amount)),
                    (1087, Some(amount)) => Some(FoodNutrient::new("calcium", food_id, amount)),
                    (1089, Some(amount)) => Some(FoodNutrient::new("iron", food_id, amount)),
                    (1090, Some(amount)) => Some(FoodNutrient::new("magnesium", food_id, amount)),
                    (1091, Some(amount)) => Some(FoodNutrient::new("phosphorus", food_id, amount)),
                    (1092, Some(amount)) => Some(FoodNutrient::new("potassium", food_id, amount)),
                    (1093, Some(amount)) => Some(FoodNutrient::new("sodium", food_id, amount)),
                    (1095, Some(amount)) => Some(FoodNutrient::new("zinc", food_id, amount)),
                    (1098, Some(amount)) => Some(FoodNutrient::new("copper", food_id, amount)),
                    (1101, Some(amount)) => Some(FoodNutrient::new("manganese", food_id, amount)),
                    (1103, Some(amount)) => Some(FoodNutrient::new("selenium", food_id, amount)),
                    (1099, Some(amount)) => Some(FoodNutrient::new("fluoride", food_id, amount)),
                    (1096, Some(amount)) => Some(FoodNutrient::new("chromium", food_id, amount)),
                    (1100, Some(amount)) => Some(FoodNutrient::new("iodine", food_id, amount)),
                    (1102, Some(amount)) => Some(FoodNutrient::new("molybdenum", food_id, amount)),
                    (1018, Some(amount)) => Some(FoodNutrient::new("alcohol", food_id, amount)),
                    (1051, Some(amount)) => Some(FoodNutrient::new("water", food_id, amount)),
                    (1007, Some(amount)) => Some(FoodNutrient::new("ash", food_id, amount)),
                    (1057, Some(amount)) => Some(FoodNutrient::new("caffeine", food_id, amount)),

                    (1404 | 1405 | 1280 | 1272 | 1278, Some(amount)) => {
                        omega_3.push(amount);
                        None
                    }
                    (1316 | 1321 | 1313 | 1406 | 1408, Some(amount)) => {
                        omega_6.push(amount);
                        None
                    }

                    _ => None,
                },
            )
            .collect();

        nutrients.push(FoodNutrient::new("omega_3", food_id, omega_3.iter().sum()));
        nutrients.push(FoodNutrient::new("omega_6", food_id, omega_6.iter().sum()));

        nutrients
    }

    pub async fn seed_food_nutrients(
        food_nutrients: Vec<FoodNutrient>,
        nutrient_mapping: &HashMap<String, i16>,
        txn: impl Executor<'_, Database = Postgres>,
    ) {
        let mut food_nutrients_query_builder: QueryBuilder<Postgres> =
            QueryBuilder::new("INSERT INTO recipe.food_nutrient (food_id, nutrient_id, amount) ");

        food_nutrients_query_builder.push_values(
            food_nutrients.iter().take(BIND_LIMIT / 3),
            |mut b, food_nutrient| {
                b.push_bind(food_nutrient.food_id)
                    .push_bind(nutrient_mapping.get(&food_nutrient.nutrient_name))
                    .push_bind(food_nutrient.amount);
            },
        );

        food_nutrients_query_builder.push(" ON CONFLICT ON CONSTRAINT food_nutrient_un DO NOTHING");

        let food_nutrients_query = food_nutrients_query_builder.build();

        let food_nutrients_response = food_nutrients_query.execute(txn).await.unwrap();

        println!(
            "{} food_nutrient records created",
            food_nutrients_response.rows_affected()
        );
    }
}
