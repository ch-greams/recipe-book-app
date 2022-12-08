use reqwest::{Client, StatusCode};
use serde::{Deserialize, Serialize};

use crate::types::error::Error;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct KeycloakRoleComposites {
    pub realm: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct KeycloakRole {
    pub name: String,
    pub composite: bool,
    pub composites: Option<KeycloakRoleComposites>,
}

impl KeycloakRole {
    pub async fn create(
        &self,
        client: &Client,
        keycloak_url: &str,
        token: &str,
    ) -> Result<StatusCode, Error> {
        let response = client
            .post(format!("http://{}/admin/realms/master/roles", keycloak_url))
            .bearer_auth(token)
            .json(self)
            .send()
            .await?;

        Ok(response.status())
    }

    pub async fn update(
        &self,
        client: &Client,
        keycloak_url: &str,
        token: &str,
    ) -> Result<StatusCode, Error> {
        let response = client
            .put(format!(
                "http://{}/admin/realms/master/roles/{}",
                keycloak_url, self.name
            ))
            .bearer_auth(token)
            .json(self)
            .send()
            .await?;

        Ok(response.status())
    }

    pub async fn upsert(
        &self,
        client: &Client,
        keycloak_url: &str,
        token: &str,
    ) -> Result<StatusCode, Error> {
        let create_status = self.create(client, keycloak_url, token).await?;

        if create_status == StatusCode::CONFLICT {
            let update_status = self.update(client, keycloak_url, token).await?;

            Ok(update_status)
        } else {
            Ok(create_status)
        }
    }
}
