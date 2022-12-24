import * as constants from "@cypress/constants";

import { BUTTON_DELETE, BUTTON_EDIT, BUTTON_REVERT, BUTTON_SAVE } from "@common/labels";
import { getProductPath, NEW_RECIPE_PATH, RECIPE_PATH } from "@common/routes";


describe("recipe_page", () => {

    describe("page", () => {

        it("can save a new page", () => {

            const NEW_PAGE_TITLE_NAME = "new name";
            const NEW_RECIPE_ID = 402;

            cy.intercept(`${constants.CY_RECIPE_API_PATH}/create`, { fixture: "recipe_create_response.json" })
                .as("createRecipe");

            // NOTE: new-recipe-page automatically loads with editMode === true
            cy.visit(`${RECIPE_PATH}/new`);

            cy.get(`[data-cy=${constants.CY_BUTTON}]`).contains(BUTTON_REVERT)
                .should("be.disabled");

            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_NAME_TEXT}]`).should("not.exist");
            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_NAME_INPUT}]`)
                .should("be.visible")
                .clear()
                .type(NEW_PAGE_TITLE_NAME);

            cy.url().should("include", NEW_RECIPE_PATH);

            cy.get(`[data-cy=${constants.CY_BUTTON}]`).contains(BUTTON_SAVE)
                .should("be.visible")
                .click();

            cy.wait("@createRecipe").then(interceptedRequest => {
                cy.wrap(interceptedRequest?.request?.body)
                    .its("name")
                    .should("eq", NEW_PAGE_TITLE_NAME);
                cy.wrap(interceptedRequest?.response?.body)
                    .its("name")
                    .should("eq", NEW_PAGE_TITLE_NAME);
            });

            cy.url().should("include", getProductPath(true, NEW_RECIPE_ID));
        });

        it("can save an updated page", () => {

            const NEW_PAGE_TITLE_NAME = "new name";

            cy.intercept(`${constants.CY_RECIPE_API_PATH}/29`, { fixture: "recipe.json" });
            cy.intercept(`${constants.CY_RECIPE_API_PATH}/update`, { fixture: "recipe_update_response.json" })
                .as("updateRecipe");


            cy.visit(`${RECIPE_PATH}/29`);

            cy.get(`[data-cy=${constants.CY_BUTTON}]`).contains(BUTTON_EDIT).click();

            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_NAME_TEXT}]`).should("not.exist");
            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_NAME_INPUT}]`)
                .should("be.visible")
                .clear()
                .type(NEW_PAGE_TITLE_NAME);

            cy.get(`[data-cy=${constants.CY_BUTTON}]`).contains(BUTTON_SAVE)
                .should("be.visible")
                .click();

            cy.wait("@updateRecipe").then(interceptedRequest => {
                cy.wrap(interceptedRequest?.request?.body)
                    .its("name")
                    .should("eq", NEW_PAGE_TITLE_NAME);
                cy.wrap(interceptedRequest?.response?.body)
                    .its("name")
                    .should("eq", NEW_PAGE_TITLE_NAME);
            });
        });

        it("can delete a recipe", () => {

            cy.intercept(`${constants.CY_RECIPE_API_PATH}/29`, { fixture: "recipe.json" });
            cy.intercept("POST", `${constants.CY_PRODUCT_API_PATH}/delete`, { statusCode: 204 });

            cy.visit(`${RECIPE_PATH}/29`);

            cy.get(`[data-cy=${constants.CY_BUTTON}]`)
                .contains(BUTTON_DELETE)
                .click();

            cy.url().should("eq", Cypress.config().baseUrl + "/");
        });
    });
});
