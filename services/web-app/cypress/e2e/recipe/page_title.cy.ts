import * as constants from "@cypress/constants";

import { BUTTON_EDIT, BUTTON_SAVE } from "@common/labels";


describe("recipe_page", () => {

    describe("page_title", () => {

        beforeEach(() => {
            cy.intercept(`${constants.CY_RECIPE_API_PATH}/29`, { fixture: "recipe.json" });
            cy.intercept(`${constants.CY_RECIPE_API_PATH}/update`, { fixture: "recipe_create_response.json" })
                .as("updateRecipe");

            cy.visit(`${constants.CY_RECIPE_PATH}/29`);
        });

        it("can update name", () => {

            const NEW_PAGE_TITLE_NAME = "new name";

            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_BLOCK}]`).should("be.visible");
            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_NAME_TEXT}]`).should("be.visible");
            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_NAME_INPUT}]`).should("not.exist");

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
            });
        });

        it("can update brand", () => {

            const NEW_PAGE_TITLE_BRAND = "new brand";

            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_BLOCK}]`).should("be.visible");
            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_BRAND_TEXT}]`).should("be.visible");
            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_BRAND_INPUT}]`).should("not.exist");

            cy.get(`[data-cy=${constants.CY_BUTTON}]`).contains(BUTTON_EDIT)
                .should("be.visible")
                .click();

            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_BRAND_TEXT}]`).should("not.exist");
            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_BRAND_INPUT}]`)
                .should("be.visible")
                .clear()
                .type(NEW_PAGE_TITLE_BRAND);

            cy.get(`[data-cy=${constants.CY_BUTTON}]`).contains(BUTTON_SAVE)
                .should("be.visible")
                .click();

            cy.wait("@updateRecipe").then(interceptedRequest => {
                cy.wrap(interceptedRequest?.request?.body)
                    .its("brand")
                    .should("eq", NEW_PAGE_TITLE_BRAND);
            });
        });

        it("can update subtitle", () => {

            const NEW_PAGE_TITLE_SUBTITLE = "new subtitle";

            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_BLOCK}]`).should("be.visible");
            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_SUBTITLE_TEXT}]`).should("be.visible");
            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_SUBTITLE_INPUT}]`).should("not.exist");

            cy.get(`[data-cy=${constants.CY_BUTTON}]`).contains(BUTTON_EDIT).click();

            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_SUBTITLE_TEXT}]`).should("not.exist");
            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_SUBTITLE_INPUT}]`)
                .should("be.visible")
                .clear()
                .type(NEW_PAGE_TITLE_SUBTITLE);

            cy.get(`[data-cy=${constants.CY_BUTTON}]`).contains(BUTTON_SAVE)
                .should("be.visible")
                .click();

            cy.wait("@updateRecipe").then(interceptedRequest => {
                cy.wrap(interceptedRequest?.request?.body)
                    .its("subtitle")
                    .should("eq", NEW_PAGE_TITLE_SUBTITLE);
            });
        });

        it("can update description", () => {

            const NEW_PAGE_TITLE_DESCRIPTION = "new description";

            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_BLOCK}]`).should("be.visible");
            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_DESCRIPTION_INPUT}]`).should("not.exist");

            cy.get(`[data-cy=${constants.CY_BUTTON}]`).contains(BUTTON_EDIT).click();

            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_DESCRIPTION_TEXT}]`).should("not.exist");
            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_DESCRIPTION_INPUT}]`)
                .should("be.visible")
                .clear()
                .type(NEW_PAGE_TITLE_DESCRIPTION);

            cy.get(`[data-cy=${constants.CY_BUTTON}]`).contains(BUTTON_SAVE)
                .should("be.visible")
                .click();

            cy.wait("@updateRecipe").then(interceptedRequest => {
                cy.wrap(interceptedRequest?.request?.body)
                    .its("description")
                    .should("eq", NEW_PAGE_TITLE_DESCRIPTION);
            });
        });
    });
});
