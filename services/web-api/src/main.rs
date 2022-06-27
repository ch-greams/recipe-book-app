use actix_web::{web::Data, App, HttpServer};
use sqlx::{migrate::Migrator, PgPool};

use crate::{config::Config, utils::seed_db};

mod config;
mod controllers;
mod types;
mod utils;

static MIGRATOR: Migrator = sqlx::migrate!("database/migrations");

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let config = Config::new().unwrap();

    println!("{:?}", config);

    let db_pool = PgPool::connect_lazy(&config.database_url).unwrap();

    MIGRATOR.run(&db_pool.clone()).await.unwrap();

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

    seed_db(db_pool.clone(), seed_list).await;

    HttpServer::new(move || {
        App::new()
            .app_data(Data::new(db_pool.clone()))
            .configure(controllers::configure)
    })
    .bind(&config.listen_addr)?
    .run()
    .await
}
