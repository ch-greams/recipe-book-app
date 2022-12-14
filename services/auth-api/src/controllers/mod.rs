use actix_web::{
    get,
    http::header,
    post,
    web::{Data, Form, ServiceConfig},
    HttpResponse, Responder,
};
use jsonwebtoken::Algorithm;
use reqwest::Client;
use serde::{Deserialize, Serialize};

use crate::{
    config::KeycloakConfig,
    services::openid::{get_access_token, get_admin_access_token, TokenRequest},
    types::{
        error::Error,
        keycloak::{
            realm::{KeycloakRealmCertificateAlgorithm, KeycloakRealmCertificates},
            user::KeycloakUser,
        },
    },
};

pub fn configure(config: &mut ServiceConfig) {
    config.service(
        actix_web::web::scope("/api/v1")
            .service(login)
            .service(signup)
            .service(certificate)
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
    client_secret: Data<String>,
    req_client: Data<Client>,
) -> Result<HttpResponse, Error> {
    let token_request = TokenRequest::new(&form.username, &form.password, &client_secret);

    let access_token = get_access_token(&req_client, &token_request, &keycloak_config.url).await?;

    let set_cookie_value = format!(
        "access_token={access_token}; SameSite=Strict; Path=/; Max-Age={expires_in}",
        access_token = access_token.access_token,
        expires_in = access_token.expires_in
    );

    let response = HttpResponse::Ok()
        .insert_header((header::SET_COOKIE, set_cookie_value))
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

#[derive(Serialize, Debug)]
pub struct CertificateResponse {
    pub kid: String,
    pub kty: String,
    pub alg: Algorithm,
    pub n: String,
    pub e: String,
}

#[get("/certificate")]
async fn certificate(
    keycloak_config: Data<KeycloakConfig>,
    req_client: Data<Client>,
) -> Result<HttpResponse, Error> {
    let response = KeycloakRealmCertificates::query(&req_client, &keycloak_config.url).await?;

    let rsa_key = response
        .keys
        .iter()
        .find(|cert| cert.alg == KeycloakRealmCertificateAlgorithm::RS256);

    Ok(HttpResponse::Ok().json(rsa_key))
}
