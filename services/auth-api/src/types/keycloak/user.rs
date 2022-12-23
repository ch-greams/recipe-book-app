use std::collections::HashMap;

use reqwest::{Client, StatusCode};
use serde::{Deserialize, Serialize};

use crate::types::error::Error;

use super::role::KeycloakRole;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum KeycloakUserCredentialsType {
    Password,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct KeycloakUserCredentials {
    #[serde(rename = "type")]
    pub credentials_type: KeycloakUserCredentialsType,
    pub value: String,
}

impl KeycloakUserCredentials {
    pub fn new(password: String) -> Self {
        KeycloakUserCredentials {
            credentials_type: KeycloakUserCredentialsType::Password,
            value: password,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct KeycloakUser {
    pub username: String,
    pub email: String,

    pub first_name: String,
    pub last_name: String,

    pub enabled: bool,

    pub credentials: Vec<KeycloakUserCredentials>,

    pub attributes: HashMap<String, String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct KeycloakUserBrief {
    pub id: String,

    pub username: String,
    pub email: String,

    pub first_name: String,
    pub last_name: String,

    pub enabled: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct KeycloakUserQuery {
    pub email: String,
    pub exact: bool,
    pub brief_representation: bool,
}

impl KeycloakUser {
    pub fn new(
        email: &str,
        first_name: &str,
        last_name: &str,
        password: &str,
        user_id: i64,
    ) -> Self {
        KeycloakUser {
            username: email.to_string(),
            email: email.to_string(),
            first_name: first_name.to_string(),
            last_name: last_name.to_string(),
            enabled: true,
            credentials: vec![KeycloakUserCredentials::new(password.to_string())],
            attributes: HashMap::from([("user_id".to_string(), user_id.to_string())]),
        }
    }

    pub async fn create(
        &self,
        req_client: &Client,
        keycloak_url: &str,
        access_token: &str,
    ) -> Result<KeycloakUserBrief, Error> {
        req_client
            .post(format!("http://{}/admin/realms/master/users", keycloak_url))
            .bearer_auth(access_token)
            .json(self)
            .send()
            .await?;

        let kc_user_brief =
            Self::query_by_email(req_client, &self.email, keycloak_url, access_token).await?;

        Ok(kc_user_brief)
    }

    pub async fn assign_realm_roles(
        req_client: &Client,
        user_id: &str,
        roles: &[KeycloakRole],
        keycloak_url: &str,
        access_token: &str,
    ) -> Result<StatusCode, Error> {
        let response = req_client
            .post(format!(
                "http://{}/admin/realms/master/users/{}/role-mappings/realm",
                keycloak_url, user_id,
            ))
            .bearer_auth(access_token)
            .json(&roles)
            .send()
            .await?;

        Ok(response.status())
    }

    pub async fn query(
        req_client: &Client,
        query: &KeycloakUserQuery,
        keycloak_url: &str,
        access_token: &str,
    ) -> Result<Vec<KeycloakUserBrief>, Error> {
        let response = req_client
            .get(format!("http://{}/admin/realms/master/users", keycloak_url))
            .bearer_auth(access_token)
            .query(&query)
            .send()
            .await?
            .json::<Vec<KeycloakUserBrief>>()
            .await?;

        Ok(response)
    }

    pub async fn query_by_email(
        req_client: &Client,
        email: &str,
        keycloak_url: &str,
        access_token: &str,
    ) -> Result<KeycloakUserBrief, Error> {
        let query = KeycloakUserQuery {
            email: email.to_string(),
            exact: true,
            brief_representation: true,
        };

        Self::query(req_client, &query, keycloak_url, access_token)
            .await?
            .first()
            .cloned()
            .ok_or_else(|| Error::not_found("user"))
    }
}
