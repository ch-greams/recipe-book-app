use actix_web::{get, web::ServiceConfig, HttpResponse, Responder};

mod food;
mod journal;
mod meta;
mod recipe;
mod user;

pub fn configure(config: &mut ServiceConfig) {
    config.service(
        actix_web::web::scope("/api/v1")
            .service(food::scope())
            .service(recipe::scope())
            .service(meta::scope())
            .service(journal::scope())
            .service(user::scope())
            .service(health),
    );
}

#[get("/health")]
async fn health() -> impl Responder {
    HttpResponse::Ok().body("API is healthy")
}
