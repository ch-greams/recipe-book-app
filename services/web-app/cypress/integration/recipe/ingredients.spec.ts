import * as constants from "@cypress/constants";

import { NutritionFactType } from "@common/nutritionFacts";
import { VolumeUnit, WeightUnit } from "@common/units";


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

            // Confirm that alternatives aren't visible
            cy.get(`[data-cy=${constants.CY_INGREDIENT_PRODUCT}] [data-cy=${constants.CY_INGREDIENT_PRODUCT_NAME}]`)
                .as("altIngredientInfoLineName")
                .should("not.exist");

            // Confirm that ingredient line is visible and open it to see alternatives
            cy.get(`[data-cy=${constants.CY_INGREDIENT_PRODUCT}] [data-cy=${constants.CY_INGREDIENT_PRODUCT_NAME}]`)
                .contains(INGREDIENT_NAME.toUpperCase())
                .should("be.visible")
                .click();

            // - Current product nutrition facts -

            cy.get(`[data-cy=${constants.CY_INGREDIENT_NUTRITION_FACT_TYPE}]`)
                .contains(NutritionFactType.Carbohydrate.toUpperCase())
                .parent()
                .get(`[data-cy=${constants.CY_INGREDIENT_NUTRITION_FACT_AMOUNT}]`)
                .should("be.visible")
                .contains("2.9");

            cy.get(`[data-cy=${constants.CY_INGREDIENT_NUTRITION_FACT_TYPE}]`)
                .contains(NutritionFactType.Fat.toUpperCase())
                .parent()
                .get(`[data-cy=${constants.CY_INGREDIENT_NUTRITION_FACT_AMOUNT}]`)
                .should("be.visible")
                .contains("15");

            cy.get(`[data-cy=${constants.CY_INGREDIENT_NUTRITION_FACT_TYPE}]`)
                .contains(NutritionFactType.Protein.toUpperCase())
                .parent()
                .get(`[data-cy=${constants.CY_INGREDIENT_NUTRITION_FACT_AMOUNT}]`)
                .should("be.visible")
                .contains("2.7");

            cy.get(`[data-cy=${constants.CY_INGREDIENT_NUTRITION_FACT_TYPE}]`)
                .contains(NutritionFactType.Energy.toUpperCase())
                .parent()
                .get(`[data-cy=${constants.CY_INGREDIENT_NUTRITION_FACT_AMOUNT}]`)
                .should("be.visible")
                .contains("157");

            // Confirm that alternative is visible and hover over it
            cy.get(`[data-cy=${constants.CY_INGREDIENT_PRODUCT}] [data-cy=${constants.CY_INGREDIENT_PRODUCT_NAME}]`)
                .contains(INGREDIENT_PRODUCT_NAME.toUpperCase())
                .should("be.visible")
                .realHover({ scrollBehavior: false });

            // - Alternative product nutrition facts -

            cy.get(`[data-cy=${constants.CY_INGREDIENT_NUTRITION_FACT_TYPE}]`)
                .contains(NutritionFactType.Carbohydrate.toUpperCase())
                .parent()
                .get(`[data-cy=${constants.CY_INGREDIENT_NUTRITION_FACT_AMOUNT}]`)
                .should("be.visible")
                .contains("4.2");

            cy.get(`[data-cy=${constants.CY_INGREDIENT_NUTRITION_FACT_TYPE}]`)
                .contains(NutritionFactType.Fat.toUpperCase())
                .parent()
                .get(`[data-cy=${constants.CY_INGREDIENT_NUTRITION_FACT_AMOUNT}]`)
                .should("be.visible")
                .contains("2");

            cy.get(`[data-cy=${constants.CY_INGREDIENT_NUTRITION_FACT_TYPE}]`)
                .contains(NutritionFactType.Protein.toUpperCase())
                .parent()
                .get(`[data-cy=${constants.CY_INGREDIENT_NUTRITION_FACT_AMOUNT}]`)
                .should("be.visible")
                .contains("8");

            cy.get(`[data-cy=${constants.CY_INGREDIENT_NUTRITION_FACT_TYPE}]`)
                .contains(NutritionFactType.Energy.toUpperCase())
                .parent()
                .get(`[data-cy=${constants.CY_INGREDIENT_NUTRITION_FACT_AMOUNT}]`)
                .should("be.visible")
                .contains("66.8");

            // Confirm that alternative is visible and change ingredient_product
            cy.get(`[data-cy=${constants.CY_INGREDIENT_PRODUCT}] [data-cy=${constants.CY_INGREDIENT_PRODUCT_NAME}]`)
                .contains(INGREDIENT_PRODUCT_NAME.toUpperCase())
                .should("be.visible")
                .click();

            // Confirm that ingredient was changed and close it
            cy.get(`[data-cy=${constants.CY_INGREDIENT_PRODUCT}] [data-cy=${constants.CY_INGREDIENT_PRODUCT_NAME}]`)
                .contains(INGREDIENT_PRODUCT_NAME.toUpperCase())
                .should("be.visible")
                .click();

            // Confirm that alternatives aren't visible
            cy.get("@altIngredientInfoLineName").should("not.exist");
        });

        it("can check product link in ingredient", () => {

            const INGREDIENT_NAME = "Sour Cream";

            cy.get(`[data-cy=${constants.CY_INGREDIENT_PRODUCT}] [data-cy=${constants.CY_INGREDIENT_PRODUCT_NAME}]`)
                .contains(INGREDIENT_NAME.toUpperCase())
                .should("be.visible")
                .parents(`[data-cy=${constants.CY_INGREDIENT}]`)
                .as("ingredient");

            cy.get("@ingredient")
                .get(`a[href="${constants.CY_FOOD_PATH}/1"]`)
                .should("be.visible");
        });

        it("can switch ingredient unit", () => {

            const INGREDIENT_NAME = "Sour Cream";

            // Check ingredient and open it
            cy.get(`[data-cy=${constants.CY_INGREDIENT_PRODUCT}] [data-cy=${constants.CY_INGREDIENT_PRODUCT_NAME}]`)
                .contains(INGREDIENT_NAME.toUpperCase())
                .should("be.visible")
                .parent()
                .as("ingredientInfoLine")
                .click();

            // Check current unit in ingredient_product to be VolumeUnit.ml
            cy.get(`[data-cy=${constants.CY_INGREDIENT_PRODUCT}] [data-cy=${constants.CY_INGREDIENT_PRODUCT_NAME}]`)
                .contains(INGREDIENT_NAME.toUpperCase())
                .should("be.visible")
                .get(`[data-cy=${constants.CY_SELECT_INPUT}]`)
                .contains(VolumeUnit.ml)
                .should("be.visible");

            // Check current unit to be VolumeUnit.ml and open select
            cy.get("@ingredientInfoLine")
                .get(`[data-cy=${constants.CY_SELECT_INPUT}]`)
                .contains(VolumeUnit.ml)
                .should("be.visible")
                .click();

            // Change unit to WeightUnit.g
            cy.get("@ingredientInfoLine")
                .get(`[data-cy=${constants.CY_SELECT_INPUT_OPTION}]`)
                .contains(WeightUnit.g)
                .should("be.visible")
                .click()
                .should("not.exist");

            // Confirm that unit changes
            cy.get("@ingredientInfoLine")
                .get(`[data-cy=${constants.CY_SELECT_INPUT}]`)
                .contains(WeightUnit.g)
                .should("be.visible");

            // Confirm that unit changes in ingredient_product line too
            cy.get(`[data-cy=${constants.CY_INGREDIENT_PRODUCT}] [data-cy=${constants.CY_INGREDIENT_PRODUCT_NAME}]`)
                .contains(INGREDIENT_NAME.toUpperCase())
                .should("be.visible")
                .get(`[data-cy=${constants.CY_SELECT_INPUT}]`)
                .contains(WeightUnit.g)
                .should("be.visible");

            // TODO: Check conversion after it is implemented (part of the RBA-28)
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

            cy.visit(`${constants.CY_RECIPE_PATH}/29?edit=true`);
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
                .contains(NEW_PRODUCT_NAME_FULL.toUpperCase())
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
                .contains(INGREDIENT_NAME_TO_REMOVE.toUpperCase())
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
                .contains(INGREDIENT_NAME.toUpperCase())
                .should("be.visible")
                .click();

            cy.get(`[data-cy=${constants.CY_INGREDIENT_PRODUCT}] [data-cy=${constants.CY_INGREDIENT_PRODUCT_NAME}]`)
                .contains(INGREDIENT_PRODUCT_NAME.toUpperCase())
                .should("be.visible")
                .parents(`[data-cy=${constants.CY_INGREDIENT_PRODUCT}]`)
                .find(`[data-cy=${constants.CY_INGREDIENT_PRODUCT_REMOVE_BUTTON}]`)
                .click();

            cy.get(`[data-cy=${constants.CY_INGREDIENT_PRODUCT}] [data-cy=${constants.CY_INGREDIENT_PRODUCT_NAME}]`)
                .contains(INGREDIENT_PRODUCT_NAME.toUpperCase())
                .should("not.exist");
        });

        it("can add ingredient_product", () => {

            const INGREDIENT_NAME = "Sour Cream";

            const AMOUNT_OF_INGREDIENTS_BEFORE = 3;
            const AMOUNT_OF_INGREDIENTS_AFTER = 4;

            cy.get(`[data-cy=${constants.CY_INGREDIENT_PRODUCT}] [data-cy=${constants.CY_INGREDIENT_PRODUCT_NAME}]`)
                .contains(INGREDIENT_NAME.toUpperCase())
                .should("be.visible")
                .parents(`[data-cy=${constants.CY_INGREDIENT}]`)
                .as("ingredient");

            cy.get("@ingredient")
                .contains(INGREDIENT_NAME.toUpperCase())
                .click();

            cy.get("@ingredient")
                .find(`[data-cy=${constants.CY_INGREDIENT_PRODUCT}]`)
                .should("have.length", AMOUNT_OF_INGREDIENTS_BEFORE);

            cy.get("@ingredient")
                .find(`[data-cy=${constants.CY_SEARCH}] [data-cy=${constants.CY_SEARCH_INPUT}]`)
                .should("be.visible")
                .type(NEW_PRODUCT_NAME_SHORT);

            cy.get("@ingredient")
                .contains(NEW_PRODUCT_NAME_FULL.toUpperCase())
                .should("be.visible")
                .click();

            cy.get("@ingredient")
                .find(`[data-cy=${constants.CY_INGREDIENT_PRODUCT}]`)
                .should("have.length", AMOUNT_OF_INGREDIENTS_AFTER);
        });
    });
});
