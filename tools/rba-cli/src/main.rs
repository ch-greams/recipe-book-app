use clap::{Parser, Args, Subcommand};
use sqlx::PgPool;

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
}

#[derive(Args)]
struct DatabaseOpts {
    #[clap(value_parser)]
    database_url: Option<String>,
}

#[tokio::main]
async fn main() {

    let cli_opts = CliOpts::parse();

    match &cli_opts.command {
        Commands::MigrateDatabase(opts) => {
            let database_url = opts.database_url.as_deref()
                .unwrap_or("postgres://postgres:password@localhost");

            migrate_db(database_url).await;
        },
        Commands::SeedDatabase(opts) => {
            let database_url = opts.database_url.as_deref()
                .unwrap_or("postgres://postgres:password@localhost");

            seed_db(database_url).await;
        }
    }
}

async fn migrate_db(database_url: &str) {
    println!("migrating database...");

    let db_pool = PgPool::connect_lazy(database_url).unwrap();

    sqlx::migrate!("database/migrations").run(&db_pool.clone()).await.unwrap();

    println!("migrating is complete!");
}

async fn seed_db(database_url: &str) {
    println!("seeding database...");

    let db_pool = PgPool::connect_lazy(database_url).unwrap();

    let seed_list = vec![
        "database/seeds/00_user.sql",
        "database/seeds/01_product.sql",
        "database/seeds/02_custom_unit.sql",
        "database/seeds/02_direction.sql",
        "database/seeds/02_favorite_product.sql",
        "database/seeds/02_ingredient.sql",
        "database/seeds/02_nutrition_fact.sql",
        "database/seeds/03_direction_part.sql",
        "database/seeds/03_ingredient_product.sql",
    ];

    utils::seed_db(db_pool.clone(), seed_list).await;

    println!("seeding is complete!");
}
