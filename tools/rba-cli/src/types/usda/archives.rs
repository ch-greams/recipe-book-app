use std::collections::HashSet;

use serde::{Deserialize, Serialize};
use sqlx::PgPool;

use crate::types::rba::{
    custom_unit::CustomUnit, food::Food, food_nutrient::FoodNutrient, nutrient::Nutrient,
};

use super::foods::{BrandedFoodItem, FoundationFoodItem, SurveyFoodItem};

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

        // foods

        let foods: Vec<Food> = self
            .foundation_foods
            .iter()
            .map(|food| food.into())
            .collect();

        let foods_count = foods.len();
        let foods_batch_size = 1000;
        let foods_batch_count = foods_count / foods_batch_size;

        for n in 0..=foods_batch_count {
            let from = n * foods_batch_size;
            let to = if n == foods_batch_count {
                foods_count
            } else {
                (n + 1) * foods_batch_size
            };
            println!("foods - from: {from} to: {to}");

            Food::seed_foods(foods[from..to].to_vec(), &mut txn).await;
        }

        // food_nutrient

        let nutrient_mapping = Nutrient::get_nutrient_mapping(&mut txn).await;

        let food_nutrients: Vec<FoodNutrient> = self
            .foundation_foods
            .iter()
            .flat_map(|food| {
                FoodNutrient::from_usda_food_nutrients(&food.food_nutrients, i64::from(food.fdc_id))
            })
            .collect();

        let food_nutrients_count = food_nutrients.len();
        let food_nutrients_batch_size = 20000;
        let food_nutrients_batch_count = food_nutrients_count / food_nutrients_batch_size;

        for n in 0..=food_nutrients_batch_count {
            let from = n * food_nutrients_batch_size;
            let to = if n == food_nutrients_batch_count {
                food_nutrients_count
            } else {
                (n + 1) * food_nutrients_batch_size
            };
            println!("food_nutrients - from: {from} to: {to}");

            FoodNutrient::seed_food_nutrients(
                food_nutrients[from..to].to_vec(),
                &nutrient_mapping,
                &mut txn,
            )
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
            println!("custom_units - from: {from} to: {to}");

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

        // foods

        let foods: Vec<Food> = self.survey_foods.iter().map(|food| food.into()).collect();

        let foods_count = foods.len();
        let foods_batch_size = 1000;
        let foods_batch_count = foods_count / foods_batch_size;

        for n in 0..=foods_batch_count {
            let from = n * foods_batch_size;
            let to = if n == foods_batch_count {
                foods_count
            } else {
                (n + 1) * foods_batch_size
            };
            println!("foods - from: {from} to: {to}");

            Food::seed_foods(foods[from..to].to_vec(), &mut txn).await;
        }

        // food_nutrient

        let nutrient_mapping = Nutrient::get_nutrient_mapping(&mut txn).await;

        let food_nutrients: Vec<FoodNutrient> = self
            .survey_foods
            .iter()
            .flat_map(|food| {
                FoodNutrient::from_usda_food_nutrients(&food.food_nutrients, i64::from(food.fdc_id))
            })
            .collect();

        let food_nutrients_count = food_nutrients.len();
        let food_nutrients_batch_size = 20000;
        let food_nutrients_batch_count = food_nutrients_count / food_nutrients_batch_size;

        for n in 0..=food_nutrients_batch_count {
            let from = n * food_nutrients_batch_size;
            let to = if n == food_nutrients_batch_count {
                food_nutrients_count
            } else {
                (n + 1) * food_nutrients_batch_size
            };
            println!("food_nutrients - from: {from} to: {to}");

            FoodNutrient::seed_food_nutrients(
                food_nutrients[from..to].to_vec(),
                &nutrient_mapping,
                &mut txn,
            )
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
            println!("custom_units - from: {from} to: {to}");

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

        // foods

        let foods: Vec<Food> = self.branded_foods.iter().map(|food| food.into()).collect();

        let foods_count = foods.len();
        let foods_batch_size = 1000;
        let foods_batch_count = foods_count / foods_batch_size;

        for n in 0..=foods_batch_count {
            let from = n * foods_batch_size;
            let to = if n == foods_batch_count {
                foods_count
            } else {
                (n + 1) * foods_batch_size
            };
            println!("foods - from: {from} to: {to}");

            Food::seed_foods(foods[from..to].to_vec(), &mut txn).await;
        }

        // food_nutrient

        let nutrient_mapping = Nutrient::get_nutrient_mapping(&mut txn).await;

        let food_nutrients: Vec<FoodNutrient> = self
            .branded_foods
            .iter()
            .flat_map(|food| {
                FoodNutrient::from_usda_food_nutrients(&food.food_nutrients, i64::from(food.fdc_id))
            })
            .collect();

        let food_nutrients_count = food_nutrients.len();
        let food_nutrients_batch_size = 20000;
        let food_nutrients_batch_count = food_nutrients_count / food_nutrients_batch_size;

        for n in 0..=food_nutrients_batch_count {
            let from = n * food_nutrients_batch_size;
            let to = if n == food_nutrients_batch_count {
                food_nutrients_count
            } else {
                (n + 1) * food_nutrients_batch_size
            };
            println!("food_nutrients - from: {from} to: {to}");

            FoodNutrient::seed_food_nutrients(
                food_nutrients[from..to].to_vec(),
                &nutrient_mapping,
                &mut txn,
            )
            .await;
        }

        txn.commit().await.unwrap();

        println!("done!");
    }
}
