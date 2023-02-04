use sqlx::PgPool;
use std::{env, fs, io, path::PathBuf, time::Instant};

pub const BIND_LIMIT: usize = 65535;

pub(crate) async fn migrate_db(database_url: &str) {
    println!("migrating database...");
    let start = Instant::now();

    let db_pool = PgPool::connect_lazy(database_url).unwrap();

    sqlx::migrate!("database/migrations")
        .run(&db_pool.clone())
        .await
        .unwrap();

    let duration = start.elapsed();
    println!("migration is complete in {duration:?}");
}

pub(crate) async fn seed_db(database_url: &str) {
    println!("seeding database...");
    let start = Instant::now();

    let db_pool = PgPool::connect_lazy(database_url).unwrap();

    let seed_list = vec![
        "database/seeds/meta/00_nutrient_group.sql",
        "database/seeds/meta/01_nutrient.sql",
        "database/seeds/meta/02_nutrient_details.sql",
        "database/seeds/journal/00_user.sql",
        "database/seeds/journal/01_journal_group.sql",
        "database/seeds/product/01_product.sql",
        "database/seeds/journal/02_user_nutrient.sql",
        "database/seeds/journal/02_journal_entry.sql",
        "database/seeds/journal/02_favorite_product.sql",
        "database/seeds/product/02_custom_unit.sql",
        "database/seeds/product/02_direction.sql",
        "database/seeds/product/02_ingredient.sql",
        "database/seeds/product/02_product_nutrient.sql",
        "database/seeds/product/03_direction_part.sql",
    ];

    let mut txn = db_pool.begin().await.unwrap();

    let base_dir = PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap());

    for seed_path in seed_list.iter() {
        let path = base_dir.join(seed_path);

        let sql_text = fs::read_to_string(path).unwrap();

        let query = sqlx::query(&sql_text);

        let response = query.execute(&mut txn).await.unwrap();

        println!(
            "{} records created from {}",
            response.rows_affected(),
            seed_path
        );
    }

    txn.commit().await.unwrap();

    let duration = start.elapsed();
    println!("seeding is complete in {duration:?}");
}

pub(crate) fn read_csv_file<T: serde::de::DeserializeOwned>(path: &str) -> anyhow::Result<Vec<T>> {
    let mut reader = csv::Reader::from_path(path)?;
    let result = reader
        .deserialize()
        .filter_map(|item| item.ok())
        .collect::<Vec<T>>();

    Ok(result)
}

pub(crate) fn read_json_file<T: serde::de::DeserializeOwned>(
    path: &str,
) -> Result<T, anyhow::Error> {
    let file = fs::File::open(path)?;
    let reader = io::BufReader::new(file);

    let result = serde_json::from_reader(reader)?;

    Ok(result)
}

#[allow(dead_code)]
pub(crate) fn save_json_file<T: serde::ser::Serialize>(
    path: &str,
    value: &T,
) -> Result<(), anyhow::Error> {
    let contents = serde_json::to_string_pretty(value)?;
    std::fs::write(path, contents)?;
    Ok(())
}
