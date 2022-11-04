use std::time::Instant;

use clap::{Args, Parser, Subcommand};
use types::usda::archives::{BrandedFoodData, FoundationFoodData, SurveyFoodData};

use crate::types::meta::nutrient::Nutrient;

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
    SeedBrandedFood(UsdaOpts),
    SeedNutrients(UsdaOpts),
}

#[derive(Args)]
struct DatabaseOpts {
    #[clap(value_parser)]
    database_url: Option<String>,
}

#[derive(Args)]
struct UsdaOpts {
    #[clap(value_parser)]
    file_path: Option<String>,
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
                .file_path
                .as_deref()
                .unwrap_or("usda-data/FoodData_Central_foundation_food_json_2022-10-28.json");

            println!("reading data from '{}'...", food_data_path);

            let food_data: FoundationFoodData = utils::read_json_file(food_data_path).unwrap();

            food_data.seed_foundation_food().await;
        }
        Commands::SeedSurveyFood(opts) => {
            let food_data_path = opts
                .file_path
                .as_deref()
                .unwrap_or("usda-data/FoodData_Central_survey_food_json_2022-10-28.json");

            println!("reading data from '{}'...", food_data_path);

            let food_data: SurveyFoodData = utils::read_json_file(food_data_path).unwrap();

            food_data.seed_survey_food().await;
        }
        Commands::SeedBrandedFood(opts) => {
            let food_data_path = opts
                .file_path
                .as_deref()
                .unwrap_or("usda-data/FoodData_Central_branded_food_json_2022-10-28.json");

            println!("reading data from '{}'...", food_data_path);

            let food_data: BrandedFoodData = utils::read_json_file(food_data_path).unwrap();

            food_data.seed_branded_food().await;
        }
        Commands::SeedNutrients(opts) => {
            let supporting_data_path = opts.file_path.as_deref().unwrap_or(
                "usda-data/FoodData_Central_Supporting_Data_csv_2022-04-28/nutrient.csv",
            );

            let start = Instant::now();

            let nutrients: Vec<Nutrient> = utils::read_csv_file(supporting_data_path).unwrap();

            let duration = start.elapsed();

            println!("Parsed {:?} nutrients in {:?}", nutrients.len(), duration);

            Nutrient::seed_nutrients(nutrients).await;
        }
    }
}
