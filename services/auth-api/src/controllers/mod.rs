use actix_web::{
    get,
    http::header,
    post,
    web::{Data, Form, ServiceConfig},
    HttpResponse, Responder,
};
use reqwest::Client;
use secrecy::Secret;
use serde::Deserialize;
use sqlx::{Pool, Postgres};

use crate::{
    services::openid::{get_access_token, TokenRequest},
    types::{
        error::Error,
        keycloak::{
            realm::{KeycloakRealmCertificateAlgorithm, KeycloakRealmCertificates},
            user::KeycloakUser,
            Keycloak,
        },
        user::{CreateUserPayload, User},
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
    pub password: Secret<String>,
}

#[post("/login")]
async fn login(
    form: Form<LoginForm>,
    kc: Data<Keycloak>,
    req_client: Data<Client>,
) -> Result<HttpResponse, Error> {
    let token_request = TokenRequest::rb_web_api(&form.username, &form.password, &kc.client_secret);

    let access_token = get_access_token(&req_client, &token_request, &kc.url).await?;

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
    kc: Data<Keycloak>,
    req_client: Data<Client>,
    db_pool: Data<Pool<Postgres>>,
) -> Result<HttpResponse, Error> {
    let token_payload = TokenRequest::admin_cli(&kc.admin_username, &kc.admin_password);
    let admin_access_token = get_access_token(&req_client, &token_payload, &kc.url)
        .await?
        .access_token;

    let mut txn = db_pool.begin().await?;

    let create_user_payload = CreateUserPayload {
        email: form.email.clone(),
        first_name: form.first_name.clone(),
        last_name: form.last_name.clone(),
    };

    let user = User::create(&create_user_payload, &mut txn).await?;

    let user: KeycloakUser = KeycloakUser::new(
        &form.email,
        &form.first_name,
        &form.last_name,
        &form.password,
        user.id,
    );
    let user_brief = user
        .create(&req_client, &kc.url, &admin_access_token)
        .await?;

    KeycloakUser::assign_realm_roles(
        &req_client,
        &user_brief.id,
        &kc.default_user_roles,
        &kc.url,
        &admin_access_token,
    )
    .await?;

    txn.commit().await?;

    Ok(HttpResponse::Created().json(user_brief))
}

#[get("/certificate")]
async fn certificate(kc: Data<Keycloak>, req_client: Data<Client>) -> Result<HttpResponse, Error> {
    let response = KeycloakRealmCertificates::query(&req_client, &kc.url).await?;

    let rsa_key = response
        .keys
        .iter()
        .find(|cert| cert.alg == KeycloakRealmCertificateAlgorithm::RS256);

    Ok(HttpResponse::Ok().json(rsa_key))
}

#[cfg(test)]
mod tests {
    use std::time::{SystemTime, UNIX_EPOCH};

    use actix_web::{test, web::Data, App};
    use reqwest::Client;
    use serde_json::json;
    use sqlx::{PgPool, Pool, Postgres};

    use crate::{config::Config, controllers::configure, types::keycloak::Keycloak};

    // NOTE: Should be ok to rerun multiple times in parallel
    // NOTE: In a perfect world you would use `before all` and/or std::sync::Once, but bootstrap requires async call
    async fn setup_data() -> (Keycloak, Client, Pool<Postgres>) {
        let config = Config::new().unwrap();
        let req_client = Client::new();

        let kc = Keycloak::bootstrap(&config.keycloak, &req_client).await;

        let db_pool = PgPool::connect_lazy(&config.database_url).unwrap();

        (kc, req_client, db_pool)
    }

    #[actix_web::test]
    async fn get_certificate() {
        let (kc, req_client, _) = setup_data().await;

        let app = test::init_service(
            App::new()
                .app_data(Data::new(kc.clone()))
                .app_data(Data::new(req_client.clone()))
                .configure(configure),
        )
        .await;

        let request = test::TestRequest::get()
            .uri("/api/v1/certificate")
            .to_request();

        let response = test::call_service(&app, request).await;

        assert!(response.status().is_success());
    }

    #[actix_web::test]
    async fn signup_and_login() {
        let (kc, req_client, db_pool) = setup_data().await;

        let app = test::init_service(
            App::new()
                .app_data(Data::new(kc.clone()))
                .app_data(Data::new(req_client.clone()))
                .app_data(Data::new(db_pool.clone()))
                .configure(configure),
        )
        .await;

        let timestamp = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs();
        let username = format!("test-{}@rba.com", timestamp);

        let signup_form = serde_json::to_value(json!({
            "email": username.clone(),
            "password": "password",
            "first_name": "Test",
            "last_name": "Testinson",
        }))
        .unwrap();

        let signup_request = test::TestRequest::post()
            .uri("/api/v1/signup")
            .set_form(signup_form)
            .to_request();

        let signup_response = test::call_service(&app, signup_request).await;

        assert!(signup_response.status().is_success());

        let login_form = serde_json::to_value(json!({
            "username": username.clone(),
            "password": "password",
        }))
        .unwrap();

        let login_request = test::TestRequest::post()
            .uri("/api/v1/login")
            .set_form(login_form)
            .to_request();

        let login_response = test::call_service(&app, login_request).await;

        assert!(login_response.status().is_success());
    }
}
