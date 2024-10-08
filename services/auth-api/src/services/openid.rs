use reqwest::Client;
use secrecy::{ExposeSecret, Secret};
use serde::{Deserialize, Serialize};

use crate::types::error::Error;

#[derive(Debug, Clone, Serialize)]
pub struct TokenRequest {
    pub grant_type: String,
    pub client_id: String,
    pub client_secret: Option<String>,
    pub username: String,
    pub password: String,
}

impl TokenRequest {
    pub fn rb_web_api(
        username: &str,
        password: &Secret<String>,
        client_secret: &Secret<String>,
    ) -> Self {
        TokenRequest {
            grant_type: "password".to_string(),
            client_id: "rb-web-api".to_string(),
            client_secret: Some(client_secret.expose_secret().to_string()),
            username: username.to_string(),
            password: password.expose_secret().to_string(),
        }
    }

    pub fn admin_cli(username: &str, password: &Secret<String>) -> Self {
        TokenRequest {
            grant_type: "password".to_string(),
            client_id: "admin-cli".to_string(),
            client_secret: None,
            username: username.to_string(),
            password: password.expose_secret().to_string(),
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
