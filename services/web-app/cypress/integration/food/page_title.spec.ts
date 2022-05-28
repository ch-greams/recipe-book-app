import * as constants from "@cypress/constants";

import { RBA_BUTTON_LABEL_EDIT, RBA_BUTTON_LABEL_SAVE } from "@views/shared/rba-button/labels";


describe("food_page", () => {

    describe("page_title", () => {

        beforeEach(() => {
            cy.intercept(`${constants.CY_FOOD_API_PATH}/1`, { fixture: "food.json" });
            cy.intercept(`${constants.CY_FOOD_API_PATH}/update`, { fixture: "food_update_response.json" })
                .as("updateFood");

            cy.visit(`${constants.CY_FOOD_PATH}/1`);
        });

        it("can update name", () => {

            const NEW_PAGE_TITLE_NAME = "new name";

            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_BLOCK}]`).should("be.visible");
            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_NAME_TEXT}]`).should("be.visible");
            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_NAME_INPUT}]`).should("not.exist");

            cy.get(`[data-cy=${constants.CY_BUTTON}]`).contains(RBA_BUTTON_LABEL_EDIT).click();

            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_NAME_TEXT}]`).should("not.exist");
            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_NAME_INPUT}]`)
                .should("be.visible")
                .clear()
                .type(NEW_PAGE_TITLE_NAME);

            cy.get(`[data-cy=${constants.CY_BUTTON}]`).contains(RBA_BUTTON_LABEL_SAVE)
                .should("be.visible")
                .click();

            cy.wait("@updateFood").then(interceptedRequest => {
                cy.wrap(interceptedRequest?.request?.body)
                    .its("name")
                    .should("eq", NEW_PAGE_TITLE_NAME.toUpperCase());
            });
        });

        it("can update brand", () => {

            const NEW_PAGE_TITLE_BRAND = "new brand";

            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_BLOCK}]`).should("be.visible");
            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_BRAND_TEXT}]`).should("be.visible");
            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_BRAND_INPUT}]`).should("not.exist");

            cy.get(`[data-cy=${constants.CY_BUTTON}]`).contains(RBA_BUTTON_LABEL_EDIT)
                .should("be.visible")
                .click();

            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_BRAND_TEXT}]`).should("not.exist");
            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_BRAND_INPUT}]`)
                .should("be.visible")
                .clear()
                .type(NEW_PAGE_TITLE_BRAND);

            cy.get(`[data-cy=${constants.CY_BUTTON}]`).contains(RBA_BUTTON_LABEL_SAVE)
                .should("be.visible")
                .click();

            cy.wait("@updateFood").then(interceptedRequest => {
                cy.wrap(interceptedRequest?.request?.body)
                    .its("brand")
                    .should("eq", NEW_PAGE_TITLE_BRAND.toUpperCase());
            });
        });

        it("can update subtitle", () => {

            const NEW_PAGE_TITLE_SUBTITLE = "new subtitle";

            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_BLOCK}]`).should("be.visible");
            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_SUBTITLE_TEXT}]`).should("be.visible");
            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_SUBTITLE_INPUT}]`).should("not.exist");

            cy.get(`[data-cy=${constants.CY_BUTTON}]`).contains(RBA_BUTTON_LABEL_EDIT).click();

            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_SUBTITLE_TEXT}]`).should("not.exist");
            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_SUBTITLE_INPUT}]`)
                .should("be.visible")
                .clear()
                .type(NEW_PAGE_TITLE_SUBTITLE);

            cy.get(`[data-cy=${constants.CY_BUTTON}]`).contains(RBA_BUTTON_LABEL_SAVE)
                .should("be.visible")
                .click();

            cy.wait("@updateFood").then(interceptedRequest => {
                cy.wrap(interceptedRequest?.request?.body)
                    .its("subtitle")
                    .should("eq", NEW_PAGE_TITLE_SUBTITLE.toUpperCase());
            });
        });

        it("can update description", () => {

            const NEW_PAGE_TITLE_DESCRIPTION = "new description";

            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_BLOCK}]`).should("be.visible");
            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_DESCRIPTION_INPUT}]`).should("not.exist");

            cy.get(`[data-cy=${constants.CY_BUTTON}]`).contains(RBA_BUTTON_LABEL_EDIT).click();

            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_DESCRIPTION_TEXT}]`).should("not.exist");
            cy.get(`[data-cy=${constants.CY_PAGE_TITLE_DESCRIPTION_INPUT}]`)
                .should("be.visible")
                .clear()
                .type(NEW_PAGE_TITLE_DESCRIPTION);

            cy.get(`[data-cy=${constants.CY_BUTTON}]`).contains(RBA_BUTTON_LABEL_SAVE)
                .should("be.visible")
                .click();

            cy.wait("@updateFood").then(interceptedRequest => {
                cy.wrap(interceptedRequest?.request?.body)
                    .its("description")
                    .should("eq", NEW_PAGE_TITLE_DESCRIPTION);
            });
        });
    });
});
