use actix_web::{
    post,
    web::{Data, Json},
    HttpResponse, Scope,
};
use sqlx::{Pool, Postgres};

use crate::types::{error::Error, journal_group::JournalGroup};

pub fn scope() -> Scope {
    actix_web::web::scope("journal").service(update_groups)
}

#[post("/groups/update")]
async fn update_groups(
    request: Json<Vec<JournalGroup>>,
    db_pool: Data<Pool<Postgres>>,
) -> Result<HttpResponse, Error> {
    let mut txn = db_pool.begin().await?;

    let user_id = 1;
    JournalGroup::replace_multiple(&request, user_id, &mut txn).await?;

    txn.commit().await?;

    Ok(HttpResponse::Created().finish())
}
