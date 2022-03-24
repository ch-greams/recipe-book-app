import {
    CY_FOOD_API_PATH,
    CY_PAGE_TITLE_BLOCK, CY_PAGE_TITLE_BRAND_INPUT, CY_PAGE_TITLE_BRAND_TEXT, CY_PAGE_TITLE_CONFIRM_BUTTON,
    CY_PAGE_TITLE_DESCRIPTION_INPUT, CY_PAGE_TITLE_DESCRIPTION_TEXT, CY_PAGE_TITLE_NAME_INPUT,
    CY_PAGE_TITLE_NAME_TEXT, CY_PAGE_TITLE_SUBTITLE_INPUT, CY_PAGE_TITLE_SUBTITLE_TEXT, CY_RECIPE_API_PATH, CY_RECIPE_PATH,
} from "cypress/constants";


describe("recipe_page", () => {

    describe("page_title", () => {

        beforeEach(() => {
            cy.intercept(`${CY_RECIPE_API_PATH}/29`, { fixture: "recipe_item.json" });
            cy.intercept(`${CY_FOOD_API_PATH}`, { fixture: "food_items.json" });
        });

        it("can update name", () => {

            cy.visit(`${CY_RECIPE_PATH}/29`);

            const newPageTitleName = "new name";

            cy.get(`[data-cy=${CY_PAGE_TITLE_BLOCK}]`).should("be.visible");
            cy.get(`[data-cy=${CY_PAGE_TITLE_NAME_TEXT}]`).should("be.visible");
            cy.get(`[data-cy=${CY_PAGE_TITLE_NAME_INPUT}]`).should("not.exist");

            cy.get(`[data-cy=${CY_PAGE_TITLE_NAME_TEXT}]`).click();

            cy.get(`[data-cy=${CY_PAGE_TITLE_NAME_TEXT}]`).should("not.exist");
            cy.get(`[data-cy=${CY_PAGE_TITLE_NAME_INPUT}]`)
                .should("be.visible")
                .clear()
                .type(newPageTitleName);

            cy.get(`[data-cy=${CY_PAGE_TITLE_CONFIRM_BUTTON}]`)
                .should("be.visible")
                .click();

            cy.get(`[data-cy=${CY_PAGE_TITLE_NAME_TEXT}]`)
                .contains(newPageTitleName.toUpperCase())
                .should("be.visible");
            cy.get(`[data-cy=${CY_PAGE_TITLE_NAME_INPUT}]`).should("not.exist");
        });

        it("can update brand", () => {

            cy.visit(`${CY_RECIPE_PATH}/29`);

            const newPageTitleBrand = "new brand";

            cy.get(`[data-cy=${CY_PAGE_TITLE_BLOCK}]`).should("be.visible");
            cy.get(`[data-cy=${CY_PAGE_TITLE_BRAND_TEXT}]`).should("be.visible");
            cy.get(`[data-cy=${CY_PAGE_TITLE_BRAND_INPUT}]`).should("not.exist");

            cy.get(`[data-cy=${CY_PAGE_TITLE_BRAND_TEXT}]`).click();

            cy.get(`[data-cy=${CY_PAGE_TITLE_BRAND_TEXT}]`).should("not.exist");
            cy.get(`[data-cy=${CY_PAGE_TITLE_BRAND_INPUT}]`)
                .should("be.visible")
                .clear()
                .type(newPageTitleBrand);

            cy.get(`[data-cy=${CY_PAGE_TITLE_CONFIRM_BUTTON}]`)
                .should("be.visible")
                .click();

            cy.get(`[data-cy=${CY_PAGE_TITLE_BRAND_TEXT}]`)
                .contains(newPageTitleBrand.toUpperCase())
                .should("be.visible");
            cy.get(`[data-cy=${CY_PAGE_TITLE_BRAND_INPUT}]`).should("not.exist");
        });

        it("can update subtitle", () => {

            cy.visit(`${CY_RECIPE_PATH}/29`);

            const newPageTitleSubtitle = "new subtitle";

            cy.get(`[data-cy=${CY_PAGE_TITLE_BLOCK}]`).should("be.visible");
            cy.get(`[data-cy=${CY_PAGE_TITLE_SUBTITLE_TEXT}]`).should("be.visible");
            cy.get(`[data-cy=${CY_PAGE_TITLE_SUBTITLE_INPUT}]`).should("not.exist");

            cy.get(`[data-cy=${CY_PAGE_TITLE_SUBTITLE_TEXT}]`).click();

            cy.get(`[data-cy=${CY_PAGE_TITLE_SUBTITLE_TEXT}]`).should("not.exist");
            cy.get(`[data-cy=${CY_PAGE_TITLE_SUBTITLE_INPUT}]`)
                .should("be.visible")
                .clear()
                .type(newPageTitleSubtitle);

            cy.get(`[data-cy=${CY_PAGE_TITLE_CONFIRM_BUTTON}]`)
                .should("be.visible")
                .click();

            cy.get(`[data-cy=${CY_PAGE_TITLE_SUBTITLE_TEXT}]`)
                .contains(newPageTitleSubtitle.toUpperCase())
                .should("be.visible");
            cy.get(`[data-cy=${CY_PAGE_TITLE_SUBTITLE_INPUT}]`).should("not.exist");
        });

        it("can update description", () => {

            cy.visit(`${CY_RECIPE_PATH}/29`);

            const newPageTitleDescription = "new description";

            cy.get(`[data-cy=${CY_PAGE_TITLE_BLOCK}]`).should("be.visible");
            cy.get(`[data-cy=${CY_PAGE_TITLE_DESCRIPTION_INPUT}]`).should("not.exist");

            cy.get(`[data-cy=${CY_PAGE_TITLE_BLOCK}]`).click();

            cy.get(`[data-cy=${CY_PAGE_TITLE_DESCRIPTION_TEXT}]`).should("not.exist");
            cy.get(`[data-cy=${CY_PAGE_TITLE_DESCRIPTION_INPUT}]`)
                .should("be.visible")
                .clear()
                .type(newPageTitleDescription);

            cy.get(`[data-cy=${CY_PAGE_TITLE_CONFIRM_BUTTON}]`)
                .should("be.visible")
                .click();

            cy.get(`[data-cy=${CY_PAGE_TITLE_DESCRIPTION_TEXT}]`)
                .contains(newPageTitleDescription)
                .should("be.visible");
            cy.get(`[data-cy=${CY_PAGE_TITLE_DESCRIPTION_INPUT}]`).should("not.exist");
        });
    });
});
