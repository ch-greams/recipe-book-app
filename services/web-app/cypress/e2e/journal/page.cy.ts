import * as constants from "@cypress/constants";

import { getCurrentDate } from "@common/date";


describe("journal_page", () => {

    describe("page", () => {
        beforeEach(() => {
            cy.intercept(`${constants.CY_JOURNAL_API_PATH}/entry?entry_date=${getCurrentDate()}&user_id=1`, { fixture: "journal_entries_response.json" });
            cy.intercept(`${constants.CY_JOURNAL_API_PATH}/groups?user_id=1`, { fixture: "journal_groups_response.json" });
            cy.visit(`${constants.CY_JOURNAL_PATH}`);
        });
        it("can see all page blocks", () => {
            cy.get(`[data-cy=${constants.CY_JOURNAL_DATE_BLOCK}]`).should("be.visible");
            cy.get(`[data-cy=${constants.CY_JOURNAL_BLOCK}]`).should("be.visible");
            cy.get(`[data-cy=${constants.CY_DETAILED_NUTRIENTS_BLOCK}]`).should("be.visible");
        });

        it("can see journal entries in groups", () => {
            const FOOD_NAME = "Hamburger";
            const FOOD_GROUP = "LUNCH";

            cy.get(`[data-cy=${constants.CY_JOURNAL_GROUP}]`)
                .contains(FOOD_GROUP)
                .should("be.visible")
                .parents(`[data-cy=${constants.CY_JOURNAL_GROUP}]`)
                .find(`[data-cy=${constants.CY_JOURNAL_ENTRY}]`)
                .contains(FOOD_NAME)
                .should("be.visible");
        });

    });
});

