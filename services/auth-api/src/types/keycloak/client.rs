use std::collections::HashMap;

use reqwest::{Client, StatusCode};
use serde::{Deserialize, Serialize};

use crate::types::error::Error;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct KeycloakClient {
    pub id: Option<String>,
    pub client_id: String,
    pub root_url: String,
    pub admin_url: String,
    pub redirect_uris: Vec<String>,
    pub web_origins: Vec<String>,
    pub direct_access_grants_enabled: bool,
    pub attributes: HashMap<String, String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct KeycloakClientQuery {
    pub client_id: String,
}

impl KeycloakClient {
    pub async fn create(
        &self,
        client: &Client,
        keycloak_url: &str,
        token: &str,
    ) -> Result<StatusCode, Error> {
        let response = client
            .post(format!(
                "http://{}/admin/realms/master/clients",
                keycloak_url
            ))
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
        if let Some(id) = &self.id {
            let response = client
                .put(format!(
                    "http://{}/admin/realms/master/clients/{}",
                    keycloak_url, id
                ))
                .bearer_auth(token)
                .json(self)
                .send()
                .await?;

            Ok(response.status())
        } else {
            Err(Error::missing_id("update", "client"))
        }
    }

    pub async fn upsert(
        &self,
        client: &Client,
        keycloak_url: &str,
        token: &str,
    ) -> Result<StatusCode, Error> {
        let create_status = self.create(client, keycloak_url, token).await?;

        if create_status == StatusCode::CONFLICT {
            let existing_kc_client =
                Self::query_by_id(client, &self.client_id, keycloak_url, token).await?;

            if let Some(id) = &existing_kc_client.id {
                let mut kc_client_with_id = self.clone();
                kc_client_with_id.id = Some(id.to_owned());

                let update_status = kc_client_with_id
                    .update(client, keycloak_url, token)
                    .await?;

                return Ok(update_status);
            } else {
                return Ok(create_status);
            }
        }

        Ok(create_status)
    }

    pub async fn query(
        client: &Client,
        query: &KeycloakClientQuery,
        keycloak_url: &str,
        token: &str,
    ) -> Result<Vec<Self>, Error> {
        let response = client
            .get(format!(
                "http://{}/admin/realms/master/clients",
                keycloak_url
            ))
            .bearer_auth(token)
            .query(&query)
            .send()
            .await?
            .json::<Vec<Self>>()
            .await?;

        Ok(response)
    }

    pub async fn query_by_id(
        client: &Client,
        client_id: &str,
        keycloak_url: &str,
        token: &str,
    ) -> Result<Self, Error> {
        let query = KeycloakClientQuery {
            client_id: client_id.to_owned(),
        };

        Self::query(client, &query, keycloak_url, token)
            .await?
            .first()
            .cloned()
            .ok_or_else(|| Error::not_found("client"))
    }
}
