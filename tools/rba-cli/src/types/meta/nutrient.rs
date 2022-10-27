use std::time::Instant;

use serde::{Deserialize, Serialize};
use sqlx::{PgPool, Postgres, QueryBuilder};

use crate::utils::BIND_LIMIT;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Nutrient {
    pub id: u32,
    pub name: String,
    pub unit_name: String,
    pub nutrient_nbr: Option<String>,
    pub rank: Option<f32>,
}

impl Nutrient {
    pub async fn seed_nutrients(nutrients: Vec<Nutrient>) {
        let start = Instant::now();

        let database_url = "postgres://postgres:password@localhost";
        let db_pool = PgPool::connect_lazy(database_url).unwrap();
        let mut txn = db_pool.begin().await.unwrap();

        let mut nutrients_query_builder: QueryBuilder<Postgres> = QueryBuilder::new(
            "INSERT INTO usda.nutrient (id, name, unit_name, nutrient_nbr, rank) ",
        );

        nutrients_query_builder.push_values(
            nutrients.iter().take(BIND_LIMIT / 5),
            |mut b, nutrient| {
                b.push_bind(i64::from(nutrient.id))
                    .push_bind(&nutrient.name)
                    .push_bind(&nutrient.unit_name)
                    .push_bind(&nutrient.nutrient_nbr)
                    .push_bind(&nutrient.rank);
            },
        );

        let nutrients_query = nutrients_query_builder.build();

        let nutrients_response = nutrients_query.execute(&mut txn).await.unwrap();

        txn.commit().await.unwrap();

        let duration = start.elapsed();

        println!(
            "Inserted {:?} nutrients in {:?}",
            nutrients_response.rows_affected(),
            duration
        );
    }
}
