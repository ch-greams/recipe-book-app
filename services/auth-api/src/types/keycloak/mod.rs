use reqwest::Client;

use crate::{
    config::KeycloakConfig,
    services::openid::get_token,
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
        Keycloak { config }
    }

    pub async fn bootstrap(&self) {
        println!("Starting bootstrap of keycloak service...");

        let client = Client::new();

        // Authorize

        let token_payload = self.config.clone().into();
        let admin_token = get_token(&client, &token_payload, &self.config.url)
            .await
            .unwrap();

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
