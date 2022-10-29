use actix_web::{
    get,
    web::{Data, Json},
    Scope,
};
use sqlx::{Pool, Postgres};

use crate::types::{error::Error, meta::Nutrient};

pub fn scope() -> Scope {
    actix_web::web::scope("meta").service(get_nutrients)
}

#[get("/nutrients")]
async fn get_nutrients(db_pool: Data<Pool<Postgres>>) -> Result<Json<Vec<Nutrient>>, Error> {
    let mut txn = db_pool.begin().await?;

    let nutrients = Nutrient::get_nutrients().fetch_all(&mut txn).await?;

    Ok(Json(nutrients))
}
