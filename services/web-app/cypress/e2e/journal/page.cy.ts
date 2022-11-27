import * as constants from "@cypress/constants";

import { getCurrentDate } from "@common/date";


describe("journal_page", () => {

    describe("page", () => {
        beforeEach(() => {
            cy.intercept(`${constants.CY_JOURNAL_API_PATH}/entry?entry_date=${getCurrentDate()}&user_id=1`, { fixture: "journal_entries_response.json" });
            cy.intercept(`${constants.CY_JOURNAL_API_PATH}/groups?user_id=1`, { fixture: "journal_groups_response.json" });
            cy.visit(`${constants.CY_JOURNAL_PATH}`);
        });
        it("successfully loads", () => {
            cy.get(`[data-cy=${constants.CY_JOURNAL_DATE_BLOCK}]`).should("be.visible");
            cy.get(`[data-cy=${constants.CY_JOURNAL_BLOCK}]`).should("be.visible");
            cy.get(`[data-cy=${constants.CY_DETAILED_NUTRIENTS_BLOCK}]`).should("be.visible");
        });

        it("can see journal page elements", () => {
            cy.get(`[data-cy=${constants.CY_JOURNAL_DATE_BLOCK}]`)
                // .contains(`[data-cy=${constants.CY_JOURNAL_GROUP}]`, "")
                .should("be.visible");
            cy.get(`[data-cy=${constants.CY_JOURNAL_GROUP}]`)
                .should("be.visible");
            cy.get(`[data-cy=${constants.CY_JOURNAL_SEARCH_INPUT}]`)
                .should("have.value", "")
                .should("be.visible");
        });

        it("can locate provided journal entry data", () => {
            const FOOD_NAME = "Hamburger";

            cy.get(`[data-cy=${constants.CY_JOURNAL_ENTRY}]`)
                .contains(FOOD_NAME);
        });
    });
});

