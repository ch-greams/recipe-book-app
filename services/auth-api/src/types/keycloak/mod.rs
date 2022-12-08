use reqwest::Client;
use serde::{Deserialize, Serialize};

use crate::{
    config::KeycloakConfig,
    types::keycloak::{client::KeycloakClient, realm::KeycloakRealm, role::KeycloakRole},
    utils,
};

pub mod client;
pub mod realm;
pub mod role;

pub struct Keycloak {
    config: KeycloakConfig,
}

impl Keycloak {
    pub fn new(config: KeycloakConfig) -> Self {
        Keycloak { config: config }
    }

    pub async fn bootstrap(&self) {
        println!("Starting bootstrap of keycloak service...");

        let client = Client::new();

        // Authorize

        let admin_token = get_admin_token(&client, &self.config).await.unwrap();

        // Update master realm

        print!("Updating realm...");

        let master_realm: KeycloakRealm = utils::read_json("config/keycloak_realm.json").unwrap();

        master_realm
            .update(&client, &self.config.url, &admin_token)
            .await
            .unwrap();

        println!(" done!");

        // Upsert roles

        print!("Updating roles...");

        let keycloak_roles: Vec<KeycloakRole> =
            utils::read_json("config/keycloak_roles.json").unwrap();

        for role in keycloak_roles.iter() {
            print!(" {}...", role.name);

            role.upsert(&client, &self.config.url, &admin_token)
                .await
                .unwrap();
        }

        println!(" done!");

        // Upsert clients

        print!("Updating clients...");

        let client_payload: KeycloakClient =
            utils::read_json("config/keycloak_client.json").unwrap();

        print!(" {}...", client_payload.client_id);

        client_payload
            .upsert(&client, &self.config.url, &admin_token)
            .await
            .unwrap();

        println!(" done!");

        println!("Keycloak bootstrap is done.");
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OpenidConnectTokenRequest {
    grant_type: String,
    client_id: String,
    client_secret: Option<String>,
    username: String,
    password: String,
}

// https://www.oauth.com/oauth2-servers/access-tokens/access-token-response/
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OpenidConnectTokenResponse {
    access_token: String,
    token_type: String,
    expires_in: u32,
    refresh_token: String,
    refresh_expires_in: u32,
    #[serde(rename = "not-before-policy")]
    not_before_policy: u32,
    session_state: String,
    scope: String,
}

async fn get_admin_token(
    client: &Client,
    keycloak: &KeycloakConfig,
) -> Result<String, reqwest::Error> {
    let auth_payload = OpenidConnectTokenRequest {
        grant_type: "password".to_string(),
        client_id: "admin-cli".to_string(),
        client_secret: None,
        username: keycloak.username.to_string(),
        password: keycloak.password.to_string(),
    };

    let response = client
        .post(format!(
            "http://{}/realms/master/protocol/openid-connect/token",
            &keycloak.url
        ))
        .form(&auth_payload)
        .send()
        .await?
        .json::<OpenidConnectTokenResponse>()
        .await?;

    Ok(response.access_token)
}
