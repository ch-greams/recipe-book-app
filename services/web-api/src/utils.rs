use sqlx::{Pool, Postgres};
use std::fs;

#[cfg(test)]
use crate::config::Config;
#[cfg(test)]
use sqlx::PgPool;

#[cfg(test)]
pub(crate) fn read_type_from_file<T: serde::de::DeserializeOwned>(
    path: &str,
) -> Result<T, anyhow::Error> {
    let file = fs::File::open(path)?;
    let reader = std::io::BufReader::new(file);

    let result = serde_json::from_reader(reader)?;

    Ok(result)
}

#[cfg(test)]
pub(crate) fn get_pg_pool() -> Pool<Postgres> {
    let config = Config::new().unwrap();
    PgPool::connect_lazy(&config.database_url).unwrap()
}

pub(crate) async fn seed_db(db_pool: Pool<Postgres>, seed_list: Vec<&str>) {
    println!("seeding database...");

    let mut txn = db_pool.begin().await.unwrap();

    for seed_path in seed_list.iter() {
        let sql_text = fs::read_to_string(seed_path).unwrap();

        let query = sqlx::query(&sql_text);

        let response = query.execute(&mut txn).await.unwrap();

        println!(
            "{} records created from {}",
            response.rows_affected(),
            seed_path
        );
    }

    txn.commit().await.unwrap();

    println!("seeding is complete!");
}
