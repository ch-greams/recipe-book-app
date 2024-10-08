import * as constants from "@cypress/constants";

import { BUTTON_EDIT } from "@common/labels";
import { NutrientName } from "@common/nutrients";
import { getRecipePath } from "@common/routes";
import type { Unit } from "@common/units";
import { VolumeUnit, WeightUnit } from "@common/units";


describe("recipe_page", () => {

    const RECIPE_ID = 29;

    describe("ingredients - read-only", () => {

        beforeEach(() => {
            cy.intercept(`${constants.CY_RECIPE_API_PATH}/${RECIPE_ID}`, { fixture: "recipe.json" });
            cy.intercept(`${constants.CY_RECIPE_API_PATH}/15`, { fixture: "food_15.json" });

            cy.visit(getRecipePath(RECIPE_ID));
        });

        it("can replace ingredient_food", () => {

            const INGREDIENT_NAME = "Sour Cream";
            const INGREDIENT_FOOD_NAME = "Yogurt";

            cy.get(`[data-cy=${constants.CY_INGREDIENT}] [data-cy=${constants.CY_INGREDIENT_FOOD_NAME}]`)
                .contains(INGREDIENT_NAME)
                .parents(`[data-cy=${constants.CY_INGREDIENT}]`)
                .as("ingredient");

            // Confirm that alternatives aren't visible
            cy.get("@ingredient")
                .find(`[data-cy=${constants.CY_INGREDIENT_INFO_LINES}]`)
                .should("not.exist");

            // Open ingredient line and save altIngredientInfoLineName
            cy.get("@ingredient")
                .find(`[data-cy=${constants.CY_INGREDIENT_FOOD_NAME}]`)
                .click();
            cy.get("@ingredient")
                .find(`[data-cy=${constants.CY_INGREDIENT_INFO_LINES}] [data-cy=${constants.CY_INGREDIENT_FOOD_NAME}]`)
                .as("altIngredientInfoLineName");

            // - Current food nutrition facts -

            cy.get(`[data-cy=${constants.CY_INGREDIENT_NUTRIENT_TYPE}]`)
                .contains(NutrientName.Carbohydrate)
                .parent()
                .get(`[data-cy=${constants.CY_INGREDIENT_NUTRIENT_AMOUNT}]`)
                .should("be.visible")
                .contains("2.9");

            cy.get(`[data-cy=${constants.CY_INGREDIENT_NUTRIENT_TYPE}]`)
                .contains(NutrientName.Fat)
                .parent()
                .get(`[data-cy=${constants.CY_INGREDIENT_NUTRIENT_AMOUNT}]`)
                .should("be.visible")
                .contains("15");

            cy.get(`[data-cy=${constants.CY_INGREDIENT_NUTRIENT_TYPE}]`)
                .contains(NutrientName.Protein)
                .parent()
                .get(`[data-cy=${constants.CY_INGREDIENT_NUTRIENT_AMOUNT}]`)
                .should("be.visible")
                .contains("2.7");

            cy.get(`[data-cy=${constants.CY_INGREDIENT_NUTRIENT_TYPE}]`)
                .contains(NutrientName.Energy)
                .parent()
                .get(`[data-cy=${constants.CY_INGREDIENT_NUTRIENT_AMOUNT}]`)
                .should("be.visible")
                .contains("157");

            // Confirm that alternative is visible and hover over it
            cy.get(`[data-cy=${constants.CY_INGREDIENT_FOOD}] [data-cy=${constants.CY_INGREDIENT_FOOD_NAME}]`)
                .contains(INGREDIENT_FOOD_NAME)
                .should("be.visible")
                .trigger("mouseover");

            // - Alternative food nutrition facts -

            cy.get(`[data-cy=${constants.CY_INGREDIENT_NUTRIENT_TYPE}]`)
                .contains(NutrientName.Carbohydrate)
                .parent()
                .get(`[data-cy=${constants.CY_INGREDIENT_NUTRIENT_AMOUNT}]`)
                .should("be.visible")
                .contains("4.2");

            cy.get(`[data-cy=${constants.CY_INGREDIENT_NUTRIENT_TYPE}]`)
                .contains(NutrientName.Fat)
                .parent()
                .get(`[data-cy=${constants.CY_INGREDIENT_NUTRIENT_AMOUNT}]`)
                .should("be.visible")
                .contains("2");

            cy.get(`[data-cy=${constants.CY_INGREDIENT_NUTRIENT_TYPE}]`)
                .contains(NutrientName.Protein)
                .parent()
                .get(`[data-cy=${constants.CY_INGREDIENT_NUTRIENT_AMOUNT}]`)
                .should("be.visible")
                .contains("8");

            cy.get(`[data-cy=${constants.CY_INGREDIENT_NUTRIENT_TYPE}]`)
                .contains(NutrientName.Energy)
                .parent()
                .get(`[data-cy=${constants.CY_INGREDIENT_NUTRIENT_AMOUNT}]`)
                .should("be.visible")
                .contains("66.8");

            // Confirm that alternative is visible and change ingredient_food
            cy.get(`[data-cy=${constants.CY_INGREDIENT_FOOD}] [data-cy=${constants.CY_INGREDIENT_FOOD_NAME}]`)
                .contains(INGREDIENT_FOOD_NAME)
                .should("be.visible")
                .click();

            // Confirm that ingredient was changed
            cy.get(`[data-cy=${constants.CY_INGREDIENT_FOOD}] [data-cy=${constants.CY_INGREDIENT_FOOD_NAME}]`)
                .contains(INGREDIENT_FOOD_NAME)
                .should("be.visible");

            // Confirm that alternatives aren't visible
            cy.get("@altIngredientInfoLineName").should("not.exist");
        });

        it("can check food link in ingredient", () => {

            const INGREDIENT_NAME = "Sour Cream";

            cy.get(`[data-cy=${constants.CY_INGREDIENT_FOOD}] [data-cy=${constants.CY_INGREDIENT_FOOD_NAME}]`)
                .contains(INGREDIENT_NAME)
                .should("be.visible")
                .parents(`[data-cy=${constants.CY_INGREDIENT}]`)
                .as("ingredient");

            cy.get("@ingredient")
                .get(`a[href="${getRecipePath(1)}"]`)
                .should("be.visible");
        });

        it("can switch ingredient unit", () => {

            const INGREDIENT_NAME = "Sour Cream";

            const INGREDIENT_UNIT_BEFORE: Unit = VolumeUnit.ml;
            const INGREDIENT_UNIT_AFTER: Unit = WeightUnit.oz;

            const INGREDIENT_AMOUNT_BEFORE: number = 97.96;
            const INGREDIENT_AMOUNT_AFTER: number = 3.53;

            // Check ingredient and open it
            cy.get(`[data-cy=${constants.CY_INGREDIENT_FOOD}] [data-cy=${constants.CY_INGREDIENT_FOOD_NAME}]`)
                .contains(INGREDIENT_NAME)
                .should("be.visible")
                .parent()
                .as("ingredientInfoLine");

            // Check current unit and open select
            cy.get("@ingredientInfoLine")
                .find(`[data-cy=${constants.CY_SELECT_INPUT}]`)
                .contains(INGREDIENT_UNIT_BEFORE)
                .should("be.visible")
                .click();

            // Check current amount
            cy.get("@ingredientInfoLine")
                .find(`[data-cy=${constants.CY_INGREDIENT_FOOD_AMOUNT}]`)
                .should("have.value", String(INGREDIENT_AMOUNT_BEFORE))
                .should("be.visible");

            // Change unit
            cy.get("@ingredientInfoLine")
                .find(`[data-cy=${constants.CY_SELECT_INPUT_OPTION}]`)
                .contains(INGREDIENT_UNIT_AFTER)
                .should("be.visible")
                .click()
                .should("not.exist");

            // Confirm that unit changes
            cy.get("@ingredientInfoLine")
                .find(`[data-cy=${constants.CY_SELECT_INPUT}]`)
                .contains(INGREDIENT_UNIT_AFTER)
                .should("be.visible");

            // Confirm that amount changes
            cy.get("@ingredientInfoLine")
                .find(`[data-cy=${constants.CY_INGREDIENT_FOOD_AMOUNT}]`)
                .should("have.value", String(INGREDIENT_AMOUNT_AFTER))
                .should("be.visible");
        });
    });

    describe("ingredients - edit", () => {

        const NEW_FOOD_NAME_SHORT = "chicken";
        const NEW_FOOD_NAME_FULL = "Chicken Thigh - Bone Out";

        beforeEach(() => {
            cy.intercept(`${constants.CY_RECIPE_API_PATH}/${RECIPE_ID}`, { fixture: "recipe.json" });
            cy.intercept(
                `${constants.CY_FOOD_API_PATH}?limit=10&filter=${NEW_FOOD_NAME_SHORT}`,
                { fixture: "foods_response.json" },
            );
            cy.intercept(`${constants.CY_RECIPE_API_PATH}/15`, { fixture: "food_15.json" });

            cy.visit(getRecipePath(RECIPE_ID));
            cy.get(`[data-cy=${constants.CY_BUTTON}]`).contains(BUTTON_EDIT).click();
        });

        it("can add ingredient", () => {
            const AMOUNT_OF_INGREDIENTS_BEFORE = 2;
            const AMOUNT_OF_INGREDIENTS_AFTER = 3;

            cy.get(`[data-cy=${constants.CY_INGREDIENT}]`)
                .should("have.length", AMOUNT_OF_INGREDIENTS_BEFORE);

            cy.get(`[data-cy=${constants.CY_INGREDIENTS_BLOCK}] [data-cy=${constants.CY_SEARCH}] [data-cy=${constants.CY_SEARCH_INPUT}]`)
                .should("be.visible")
                .type(NEW_FOOD_NAME_SHORT);

            cy.get(`[data-cy=${constants.CY_INGREDIENTS_BLOCK}] [data-cy=${constants.CY_SEARCH}]`)
                .contains(NEW_FOOD_NAME_FULL)
                .should("be.visible")
                .click();

            cy.get(`[data-cy=${constants.CY_INGREDIENT}]`)
                .should("have.length", AMOUNT_OF_INGREDIENTS_AFTER);
        });

        it("can remove ingredient", () => {

            const AMOUNT_OF_INGREDIENTS_BEFORE = 2;
            const AMOUNT_OF_INGREDIENTS_AFTER = 1;

            const INGREDIENT_NAME_TO_REMOVE = "Sour Cream";

            cy.get(`[data-cy=${constants.CY_INGREDIENT}]`)
                .should("have.length", AMOUNT_OF_INGREDIENTS_BEFORE);

            cy.get(`[data-cy=${constants.CY_INGREDIENT_FOOD}] [data-cy=${constants.CY_INGREDIENT_FOOD_NAME}]`)
                .contains(INGREDIENT_NAME_TO_REMOVE)
                .parents(`[data-cy=${constants.CY_INGREDIENT}]`)
                .find(`[data-cy=${constants.CY_INGREDIENT_FOOD_REMOVE_BUTTON}]`)
                .click();

            cy.get(`[data-cy=${constants.CY_INGREDIENT}]`)
                .should("have.length", AMOUNT_OF_INGREDIENTS_AFTER);
        });

        it("can remove ingredient_food", () => {

            const INGREDIENT_NAME = "Sour Cream";
            const INGREDIENT_FOOD_NAME = "Yogurt";

            cy.get(`[data-cy=${constants.CY_INGREDIENT_FOOD}] [data-cy=${constants.CY_INGREDIENT_FOOD_NAME}]`)
                .contains(INGREDIENT_NAME)
                .should("be.visible")
                .click();

            cy.get(`[data-cy=${constants.CY_INGREDIENT_FOOD}] [data-cy=${constants.CY_INGREDIENT_FOOD_NAME}]`)
                .contains(INGREDIENT_FOOD_NAME)
                .should("be.visible")
                .parents(`[data-cy=${constants.CY_INGREDIENT_FOOD}]`)
                .find(`[data-cy=${constants.CY_INGREDIENT_FOOD_REMOVE_BUTTON}]`)
                .click();

            cy.get(`[data-cy=${constants.CY_INGREDIENT_FOOD}] [data-cy=${constants.CY_INGREDIENT_FOOD_NAME}]`)
                .contains(INGREDIENT_FOOD_NAME)
                .should("not.exist");
        });

        it("can add ingredient_food", () => {

            const INGREDIENT_NAME = "Sour Cream";

            const AMOUNT_OF_INGREDIENTS_BEFORE = 2;
            const AMOUNT_OF_INGREDIENTS_AFTER = 3;

            cy.get(`[data-cy=${constants.CY_INGREDIENT_FOOD}] [data-cy=${constants.CY_INGREDIENT_FOOD_NAME}]`)
                .contains(INGREDIENT_NAME)
                .should("be.visible")
                .parents(`[data-cy=${constants.CY_INGREDIENT}]`)
                .as("ingredient");

            cy.get("@ingredient")
                .contains(INGREDIENT_NAME)
                .click();

            cy.get("@ingredient")
                .find(`[data-cy=${constants.CY_INGREDIENT_FOOD}]`)
                .should("have.length", AMOUNT_OF_INGREDIENTS_BEFORE);

            cy.get("@ingredient")
                .find(`[data-cy=${constants.CY_SEARCH}] [data-cy=${constants.CY_SEARCH_INPUT}]`)
                .should("be.visible")
                .type(NEW_FOOD_NAME_SHORT);

            cy.get("@ingredient")
                .contains(NEW_FOOD_NAME_FULL)
                .should("be.visible")
                .click();

            cy.get("@ingredient")
                .find(`[data-cy=${constants.CY_INGREDIENT_FOOD}]`)
                .should("have.length", AMOUNT_OF_INGREDIENTS_AFTER);
        });
    });
});
