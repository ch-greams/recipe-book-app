import * as constants from "@cypress/constants";

import Utils, { ProductType } from "@common/utils";
import { RBA_BUTTON_LABEL_EDIT, RBA_BUTTON_LABEL_REVERT, RBA_BUTTON_LABEL_SAVE } from "@views/shared/rba-button/labels";


describe("recipe_page", () => {

    describe("page", () => {

        it("can save a new page", () => {

            const NEW_PAGE_TITLE_NAME = "new name";
            const NEW_RECIPE_ID = 402;

            cy.intercept(`${constants.CY_RECIPE_API_PATH}/create`, { fixture: "recipe_create_response.json" })
                .as("createRecipe");

            // NOTE: new-recipe-page automatically loads with editMode === true
            cy.visit(`${constants.CY_RECIPE_PATH}/new`);

            cy.get(`[data-cy=${constants.CY_BUTTON}]`).contains(RBA_BUTTON_LABEL_REVERT)
                .should("be.disabled");

            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_NAME_TEXT}]`).should("not.exist");
            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_NAME_INPUT}]`)
                .should("be.visible")
                .clear()
                .type(NEW_PAGE_TITLE_NAME);

            cy.url().should("include", Utils.getNewItemPath(ProductType.Recipe));

            cy.get(`[data-cy=${constants.CY_BUTTON}]`).contains(RBA_BUTTON_LABEL_SAVE)
                .should("be.visible")
                .click();

            cy.wait("@createRecipe").then(interceptedRequest => {
                cy.wrap(interceptedRequest?.request?.body)
                    .its("name")
                    .should("eq", NEW_PAGE_TITLE_NAME.toUpperCase());
                cy.wrap(interceptedRequest?.response?.body)
                    .its("name")
                    .should("eq", NEW_PAGE_TITLE_NAME.toUpperCase());
            });

            cy.url().should("include", Utils.getItemPath(ProductType.Recipe, NEW_RECIPE_ID));
        });

        it("can save an updated page", () => {

            const NEW_PAGE_TITLE_NAME = "new name";

            cy.intercept(`${constants.CY_RECIPE_API_PATH}/29`, { fixture: "recipe.json" });
            cy.intercept(`${constants.CY_RECIPE_API_PATH}/update`, { fixture: "recipe_update_response.json" })
                .as("updateRecipe");


            cy.visit(`${constants.CY_RECIPE_PATH}/29`);

            cy.get(`[data-cy=${constants.CY_BUTTON}]`).contains(RBA_BUTTON_LABEL_EDIT).click();

            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_NAME_TEXT}]`).should("not.exist");
            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_NAME_INPUT}]`)
                .should("be.visible")
                .clear()
                .type(NEW_PAGE_TITLE_NAME);

            cy.get(`[data-cy=${constants.CY_BUTTON}]`).contains(RBA_BUTTON_LABEL_SAVE)
                .should("be.visible")
                .click();

            cy.wait("@updateRecipe").then(interceptedRequest => {
                cy.wrap(interceptedRequest?.request?.body)
                    .its("name")
                    .should("eq", NEW_PAGE_TITLE_NAME.toUpperCase());
                cy.wrap(interceptedRequest?.response?.body)
                    .its("name")
                    .should("eq", NEW_PAGE_TITLE_NAME.toUpperCase());
            });
        });
    });
});
