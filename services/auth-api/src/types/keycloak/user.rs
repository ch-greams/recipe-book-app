use reqwest::{Client, StatusCode};
use serde::{Deserialize, Serialize};

use crate::{controllers::SignupForm, types::error::Error};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct KeycloakUserCredentials {
    #[serde(rename = "type")]
    pub credentials_type: String, // password
    pub value: String, // password
}

impl KeycloakUserCredentials {
    pub fn new(password: String) -> Self {
        KeycloakUserCredentials {
            credentials_type: "password".to_string(),
            value: password,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct KeycloakUser {
    pub username: String, // john@central.com
    pub email: String,    // john@central.com

    pub first_name: String, // Andrei
    pub last_name: String,  // Khvalko

    pub enabled: bool, // true

    pub credentials: Vec<KeycloakUserCredentials>,

    pub realm_roles: Vec<String>, // vec![ "user", "rb-user" ]
}

impl From<SignupForm> for KeycloakUser {
    fn from(form: SignupForm) -> Self {
        KeycloakUser::new(form.email, form.first_name, form.last_name, form.password)
    }
}

impl KeycloakUser {
    pub fn new(email: String, first_name: String, last_name: String, password: String) -> Self {
        KeycloakUser {
            username: email.clone(),
            email,
            first_name,
            last_name,
            enabled: true,
            credentials: vec![KeycloakUserCredentials::new(password)],
            realm_roles: vec!["user".to_string(), "rb-user".to_string()],
        }
    }

    pub async fn create(
        &self,
        req_client: &Client,
        keycloak_url: &str,
        access_token: &str,
    ) -> Result<StatusCode, Error> {
        let response = req_client
            .post(format!("http://{}/admin/realms/master/users", keycloak_url))
            .bearer_auth(access_token)
            .json(self)
            .send()
            .await?;

        Ok(response.status())
    }
}
