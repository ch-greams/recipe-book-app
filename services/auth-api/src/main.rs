use crate::types::keycloak::Keycloak;
use actix_web::{web::Data, App, HttpServer};
use reqwest::Client;
use sqlx::PgPool;

use crate::config::Config;

mod config;
mod controllers;
mod services;
mod types;
mod utils;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Starting app...");

    let config = Config::new().unwrap();
    let req_client = Client::new();

    let kc = Keycloak::bootstrap(&config.keycloak, &req_client).await;

    let db_pool = PgPool::connect_lazy(&config.database_url).unwrap();

    println!("App is listening on {:?}", config.listen_addr);

    HttpServer::new(move || {
        App::new()
            .app_data(Data::new(kc.clone()))
            .app_data(Data::new(req_client.clone()))
            .app_data(Data::new(db_pool.clone()))
            .configure(controllers::configure)
    })
    .bind(&config.listen_addr)?
    .run()
    .await
}
