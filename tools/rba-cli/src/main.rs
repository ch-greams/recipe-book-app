use clap::{Args, Parser, Subcommand};
use types::usda::FoundationFoodData;

use crate::types::usda::{SurveyFoodData, SRLegacyFoodData, BrandedFoodData};

mod utils;
mod types;

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
    ReadFoundationFood(UsdaOpts),
    ReadSurveyFood(UsdaOpts),
    ReadLegacyFood(UsdaOpts),
    ReadBrandedFood(UsdaOpts),
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
        Commands::ReadFoundationFood(opts) => {
            let food_data_path = opts
                .food_data_path
                .as_deref()
                .unwrap_or("usda-data/FoodData_Central_foundation_food_json_2022-04-28.json");

            let food_data: FoundationFoodData =
                utils::read_type_from_file(food_data_path).unwrap();

            println!("{:?}", food_data.foundation_foods.len());
        }
        Commands::ReadSurveyFood(opts) => {
            let food_data_path = opts
                .food_data_path
                .as_deref()
                .unwrap_or("usda-data/FoodData_Central_survey_food_json_2021-10-28.json");

            let food_data: SurveyFoodData =
                utils::read_type_from_file(food_data_path).unwrap();

            println!("{:?}", food_data.survey_foods.len());
        }
        Commands::ReadLegacyFood(opts) => {
            let food_data_path = opts
                .food_data_path
                .as_deref()
                .unwrap_or("usda-data/FoodData_Central_sr_legacy_food_json_2021-10-28.json");

            let food_data: SRLegacyFoodData =
                utils::read_type_from_file(food_data_path).unwrap();

            println!("{:?}", food_data.sr_legacy_foods.len());
        }
        Commands::ReadBrandedFood(opts) => {
            let food_data_path = opts
                .food_data_path
                .as_deref()
                .unwrap_or("usda-data/FoodData_Central_branded_food_json_2022-04-28.json");

            let food_data: BrandedFoodData =
                utils::read_type_from_file(food_data_path).unwrap();

            println!("{:?}", food_data.branded_foods.len());
        }
    }
}
