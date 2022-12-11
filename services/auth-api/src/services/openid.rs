use reqwest::Client;
use serde::{Deserialize, Serialize};

use crate::{config::KeycloakConfig, controllers::LoginForm, types::error::Error};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TokenRequest {
    pub grant_type: String,
    pub client_id: String,
    pub client_secret: Option<String>,
    pub username: String,
    pub password: String,
}

impl From<KeycloakConfig> for TokenRequest {
    fn from(config: KeycloakConfig) -> Self {
        TokenRequest {
            grant_type: "password".to_string(),
            client_id: "admin-cli".to_string(),
            client_secret: None,
            username: config.username,
            password: config.password,
        }
    }
}

impl From<LoginForm> for TokenRequest {
    fn from(form: LoginForm) -> Self {
        TokenRequest {
            grant_type: "password".to_string(),
            client_id: "admin-cli".to_string(),
            client_secret: None,
            username: form.username.to_string(),
            password: form.password,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TokenResponse {
    pub access_token: String,
    pub token_type: String,
    pub expires_in: u32,
    pub refresh_token: String,
    pub refresh_expires_in: u32,
    #[serde(rename = "not-before-policy")]
    pub not_before_policy: u32,
    pub session_state: String,
    pub scope: String,
}

pub async fn get_access_token(
    req_client: &Client,
    token_payload: &TokenRequest,
    keycloak_url: &str,
) -> Result<TokenResponse, Error> {
    let token_endpoint = format!(
        "http://{}/realms/master/protocol/openid-connect/token",
        keycloak_url
    );

    let response = req_client
        .post(token_endpoint)
        .form(token_payload)
        .send()
        .await?
        .json::<TokenResponse>()
        .await?;

    Ok(response)
}

pub async fn get_admin_access_token(
    req_client: &Client,
    keycloak_config: &KeycloakConfig,
) -> Result<String, Error> {
    let token_payload = keycloak_config.clone().into();

    let admin_access_token =
        get_access_token(req_client, &token_payload, &keycloak_config.url).await?;

    Ok(admin_access_token.access_token)
}
