use std::collections::HashSet;

use serde::{Deserialize, Serialize};
use sqlx::PgPool;

use crate::types::rba::{
    custom_unit::CustomUnit, nutrition_fact::NutritionFacts, product::Product,
};

use super::food_items::{BrandedFoodItem, FoundationFoodItem, SRLegacyFoodItem, SurveyFoodItem};

//------------------------------------------------------------------------------
// Custom aggregator types (not directly taken from USDA spec)
//------------------------------------------------------------------------------

#[derive(Serialize, Deserialize, Debug)]
pub struct FoundationFoodData {
    #[serde(rename = "FoundationFoods")]
    pub foundation_foods: Vec<FoundationFoodItem>,
}

impl FoundationFoodData {
    pub async fn seed_foundation_food(self) {
        let database_url = "postgres://postgres:password@localhost";
        let db_pool = PgPool::connect_lazy(database_url).unwrap();
        let mut txn = db_pool.begin().await.unwrap();

        // products

        let products: Vec<Product> = self
            .foundation_foods
            .iter()
            .map(|food| food.into())
            .collect();

        let products_count = products.len();
        let products_batch_size = 1000;
        let products_batch_count = products_count / products_batch_size;

        for n in 0..=products_batch_count {
            let from = n * products_batch_size;
            let to = if n == products_batch_count {
                products_count
            } else {
                (n + 1) * products_batch_size
            };
            println!("products - from: {} to: {}", from, to);

            Product::seed_products(products[from..to].to_vec(), &mut txn).await;
        }

        // nutrition_facts

        let nutrition_facts: Vec<NutritionFacts> = self
            .foundation_foods
            .iter()
            .map(|food| food.into())
            .collect();

        let nutrition_facts_count = nutrition_facts.len();
        let nutrition_facts_batch_size = 800;
        let nutrition_facts_batch_count = nutrition_facts_count / nutrition_facts_batch_size;

        for n in 0..=nutrition_facts_batch_count {
            let from = n * nutrition_facts_batch_size;
            let to = if n == nutrition_facts_batch_count {
                nutrition_facts_count
            } else {
                (n + 1) * nutrition_facts_batch_size
            };
            println!("nutrition_facts - from: {} to: {}", from, to);

            NutritionFacts::seed_nutrition_facts(nutrition_facts[from..to].to_vec(), &mut txn)
                .await;
        }

        // custom_units

        let custom_units: HashSet<CustomUnit> = self
            .foundation_foods
            .iter()
            .flat_map(|food| {
                food.food_portions
                    .iter()
                    .map(|fp| CustomUnit::new(fp, food.fdc_id.into()))
                    .collect::<Vec<CustomUnit>>()
            })
            .collect();

        let custom_units_vec: Vec<CustomUnit> = custom_units.into_iter().collect();

        let custom_units_count = custom_units_vec.len();
        let custom_units_batch_size = 1000;
        let custom_units_batch_count = custom_units_count / custom_units_batch_size;

        for n in 0..=custom_units_batch_count {
            let from = n * custom_units_batch_size;
            let to = if n == custom_units_batch_count {
                custom_units_count
            } else {
                (n + 1) * custom_units_batch_size
            };
            println!("custom_units - from: {} to: {}", from, to);

            CustomUnit::seed_custom_units(custom_units_vec[from..to].to_vec(), &mut txn).await;
        }

        txn.commit().await.unwrap();

        println!("done!");
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct SurveyFoodData {
    #[serde(rename = "SurveyFoods")]
    pub survey_foods: Vec<SurveyFoodItem>,
}

impl SurveyFoodData {
    pub async fn seed_survey_food(self) {
        let database_url = "postgres://postgres:password@localhost";
        let db_pool = PgPool::connect_lazy(database_url).unwrap();
        let mut txn = db_pool.begin().await.unwrap();

        // products

        let products: Vec<Product> = self.survey_foods.iter().map(|food| food.into()).collect();

        let products_count = products.len();
        let products_batch_size = 1000;
        let products_batch_count = products_count / products_batch_size;

        for n in 0..=products_batch_count {
            let from = n * products_batch_size;
            let to = if n == products_batch_count {
                products_count
            } else {
                (n + 1) * products_batch_size
            };
            println!("products - from: {} to: {}", from, to);

            Product::seed_products(products[from..to].to_vec(), &mut txn).await;
        }

        // nutrition_facts

        let nutrition_facts: Vec<NutritionFacts> =
            self.survey_foods.iter().map(|food| food.into()).collect();

        let nutrition_facts_count = nutrition_facts.len();
        let nutrition_facts_batch_size = 800;
        let nutrition_facts_batch_count = nutrition_facts_count / nutrition_facts_batch_size;

        for n in 0..=nutrition_facts_batch_count {
            let from = n * nutrition_facts_batch_size;
            let to = if n == nutrition_facts_batch_count {
                nutrition_facts_count
            } else {
                (n + 1) * nutrition_facts_batch_size
            };
            println!("nutrition_facts - from: {} to: {}", from, to);

            NutritionFacts::seed_nutrition_facts(nutrition_facts[from..to].to_vec(), &mut txn)
                .await;
        }

        // custom_units

        let custom_units: HashSet<CustomUnit> = self
            .survey_foods
            .iter()
            .flat_map(|food| {
                food.food_portions
                    .iter()
                    .map(|fp| CustomUnit::new(fp, food.fdc_id.into()))
                    .collect::<Vec<CustomUnit>>()
            })
            .collect();

        let custom_units_vec: Vec<CustomUnit> = custom_units.into_iter().collect();

        let custom_units_count = custom_units_vec.len();
        let custom_units_batch_size = 1000;
        let custom_units_batch_count = custom_units_count / custom_units_batch_size;

        for n in 0..=custom_units_batch_count {
            let from = n * custom_units_batch_size;
            let to = if n == custom_units_batch_count {
                custom_units_count
            } else {
                (n + 1) * custom_units_batch_size
            };
            println!("custom_units - from: {} to: {}", from, to);

            CustomUnit::seed_custom_units(custom_units_vec[from..to].to_vec(), &mut txn).await;
        }

        txn.commit().await.unwrap();

        println!("done!");
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct SRLegacyFoodData {
    #[serde(rename = "SRLegacyFoods")]
    pub sr_legacy_foods: Vec<SRLegacyFoodItem>,
}

impl SRLegacyFoodData {
    pub async fn seed_sr_legacy_food(self) {
        let database_url = "postgres://postgres:password@localhost";
        let db_pool = PgPool::connect_lazy(database_url).unwrap();
        let mut txn = db_pool.begin().await.unwrap();

        // products

        let products: Vec<Product> = self
            .sr_legacy_foods
            .iter()
            .map(|food| food.into())
            .collect();

        let products_count = products.len();
        let products_batch_size = 1000;
        let products_batch_count = products_count / products_batch_size;

        for n in 0..=products_batch_count {
            let from = n * products_batch_size;
            let to = if n == products_batch_count {
                products_count
            } else {
                (n + 1) * products_batch_size
            };
            println!("products - from: {} to: {}", from, to);

            Product::seed_products(products[from..to].to_vec(), &mut txn).await;
        }

        // nutrition_facts

        let nutrition_facts: Vec<NutritionFacts> = self
            .sr_legacy_foods
            .iter()
            .map(|food| food.into())
            .collect();

        let nutrition_facts_count = nutrition_facts.len();
        let nutrition_facts_batch_size = 800;
        let nutrition_facts_batch_count = nutrition_facts_count / nutrition_facts_batch_size;

        for n in 0..=nutrition_facts_batch_count {
            let from = n * nutrition_facts_batch_size;
            let to = if n == nutrition_facts_batch_count {
                nutrition_facts_count
            } else {
                (n + 1) * nutrition_facts_batch_size
            };
            println!("nutrition_facts - from: {} to: {}", from, to);

            NutritionFacts::seed_nutrition_facts(nutrition_facts[from..to].to_vec(), &mut txn)
                .await;
        }

        // custom_units

        let custom_units: HashSet<CustomUnit> = self
            .sr_legacy_foods
            .iter()
            .flat_map(|food| {
                food.food_portions
                    .iter()
                    .map(|fp| CustomUnit::new(fp, food.fdc_id.into()))
                    .collect::<Vec<CustomUnit>>()
            })
            .collect();

        let custom_units_vec: Vec<CustomUnit> = custom_units.into_iter().collect();

        let custom_units_count = custom_units_vec.len();
        let custom_units_batch_size = 1000;
        let custom_units_batch_count = custom_units_count / custom_units_batch_size;

        for n in 0..=custom_units_batch_count {
            let from = n * custom_units_batch_size;
            let to = if n == custom_units_batch_count {
                custom_units_count
            } else {
                (n + 1) * custom_units_batch_size
            };
            println!("custom_units - from: {} to: {}", from, to);

            CustomUnit::seed_custom_units(custom_units_vec[from..to].to_vec(), &mut txn).await;
        }

        txn.commit().await.unwrap();

        println!("done!");
    }
}

#[derive(Serialize, Deserialize, Debug)]
pub struct BrandedFoodData {
    #[serde(rename = "BrandedFoods")]
    pub branded_foods: Vec<BrandedFoodItem>,
}

impl BrandedFoodData {
    pub async fn seed_branded_food(self) {
        let database_url = "postgres://postgres:password@localhost";
        let db_pool = PgPool::connect_lazy(database_url).unwrap();
        let mut txn = db_pool.begin().await.unwrap();

        // products

        let products: Vec<Product> = self.branded_foods.iter().map(|food| food.into()).collect();

        let products_count = products.len();
        let products_batch_size = 1000;
        let products_batch_count = products_count / products_batch_size;

        for n in 0..=products_batch_count {
            let from = n * products_batch_size;
            let to = if n == products_batch_count {
                products_count
            } else {
                (n + 1) * products_batch_size
            };
            println!("products - from: {} to: {}", from, to);

            Product::seed_products(products[from..to].to_vec(), &mut txn).await;
        }

        // nutrition_facts

        let nutrition_facts: Vec<NutritionFacts> =
            self.branded_foods.iter().map(|food| food.into()).collect();

        let nutrition_facts_count = nutrition_facts.len();
        let nutrition_facts_batch_size = 800;
        let nutrition_facts_batch_count = nutrition_facts_count / nutrition_facts_batch_size;

        for n in 0..=nutrition_facts_batch_count {
            let from = n * nutrition_facts_batch_size;
            let to = if n == nutrition_facts_batch_count {
                nutrition_facts_count
            } else {
                (n + 1) * nutrition_facts_batch_size
            };
            println!("nutrition_facts - from: {} to: {}", from, to);

            NutritionFacts::seed_nutrition_facts(nutrition_facts[from..to].to_vec(), &mut txn)
                .await;
        }

        txn.commit().await.unwrap();

        println!("done!");
    }
}
