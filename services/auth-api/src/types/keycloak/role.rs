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
        req_client: &Client,
        keycloak_url: &str,
        access_token: &str,
    ) -> Result<StatusCode, Error> {
        let response = req_client
            .post(format!("http://{}/admin/realms/master/roles", keycloak_url))
            .bearer_auth(access_token)
            .json(self)
            .send()
            .await?;

        Ok(response.status())
    }

    pub async fn update(
        &self,
        req_client: &Client,
        keycloak_url: &str,
        access_token: &str,
    ) -> Result<StatusCode, Error> {
        let response = req_client
            .put(format!(
                "http://{}/admin/realms/master/roles/{}",
                keycloak_url, self.name
            ))
            .bearer_auth(access_token)
            .json(self)
            .send()
            .await?;

        Ok(response.status())
    }

    pub async fn upsert(
        &self,
        req_client: &Client,
        keycloak_url: &str,
        access_token: &str,
    ) -> Result<StatusCode, Error> {
        let create_status = self.create(req_client, keycloak_url, access_token).await?;

        if create_status == StatusCode::CONFLICT {
            let update_status = self.update(req_client, keycloak_url, access_token).await?;

            Ok(update_status)
        } else {
            Ok(create_status)
        }
    }
}
