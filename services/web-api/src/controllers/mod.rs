use actix_web::{get, web::ServiceConfig, HttpResponse, Responder};

mod food;
mod recipe;

pub fn configure(config: &mut ServiceConfig) {
    config.service(
        actix_web::web::scope("/api/v1")
            .service(food::scope())
            .service(recipe::scope())
            .service(echo),
    );
}

#[get("/health")]
async fn echo() -> impl Responder {
    HttpResponse::Ok().body("API is healthy")
}
