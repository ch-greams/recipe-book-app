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
    pub async fn update(
        &self,
        req_client: &Client,
        keycloak_url: &str,
        access_token: &str,
    ) -> Result<StatusCode, Error> {
        let response = req_client
            .put(format!("http://{}/admin/realms/master", keycloak_url))
            .bearer_auth(access_token)
            .json(self)
            .send()
            .await?;

        Ok(response.status())
    }
}
