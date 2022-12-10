use actix_web::{get, web::ServiceConfig, HttpResponse, Responder};

mod food;
mod journal;
mod meta;
mod product;
mod recipe;

pub fn configure(config: &mut ServiceConfig) {
    config.service(
        actix_web::web::scope("/api/v1")
            .service(product::scope())
            .service(food::scope())
            .service(recipe::scope())
            .service(meta::scope())
            .service(journal::scope())
            .service(health),
    );
}

#[get("/health")]
async fn health() -> impl Responder {
    HttpResponse::Ok().body("API is healthy")
}
