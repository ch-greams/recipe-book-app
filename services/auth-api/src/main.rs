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
    println!("Starting app...");

    let config = Config::new().unwrap();
    let req_client = Client::new();

    let client_secret = Keycloak::new(&config.keycloak).bootstrap(&req_client).await;

    println!("App is listening on {:?}", config.listen_addr);

    HttpServer::new(move || {
        App::new()
            .app_data(Data::new(config.keycloak.clone()))
            .app_data(Data::new(client_secret.clone()))
            .app_data(Data::new(req_client.clone()))
            .configure(controllers::configure)
    })
    .bind(&config.listen_addr)?
    .run()
    .await
}
