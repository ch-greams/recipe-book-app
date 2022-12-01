use std::hash::{Hash, Hasher};

use serde::{Deserialize, Serialize};
use sqlx::{Executor, Postgres, QueryBuilder};

use crate::{types::usda::support::FoodPortion, utils::BIND_LIMIT};

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct CustomUnit {
    pub product_id: i64,
    pub name: String,
    pub amount: f64,
    pub unit: String,
}

impl Hash for CustomUnit {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.product_id.hash(state);
        self.name.hash(state);
    }
}

impl PartialEq for CustomUnit {
    fn eq(&self, other: &Self) -> bool {
        (self.product_id == other.product_id) && (self.name == other.name)
    }
}

impl Eq for CustomUnit {}

impl CustomUnit {
    pub fn new(food_portion: &FoodPortion, product_id: i64) -> Self {
        Self {
            product_id,
            name: food_portion.measure_unit.name.to_owned(),
            amount: food_portion.gram_weight.into(),
            unit: "g".to_string(),
        }
    }

    pub async fn seed_custom_units(
        custom_units: Vec<CustomUnit>,
        txn: impl Executor<'_, Database = Postgres>,
    ) {
        let mut custom_units_query_builder: QueryBuilder<Postgres> =
            QueryBuilder::new("INSERT INTO product.custom_unit (product_id, name, amount, unit) ");

        custom_units_query_builder.push_values(
            custom_units.iter().take(BIND_LIMIT / 4),
            |mut b, custom_unit| {
                b.push_bind(custom_unit.product_id)
                    .push_bind(&custom_unit.name)
                    .push_bind(custom_unit.amount)
                    .push_bind(&custom_unit.unit);
            },
        );

        let custom_units_query = custom_units_query_builder.build();

        let custom_units_response = custom_units_query.execute(txn).await.unwrap();

        println!(
            "{} custom_unit records created",
            custom_units_response.rows_affected()
        );
    }
}
