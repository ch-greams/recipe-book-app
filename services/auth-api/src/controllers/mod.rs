use actix_web::{
    get,
    http::header,
    post,
    web::{Data, Form, ServiceConfig},
    HttpResponse, Responder,
};
use reqwest::Client;
use serde::Deserialize;

use crate::{services::openid::get_token, types::error::Error};

pub fn configure(config: &mut ServiceConfig) {
    config.service(
        actix_web::web::scope("/api/v1")
            .service(login)
            .service(signup)
            .service(health),
    );
}

#[get("/health")]
async fn health() -> impl Responder {
    HttpResponse::Ok().body("API is healthy")
}

#[derive(Deserialize, Clone, Debug)]
pub struct LoginForm {
    pub username: String,
    pub password: String,
}

#[post("/login")]
async fn login(
    form: Form<LoginForm>,
    keycloak_url: Data<String>,
    req_client: Data<Client>,
) -> Result<HttpResponse, Error> {
    let access_token = get_token(&req_client, &form.clone().into(), &keycloak_url).await?;

    let response = HttpResponse::Ok()
        .insert_header((header::SET_COOKIE, format!("access_token={}", access_token)))
        .finish();

    Ok(response)
}

#[post("/signup")]
async fn signup() -> impl Responder {
    HttpResponse::NotImplemented()
}
