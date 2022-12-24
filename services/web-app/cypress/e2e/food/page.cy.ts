import * as constants from "@cypress/constants";

import { BUTTON_DELETE, BUTTON_EDIT, BUTTON_REVERT, BUTTON_SAVE } from "@common/labels";
import { FOOD_PATH, getProductPath, NEW_FOOD_PATH } from "@common/routes";


describe("food_page", () => {

    describe("page", () => {

        it("can save a new page", () => {

            const NEW_PAGE_TITLE_NAME = "new name";
            const NEW_FOOD_ID = 17;

            cy.intercept(`${constants.CY_FOOD_API_PATH}/create`, { fixture: "food_create_response.json" })
                .as("updateFood");

            // NOTE: new-food-page automatically loads with editMode === true
            cy.visit(`${FOOD_PATH}/new`);

            cy.get(`[data-cy=${constants.CY_BUTTON}]`).contains(BUTTON_REVERT)
                .should("be.disabled");

            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_NAME_TEXT}]`).should("not.exist");
            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_NAME_INPUT}]`)
                .should("be.visible")
                .clear()
                .type(NEW_PAGE_TITLE_NAME);

            cy.url().should("include", NEW_FOOD_PATH);

            cy.get(`[data-cy=${constants.CY_BUTTON}]`).contains(BUTTON_SAVE)
                .should("be.visible")
                .click();

            cy.wait("@updateFood").then(interceptedRequest => {
                cy.wrap(interceptedRequest?.request?.body)
                    .its("name")
                    .should("eq", NEW_PAGE_TITLE_NAME);
                cy.wrap(interceptedRequest?.response?.body)
                    .its("name")
                    .should("eq", NEW_PAGE_TITLE_NAME);
            });

            cy.url().should("include", getProductPath(false, NEW_FOOD_ID));
        });

        it("can save an updated page", () => {

            const NEW_PAGE_TITLE_NAME = "new name";

            cy.intercept(`${constants.CY_FOOD_API_PATH}/1`, { fixture: "food.json" });
            cy.intercept(`${constants.CY_FOOD_API_PATH}/update`, { fixture: "food_update_response.json" })
                .as("updateFood");

            cy.visit(`${FOOD_PATH}/1`);

            cy.get(`[data-cy=${constants.CY_BUTTON}]`).contains(BUTTON_EDIT).click();

            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_NAME_TEXT}]`).should("not.exist");
            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_NAME_INPUT}]`)
                .should("be.visible")
                .clear()
                .type(NEW_PAGE_TITLE_NAME);

            cy.get(`[data-cy=${constants.CY_BUTTON}]`).contains(BUTTON_SAVE)
                .should("be.visible")
                .click();

            cy.wait("@updateFood").then(interceptedRequest => {
                cy.wrap(interceptedRequest?.request?.body)
                    .its("name")
                    .should("eq", NEW_PAGE_TITLE_NAME);
                cy.wrap(interceptedRequest?.response?.body)
                    .its("name")
                    .should("eq", NEW_PAGE_TITLE_NAME);
            });
        });

        it("can delete a food", () => {

            cy.intercept(`${constants.CY_FOOD_API_PATH}/1`, { fixture: "food.json" });
            cy.intercept("POST", `${constants.CY_PRODUCT_API_PATH}/delete`, { statusCode: 204 });

            cy.visit(`${FOOD_PATH}/1`);

            cy.get(`[data-cy=${constants.CY_BUTTON}]`)
                .contains(BUTTON_DELETE)
                .click();

            cy.url().should("eq", Cypress.config().baseUrl + "/");
        });
    });
});
