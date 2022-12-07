use reqwest::{Client, StatusCode};
use serde::{Deserialize, Serialize};

use crate::types::error::Error;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct KeycloakRealm {
    pub display_name: String,
    pub display_name_html: String,
    pub registration_allowed: bool,
    pub registration_email_as_username: bool,
}

impl KeycloakRealm {
    pub async fn update(&self, keycloak_url: &str, token: &str) -> Result<StatusCode, Error> {
        let client = Client::default();

        let response = client
            .put(format!("http://{}/admin/realms/master", keycloak_url))
            .bearer_auth(token)
            .json(self)
            .send()
            .await?;

        Ok(response.status())
    }
}
