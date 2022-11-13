use actix_web::{
    get, post,
    web::{Data, Json, Query},
    HttpResponse, Scope,
};
use serde::Deserialize;
use sqlx::{Pool, Postgres};

use crate::types::{error::Error, journal_group::JournalGroup};

pub fn scope() -> Scope {
    actix_web::web::scope("journal")
        .service(get_groups)
        .service(update_groups)
}

#[derive(Debug, Deserialize)]
pub struct FindGroupsQuery {
    // TODO: Move into auth cookies
    user_id: i64,
}

#[get("/groups")]
async fn get_groups(
    query: Query<FindGroupsQuery>,
    db_pool: Data<Pool<Postgres>>,
) -> Result<Json<Vec<JournalGroup>>, Error> {
    let mut txn = db_pool.begin().await?;

    let journal_groups = JournalGroup::find_all_by_user_id(query.user_id)
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
