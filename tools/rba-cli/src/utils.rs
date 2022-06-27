use sqlx::{Pool, Postgres};
use std::fs;


pub(crate) async fn seed_db(db_pool: Pool<Postgres>, seed_list: Vec<&str>) {

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
}
