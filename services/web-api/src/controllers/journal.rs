use actix_web::{
    get, post,
    web::{Data, Json},
    HttpResponse, Scope,
};
use sqlx::{Pool, Postgres};

use crate::types::{error::Error, journal_group::JournalGroup};

pub fn scope() -> Scope {
    actix_web::web::scope("journal")
        .service(get_groups)
        .service(update_groups)
}

#[get("/groups")]
async fn get_groups(db_pool: Data<Pool<Postgres>>) -> Result<Json<Vec<JournalGroup>>, Error> {
    let mut txn = db_pool.begin().await?;

    // TODO: Get this value from cookies
    let user_id = 1;

    let journal_groups = JournalGroup::find_all_by_user_id(user_id)
        .fetch_all(&mut txn)
        .await?;

    txn.commit().await?;

    Ok(Json(journal_groups))
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
