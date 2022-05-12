import * as constants from "@cypress/constants";

import { UserMenuItem } from "@common/utils";


describe("user", () => {

    describe("navbar", () => {

        beforeEach(() => {
            cy.intercept(`${constants.CY_RECIPE_API_PATH}/favorite/1`, { fixture: "recipe_items_favorite.json" });
            cy.intercept(`${constants.CY_RECIPE_API_PATH}?limit=20&user_id=1`, { fixture: "recipe_items_custom.json" });

            cy.intercept(`${constants.CY_FOOD_API_PATH}/favorite/1`, { fixture: "food_items_favorite.json" });
            cy.intercept(`${constants.CY_FOOD_API_PATH}?limit=20&user_id=1`, { fixture: "food_items_custom.json" });

            cy.intercept(`${constants.CY_FOOD_API_PATH}/1`, { fixture: "food_item.json" });

            cy.visit(`${constants.CY_FOOD_PATH}/1`);
        });

        it("can navigate to user page", () => {

            const USER_NAME = "Andrei Khvalko";

            cy.get(`[data-cy=${constants.CY_NAVBAR_USER_ITEM}]`)
                .contains(USER_NAME)
                .should("be.visible")
                .click();

            cy.url().should("include", "/user");

            cy.get(`[data-cy=${constants.CY_USER_MENU_ITEM}]`)
                .contains(UserMenuItem.Diary)
                .should("be.visible");
        });

        it("can navigate to home page", () => {

            const APP_NAME = "RecipeBook";

            cy.get(`[data-cy=${constants.CY_NAVBAR_LOGO_ITEM}]`)
                .contains(APP_NAME)
                .should("be.visible")
                .click();

            cy.get(`a[href="${constants.CY_NEW_RECIPE_PATH}"]`).should("be.visible");
            cy.get(`a[href="${constants.CY_NEW_FOOD_PATH}"]`).should("be.visible");
        });
    });
});
