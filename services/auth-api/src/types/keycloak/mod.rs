use std::time::Instant;

use reqwest::Client;

use crate::{
    config::KeycloakConfig,
    services::openid::get_admin_access_token,
    types::keycloak::{client::KeycloakClient, realm::KeycloakRealm, role::KeycloakRole},
    utils,
};

pub mod client;
pub mod realm;
pub mod role;
pub mod user;

pub struct Keycloak {
    config: KeycloakConfig,
}

impl Keycloak {
    pub fn new(config: &KeycloakConfig) -> Self {
        Keycloak {
            config: config.to_owned(),
        }
    }

    pub async fn bootstrap(&self, req_client: &Client) -> String {
        println!("Starting bootstrap of keycloak service...");
        let start = Instant::now();

        // Authorize

        let admin_access_token = get_admin_access_token(req_client, &self.config)
            .await
            .unwrap();

        // Update master realm

        print!("Updating realm...");

        let master_realm: KeycloakRealm = utils::read_json("config/keycloak_realm.json").unwrap();

        master_realm
            .update(req_client, &self.config.url, &admin_access_token)
            .await
            .unwrap();

        println!(" done!");

        // Upsert roles

        print!("Updating roles...");

        let keycloak_roles: Vec<KeycloakRole> =
            utils::read_json("config/keycloak_roles.json").unwrap();

        for role in keycloak_roles.iter() {
            print!(" {}...", role.name);

            role.upsert(req_client, &self.config.url, &admin_access_token)
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
            .upsert(req_client, &self.config.url, &admin_access_token)
            .await
            .unwrap();

        println!(" done!");

        let client_secret = KeycloakClient::query_by_id(
            req_client,
            &client_payload.client_id,
            &self.config.url,
            &admin_access_token,
        )
        .await
        .unwrap()
        .secret
        .unwrap();

        let duration = start.elapsed();
        println!("Keycloak bootstrap is done in {:?}", duration);

        client_secret
    }
}
