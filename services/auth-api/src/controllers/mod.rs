use actix_web::{
    get,
    http::header,
    post,
    web::{Data, Form, ServiceConfig},
    HttpResponse, Responder,
};
use reqwest::Client;
use serde::Deserialize;

use crate::{
    config::KeycloakConfig,
    services::openid::{get_access_token, get_admin_access_token},
    types::{error::Error, keycloak::user::KeycloakUser},
};

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
    keycloak_config: Data<KeycloakConfig>,
    req_client: Data<Client>,
) -> Result<HttpResponse, Error> {
    let access_token = get_access_token(&req_client, &form.clone().into(), &keycloak_config.url).await?;

    let response = HttpResponse::Ok()
        .insert_header((header::SET_COOKIE, format!("access_token={}", access_token)))
        .finish();

    Ok(response)
}

#[derive(Deserialize, Clone, Debug)]
pub struct SignupForm {
    pub email: String,
    pub password: String,

    pub first_name: String,
    pub last_name: String,
}

#[post("/signup")]
async fn signup(
    form: Form<SignupForm>,
    keycloak_config: Data<KeycloakConfig>,
    req_client: Data<Client>,
) -> Result<HttpResponse, Error> {
    let admin_access_token = get_admin_access_token(&req_client, &keycloak_config).await?;

    let user: KeycloakUser = form.clone().into();
    let response = user
        .create(&req_client, &keycloak_config.url, &admin_access_token)
        .await?;

    Ok(HttpResponse::new(response))
}
