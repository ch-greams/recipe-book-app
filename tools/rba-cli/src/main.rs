use clap::{Args, Parser, Subcommand};

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
    }
}
