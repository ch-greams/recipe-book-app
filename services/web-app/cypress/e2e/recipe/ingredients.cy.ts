import * as constants from "@cypress/constants";

import { NutrientName } from "@common/nutritionFacts";
import type { Unit } from "@common/units";
import { VolumeUnit, WeightUnit } from "@common/units";
import { RBA_BUTTON_LABEL_EDIT } from "@views/shared/rba-button/labels";


describe("recipe_page", () => {

    describe("ingredients - read-only", () => {

        beforeEach(() => {
            cy.intercept(`${constants.CY_RECIPE_API_PATH}/29`, { fixture: "recipe.json" });
            cy.intercept(`${constants.CY_FOOD_API_PATH}/15`, { fixture: "product.json" });

            cy.visit(`${constants.CY_RECIPE_PATH}/29`);
        });

        it("can replace ingredient_product", () => {

            const INGREDIENT_NAME = "Sour Cream";
            const INGREDIENT_PRODUCT_NAME = "Yogurt";

            cy.get(`[data-cy=${constants.CY_INGREDIENT}] [data-cy=${constants.CY_INGREDIENT_PRODUCT_NAME}]`)
                .contains(INGREDIENT_NAME)
                .parents(`[data-cy=${constants.CY_INGREDIENT}]`)
                .as("ingredient");

            // Confirm that alternatives aren't visible
            cy.get("@ingredient")
                .find(`[data-cy=${constants.CY_INGREDIENT_INFO_LINES}]`)
                .should("not.exist");

            // Open ingredient line and save altIngredientInfoLineName
            cy.get("@ingredient")
                .find(`[data-cy=${constants.CY_INGREDIENT_PRODUCT_NAME}]`)
                .click();
            cy.get("@ingredient")
                .find(`[data-cy=${constants.CY_INGREDIENT_INFO_LINES}] [data-cy=${constants.CY_INGREDIENT_PRODUCT_NAME}]`)
                .as("altIngredientInfoLineName");

            // - Current product nutrition facts -

            cy.get(`[data-cy=${constants.CY_INGREDIENT_NUTRITION_FACT_TYPE}]`)
                .contains(NutrientName.Carbohydrate)
                .parent()
                .get(`[data-cy=${constants.CY_INGREDIENT_NUTRITION_FACT_AMOUNT}]`)
                .should("be.visible")
                .contains("2.9");

            cy.get(`[data-cy=${constants.CY_INGREDIENT_NUTRITION_FACT_TYPE}]`)
                .contains(NutrientName.Fat)
                .parent()
                .get(`[data-cy=${constants.CY_INGREDIENT_NUTRITION_FACT_AMOUNT}]`)
                .should("be.visible")
                .contains("15");

            cy.get(`[data-cy=${constants.CY_INGREDIENT_NUTRITION_FACT_TYPE}]`)
                .contains(NutrientName.Protein)
                .parent()
                .get(`[data-cy=${constants.CY_INGREDIENT_NUTRITION_FACT_AMOUNT}]`)
                .should("be.visible")
                .contains("2.7");

            cy.get(`[data-cy=${constants.CY_INGREDIENT_NUTRITION_FACT_TYPE}]`)
                .contains(NutrientName.Energy)
                .parent()
                .get(`[data-cy=${constants.CY_INGREDIENT_NUTRITION_FACT_AMOUNT}]`)
                .should("be.visible")
                .contains("157");

            // Confirm that alternative is visible and hover over it
            cy.get(`[data-cy=${constants.CY_INGREDIENT_PRODUCT}] [data-cy=${constants.CY_INGREDIENT_PRODUCT_NAME}]`)
                .contains(INGREDIENT_PRODUCT_NAME)
                .should("be.visible")
                .trigger("mouseover");

            // - Alternative product nutrition facts -

            cy.get(`[data-cy=${constants.CY_INGREDIENT_NUTRITION_FACT_TYPE}]`)
                .contains(NutrientName.Carbohydrate)
                .parent()
                .get(`[data-cy=${constants.CY_INGREDIENT_NUTRITION_FACT_AMOUNT}]`)
                .should("be.visible")
                .contains("4.2");

            cy.get(`[data-cy=${constants.CY_INGREDIENT_NUTRITION_FACT_TYPE}]`)
                .contains(NutrientName.Fat)
                .parent()
                .get(`[data-cy=${constants.CY_INGREDIENT_NUTRITION_FACT_AMOUNT}]`)
                .should("be.visible")
                .contains("2");

            cy.get(`[data-cy=${constants.CY_INGREDIENT_NUTRITION_FACT_TYPE}]`)
                .contains(NutrientName.Protein)
                .parent()
                .get(`[data-cy=${constants.CY_INGREDIENT_NUTRITION_FACT_AMOUNT}]`)
                .should("be.visible")
                .contains("8");

            cy.get(`[data-cy=${constants.CY_INGREDIENT_NUTRITION_FACT_TYPE}]`)
                .contains(NutrientName.Energy)
                .parent()
                .get(`[data-cy=${constants.CY_INGREDIENT_NUTRITION_FACT_AMOUNT}]`)
                .should("be.visible")
                .contains("66.8");

            // Confirm that alternative is visible and change ingredient_product
            cy.get(`[data-cy=${constants.CY_INGREDIENT_PRODUCT}] [data-cy=${constants.CY_INGREDIENT_PRODUCT_NAME}]`)
                .contains(INGREDIENT_PRODUCT_NAME)
                .should("be.visible")
                .click();

            // Confirm that ingredient was changed and close it
            cy.get(`[data-cy=${constants.CY_INGREDIENT_PRODUCT}] [data-cy=${constants.CY_INGREDIENT_PRODUCT_NAME}]`)
                .contains(INGREDIENT_PRODUCT_NAME)
                .should("be.visible")
                .click();

            // Confirm that alternatives aren't visible
            cy.get("@altIngredientInfoLineName").should("not.exist");
        });

        it("can check product link in ingredient", () => {

            const INGREDIENT_NAME = "Sour Cream";

            cy.get(`[data-cy=${constants.CY_INGREDIENT_PRODUCT}] [data-cy=${constants.CY_INGREDIENT_PRODUCT_NAME}]`)
                .contains(INGREDIENT_NAME)
                .should("be.visible")
                .parents(`[data-cy=${constants.CY_INGREDIENT}]`)
                .as("ingredient");

            cy.get("@ingredient")
                .get(`a[href="${constants.CY_FOOD_PATH}/1"]`)
                .should("be.visible");
        });

        it("can switch ingredient unit", () => {

            const INGREDIENT_NAME = "Sour Cream";

            const INGREDIENT_UNIT_BEFORE: Unit = VolumeUnit.ml;
            const INGREDIENT_UNIT_AFTER: Unit = WeightUnit.oz;

            const INGREDIENT_AMOUNT_BEFORE: number = 97.96;
            const INGREDIENT_AMOUNT_AFTER: number = 3.53;

            // Check ingredient and open it
            cy.get(`[data-cy=${constants.CY_INGREDIENT_PRODUCT}] [data-cy=${constants.CY_INGREDIENT_PRODUCT_NAME}]`)
                .contains(INGREDIENT_NAME)
                .should("be.visible")
                .parent()
                .as("ingredientInfoLine")
                .click();

            // Check current unit in ingredient_product
            cy.get("@ingredientInfoLine")
                .parents(`[data-cy=${constants.CY_INGREDIENT}]`)
                .find(`[data-cy=${constants.CY_INGREDIENT_INFO_LINES}] [data-cy=${constants.CY_INGREDIENT_PRODUCT_NAME}]`)
                .contains(INGREDIENT_NAME)
                .should("be.visible")
                .parent()
                .as("ingredientProduct")
                .find(`[data-cy=${constants.CY_SELECT_INPUT}]`)
                .contains(INGREDIENT_UNIT_BEFORE)
                .should("be.visible");

            // Check current unit and open select
            cy.get("@ingredientInfoLine")
                .find(`[data-cy=${constants.CY_SELECT_INPUT}]`)
                .contains(INGREDIENT_UNIT_BEFORE)
                .should("be.visible")
                .click();

            // Check current amount
            cy.get("@ingredientInfoLine")
                .find(`[data-cy=${constants.CY_INGREDIENT_PRODUCT_AMOUNT}]`)
                .should("have.value", String(INGREDIENT_AMOUNT_BEFORE))
                .should("be.visible");

            // Check current amount in ingredient_product line
            cy.get("@ingredientProduct")
                .find(`[data-cy=${constants.CY_INGREDIENT_PRODUCT_AMOUNT}]`)
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
                .find(`[data-cy=${constants.CY_INGREDIENT_PRODUCT_AMOUNT}]`)
                .should("have.value", String(INGREDIENT_AMOUNT_AFTER))
                .should("be.visible");

            // Confirm that unit changes in ingredient_product line
            cy.get("@ingredientProduct")
                .find(`[data-cy=${constants.CY_SELECT_INPUT}]`)
                .contains(INGREDIENT_UNIT_AFTER)
                .should("be.visible");

            // Confirm that amount changes in ingredient_product line
            cy.get("@ingredientProduct")
                .find(`[data-cy=${constants.CY_INGREDIENT_PRODUCT_AMOUNT}]`)
                .should("have.value", String(INGREDIENT_AMOUNT_AFTER))
                .should("be.visible");
        });
    });

    describe("ingredients - edit", () => {

        const NEW_PRODUCT_NAME_SHORT = "chicken";
        const NEW_PRODUCT_NAME_FULL = "Chicken Thigh - Bone Out";

        beforeEach(() => {
            cy.intercept(`${constants.CY_RECIPE_API_PATH}/29`, { fixture: "recipe.json" });
            cy.intercept(
                `${constants.CY_PRODUCT_API_PATH}?limit=10&user_id=1&filter=${NEW_PRODUCT_NAME_SHORT}`,
                { fixture: "products_response.json" },
            );
            cy.intercept(`${constants.CY_FOOD_API_PATH}/15`, { fixture: "product.json" });

            cy.visit(`${constants.CY_RECIPE_PATH}/29`);
            cy.get(`[data-cy=${constants.CY_BUTTON}]`).contains(RBA_BUTTON_LABEL_EDIT).click();
        });

        it("can add ingredient", () => {
            const AMOUNT_OF_INGREDIENTS_BEFORE = 2;
            const AMOUNT_OF_INGREDIENTS_AFTER = 3;

            cy.get(`[data-cy=${constants.CY_INGREDIENT}]`)
                .should("have.length", AMOUNT_OF_INGREDIENTS_BEFORE);

            cy.get(`[data-cy=${constants.CY_INGREDIENTS_BLOCK}] [data-cy=${constants.CY_SEARCH}] [data-cy=${constants.CY_SEARCH_INPUT}]`)
                .should("be.visible")
                .type(NEW_PRODUCT_NAME_SHORT);

            cy.get(`[data-cy=${constants.CY_INGREDIENTS_BLOCK}] [data-cy=${constants.CY_SEARCH}]`)
                .contains(NEW_PRODUCT_NAME_FULL)
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

            cy.get(`[data-cy=${constants.CY_INGREDIENT_PRODUCT}] [data-cy=${constants.CY_INGREDIENT_PRODUCT_NAME}]`)
                .contains(INGREDIENT_NAME_TO_REMOVE)
                .parents(`[data-cy=${constants.CY_INGREDIENT}]`)
                .find(`[data-cy=${constants.CY_INGREDIENT_PRODUCT_REMOVE_BUTTON}]`)
                .click();

            cy.get(`[data-cy=${constants.CY_INGREDIENT}]`)
                .should("have.length", AMOUNT_OF_INGREDIENTS_AFTER);
        });

        it("can remove ingredient_product", () => {

            const INGREDIENT_NAME = "Sour Cream";
            const INGREDIENT_PRODUCT_NAME = "Yogurt";

            cy.get(`[data-cy=${constants.CY_INGREDIENT_PRODUCT}] [data-cy=${constants.CY_INGREDIENT_PRODUCT_NAME}]`)
                .contains(INGREDIENT_NAME)
                .should("be.visible")
                .click();

            cy.get(`[data-cy=${constants.CY_INGREDIENT_PRODUCT}] [data-cy=${constants.CY_INGREDIENT_PRODUCT_NAME}]`)
                .contains(INGREDIENT_PRODUCT_NAME)
                .should("be.visible")
                .parents(`[data-cy=${constants.CY_INGREDIENT_PRODUCT}]`)
                .find(`[data-cy=${constants.CY_INGREDIENT_PRODUCT_REMOVE_BUTTON}]`)
                .click();

            cy.get(`[data-cy=${constants.CY_INGREDIENT_PRODUCT}] [data-cy=${constants.CY_INGREDIENT_PRODUCT_NAME}]`)
                .contains(INGREDIENT_PRODUCT_NAME)
                .should("not.exist");
        });

        it("can add ingredient_product", () => {

            const INGREDIENT_NAME = "Sour Cream";

            const AMOUNT_OF_INGREDIENTS_BEFORE = 3;
            const AMOUNT_OF_INGREDIENTS_AFTER = 4;

            cy.get(`[data-cy=${constants.CY_INGREDIENT_PRODUCT}] [data-cy=${constants.CY_INGREDIENT_PRODUCT_NAME}]`)
                .contains(INGREDIENT_NAME)
                .should("be.visible")
                .parents(`[data-cy=${constants.CY_INGREDIENT}]`)
                .as("ingredient");

            cy.get("@ingredient")
                .contains(INGREDIENT_NAME)
                .click();

            cy.get("@ingredient")
                .find(`[data-cy=${constants.CY_INGREDIENT_PRODUCT}]`)
                .should("have.length", AMOUNT_OF_INGREDIENTS_BEFORE);

            cy.get("@ingredient")
                .find(`[data-cy=${constants.CY_SEARCH}] [data-cy=${constants.CY_SEARCH_INPUT}]`)
                .should("be.visible")
                .type(NEW_PRODUCT_NAME_SHORT);

            cy.get("@ingredient")
                .contains(NEW_PRODUCT_NAME_FULL)
                .should("be.visible")
                .click();

            cy.get("@ingredient")
                .find(`[data-cy=${constants.CY_INGREDIENT_PRODUCT}]`)
                .should("have.length", AMOUNT_OF_INGREDIENTS_AFTER);
        });
    });
});
