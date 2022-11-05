use std::collections::HashSet;

use serde::{Deserialize, Serialize};
use sqlx::PgPool;

use crate::types::rba::{
    custom_unit::CustomUnit, nutrient::Nutrient, product::Product,
    product_nutrient::ProductNutrient,
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

        // product_nutrient

        let nutrient_mapping = Nutrient::get_nutrient_mapping(&mut txn).await;

        let product_nutrients: Vec<ProductNutrient> = self
            .foundation_foods
            .iter()
            .flat_map(|food| {
                ProductNutrient::from_food_nutrients(&food.food_nutrients, i64::from(food.fdc_id))
            })
            .collect();

        let product_nutrients_count = product_nutrients.len();
        let product_nutrients_batch_size = 20000;
        let product_nutrients_batch_count = product_nutrients_count / product_nutrients_batch_size;

        for n in 0..=product_nutrients_batch_count {
            let from = n * product_nutrients_batch_size;
            let to = if n == product_nutrients_batch_count {
                product_nutrients_count
            } else {
                (n + 1) * product_nutrients_batch_size
            };
            println!("product_nutrients - from: {} to: {}", from, to);

            ProductNutrient::seed_product_nutrients(
                product_nutrients[from..to].to_vec(),
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

        // product_nutrient

        let nutrient_mapping = Nutrient::get_nutrient_mapping(&mut txn).await;

        let product_nutrients: Vec<ProductNutrient> = self
            .survey_foods
            .iter()
            .flat_map(|food| {
                ProductNutrient::from_food_nutrients(&food.food_nutrients, i64::from(food.fdc_id))
            })
            .collect();

        let product_nutrients_count = product_nutrients.len();
        let product_nutrients_batch_size = 20000;
        let product_nutrients_batch_count = product_nutrients_count / product_nutrients_batch_size;

        for n in 0..=product_nutrients_batch_count {
            let from = n * product_nutrients_batch_size;
            let to = if n == product_nutrients_batch_count {
                product_nutrients_count
            } else {
                (n + 1) * product_nutrients_batch_size
            };
            println!("product_nutrients - from: {} to: {}", from, to);

            ProductNutrient::seed_product_nutrients(
                product_nutrients[from..to].to_vec(),
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

        // product_nutrient

        let nutrient_mapping = Nutrient::get_nutrient_mapping(&mut txn).await;

        let product_nutrients: Vec<ProductNutrient> = self
            .branded_foods
            .iter()
            .flat_map(|food| {
                ProductNutrient::from_food_nutrients(&food.food_nutrients, i64::from(food.fdc_id))
            })
            .collect();

        let product_nutrients_count = product_nutrients.len();
        let product_nutrients_batch_size = 20000;
        let product_nutrients_batch_count = product_nutrients_count / product_nutrients_batch_size;

        for n in 0..=product_nutrients_batch_count {
            let from = n * product_nutrients_batch_size;
            let to = if n == product_nutrients_batch_count {
                product_nutrients_count
            } else {
                (n + 1) * product_nutrients_batch_size
            };
            println!("product_nutrients - from: {} to: {}", from, to);

            ProductNutrient::seed_product_nutrients(
                product_nutrients[from..to].to_vec(),
                &nutrient_mapping,
                &mut txn,
            )
            .await;
        }

        txn.commit().await.unwrap();

        println!("done!");
    }
}
