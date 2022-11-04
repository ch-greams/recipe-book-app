use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use sqlx::{Executor, Postgres, QueryBuilder};

use crate::{types::usda::support::FoodNutrient, utils::BIND_LIMIT};

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct ProductNutrient {
    pub product_id: i64,
    pub nutrient_name: String,
    pub amount: f32,
}

impl ProductNutrient {
    pub fn new(nutrient_name: &str, product_id: i64, amount: f32) -> Self {
        ProductNutrient {
            product_id,
            nutrient_name: nutrient_name.to_string(),
            amount,
        }
    }

    pub fn from_food_nutrients(food_nutrients: &[FoodNutrient], product_id: i64) -> Vec<Self> {
        let mut omega_3: Vec<f32> = vec![];
        let mut omega_6: Vec<f32> = vec![];

        let mut nutrients: Vec<ProductNutrient> = food_nutrients
            .iter()
            .filter_map(
                |food_nutrient| match (food_nutrient.nutrient.id, food_nutrient.amount) {
                    (1008, Some(amount)) => {
                        Some(ProductNutrient::new("energy", product_id, amount))
                    }
                    (1005, Some(amount)) => {
                        Some(ProductNutrient::new("carbohydrate", product_id, amount))
                    }
                    (1079, Some(amount)) => {
                        Some(ProductNutrient::new("dietary_fiber", product_id, amount))
                    }
                    (1009, Some(amount)) => {
                        Some(ProductNutrient::new("starch", product_id, amount))
                    }
                    (1063, Some(amount)) => {
                        Some(ProductNutrient::new("sugars", product_id, amount))
                    }
                    (1004, Some(amount)) => Some(ProductNutrient::new("fat", product_id, amount)),
                    (1292, Some(amount)) => {
                        Some(ProductNutrient::new("monounsaturated", product_id, amount))
                    }
                    (1293, Some(amount)) => {
                        Some(ProductNutrient::new("polyunsaturated", product_id, amount))
                    }
                    (1258, Some(amount)) => {
                        Some(ProductNutrient::new("saturated", product_id, amount))
                    }
                    (1257, Some(amount)) => {
                        Some(ProductNutrient::new("trans_fats", product_id, amount))
                    }
                    (1253, Some(amount)) => {
                        Some(ProductNutrient::new("cholesterol", product_id, amount))
                    }
                    (1298, Some(amount)) => {
                        Some(ProductNutrient::new("phytosterol", product_id, amount))
                    }
                    (1003, Some(amount)) => {
                        Some(ProductNutrient::new("protein", product_id, amount))
                    }
                    (1210, Some(amount)) => {
                        Some(ProductNutrient::new("tryptophan", product_id, amount))
                    }
                    (1211, Some(amount)) => {
                        Some(ProductNutrient::new("threonine", product_id, amount))
                    }
                    (1212, Some(amount)) => {
                        Some(ProductNutrient::new("isoleucine", product_id, amount))
                    }
                    (1213, Some(amount)) => {
                        Some(ProductNutrient::new("leucine", product_id, amount))
                    }
                    (1214, Some(amount)) => {
                        Some(ProductNutrient::new("lysine", product_id, amount))
                    }
                    (1215, Some(amount)) => {
                        Some(ProductNutrient::new("methionine", product_id, amount))
                    }
                    (1216, Some(amount)) => {
                        Some(ProductNutrient::new("cystine", product_id, amount))
                    }
                    (1217, Some(amount)) => {
                        Some(ProductNutrient::new("phenylalanine", product_id, amount))
                    }
                    (1218, Some(amount)) => {
                        Some(ProductNutrient::new("tyrosine", product_id, amount))
                    }
                    (1219, Some(amount)) => {
                        Some(ProductNutrient::new("valine", product_id, amount))
                    }
                    (1220, Some(amount)) => {
                        Some(ProductNutrient::new("arginine", product_id, amount))
                    }
                    (1221, Some(amount)) => {
                        Some(ProductNutrient::new("histidine", product_id, amount))
                    }
                    (1222, Some(amount)) => {
                        Some(ProductNutrient::new("alanine", product_id, amount))
                    }
                    (1223, Some(amount)) => {
                        Some(ProductNutrient::new("aspartic_acid", product_id, amount))
                    }
                    (1224, Some(amount)) => {
                        Some(ProductNutrient::new("glutamic_acid", product_id, amount))
                    }
                    (1225, Some(amount)) => {
                        Some(ProductNutrient::new("glycine", product_id, amount))
                    }
                    (1226, Some(amount)) => {
                        Some(ProductNutrient::new("proline", product_id, amount))
                    }
                    (1227, Some(amount)) => {
                        Some(ProductNutrient::new("serine", product_id, amount))
                    }
                    (1228, Some(amount)) => {
                        Some(ProductNutrient::new("hydroxyproline", product_id, amount))
                    }
                    (1106, Some(amount)) => {
                        Some(ProductNutrient::new("vitamin_a", product_id, amount))
                    }
                    (1162, Some(amount)) => {
                        Some(ProductNutrient::new("vitamin_c", product_id, amount))
                    }
                    (1114, Some(amount)) => {
                        Some(ProductNutrient::new("vitamin_d", product_id, amount))
                    }
                    (1109, Some(amount)) => {
                        Some(ProductNutrient::new("vitamin_e", product_id, amount))
                    }
                    (1185, Some(amount)) => {
                        Some(ProductNutrient::new("vitamin_k", product_id, amount))
                    }
                    (1165, Some(amount)) => {
                        Some(ProductNutrient::new("vitamin_b1", product_id, amount))
                    }
                    (1166, Some(amount)) => {
                        Some(ProductNutrient::new("vitamin_b2", product_id, amount))
                    }
                    (1167, Some(amount)) => {
                        Some(ProductNutrient::new("vitamin_b3", product_id, amount))
                    }
                    (1170, Some(amount)) => {
                        Some(ProductNutrient::new("vitamin_b5", product_id, amount))
                    }
                    (1175, Some(amount)) => {
                        Some(ProductNutrient::new("vitamin_b6", product_id, amount))
                    }
                    (1176, Some(amount)) => {
                        Some(ProductNutrient::new("vitamin_b7", product_id, amount))
                    }
                    (1177, Some(amount)) => {
                        Some(ProductNutrient::new("vitamin_b9", product_id, amount))
                    }
                    (1178, Some(amount)) => {
                        Some(ProductNutrient::new("vitamin_b12", product_id, amount))
                    }
                    (1180, Some(amount)) => {
                        Some(ProductNutrient::new("choline", product_id, amount))
                    }
                    (1198, Some(amount)) => {
                        Some(ProductNutrient::new("betaine", product_id, amount))
                    }
                    (1087, Some(amount)) => {
                        Some(ProductNutrient::new("calcium", product_id, amount))
                    }
                    (1089, Some(amount)) => Some(ProductNutrient::new("iron", product_id, amount)),
                    (1090, Some(amount)) => {
                        Some(ProductNutrient::new("magnesium", product_id, amount))
                    }
                    (1091, Some(amount)) => {
                        Some(ProductNutrient::new("phosphorus", product_id, amount))
                    }
                    (1092, Some(amount)) => {
                        Some(ProductNutrient::new("potassium", product_id, amount))
                    }
                    (1093, Some(amount)) => {
                        Some(ProductNutrient::new("sodium", product_id, amount))
                    }
                    (1095, Some(amount)) => Some(ProductNutrient::new("zinc", product_id, amount)),
                    (1098, Some(amount)) => {
                        Some(ProductNutrient::new("copper", product_id, amount))
                    }
                    (1101, Some(amount)) => {
                        Some(ProductNutrient::new("manganese", product_id, amount))
                    }
                    (1103, Some(amount)) => {
                        Some(ProductNutrient::new("selenium", product_id, amount))
                    }
                    (1099, Some(amount)) => {
                        Some(ProductNutrient::new("fluoride", product_id, amount))
                    }
                    (1096, Some(amount)) => {
                        Some(ProductNutrient::new("chromium", product_id, amount))
                    }
                    (1100, Some(amount)) => {
                        Some(ProductNutrient::new("iodine", product_id, amount))
                    }
                    (1102, Some(amount)) => {
                        Some(ProductNutrient::new("molybdenum", product_id, amount))
                    }
                    (1018, Some(amount)) => {
                        Some(ProductNutrient::new("alcohol", product_id, amount))
                    }
                    (1051, Some(amount)) => Some(ProductNutrient::new("water", product_id, amount)),
                    (1007, Some(amount)) => Some(ProductNutrient::new("ash", product_id, amount)),
                    (1057, Some(amount)) => {
                        Some(ProductNutrient::new("caffeine", product_id, amount))
                    }

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

        nutrients.push(ProductNutrient::new(
            "omega_3",
            product_id,
            omega_3.iter().sum(),
        ));
        nutrients.push(ProductNutrient::new(
            "omega_6",
            product_id,
            omega_6.iter().sum(),
        ));

        nutrients
    }

    pub async fn seed_product_nutrients(
        product_nutrients: Vec<ProductNutrient>,
        nutrient_mapping: &HashMap<String, i16>,
        txn: impl Executor<'_, Database = Postgres>,
    ) {
        let mut product_nutrients_query_builder: QueryBuilder<Postgres> = QueryBuilder::new(
            "INSERT INTO private.product_nutrient (product_id, nutrient_id, amount) ",
        );

        product_nutrients_query_builder.push_values(
            product_nutrients.iter().take(BIND_LIMIT / 3),
            |mut b, product_nutrient| {
                b.push_bind(product_nutrient.product_id)
                    .push_bind(nutrient_mapping.get(&product_nutrient.nutrient_name))
                    .push_bind(product_nutrient.amount);
            },
        );

        product_nutrients_query_builder
            .push(" ON CONFLICT ON CONSTRAINT product_nutrient_un DO NOTHING");

        let product_nutrients_query = product_nutrients_query_builder.build();

        let product_nutrients_response = product_nutrients_query.execute(txn).await.unwrap();

        println!(
            "{} product_nutrient records created",
            product_nutrients_response.rows_affected()
        );
    }
}
