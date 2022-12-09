use reqwest::Client;
use serde::{Deserialize, Serialize};

use crate::{config::KeycloakConfig, controllers::LoginForm, types::error::Error};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TokenRequest {
    grant_type: String,
    client_id: String,
    client_secret: Option<String>,
    username: String,
    password: String,
}

impl From<KeycloakConfig> for TokenRequest {
    fn from(config: KeycloakConfig) -> Self {
        TokenRequest {
            grant_type: "password".to_string(),
            client_id: "admin-cli".to_string(),
            client_secret: None,
            username: config.username.to_string(),
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
    access_token: String,
    token_type: String,
    expires_in: u32,
    refresh_token: String,
    refresh_expires_in: u32,
    #[serde(rename = "not-before-policy")]
    not_before_policy: u32,
    session_state: String,
    scope: String,
}

pub async fn get_token(
    client: &Client,
    token_payload: &TokenRequest,
    keycloak_url: &str,
) -> Result<String, Error> {
    let token_endpoint = format!(
        "http://{}/realms/master/protocol/openid-connect/token",
        keycloak_url
    );

    let response = client
        .post(token_endpoint)
        .form(token_payload)
        .send()
        .await?
        .json::<TokenResponse>()
        .await?;

    Ok(response.access_token)
}
