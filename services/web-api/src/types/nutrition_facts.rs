use serde::{Deserialize, Serialize};
use sqlx::{postgres::PgArguments, query::QueryAs, Postgres};

#[derive(sqlx::FromRow, sqlx::Type, Serialize, Deserialize, Clone)]
#[sqlx(type_name = "nutrition_fact")]
pub struct NutritionFacts {
    pub product_id: i64,
    pub energy: Option<f64>,
    pub carbohydrate: Option<f64>,
    pub dietary_fiber: Option<f64>,
    pub starch: Option<f64>,
    pub sugars: Option<f64>,
    pub fat: Option<f64>,
    pub monounsaturated: Option<f64>,
    pub polyunsaturated: Option<f64>,
    pub omega_3: Option<f64>,
    pub omega_6: Option<f64>,
    pub saturated: Option<f64>,
    pub trans_fats: Option<f64>,
    pub cholesterol: Option<f64>,
    pub phytosterol: Option<f64>,
    pub protein: Option<f64>,
    pub tryptophan: Option<f64>,
    pub threonine: Option<f64>,
    pub isoleucine: Option<f64>,
    pub leucine: Option<f64>,
    pub lysine: Option<f64>,
    pub methionine: Option<f64>,
    pub cystine: Option<f64>,
    pub phenylalanine: Option<f64>,
    pub tyrosine: Option<f64>,
    pub valine: Option<f64>,
    pub arginine: Option<f64>,
    pub histidine: Option<f64>,
    pub alanine: Option<f64>,
    pub aspartic_acid: Option<f64>,
    pub glutamic_acid: Option<f64>,
    pub glycine: Option<f64>,
    pub proline: Option<f64>,
    pub serine: Option<f64>,
    pub hydroxyproline: Option<f64>,
    pub vitamin_a: Option<f64>,
    pub vitamin_c: Option<f64>,
    pub vitamin_d: Option<f64>,
    pub vitamin_e: Option<f64>,
    pub vitamin_k: Option<f64>,
    pub vitamin_b1: Option<f64>,
    pub vitamin_b2: Option<f64>,
    pub vitamin_b3: Option<f64>,
    pub vitamin_b5: Option<f64>,
    pub vitamin_b6: Option<f64>,
    pub vitamin_b9: Option<f64>,
    pub vitamin_b12: Option<f64>,
    pub choline: Option<f64>,
    pub betaine: Option<f64>,
    pub calcium: Option<f64>,
    pub iron: Option<f64>,
    pub magnesium: Option<f64>,
    pub phosphorus: Option<f64>,
    pub potassium: Option<f64>,
    pub sodium: Option<f64>,
    pub zinc: Option<f64>,
    pub copper: Option<f64>,
    pub manganese: Option<f64>,
    pub selenium: Option<f64>,
    pub fluoride: Option<f64>,
    pub chromium: Option<f64>,
    pub iodine: Option<f64>,
    pub molybdenum: Option<f64>,
    pub alcohol: Option<f64>,
    pub water: Option<f64>,
    pub ash: Option<f64>,
    pub caffeine: Option<f64>,
}

impl NutritionFacts {
    pub fn new(id: i64) -> Self {
        NutritionFacts {
            product_id: id,
            energy: None,
            carbohydrate: None,
            dietary_fiber: None,
            starch: None,
            sugars: None,
            fat: None,
            monounsaturated: None,
            polyunsaturated: None,
            omega_3: None,
            omega_6: None,
            saturated: None,
            trans_fats: None,
            cholesterol: None,
            phytosterol: None,
            protein: None,
            tryptophan: None,
            threonine: None,
            isoleucine: None,
            leucine: None,
            lysine: None,
            methionine: None,
            cystine: None,
            phenylalanine: None,
            tyrosine: None,
            valine: None,
            arginine: None,
            histidine: None,
            alanine: None,
            aspartic_acid: None,
            glutamic_acid: None,
            glycine: None,
            proline: None,
            serine: None,
            hydroxyproline: None,
            vitamin_a: None,
            vitamin_c: None,
            vitamin_d: None,
            vitamin_e: None,
            vitamin_k: None,
            vitamin_b1: None,
            vitamin_b2: None,
            vitamin_b3: None,
            vitamin_b5: None,
            vitamin_b6: None,
            vitamin_b9: None,
            vitamin_b12: None,
            choline: None,
            betaine: None,
            calcium: None,
            iron: None,
            magnesium: None,
            phosphorus: None,
            potassium: None,
            sodium: None,
            zinc: None,
            copper: None,
            manganese: None,
            selenium: None,
            fluoride: None,
            chromium: None,
            iodine: None,
            molybdenum: None,
            alcohol: None,
            water: None,
            ash: None,
            caffeine: None,
        }
    }

    pub fn find_by_product_id(product_id: i64) -> QueryAs<'static, Postgres, Self, PgArguments> {
        sqlx::query_as("SELECT * FROM private.nutrition_fact WHERE product_id = $1")
            .bind(product_id)
    }

    pub fn find_by_product_ids(
        product_ids: Vec<i64>,
    ) -> QueryAs<'static, Postgres, Self, PgArguments> {
        sqlx::query_as("SELECT * FROM private.nutrition_fact WHERE product_id = ANY($1)")
            .bind(product_ids)
    }
}

#[cfg(test)]
mod tests {
    use crate::{config::Config, types::nutrition_facts::NutritionFacts};
    use sqlx::{PgPool, Pool, Postgres};

    fn get_pool() -> Pool<Postgres> {
        let config = Config::new().unwrap();
        PgPool::connect_lazy(&config.database_url).unwrap()
    }

    #[tokio::test]
    #[ignore]
    async fn find_by_product_id() {
        let food_id = 1;

        let mut txn = get_pool().begin().await.unwrap();

        let nutrition_facts = NutritionFacts::find_by_product_id(food_id)
            .fetch_optional(&mut txn)
            .await
            .unwrap();

        assert!(nutrition_facts.is_some());
    }

    #[tokio::test]
    #[ignore]
    async fn find_by_product_ids() {
        let product_ids = vec![1, 2];

        let mut txn = get_pool().begin().await.unwrap();

        let nutrition_facts = NutritionFacts::find_by_product_ids(product_ids)
            .fetch_all(&mut txn)
            .await
            .unwrap();

        assert!(nutrition_facts.len() == 2);
    }
}
