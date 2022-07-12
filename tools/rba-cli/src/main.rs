use std::{collections::HashMap, thread, time::Instant};

use clap::{Args, Parser, Subcommand};
use types::usda::{
    archives::{BrandedFoodData, FoundationFoodData, SRLegacyFoodData, SurveyFoodData},
    food_parts::Nutrient,
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

            food_data.seed_foundation_food().await;
        }
        Commands::SeedSurveyFood(opts) => {
            let food_data_path = opts
                .food_data_path
                .as_deref()
                .unwrap_or("usda-data/FoodData_Central_survey_food_json_2021-10-28.json");

            let food_data: SurveyFoodData = utils::read_type_from_file(food_data_path).unwrap();

            food_data.seed_survey_food().await;
        }
        Commands::SeedLegacyFood(opts) => {
            let food_data_path = opts
                .food_data_path
                .as_deref()
                .unwrap_or("usda-data/FoodData_Central_sr_legacy_food_json_2021-10-28.json");

            let food_data: SRLegacyFoodData = utils::read_type_from_file(food_data_path).unwrap();

            food_data.seed_sr_legacy_food().await;
        }
        Commands::SeedBrandedFood(opts) => {
            let food_data_path = opts
                .food_data_path
                .as_deref()
                .unwrap_or("usda-data/FoodData_Central_branded_food_json_2022-04-28.json");

            let food_data: BrandedFoodData = utils::read_type_from_file(food_data_path).unwrap();

            food_data.seed_branded_food().await;
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

            Nutrient::seed_nutrients(nutrients_list).await;
        }
    }
}
