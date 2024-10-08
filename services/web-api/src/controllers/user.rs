use actix_web::{
    get,
    web::{Data, Json, Query},
    HttpRequest, Scope,
};
use serde::{Deserialize, Serialize};
use sqlx::{Pool, Postgres};

use crate::{
    auth::{authorize, Certificate},
    types::{
        error::Error,
        food::{Food, FoodShort},
        journal_group::JournalGroup,
        user_nutrient::{UserNutrient, UserNutrientDetailed},
    },
};

pub fn scope() -> Scope {
    actix_web::web::scope("user").service(get_info)
}

#[derive(Debug, Deserialize)]
pub struct FindAllQuery {
    limit: Option<u32>,
    offset: Option<u32>,
    is_recipe: Option<bool>,
    filter: Option<String>,
}

#[derive(Serialize)]
struct UserInfo {
    journal_groups: Vec<JournalGroup>,
    user_nutrients: Vec<UserNutrientDetailed>,
    created_foods: Vec<FoodShort>,
    favorite_foods: Vec<FoodShort>,
}

impl UserInfo {
    pub fn new(
        journal_groups: Vec<JournalGroup>,
        user_nutrients: Vec<UserNutrientDetailed>,
        created_foods: Vec<FoodShort>,
        favorite_foods: Vec<FoodShort>,
    ) -> Self {
        Self {
            journal_groups,
            user_nutrients,
            created_foods,
            favorite_foods,
        }
    }
}

#[get("/info")]
async fn get_info(
    query: Query<FindAllQuery>,
    db_pool: Data<Pool<Postgres>>,
    auth_certificate: Data<Certificate>,
    request: HttpRequest,
) -> Result<Json<UserInfo>, Error> {
    let user_id = authorize(request, &auth_certificate)?;

    let mut txn = db_pool.begin().await?;

    // journal_groups

    let journal_groups = JournalGroup::find_all_by_user_id(user_id)
        .fetch_all(&mut txn)
        .await?;

    // user_nutrients

    let user_nutrients = UserNutrient::find_all(user_id).fetch_all(&mut txn).await?;

    // created_foods

    let created_foods = Food::find_all_created_by_user(
        query.limit.unwrap_or(100),
        query.offset.unwrap_or(0),
        user_id,
        query.is_recipe,
        query.filter.clone().unwrap_or_default(),
    )
    .fetch_all(&mut txn)
    .await?
    .iter()
    .map(FoodShort::new)
    .collect();

    // favorite_foods

    let favorite_foods = Food::find_all_favorite(
        query.limit.unwrap_or(100),
        query.offset.unwrap_or(0),
        user_id,
        query.is_recipe,
        query.filter.clone().unwrap_or_default(),
    )
    .fetch_all(&mut txn)
    .await?
    .iter()
    .map(FoodShort::new)
    .collect();

    Ok(Json(UserInfo::new(
        journal_groups,
        user_nutrients,
        created_foods,
        favorite_foods,
    )))
}
