use serde::{Deserialize, Serialize};

use chrono::{DateTime, Utc};
use sqlx::{Executor, Postgres, QueryBuilder};

use crate::{
    types::usda::{
        foods::{BrandedFoodItem, FoundationFoodItem, SurveyFoodItem},
        support::FoodPortion,
    },
    utils::BIND_LIMIT,
};

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct Product {
    pub id: i64,
    pub is_recipe: bool,
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

impl Product {
    pub async fn seed_products(
        products: Vec<Product>,
        txn: impl Executor<'_, Database = Postgres>,
    ) {
        let mut products_query_builder: QueryBuilder<Postgres> = QueryBuilder::new(
            "INSERT INTO product.product (id, is_recipe, name, brand, subtitle, description, density, serving_size, created_by, is_private, created_at, updated_at) "
        );

        products_query_builder.push_values(
            products.iter().take(BIND_LIMIT / 12),
            |mut b, product| {
                b.push_bind(product.id)
                    .push_bind(product.is_recipe)
                    .push_bind(&product.name)
                    .push_bind(&product.brand)
                    .push_bind(&product.subtitle)
                    .push_bind(&product.description)
                    .push_bind(product.density)
                    .push_bind(product.serving_size)
                    .push_bind(product.created_by)
                    .push_bind(product.is_private)
                    .push_bind(product.created_at)
                    .push_bind(product.updated_at);
            },
        );

        let products_query = products_query_builder.build();

        let products_response = products_query.execute(txn).await.unwrap();

        println!(
            "{} product records created",
            products_response.rows_affected()
        );
    }
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
            is_recipe: false,

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
            is_recipe: false,

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
            is_recipe: false,

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
