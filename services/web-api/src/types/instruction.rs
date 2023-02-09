use serde::{Deserialize, Serialize};
use sqlx::{
    postgres::PgArguments, query::QueryAs, types::Json, Executor, Postgres, QueryBuilder,
    Transaction,
};

use crate::utils::BIND_LIMIT;

use super::{
    error::Error,
    instruction_ingredient::{InstructionIngredient, InstructionIngredientSimple},
};

#[derive(sqlx::FromRow, Serialize, Deserialize, Clone)]
pub struct Instruction {
    pub id: i64,
    pub recipe_id: i64,
    pub step_number: i16,
    pub description: String,
    pub temperature_value: Option<f32>,
    pub temperature_unit: String,
    pub duration_value: Option<i32>,
    pub duration_unit: String,
}

#[derive(Deserialize, Serialize, Clone, Debug)]
pub struct CreateInstructionPayload {
    pub step_number: i16,
    pub description: String,
    pub temperature_value: Option<f32>,
    pub temperature_unit: String,
    pub duration_value: Option<i32>,
    pub duration_unit: String,
    pub ingredients: Vec<InstructionIngredientSimple>,
}

#[derive(Deserialize, Serialize, Clone, Debug)]
pub struct UpdateInstructionPayload {
    pub id: i64,
    pub step_number: i16,
    pub description: String,
    pub temperature_value: Option<f32>,
    pub temperature_unit: String,
    pub duration_value: Option<i32>,
    pub duration_unit: String,
    pub ingredients: Vec<InstructionIngredientSimple>,
}

impl Instruction {
    pub async fn insert_multiple(
        instruction_payloads: &[CreateInstructionPayload],
        recipe_id: i64,
        txn: impl Executor<'_, Database = Postgres>,
    ) -> Result<Vec<Self>, Error> {
        let mut insert_query_builder: QueryBuilder<Postgres> = QueryBuilder::new(
            "INSERT INTO product.instruction (recipe_id, step_number, description, temperature_value, temperature_unit, duration_value, duration_unit) ",
        );

        let created_instructions = insert_query_builder
            .push_values(
                instruction_payloads.iter().take(BIND_LIMIT / 7),
                |mut builder, instruction_payload| {
                    builder
                        .push_bind(recipe_id)
                        .push_bind(instruction_payload.step_number)
                        .push_bind(instruction_payload.description.to_owned())
                        .push_bind(instruction_payload.temperature_value)
                        .push_bind(instruction_payload.temperature_unit.to_owned())
                        .push_bind(instruction_payload.duration_value)
                        .push_bind(instruction_payload.duration_unit.to_owned());
                },
            )
            .push(
                " RETURNING id, recipe_id, step_number, description, temperature_value, temperature_unit, duration_value, duration_unit;",
            )
            .build_query_as()
            .fetch_all(txn)
            .await?;

        Ok(created_instructions)
    }

    pub async fn replace_multiple(
        instruction_payloads: &[UpdateInstructionPayload],
        recipe_id: i64,
        txn: &mut Transaction<'_, Postgres>,
    ) -> Result<Vec<Self>, Error> {
        // delete

        let delete_query =
            sqlx::query("DELETE FROM product.instruction WHERE recipe_id = $1").bind(recipe_id);

        delete_query.fetch_all(&mut *txn).await?;

        // insert

        let mut insert_query_builder: QueryBuilder<Postgres> = QueryBuilder::new(
            "INSERT INTO product.instruction (recipe_id, step_number, description, temperature_value, temperature_unit, duration_value, duration_unit) ",
        );

        let created_instructions = insert_query_builder
            .push_values(
                instruction_payloads.iter().take(BIND_LIMIT / 7),
                |mut builder, instruction_payload| {
                    builder
                        .push_bind(recipe_id)
                        .push_bind(instruction_payload.step_number)
                        .push_bind(instruction_payload.description.to_owned())
                        .push_bind(instruction_payload.temperature_value)
                        .push_bind(instruction_payload.temperature_unit.to_owned())
                        .push_bind(instruction_payload.duration_value)
                        .push_bind(instruction_payload.duration_unit.to_owned());
                },
            )
            .push(
                " RETURNING id, recipe_id, step_number, description, temperature_value, temperature_unit, duration_value, duration_unit;",
            )
            .build_query_as()
            .fetch_all(txn)
            .await?;

        Ok(created_instructions)
    }
}

#[derive(sqlx::FromRow, Serialize, Deserialize, Clone)]
pub struct InstructionDetailed {
    pub id: i64,
    pub step_number: i16,
    pub description: String,
    pub temperature_value: Option<f32>,
    pub temperature_unit: String,
    pub duration_value: Option<i32>,
    pub duration_unit: String,
    pub ingredients: Json<Vec<InstructionIngredientSimple>>,
}

impl InstructionDetailed {
    pub fn new(
        instruction: &Instruction,
        instruction_ingredients: &[InstructionIngredient],
    ) -> Self {
        Self {
            id: instruction.id,
            step_number: instruction.step_number,
            description: instruction.description.to_owned(),
            temperature_value: instruction.temperature_value,
            temperature_unit: instruction.temperature_unit.to_owned(),
            duration_value: instruction.duration_value,
            duration_unit: instruction.duration_unit.to_owned(),
            ingredients: Json(
                instruction_ingredients
                    .iter()
                    .map(|ii| ii.to_owned().into())
                    .collect(),
            ),
        }
    }

    pub fn find_by_recipe_id(recipe_id: i64) -> QueryAs<'static, Postgres, Self, PgArguments> {
        sqlx::query_as(
            r#"
                SELECT
                    id,
                    step_number,
                    recipe_id,
                    description,
                    temperature_value,
                    temperature_unit,
                    duration_value,
                    duration_unit,
                    ingredients
                FROM product.instruction_detailed
                WHERE recipe_id = $1
            "#,
        )
        .bind(recipe_id)
    }
}

#[cfg(test)]
mod tests {
    use crate::{
        config::Config,
        types::{
            ingredient::Ingredient,
            instruction::{Instruction, InstructionDetailed},
            product::Product,
            recipe::{CreateRecipePayload, UpdateRecipePayload},
        },
        utils,
    };
    use sqlx::PgPool;

    #[tokio::test]
    async fn find_by_product_id() {
        let recipe_id = 6;

        let config = Config::new().unwrap();
        let mut txn = PgPool::connect_lazy(&config.database_url)
            .unwrap()
            .begin()
            .await
            .unwrap();

        let instructions_detailed = InstructionDetailed::find_by_recipe_id(recipe_id)
            .fetch_all(&mut txn)
            .await
            .unwrap();

        assert_eq!(instructions_detailed.len(), 3);
    }

    #[tokio::test]
    async fn insert_multiple() {
        let create_product_payload: CreateRecipePayload =
            utils::read_json("examples/create_recipe_payload.json").unwrap();

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let create_product_result = Product::insert_recipe(&create_product_payload, 1, &mut txn)
            .await
            .unwrap();

        assert_ne!(
            0, create_product_result.id,
            "create_product_result should not have a placeholder value for id"
        );

        let create_ingredients_result = Ingredient::insert_multiple(
            &create_product_payload.ingredients,
            create_product_result.id,
            &mut txn,
        )
        .await
        .unwrap();

        assert_eq!(create_ingredients_result.len(), 3);

        let create_instructions_result = Instruction::insert_multiple(
            &create_product_payload.instructions,
            create_product_result.id,
            &mut txn,
        )
        .await
        .unwrap();

        assert_eq!(create_instructions_result.len(), 2);

        txn.rollback().await.unwrap();
    }

    #[tokio::test]
    async fn replace_multiple() {
        let create_product_payload: CreateRecipePayload =
            utils::read_json("examples/create_recipe_payload.json").unwrap();

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let create_product_result = Product::insert_recipe(&create_product_payload, 1, &mut txn)
            .await
            .unwrap();

        assert_ne!(
            0, create_product_result.id,
            "create_product_result should not have a placeholder value for id"
        );

        let create_ingredients_result = Ingredient::insert_multiple(
            &create_product_payload.ingredients,
            create_product_result.id,
            &mut txn,
        )
        .await
        .unwrap();

        assert_eq!(create_ingredients_result.len(), 3);

        let create_instructions_result = Instruction::insert_multiple(
            &create_product_payload.instructions,
            create_product_result.id,
            &mut txn,
        )
        .await
        .unwrap();

        assert_eq!(create_instructions_result.len(), 2);

        let update_product_payload: UpdateRecipePayload =
            utils::read_json("examples/update_recipe_payload.json").unwrap();

        let update_instructions_result = Instruction::replace_multiple(
            &update_product_payload.instructions,
            create_product_result.id,
            &mut txn,
        )
        .await
        .unwrap();

        assert_eq!(update_instructions_result.len(), 3);

        txn.rollback().await.unwrap();
    }
}
