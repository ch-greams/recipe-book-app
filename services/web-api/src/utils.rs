use std::collections::HashMap;

#[cfg(test)]
use crate::config::Config;
use crate::types::error::Error;
use actix_web::HttpRequest;
use jsonwebtoken::{decode, Algorithm, DecodingKey, Validation};
use reqwest::Client;
use serde::{Deserialize, Serialize};
#[cfg(test)]
use sqlx::{PgPool, Pool, Postgres};

pub const BIND_LIMIT: usize = 65535;

#[cfg(test)]
pub(crate) fn read_json<T: serde::de::DeserializeOwned>(path: &str) -> Result<T, anyhow::Error> {
    let file = std::fs::File::open(path)?;
    let reader = std::io::BufReader::new(file);

    let result = serde_json::from_reader(reader)?;

    Ok(result)
}

#[cfg(test)]
pub(crate) fn get_pg_pool() -> Pool<Postgres> {
    let config = Config::new().unwrap();
    PgPool::connect_lazy(&config.database_url).unwrap()
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ClaimsAccess {
    pub roles: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum ClaimAudience {
    Many(Vec<String>),
    One(String),
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    #[serde(rename = "aud")]
    pub audience: ClaimAudience,
    #[serde(rename = "exp")]
    pub expiration_time: usize,
    #[serde(rename = "iat")]
    pub issued_at_time: usize,
    #[serde(rename = "iss")]
    pub issuer: String,
    #[serde(rename = "sub")]
    pub subject: String,
    #[serde(rename = "azp")]
    pub authorized_party: String,

    pub realm_access: ClaimsAccess,
    pub resource_access: HashMap<String, ClaimsAccess>,
    pub name: Option<String>,
    pub preferred_username: String,
    pub given_name: Option<String>,
    pub family_name: Option<String>,
    pub email: Option<String>,
}

pub fn validate_cookie(request: HttpRequest, certificate: &Certificate) -> Result<Claims, Error> {
    let cookie = request
        .cookie("access_token")
        .ok_or_else(Error::unauthenticated)?;

    let access_token = cookie.value();

    let decoding_key =
        DecodingKey::from_rsa_components(&certificate.modulus, &certificate.exponent)?;

    let mut validation = Validation::new(certificate.algorithm);
    validation.set_required_spec_claims(&["azp", "realm_access"]);

    let token_data = decode::<Claims>(access_token, &decoding_key, &validation)?;

    Ok(token_data.claims)
}

#[derive(Deserialize, Serialize, Clone, Debug)]
pub struct Certificate {
    #[serde(rename = "kid")]
    key_id: String,
    #[serde(rename = "kty")]
    key_type: String,
    #[serde(rename = "alg")]
    algorithm: Algorithm,
    #[serde(rename = "n")]
    modulus: String,
    #[serde(rename = "e")]
    exponent: String,
}

pub async fn auth_setup(auth_api_url: &str) -> Result<Certificate, reqwest::Error> {
    let req_client = Client::new();

    let auth_certificate = req_client
        .get(format!("http://{}/api/v1/certificate", auth_api_url))
        .send()
        .await?
        .json::<Certificate>()
        .await?;

    Ok(auth_certificate)
}
