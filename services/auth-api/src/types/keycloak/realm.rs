use jsonwebtoken::Algorithm;
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

#[derive(Deserialize, Serialize, PartialEq, Eq, Clone, Debug)]
#[allow(non_camel_case_types)]
pub enum KeycloakRealmCertificateAlgorithm {
    RS256,
    #[serde(rename = "RSA-OAEP")]
    RSA_OAEP,
}

impl From<KeycloakRealmCertificateAlgorithm> for Algorithm {
    fn from(alg: KeycloakRealmCertificateAlgorithm) -> Self {
        match alg {
            KeycloakRealmCertificateAlgorithm::RS256 => Algorithm::RS256,
            KeycloakRealmCertificateAlgorithm::RSA_OAEP => Algorithm::RS256,
        }
    }
}

#[derive(Deserialize, Serialize, Clone, Debug)]
pub struct KeycloakRealmCertificate {
    pub kid: String,
    pub kty: String,
    pub alg: KeycloakRealmCertificateAlgorithm,
    pub n: String,
    pub e: String,
}

#[derive(Deserialize, Serialize, Clone, Debug)]
pub struct KeycloakRealmCertificates {
    pub keys: Vec<KeycloakRealmCertificate>,
}

impl KeycloakRealmCertificates {
    pub async fn query(req_client: &Client, keycloak_url: &str) -> Result<Self, Error> {
        let response = req_client
            .get(format!(
                "http://{}/realms/master/protocol/openid-connect/certs",
                keycloak_url
            ))
            .send()
            .await?
            .json::<KeycloakRealmCertificates>()
            .await?;

        Ok(response)
    }
}
