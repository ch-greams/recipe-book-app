import * as constants from "cypress/constants";

import Utils, { RoutePath } from "@common/utils";


describe("food_page", () => {

    describe("page", () => {

        it("can save a new page", () => {

            const NEW_PAGE_TITLE_NAME = "new name";
            const NEW_FOOD_ID = 17;

            cy.intercept(`${constants.CY_FOOD_API_PATH}/create`, { fixture: "food_item_create_response.json" })
                .as("updateFood");

            cy.visit(`${constants.CY_FOOD_PATH}/new`);

            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_NAME_TEXT}]`).click();

            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_NAME_TEXT}]`).should("not.exist");
            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_NAME_INPUT}]`)
                .should("be.visible")
                .clear()
                .type(NEW_PAGE_TITLE_NAME);

            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_CONFIRM_BUTTON}]`)
                .should("be.visible")
                .click();

            cy.url().should("include", Utils.getNewItemPath(RoutePath.Food));

            cy.get(`[data-cy=${constants.CY_PAGE_SAVE_BUTTON}]`)
                .should("be.visible")
                .click();

            cy.wait("@updateFood").then(interceptedRequest => {
                cy.wrap(interceptedRequest?.request?.body?.name).should("eq", NEW_PAGE_TITLE_NAME.toUpperCase());
                cy.wrap(interceptedRequest?.response?.body?.name).should("eq", NEW_PAGE_TITLE_NAME.toUpperCase());
            });

            cy.url().should("include", Utils.getItemPath(RoutePath.Food, NEW_FOOD_ID));
        });

        it("can save an updated page", () => {

            const NEW_PAGE_TITLE_NAME = "new name";

            cy.intercept(`${constants.CY_FOOD_API_PATH}/1`, { fixture: "food_item.json" });
            cy.intercept(`${constants.CY_FOOD_API_PATH}/update`, { fixture: "food_item_update_response.json" })
                .as("updateFood");


            cy.visit(`${constants.CY_FOOD_PATH}/1`);

            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_NAME_TEXT}]`).click();

            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_NAME_TEXT}]`).should("not.exist");
            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_NAME_INPUT}]`)
                .should("be.visible")
                .clear()
                .type(NEW_PAGE_TITLE_NAME);

            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_CONFIRM_BUTTON}]`)
                .should("be.visible")
                .click();

            cy.get(`[data-cy=${constants.CY_PAGE_SAVE_BUTTON}]`)
                .should("be.visible")
                .click();

            cy.wait("@updateFood").then(interceptedRequest => {
                cy.wrap(interceptedRequest?.request?.body?.name).should("eq", NEW_PAGE_TITLE_NAME.toUpperCase());
                cy.wrap(interceptedRequest?.response?.body?.name).should("eq", NEW_PAGE_TITLE_NAME.toUpperCase());
            });
        });
    });
});
