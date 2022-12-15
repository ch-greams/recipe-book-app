use std::{net::SocketAddr, path::Path};

use config::ConfigError;
use secrecy::Secret;
use serde::Deserialize;

#[derive(Clone, Debug, Deserialize)]
pub struct KeycloakConfig {
    pub url: String,
    pub username: String,
    pub password: Secret<String>,
}

#[derive(Clone, Debug, Deserialize)]
pub struct Config {
    pub listen_addr: SocketAddr,
    pub database_url: String,
    pub keycloak: KeycloakConfig,
}

impl Config {
    pub fn new() -> Result<Self, ConfigError> {
        let config = config::Config::builder()
            .add_source(config::File::from(Path::new("./config.toml")).required(false))
            .add_source(
                config::Environment::with_prefix("RB")
                    .separator("__")
                    .ignore_empty(true),
            )
            .build()?
            .try_deserialize::<Self>()?;

        Ok(config)
    }
}
