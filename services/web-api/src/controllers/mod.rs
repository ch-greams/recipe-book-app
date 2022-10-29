use actix_web::{get, web::ServiceConfig, HttpResponse, Responder};

mod food;
mod product;
mod recipe;
mod meta;

pub fn configure(config: &mut ServiceConfig) {
    config.service(
        actix_web::web::scope("/api/v1")
            .service(product::scope())
            .service(food::scope())
            .service(recipe::scope())
            .service(meta::scope())
            .service(echo),
    );
}

#[get("/health")]
async fn echo() -> impl Responder {
    HttpResponse::Ok().body("API is healthy")
}
