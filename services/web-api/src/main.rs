use actix_web::{web::Data, App, HttpServer};
use sqlx::PgPool;

use crate::config::Config;

mod config;
mod controllers;
mod types;
mod utils;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let config = Config::new().unwrap();

    println!("{:?}", config);

    let db_pool = PgPool::connect_lazy(&config.database_url).unwrap();

    HttpServer::new(move || {
        App::new()
            .app_data(Data::new(db_pool.clone()))
            .configure(controllers::configure)
    })
    .bind(&config.listen_addr)?
    .run()
    .await
}
