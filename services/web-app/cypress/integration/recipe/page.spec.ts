import * as constants from "@cypress/constants";

import Utils, { RoutePath } from "@common/utils";


describe("recipe_page", () => {

    describe("page", () => {

        it("can save a new page", () => {

            const NEW_PAGE_TITLE_NAME = "new name";
            const NEW_RECIPE_ID = 402;

            cy.intercept(`${constants.CY_RECIPE_API_PATH}/create`, { fixture: "recipe_create_response.json" })
                .as("updateRecipe");

            cy.visit(`${constants.CY_RECIPE_PATH}/new?edit=true`);

            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_NAME_TEXT}]`).click();

            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_NAME_TEXT}]`).should("not.exist");
            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_NAME_INPUT}]`)
                .should("be.visible")
                .clear()
                .type(NEW_PAGE_TITLE_NAME);

            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_CONFIRM_BUTTON}]`)
                .should("be.visible")
                .click();

            cy.url().should("include", Utils.getNewItemPath(RoutePath.Recipe));

            cy.get(`[data-cy=${constants.CY_PAGE_SAVE_BUTTON}]`)
                .should("be.visible")
                .click();

            cy.wait("@updateRecipe").then(interceptedRequest => {
                cy.wrap(interceptedRequest?.request?.body?.name).should("eq", NEW_PAGE_TITLE_NAME.toUpperCase());
                cy.wrap(interceptedRequest?.response?.body?.name).should("eq", NEW_PAGE_TITLE_NAME.toUpperCase());
            });

            cy.url().should("include", Utils.getItemPath(RoutePath.Recipe, NEW_RECIPE_ID));
        });

        it("can save an updated page", () => {

            const NEW_PAGE_TITLE_NAME = "new name";

            cy.intercept(`${constants.CY_RECIPE_API_PATH}/29`, { fixture: "recipe.json" });
            cy.intercept(`${constants.CY_RECIPE_API_PATH}/update`, { fixture: "recipe_update_response.json" })
                .as("updateRecipe");


            cy.visit(`${constants.CY_RECIPE_PATH}/29?edit=true`);

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

            cy.wait("@updateRecipe").then(interceptedRequest => {
                cy.wrap(interceptedRequest?.request?.body?.name).should("eq", NEW_PAGE_TITLE_NAME.toUpperCase());
                cy.wrap(interceptedRequest?.response?.body?.name).should("eq", NEW_PAGE_TITLE_NAME.toUpperCase());
            });
        });
    });
});
