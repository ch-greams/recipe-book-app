use actix_web::{web::Data, App, HttpServer};
use sqlx::PgPool;

use crate::{config::Config, utils::auth_setup};

mod config;
mod controllers;
mod types;
mod utils;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let config = Config::new().unwrap();

    println!("{:?}", config);

    let auth_certificate = auth_setup(&config.auth_api_url)
        .await
        .unwrap();

    let db_pool = PgPool::connect_lazy(&config.database_url).unwrap();

    HttpServer::new(move || {
        App::new()
            .app_data(Data::new(db_pool.clone()))
            .app_data(Data::new(auth_certificate.clone()))
            .configure(controllers::configure)
    })
    .bind(&config.listen_addr)?
    .run()
    .await
}
