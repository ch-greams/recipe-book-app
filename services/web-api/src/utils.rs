#[cfg(test)]
use crate::config::Config;
#[cfg(test)]
use sqlx::{PgPool, Pool, Postgres};

#[cfg(test)]
pub(crate) fn read_type_from_file<T: serde::de::DeserializeOwned>(
    path: &str,
) -> Result<T, anyhow::Error> {
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
