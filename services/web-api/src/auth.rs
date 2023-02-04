use std::collections::HashMap;

use crate::types::error::Error;
use actix_web::HttpRequest;
use jsonwebtoken::{decode, Algorithm, DecodingKey, Validation};
use reqwest::Client;
use serde::{Deserialize, Serialize};

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
pub struct ClaimAttributes {
    pub user_id: Option<i64>,
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
    pub attributes: Option<ClaimAttributes>,
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

pub fn authorize(request: HttpRequest, certificate: &Certificate) -> Result<i64, Error> {
    let token_data_claims = validate_cookie(request, certificate)?;

    let has_role = token_data_claims
        .realm_access
        .roles
        .contains(&"rb-user".to_string());

    if !has_role {
        return Err(Error::unauthorized());
    }

    token_data_claims
        .attributes
        .and_then(|a| a.user_id)
        .ok_or_else(Error::unauthorized)
}

pub fn get_user(request: HttpRequest, certificate: &Certificate) -> Option<i64> {
    authorize(request, certificate).ok()
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
        .get(format!("http://{auth_api_url}/api/v1/certificate"))
        .send()
        .await?
        .json::<Certificate>()
        .await?;

    Ok(auth_certificate)
}
