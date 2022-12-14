use actix_web::{
    get,
    web::{Data, Json},
    HttpRequest, Scope,
};
use sqlx::{Pool, Postgres};

use crate::{
    types::{error::Error, meta::Nutrient},
    utils::{validate_cookie, Certificate},
};

pub fn scope() -> Scope {
    actix_web::web::scope("meta").service(get_nutrients)
}

#[get("/nutrients")]
async fn get_nutrients(
    db_pool: Data<Pool<Postgres>>,
    auth_certificate: Data<Certificate>,
    request: HttpRequest,
) -> Result<Json<Vec<Nutrient>>, Error> {
    let token_data_claims = validate_cookie(request, &auth_certificate)?;

    if !token_data_claims.realm_access.roles.contains(&"rb-user".to_string()) {
        return Err(Error::unauthenticated());
    }

    let mut txn = db_pool.begin().await?;

    let nutrients = Nutrient::get_nutrients().fetch_all(&mut txn).await?;

    Ok(Json(nutrients))
}
