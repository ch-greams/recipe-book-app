import * as constants from "@cypress/constants";

import { getCurrentDate } from "@common/date";
import { BUTTON_DELETE } from "@common/labels";
import { getProductPath, USER_PATH } from "@common/routes";
import { UserMenuItem } from "@store/types/user";


describe("user", () => {

    describe("custom and favorite foods", () => {

        beforeEach(() => {
            cy.intercept(
                `${constants.CY_PRODUCT_API_PATH}/favorite?limit=20&user_id=1`,
                { fixture: "foods_favorite.json" },
            );
            cy.intercept(
                `${constants.CY_PRODUCT_API_PATH}/created?limit=20&user_id=1`,
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
            cy.intercept(`${constants.CY_RECIPE_API_PATH}/29`, { fixture: "recipe.json" });

            cy.visit(USER_PATH);
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

            cy.url().should("include", getProductPath(false, FAVORITE_FOOD_ID));

            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_NAME_TEXT}]`)
                .contains(FAVORITE_FOOD_NAME)
                .should("be.visible");
        });

        it("can remove favorite food", () => {

            const FAVORITE_FOOD_NAME = "English Muffin";

            cy.intercept("POST", `${constants.CY_PRODUCT_API_PATH}/favorite/delete?user_id=1`, { statusCode: 204 });

            cy.get(`[data-cy=${constants.CY_USER_MENU_ITEM}]`)
                .contains(UserMenuItem.Foods)
                .should("be.visible")
                .click();

            cy.get(`[data-cy=${constants.CY_USER_FOOD_FAVORITE_ITEM}]`)
                .contains(FAVORITE_FOOD_NAME)
                .should("be.visible")
                .siblings(`[data-cy=${constants.CY_BUTTON}]`)
                .contains(BUTTON_DELETE)
                .should("be.visible")
                .click()
                .should("not.exist");
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

            cy.url().should("include", getProductPath(false, CUSTOM_FOOD_ID));

            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_NAME_TEXT}]`)
                .contains(CUSTOM_FOOD_NAME)
                .should("be.visible");
        });

        it("can remove custom food", () => {

            const CUSTOM_FOOD_NAME = "English Muffin";

            cy.intercept("POST", `${constants.CY_PRODUCT_API_PATH}/delete`, { statusCode: 204 });

            cy.get(`[data-cy=${constants.CY_USER_MENU_ITEM}]`)
                .contains(UserMenuItem.Foods)
                .should("be.visible")
                .click();

            cy.get(`[data-cy=${constants.CY_USER_FOOD_CUSTOM_ITEM}]`)
                .contains(CUSTOM_FOOD_NAME)
                .should("be.visible")
                .siblings(`[data-cy=${constants.CY_BUTTON}]`)
                .contains(BUTTON_DELETE)
                .should("be.visible")
                .click()
                .should("not.exist");
        });
    });
});
