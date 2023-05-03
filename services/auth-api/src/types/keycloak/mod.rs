use std::time::Instant;

use reqwest::Client;
use secrecy::Secret;

use crate::{
    config::KeycloakConfig,
    services::openid::{get_access_token, TokenRequest},
    types::keycloak::{
        client::KeycloakClient, realm::KeycloakRealm, role::KeycloakRole, user::KeycloakUser,
    },
    utils,
};

pub mod client;
pub mod realm;
pub mod role;
pub mod user;

#[derive(Clone)]
pub struct Keycloak {
    pub url: String,

    pub admin_username: String,
    pub admin_password: Secret<String>,

    // NOTE: At the moment you'll have only one client, so there's no need for HashMap here
    pub client_id: String,
    pub client_secret: Secret<String>,

    pub default_user_roles: Vec<KeycloakRole>,
}

impl Keycloak {
    pub async fn bootstrap(config: &KeycloakConfig, req_client: &Client) -> Self {
        println!("Starting bootstrap of keycloak service...");
        let start = Instant::now();

        // Authorize

        let token_payload = TokenRequest::admin_cli(&config.username, &config.password);
        let admin_access_token = get_access_token(req_client, &token_payload, &config.url)
            .await
            .unwrap()
            .access_token;

        // Update master realm

        print!("Updating realm...");

        let master_realm: KeycloakRealm = utils::read_json("config/keycloak_realm.json").unwrap();

        master_realm
            .update(req_client, &config.url, &admin_access_token)
            .await
            .unwrap();

        println!(" done!");

        // Upsert roles

        print!("Updating roles...");

        let keycloak_roles: Vec<KeycloakRole> =
            utils::read_json("config/keycloak_roles.json").unwrap();

        let mut default_user_roles: Vec<KeycloakRole> = Vec::new();

        for role in keycloak_roles.iter() {
            print!(" {}...", role.name);

            role.upsert(req_client, &config.url, &admin_access_token)
                .await
                .unwrap();

            let upserted_role = KeycloakRole::query_by_name(
                req_client,
                &role.name,
                &config.url,
                &admin_access_token,
            )
            .await
            .unwrap();

            if upserted_role.name == "rb-user" {
                default_user_roles.push(upserted_role);
            }
        }

        println!(" done!");

        // Upsert clients

        print!("Updating clients...");

        let client_payload: KeycloakClient =
            utils::read_json("config/keycloak_client.json").unwrap();

        print!(" {}...", client_payload.client_id);

        client_payload
            .upsert(req_client, &config.url, &admin_access_token)
            .await
            .unwrap();

        println!(" done!");

        // Upsert users

        print!("Updating users...");

        let keycloak_users: Vec<KeycloakUser> =
            utils::read_json("config/keycloak_users.json").unwrap();

        for user in keycloak_users.iter() {
            print!(" {}...", user.username);

            let user_brief = user
                .create(&req_client, &config.url, &admin_access_token)
                .await
                .unwrap();

            KeycloakUser::assign_realm_roles(
                &req_client,
                &user_brief.id,
                &default_user_roles,
                &config.url,
                &admin_access_token,
            )
            .await
            .unwrap();
        }

        println!(" done!");

        // Completion

        let client = KeycloakClient::query_by_id(
            req_client,
            &client_payload.client_id,
            &config.url,
            &admin_access_token,
        )
        .await
        .unwrap();

        let client_uuid = client.id.unwrap();
        let client_secret = client.secret.unwrap();

        let duration = start.elapsed();
        println!("Keycloak bootstrap is done in {:?}", duration);

        Keycloak {
            url: config.url.clone(),
            admin_username: config.username.clone(),
            admin_password: config.password.clone(),
            client_id: client_uuid,
            client_secret: Secret::new(client_secret),
            default_user_roles,
        }
    }
}
