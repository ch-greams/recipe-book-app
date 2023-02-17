import * as constants from "@cypress/constants";

import { getCurrentDate } from "@common/date";
import { getRecipePath, USER_PATH } from "@common/routes";
import { UserMenuItem } from "@store/types/user";


describe("user", () => {

    describe("navbar", () => {

        beforeEach(() => {
            cy.intercept(
                `${constants.CY_JOURNAL_API_PATH}/entry?entry_date=${getCurrentDate()}`,
                { fixture: "journal_entries_response.json" },
            );
            cy.intercept(
                `${constants.CY_USER_API_PATH}/info`,
                { fixture: "user_info.json" },
            );
            cy.intercept(
                `${constants.CY_META_API_PATH}/nutrients`,
                { fixture: "meta_nutrients_response.json" },
            );

            cy.intercept(`${constants.CY_FOOD_API_PATH}/1`, { fixture: "food_1.json" });

            cy.visit(getRecipePath(1));
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
