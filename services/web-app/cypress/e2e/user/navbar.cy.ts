import * as constants from "@cypress/constants";

import { getCurrentDate } from "@common/date";
import { FOOD_PATH, USER_PATH } from "@common/routes";
import { UserMenuItem } from "@store/types/user";


describe("user", () => {

    describe("navbar", () => {

        beforeEach(() => {
            cy.intercept(
                `${constants.CY_PRODUCT_API_PATH}/favorite?limit=20&user_id=1&is_recipe=true`,
                { fixture: "recipes_favorite.json" },
            );
            cy.intercept(
                `${constants.CY_PRODUCT_API_PATH}/created?limit=20&user_id=1&is_recipe=true`,
                { fixture: "recipes_custom.json" },
            );

            cy.intercept(
                `${constants.CY_PRODUCT_API_PATH}/favorite?limit=20&user_id=1&is_recipe=false`,
                { fixture: "foods_favorite.json" },
            );
            cy.intercept(
                `${constants.CY_PRODUCT_API_PATH}/created?limit=20&user_id=1&is_recipe=false`,
                { fixture: "foods_custom.json" },
            );
            cy.intercept(
                `${constants.CY_JOURNAL_API_PATH}/groups?user_id=1`,
                { fixture: "journal_groups_response.json" },
            );
            cy.intercept(
                `${constants.CY_JOURNAL_API_PATH}/entry?entry_date=${getCurrentDate()}&user_id=1`,
                { fixture: "journal_entries_response.json" },
            );
            cy.intercept(
                `${constants.CY_JOURNAL_API_PATH}/nutrients?user_id=1`,
                { fixture: "journal_nutrients_response.json" },
            );
            cy.intercept(
                `${constants.CY_META_API_PATH}/nutrients`,
                { fixture: "meta_nutrients_response.json" },
            );

            cy.intercept(`${constants.CY_FOOD_API_PATH}/1`, { fixture: "food.json" });

            cy.visit(`${FOOD_PATH}/1`);
        });

        it("can navigate to user page", () => {

            const USER_NAME = "Andrei Greams";

            cy.get(`[data-cy=${constants.CY_NAVBAR_USER_ITEM}]`)
                .contains(USER_NAME)
                .should("be.visible")
                .click();

            cy.url().should("include", USER_PATH);

            cy.get(`[data-cy=${constants.CY_USER_MENU_ITEM}]`)
                .contains(UserMenuItem.Foods)
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
