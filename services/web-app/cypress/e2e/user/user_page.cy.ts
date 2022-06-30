import * as constants from "@cypress/constants";

import Utils, { ProductType, UserMenuItem } from "@common/utils";


describe("user", () => {

    describe("user_page", () => {

        beforeEach(() => {
            cy.intercept(
                `${constants.CY_PRODUCT_API_PATH}/favorite?limit=20&user_id=1&product_type=recipe`,
                { fixture: "recipes_favorite.json" },
            );
            cy.intercept(
                `${constants.CY_PRODUCT_API_PATH}/created?limit=20&user_id=1&product_type=recipe`,
                { fixture: "recipes_custom.json" },
            );

            cy.intercept(
                `${constants.CY_PRODUCT_API_PATH}/favorite?limit=20&user_id=1&product_type=food`,
                { fixture: "foods_favorite.json" },
            );
            cy.intercept(
                `${constants.CY_PRODUCT_API_PATH}/created?limit=20&user_id=1&product_type=food`,
                { fixture: "foods_custom.json" },
            );

            cy.intercept(`${constants.CY_FOOD_API_PATH}/1`, { fixture: "food.json" });
            cy.intercept(`${constants.CY_RECIPE_API_PATH}/29`, { fixture: "recipe.json" });

            cy.visit(constants.CY_USER_PATH);
        });

        it("can navigate to favorite recipe", () => {

            const FAVORITE_RECIPE_NAME = "Cottage Cheese Dip";
            const FAVORITE_RECIPE_ID = 29;

            cy.get(`[data-cy=${constants.CY_USER_MENU_ITEM}]`)
                .contains(UserMenuItem.Recipes)
                .should("be.visible")
                .click();

            cy.get(`[data-cy=${constants.CY_USER_RECIPE_FAVORITE_ITEM}]`)
                .contains(FAVORITE_RECIPE_NAME)
                .should("be.visible")
                .click();

            cy.url().should("include", Utils.getProductPath(ProductType.Recipe, FAVORITE_RECIPE_ID));

            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_NAME_TEXT}]`)
                .contains(FAVORITE_RECIPE_NAME.toUpperCase())
                .should("be.visible");
        });

        it("can navigate to custom recipe", () => {

            const CUSTOM_RECIPE_NAME = "Cottage Cheese Dip";
            const CUSTOM_RECIPE_ID = 29;

            cy.get(`[data-cy=${constants.CY_USER_MENU_ITEM}]`)
                .contains(UserMenuItem.Recipes)
                .should("be.visible")
                .click();

            cy.get(`[data-cy=${constants.CY_USER_RECIPE_CUSTOM_ITEM}]`)
                .contains(CUSTOM_RECIPE_NAME)
                .should("be.visible")
                .click();

            cy.url().should("include", Utils.getProductPath(ProductType.Recipe, CUSTOM_RECIPE_ID));

            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_NAME_TEXT}]`)
                .contains(CUSTOM_RECIPE_NAME.toUpperCase())
                .should("be.visible");
        });

        it("can navigate to favorite food", () => {

            const FAVORITE_FOOD_NAME = "English Muffin";
            const FAVORITE_FOOD_ID = 1;

            cy.get(`[data-cy=${constants.CY_USER_MENU_ITEM}]`)
                .contains(UserMenuItem.Foods)
                .should("be.visible")
                .click();

            cy.get(`[data-cy=${constants.CY_USER_FOOD_FAVORITE_ITEM}]`)
                .contains(FAVORITE_FOOD_NAME)
                .should("be.visible")
                .click();

            cy.url().should("include", Utils.getProductPath(ProductType.Food, FAVORITE_FOOD_ID));

            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_NAME_TEXT}]`)
                .contains(FAVORITE_FOOD_NAME.toUpperCase())
                .should("be.visible");
        });

        it("can navigate to custom food", () => {

            const CUSTOM_FOOD_NAME = "English Muffin";
            const CUSTOM_FOOD_ID = 1;

            cy.get(`[data-cy=${constants.CY_USER_MENU_ITEM}]`)
                .contains(UserMenuItem.Foods)
                .should("be.visible")
                .click();

            cy.get(`[data-cy=${constants.CY_USER_FOOD_CUSTOM_ITEM}]`)
                .contains(CUSTOM_FOOD_NAME)
                .should("be.visible")
                .click();

            cy.url().should("include", Utils.getProductPath(ProductType.Food, CUSTOM_FOOD_ID));

            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_NAME_TEXT}]`)
                .contains(CUSTOM_FOOD_NAME.toUpperCase())
                .should("be.visible");
        });
    });
});
