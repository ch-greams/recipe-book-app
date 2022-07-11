use std::{
    collections::{HashMap, HashSet},
    thread,
    time::Instant,
};

use clap::{Args, Parser, Subcommand};
use sqlx::{Executor, PgPool, Postgres, QueryBuilder};
use types::usda::FoundationFoodData;

use crate::types::{
    rba::{CustomUnit, NutritionFacts, Product},
    usda::{BrandedFoodData, Nutrient, SRLegacyFoodData, SurveyFoodData},
};

mod types;
mod utils;

#[derive(Parser)]
#[clap(author, version, about)]
struct CliOpts {
    #[clap(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    MigrateDatabase(DatabaseOpts),
    SeedDatabase(DatabaseOpts),
    SeedFoundationFood(UsdaOpts),
    SeedSurveyFood(UsdaOpts),
    SeedLegacyFood(UsdaOpts),
    SeedBrandedFood(UsdaOpts),
    SeedNutrients,
}

#[derive(Args)]
struct DatabaseOpts {
    #[clap(value_parser)]
    database_url: Option<String>,
}

#[derive(Args)]
struct UsdaOpts {
    #[clap(value_parser)]
    food_data_path: Option<String>,
}

const BIND_LIMIT: usize = 65535;

const NUTRITION_FACTS_FIELDS: &[&str] = &[
    "product_id",
    "energy",
    "carbohydrate",
    "dietary_fiber",
    "starch",
    "sugars",
    "fat",
    "monounsaturated",
    "polyunsaturated",
    "omega_3",
    "omega_6",
    "saturated",
    "trans_fats",
    "cholesterol",
    "phytosterol",
    "protein",
    "tryptophan",
    "threonine",
    "isoleucine",
    "leucine",
    "lysine",
    "methionine",
    "cystine",
    "phenylalanine",
    "tyrosine",
    "valine",
    "arginine",
    "histidine",
    "alanine",
    "aspartic_acid",
    "glutamic_acid",
    "glycine",
    "proline",
    "serine",
    "hydroxyproline",
    "vitamin_a",
    "vitamin_c",
    "vitamin_d",
    "vitamin_e",
    "vitamin_k",
    "vitamin_b1",
    "vitamin_b2",
    "vitamin_b3",
    "vitamin_b5",
    "vitamin_b6",
    "vitamin_b7",
    "vitamin_b9",
    "vitamin_b12",
    "choline",
    "betaine",
    "calcium",
    "iron",
    "magnesium",
    "phosphorus",
    "potassium",
    "sodium",
    "zinc",
    "copper",
    "manganese",
    "selenium",
    "fluoride",
    "chloride",
    "chromium",
    "iodine",
    "molybdenum",
    "alcohol",
    "water",
    "ash",
    "caffeine",
];

async fn seed_products(products: Vec<Product>, txn: impl Executor<'_, Database = Postgres>) {
    let mut products_query_builder: QueryBuilder<Postgres> = QueryBuilder::new(
        "INSERT INTO private.product (id, type, name, brand, subtitle, description, density, serving_size, created_by, is_private, created_at, updated_at) "
    );

    products_query_builder.push_values(products.iter().take(BIND_LIMIT / 12), |mut b, product| {
        b.push_bind(product.id)
            .push_bind(&product.product_type)
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
    });

    let products_query = products_query_builder.build();

    let products_response = products_query.execute(txn).await.unwrap();

    println!(
        "{} product records created",
        products_response.rows_affected()
    );
}

async fn seed_nutrition_facts(
    nutrition_facts: Vec<NutritionFacts>,
    txn: impl Executor<'_, Database = Postgres>,
) {
    let query_text = format!(
        "INSERT INTO private.nutrition_fact ({field_names}) ",
        field_names = NUTRITION_FACTS_FIELDS.join(", "),
    );

    let mut nutrition_facts_query_builder: QueryBuilder<Postgres> = QueryBuilder::new(query_text);

    nutrition_facts_query_builder.push_values(
        nutrition_facts.iter().take(BIND_LIMIT / 69),
        |mut b, nutrition_fact| {
            b.push_bind(nutrition_fact.product_id)
                .push_bind(nutrition_fact.energy)
                .push_bind(nutrition_fact.carbohydrate)
                .push_bind(nutrition_fact.dietary_fiber)
                .push_bind(nutrition_fact.starch)
                .push_bind(nutrition_fact.sugars)
                .push_bind(nutrition_fact.fat)
                .push_bind(nutrition_fact.monounsaturated)
                .push_bind(nutrition_fact.polyunsaturated)
                .push_bind(nutrition_fact.omega_3)
                .push_bind(nutrition_fact.omega_6)
                .push_bind(nutrition_fact.saturated)
                .push_bind(nutrition_fact.trans_fats)
                .push_bind(nutrition_fact.cholesterol)
                .push_bind(nutrition_fact.phytosterol)
                .push_bind(nutrition_fact.protein)
                .push_bind(nutrition_fact.tryptophan)
                .push_bind(nutrition_fact.threonine)
                .push_bind(nutrition_fact.isoleucine)
                .push_bind(nutrition_fact.leucine)
                .push_bind(nutrition_fact.lysine)
                .push_bind(nutrition_fact.methionine)
                .push_bind(nutrition_fact.cystine)
                .push_bind(nutrition_fact.phenylalanine)
                .push_bind(nutrition_fact.tyrosine)
                .push_bind(nutrition_fact.valine)
                .push_bind(nutrition_fact.arginine)
                .push_bind(nutrition_fact.histidine)
                .push_bind(nutrition_fact.alanine)
                .push_bind(nutrition_fact.aspartic_acid)
                .push_bind(nutrition_fact.glutamic_acid)
                .push_bind(nutrition_fact.glycine)
                .push_bind(nutrition_fact.proline)
                .push_bind(nutrition_fact.serine)
                .push_bind(nutrition_fact.hydroxyproline)
                .push_bind(nutrition_fact.vitamin_a)
                .push_bind(nutrition_fact.vitamin_c)
                .push_bind(nutrition_fact.vitamin_d)
                .push_bind(nutrition_fact.vitamin_e)
                .push_bind(nutrition_fact.vitamin_k)
                .push_bind(nutrition_fact.vitamin_b1)
                .push_bind(nutrition_fact.vitamin_b2)
                .push_bind(nutrition_fact.vitamin_b3)
                .push_bind(nutrition_fact.vitamin_b5)
                .push_bind(nutrition_fact.vitamin_b6)
                .push_bind(nutrition_fact.vitamin_b7)
                .push_bind(nutrition_fact.vitamin_b9)
                .push_bind(nutrition_fact.vitamin_b12)
                .push_bind(nutrition_fact.choline)
                .push_bind(nutrition_fact.betaine)
                .push_bind(nutrition_fact.calcium)
                .push_bind(nutrition_fact.iron)
                .push_bind(nutrition_fact.magnesium)
                .push_bind(nutrition_fact.phosphorus)
                .push_bind(nutrition_fact.potassium)
                .push_bind(nutrition_fact.sodium)
                .push_bind(nutrition_fact.zinc)
                .push_bind(nutrition_fact.copper)
                .push_bind(nutrition_fact.manganese)
                .push_bind(nutrition_fact.selenium)
                .push_bind(nutrition_fact.fluoride)
                .push_bind(nutrition_fact.chloride)
                .push_bind(nutrition_fact.chromium)
                .push_bind(nutrition_fact.iodine)
                .push_bind(nutrition_fact.molybdenum)
                .push_bind(nutrition_fact.alcohol)
                .push_bind(nutrition_fact.water)
                .push_bind(nutrition_fact.ash)
                .push_bind(nutrition_fact.caffeine);
        },
    );

    let nutrition_facts_query = nutrition_facts_query_builder.build();

    let nutrition_facts_response = nutrition_facts_query.execute(txn).await.unwrap();

    println!(
        "{} nutrition_fact records created",
        nutrition_facts_response.rows_affected()
    );
}

async fn seed_custom_units(
    custom_units: Vec<CustomUnit>,
    txn: impl Executor<'_, Database = Postgres>,
) {
    let mut custom_units_query_builder: QueryBuilder<Postgres> =
        QueryBuilder::new("INSERT INTO private.custom_unit (product_id, name, amount, unit) ");

    custom_units_query_builder.push_values(
        custom_units.iter().take(BIND_LIMIT / 4),
        |mut b, custom_unit| {
            b.push_bind(custom_unit.product_id)
                .push_bind(&custom_unit.name)
                .push_bind(&custom_unit.amount)
                .push_bind(&custom_unit.unit);
        },
    );

    let custom_units_query = custom_units_query_builder.build();

    let custom_units_response = custom_units_query.execute(txn).await.unwrap();

    println!(
        "{} custom_unit records created",
        custom_units_response.rows_affected()
    );
}

async fn seed_foundation_food(food_data: FoundationFoodData) {
    let database_url = "postgres://postgres:password@localhost";
    let db_pool = PgPool::connect_lazy(database_url).unwrap();
    let mut txn = db_pool.begin().await.unwrap();

    // products

    let products: Vec<Product> = food_data
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

        seed_products(products[from..to].to_vec(), &mut txn).await;
    }

    // nutrition_facts

    let nutrition_facts: Vec<NutritionFacts> = food_data
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

        seed_nutrition_facts(nutrition_facts[from..to].to_vec(), &mut txn).await;
    }

    // custom_units

    let custom_units: HashSet<CustomUnit> = food_data
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

        seed_custom_units(custom_units_vec[from..to].to_vec(), &mut txn).await;
    }

    txn.commit().await.unwrap();

    println!("done!");
}

async fn seed_branded_food(food_data: BrandedFoodData) {
    let database_url = "postgres://postgres:password@localhost";
    let db_pool = PgPool::connect_lazy(database_url).unwrap();
    let mut txn = db_pool.begin().await.unwrap();

    // products

    let products: Vec<Product> = food_data
        .branded_foods
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

        seed_products(products[from..to].to_vec(), &mut txn).await;
    }

    // nutrition_facts

    let nutrition_facts: Vec<NutritionFacts> = food_data
        .branded_foods
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

        seed_nutrition_facts(nutrition_facts[from..to].to_vec(), &mut txn).await;
    }

    txn.commit().await.unwrap();

    println!("done!");
}

async fn seed_survey_food(food_data: SurveyFoodData) {
    let database_url = "postgres://postgres:password@localhost";
    let db_pool = PgPool::connect_lazy(database_url).unwrap();
    let mut txn = db_pool.begin().await.unwrap();

    // products

    let products: Vec<Product> = food_data
        .survey_foods
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

        seed_products(products[from..to].to_vec(), &mut txn).await;
    }

    // nutrition_facts

    let nutrition_facts: Vec<NutritionFacts> = food_data
        .survey_foods
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

        seed_nutrition_facts(nutrition_facts[from..to].to_vec(), &mut txn).await;
    }

    // custom_units

    let custom_units: HashSet<CustomUnit> = food_data
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

        seed_custom_units(custom_units_vec[from..to].to_vec(), &mut txn).await;
    }

    txn.commit().await.unwrap();

    println!("done!");
}

async fn seed_nutrients(nutrients: Vec<Nutrient>) {
    let start = Instant::now();

    let database_url = "postgres://postgres:password@localhost:8001";
    let db_pool = PgPool::connect_lazy(database_url).unwrap();
    let mut txn = db_pool.begin().await.unwrap();

    let mut nutrients_query_builder: QueryBuilder<Postgres> =
        QueryBuilder::new("INSERT INTO usda.nutrient (id, number, name, rank, unit_name) ");

    nutrients_query_builder.push_values(
        nutrients.iter().take(BIND_LIMIT / 5),
        |mut b, nutrient| {
            b.push_bind(i64::from(nutrient.id))
                .push_bind(&nutrient.number)
                .push_bind(&nutrient.name)
                .push_bind(nutrient.rank.map(i64::from))
                .push_bind(&nutrient.unit_name);
        },
    );

    let nutrients_query = nutrients_query_builder.build();

    let nutrients_response = nutrients_query.execute(&mut txn).await.unwrap();

    txn.commit().await.unwrap();

    let duration = start.elapsed();

    println!(
        "Inserted {:?} nutrients in {:?}",
        nutrients_response.rows_affected(),
        duration
    );
}

#[tokio::main]
async fn main() {
    let cli_opts = CliOpts::parse();

    match &cli_opts.command {
        Commands::MigrateDatabase(opts) => {
            let database_url = opts
                .database_url
                .as_deref()
                .unwrap_or("postgres://postgres:password@localhost");

            utils::migrate_db(database_url).await;
        }
        Commands::SeedDatabase(opts) => {
            let database_url = opts
                .database_url
                .as_deref()
                .unwrap_or("postgres://postgres:password@localhost");

            utils::seed_db(database_url).await;
        }
        Commands::SeedFoundationFood(opts) => {
            let food_data_path = opts
                .food_data_path
                .as_deref()
                .unwrap_or("usda-data/FoodData_Central_foundation_food_json_2022-04-28.json");

            let food_data: FoundationFoodData = utils::read_type_from_file(food_data_path).unwrap();

            seed_foundation_food(food_data).await;
        }
        Commands::SeedSurveyFood(opts) => {
            let food_data_path = opts
                .food_data_path
                .as_deref()
                .unwrap_or("usda-data/FoodData_Central_survey_food_json_2021-10-28.json");

            let food_data: SurveyFoodData = utils::read_type_from_file(food_data_path).unwrap();

            seed_survey_food(food_data).await;
        }
        Commands::SeedLegacyFood(opts) => {
            let food_data_path = opts
                .food_data_path
                .as_deref()
                .unwrap_or("usda-data/FoodData_Central_sr_legacy_food_json_2021-10-28.json");

            let food_data: SRLegacyFoodData = utils::read_type_from_file(food_data_path).unwrap();

            println!("{:?}", food_data.sr_legacy_foods.len());
        }
        Commands::SeedBrandedFood(opts) => {
            let food_data_path = opts
                .food_data_path
                .as_deref()
                .unwrap_or("usda-data/FoodData_Central_branded_food_json_2022-04-28.json");

            let food_data: BrandedFoodData = utils::read_type_from_file(food_data_path).unwrap();

            seed_branded_food(food_data).await;
        }
        Commands::SeedNutrients => {
            let start = Instant::now();

            let mut nutrients: HashMap<u32, Nutrient> = HashMap::new();

            // foundation_food

            let foundation_food_thread = thread::spawn(|| {
                let foundation_food_path =
                    "usda-data/FoodData_Central_foundation_food_json_2022-04-28.json";
                let foundation_food_data: FoundationFoodData =
                    utils::read_type_from_file(foundation_food_path).unwrap();

                foundation_food_data
                    .foundation_foods
                    .iter()
                    .flat_map(|food_item| &food_item.food_nutrients)
                    .map(|food_nutrient| {
                        (food_nutrient.nutrient.id, food_nutrient.nutrient.clone())
                    })
                    .collect::<HashMap<u32, Nutrient>>()
            });

            // survey_food

            let survey_food_thread = thread::spawn(|| {
                let survey_food_path =
                    "usda-data/FoodData_Central_survey_food_json_2021-10-28.json";
                let survey_food_data: SurveyFoodData =
                    utils::read_type_from_file(survey_food_path).unwrap();

                survey_food_data
                    .survey_foods
                    .iter()
                    .flat_map(|food_item| &food_item.food_nutrients)
                    .map(|food_nutrient| {
                        (food_nutrient.nutrient.id, food_nutrient.nutrient.clone())
                    })
                    .collect::<HashMap<u32, Nutrient>>()
            });

            // sr_legacy_food

            let sr_legacy_food_thread = thread::spawn(|| {
                let sr_legacy_food_path =
                    "usda-data/FoodData_Central_sr_legacy_food_json_2021-10-28.json";
                let sr_legacy_food_data: SRLegacyFoodData =
                    utils::read_type_from_file(sr_legacy_food_path).unwrap();

                sr_legacy_food_data
                    .sr_legacy_foods
                    .iter()
                    .flat_map(|food_item| &food_item.food_nutrients)
                    .map(|food_nutrient| {
                        (food_nutrient.nutrient.id, food_nutrient.nutrient.clone())
                    })
                    .collect::<HashMap<u32, Nutrient>>()
            });

            // branded_food

            let branded_food_thread = thread::spawn(|| {
                let branded_food_path =
                    "usda-data/FoodData_Central_branded_food_json_2022-04-28.json";
                let branded_food_data: BrandedFoodData =
                    utils::read_type_from_file(branded_food_path).unwrap();

                branded_food_data
                    .branded_foods
                    .iter()
                    .flat_map(|food_item| &food_item.food_nutrients)
                    .map(|food_nutrient| {
                        (food_nutrient.nutrient.id, food_nutrient.nutrient.clone())
                    })
                    .collect::<HashMap<u32, Nutrient>>()
            });

            let foundation_nutrients = foundation_food_thread.join().unwrap();
            let survey_nutrients = survey_food_thread.join().unwrap();
            let sr_legacy_nutrients = sr_legacy_food_thread.join().unwrap();
            let branded_nutrients = branded_food_thread.join().unwrap();

            nutrients.extend(foundation_nutrients.into_iter());
            nutrients.extend(survey_nutrients.into_iter());
            nutrients.extend(sr_legacy_nutrients.into_iter());
            nutrients.extend(branded_nutrients.into_iter());

            let nutrients_list: Vec<Nutrient> = nutrients.into_values().collect();

            let duration = start.elapsed();

            println!(
                "Parsed {:?} nutrients in {:?}",
                nutrients_list.len(),
                duration
            );

            seed_nutrients(nutrients_list).await;
        }
    }
}
