use crate::types::keycloak::Keycloak;
use actix_web::{web::Data, App, HttpServer};
use reqwest::Client;

use crate::config::Config;

mod config;
mod controllers;
mod services;
mod types;
mod utils;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let config = Config::new().unwrap();
    println!("{:?}", config);

    Keycloak::new(config.keycloak).bootstrap().await;

    let client = Client::new();

    HttpServer::new(move || {
        App::new()
            .app_data(Data::new(client.clone()))
            .configure(controllers::configure)
    })
    .bind(&config.listen_addr)?
    .run()
    .await
}
