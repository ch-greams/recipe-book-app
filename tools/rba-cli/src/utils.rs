use sqlx::PgPool;
use std::{env, fs, path::PathBuf};

pub(crate) async fn migrate_db(database_url: &str) {
    println!("migrating database...");

    let db_pool = PgPool::connect_lazy(database_url).unwrap();

    sqlx::migrate!("database/migrations")
        .run(&db_pool.clone())
        .await
        .unwrap();

    println!("migrating is complete!");
}

pub(crate) async fn seed_db(database_url: &str) {
    println!("seeding database...");

    let db_pool = PgPool::connect_lazy(database_url).unwrap();

    let seed_list = vec![
        "database/seeds/00_user.sql",
        "database/seeds/01_product.sql",
        "database/seeds/02_custom_unit.sql",
        "database/seeds/02_direction.sql",
        "database/seeds/02_favorite_product.sql",
        "database/seeds/02_ingredient.sql",
        "database/seeds/02_nutrition_fact.sql",
        "database/seeds/03_direction_part.sql",
        "database/seeds/03_ingredient_product.sql",
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

    println!("seeding is complete!");
}