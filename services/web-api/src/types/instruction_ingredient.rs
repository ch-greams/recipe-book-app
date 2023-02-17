use serde::{Deserialize, Serialize};
use sqlx::{Executor, Postgres, QueryBuilder};

use crate::utils::BIND_LIMIT;

use super::{
    error::Error,
    instruction::{Instruction, InstructionPayload},
};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct InstructionIngredientSimple {
    pub ingredient_slot_number: i16,
    pub ingredient_percentage: f32,
}

impl From<InstructionIngredient> for InstructionIngredientSimple {
    fn from(ii: InstructionIngredient) -> Self {
        Self {
            ingredient_slot_number: ii.ingredient_slot_number,
            ingredient_percentage: ii.ingredient_percentage,
        }
    }
}

#[derive(sqlx::FromRow, Serialize, Deserialize, Clone, Debug)]
pub struct InstructionIngredient {
    pub instruction_id: i64,
    pub ingredient_slot_number: i16,
    pub ingredient_percentage: f32,
}

impl InstructionIngredient {
    pub fn new(instruction_id: i64, ingredient: &InstructionIngredientSimple) -> Self {
        Self {
            instruction_id,
            ingredient_slot_number: ingredient.ingredient_slot_number,
            ingredient_percentage: ingredient.ingredient_percentage,
        }
    }

    pub fn from_created_instructions(
        instruction: &Instruction,
        instruction_payload: &InstructionPayload,
    ) -> Vec<Self> {
        instruction_payload
            .ingredients
            .iter()
            .map(|ingredient| InstructionIngredient::new(instruction.id, ingredient))
            .collect()
    }

    pub fn from_updated_instructions(
        instruction: &Instruction,
        instruction_payload: &InstructionPayload,
    ) -> Vec<Self> {
        instruction_payload
            .ingredients
            .iter()
            .map(|ingredient| InstructionIngredient::new(instruction.id, ingredient))
            .collect()
    }

    pub async fn insert_multiple(
        instruction_ingredient_payloads: &[Self],
        txn: impl Executor<'_, Database = Postgres>,
    ) -> Result<Vec<Self>, Error> {
        let mut insert_query_builder: QueryBuilder<Postgres> = QueryBuilder::new(
            "INSERT INTO food.instruction_ingredient (instruction_id, ingredient_slot_number, ingredient_percentage) ",
        );

        let instruction_ingredients = insert_query_builder
            .push_values(
                instruction_ingredient_payloads.iter().take(BIND_LIMIT / 3),
                |mut builder, instruction_ingredient| {
                    builder
                        .push_bind(instruction_ingredient.instruction_id)
                        .push_bind(instruction_ingredient.ingredient_slot_number)
                        .push_bind(instruction_ingredient.ingredient_percentage);
                },
            )
            .push(" RETURNING instruction_id, ingredient_slot_number, ingredient_percentage;")
            .build_query_as()
            .fetch_all(txn)
            .await?;

        Ok(instruction_ingredients)
    }
}

#[cfg(test)]
mod tests {

    use std::iter::zip;

    use crate::{
        types::{
            food::Food, ingredient::Ingredient, instruction::Instruction,
            instruction_ingredient::InstructionIngredient, recipe::CreateRecipePayload,
        },
        utils,
    };

    #[tokio::test]
    async fn insert_multiple() {
        let create_food_payload: CreateRecipePayload =
            utils::read_json("examples/create_recipe_payload.json").unwrap();

        let mut txn = utils::get_pg_pool().begin().await.unwrap();

        let create_food_result = Food::insert(&create_food_payload.to_owned().into(), 1, &mut txn)
            .await
            .unwrap();

        assert_ne!(
            0, create_food_result.id,
            "create_food_result should not have a placeholder value for id"
        );

        let create_ingredients_result = Ingredient::insert_multiple(
            &create_food_payload.ingredients,
            create_food_result.id,
            &mut txn,
        )
        .await
        .unwrap();

        assert_eq!(create_ingredients_result.len(), 3);

        let create_instructions_result = Instruction::insert_multiple(
            &create_food_payload.instructions,
            create_food_result.id,
            &mut txn,
        )
        .await
        .unwrap();

        assert_eq!(create_instructions_result.len(), 2);

        let instruction_ingredients_to_create: Vec<InstructionIngredient> = zip(
            &create_instructions_result,
            &create_food_payload.instructions,
        )
        .flat_map(|(ci, ip)| InstructionIngredient::from_created_instructions(ci, ip))
        .collect();

        let created_instruction_ingredients =
            InstructionIngredient::insert_multiple(&instruction_ingredients_to_create, &mut txn)
                .await
                .unwrap();

        assert_eq!(created_instruction_ingredients.len(), 2);

        txn.rollback().await.unwrap();
    }
}
