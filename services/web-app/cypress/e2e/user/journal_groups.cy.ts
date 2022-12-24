import * as constants from "@cypress/constants";

import { getCurrentDate } from "@common/date";
import { BUTTON_REVERT, BUTTON_SAVE } from "@common/labels";
import { USER_PATH } from "@common/routes";
import type { JournalGroup } from "@common/typings";


describe("user", () => {

    describe("journal groups", () => {

        beforeEach(() => {
            cy.intercept(
                `${constants.CY_PRODUCT_API_PATH}/favorite?limit=20&user_id=1&is_recipe=true`,
                { fixture: "recipes_favorite.json" },
            );
            cy.intercept(
                `${constants.CY_PRODUCT_API_PATH}/created?limit=20&user_id=1&is_recipe=true`,
                { fixture: "recipes_custom.json" },
            );

            cy.intercept(
                `${constants.CY_PRODUCT_API_PATH}/favorite?limit=20&user_id=1&is_recipe=false`,
                { fixture: "foods_favorite.json" },
            );
            cy.intercept(
                `${constants.CY_PRODUCT_API_PATH}/created?limit=20&user_id=1&is_recipe=false`,
                { fixture: "foods_custom.json" },
            );
            cy.intercept(
                `${constants.CY_JOURNAL_API_PATH}/groups?user_id=1`,
                { fixture: "journal_groups_response.json" },
            );
            cy.intercept(
                `${constants.CY_JOURNAL_API_PATH}/entry?entry_date=${getCurrentDate()}&user_id=1`,
                { fixture: "journal_entries_response.json" },
            );
            cy.intercept(
                `${constants.CY_JOURNAL_API_PATH}/nutrients?user_id=1`,
                { fixture: "journal_nutrients_response.json" },
            );
            cy.intercept(
                `${constants.CY_META_API_PATH}/nutrients`,
                { fixture: "meta_nutrients_response.json" },
            );

            cy.visit(USER_PATH);
        });

        it("can see journal groups", () => {

            const JOURNAL_GROUP_N3 = "dinner";

            cy.get(`[data-cy=${constants.CY_USER_JOURNAL_GROUP_INPUT}][value="${JOURNAL_GROUP_N3}"]`)
                .should("be.visible")
                .siblings(`[data-cy=${constants.CY_USER_JOURNAL_GROUP_INDEX}]`)
                .should("have.text", "3")
                .should("be.visible");
        });

        it("can delete journal group and revert changes", () => {

            const JOURNAL_GROUP_N2 = "lunch";

            cy.get(`[data-cy=${constants.CY_USER_JOURNAL_GROUP_INPUT}][value="${JOURNAL_GROUP_N2}"]`)
                .should("be.visible")
                .siblings(`[data-cy=${constants.CY_USER_JOURNAL_GROUP_INDEX}]`)
                .should("have.text", "2")
                .should("be.visible");

            cy.get(`[data-cy=${constants.CY_BUTTON}]`)
                .contains(BUTTON_REVERT)
                .should("be.visible")
                .should("be.disabled");

            // Click toggle to disable the group
            cy.get(`[data-cy=${constants.CY_USER_JOURNAL_GROUP_INPUT}][value="${JOURNAL_GROUP_N2}"]`)
                .parent()
                .siblings(`[data-cy=${constants.CY_TOGGLE}]`)
                .click();

            cy.get(`[data-cy=${constants.CY_USER_JOURNAL_GROUP_INPUT}][value="${JOURNAL_GROUP_N2}"]`)
                .should("not.exist");

            // Revert changes
            cy.get(`[data-cy=${constants.CY_BUTTON}]`)
                .contains(BUTTON_REVERT)
                .should("be.visible")
                .click()
                .should("be.disabled");

            cy.get(`[data-cy=${constants.CY_USER_JOURNAL_GROUP_INPUT}][value="${JOURNAL_GROUP_N2}"]`)
                .should("be.visible")
                .siblings(`[data-cy=${constants.CY_USER_JOURNAL_GROUP_INDEX}]`)
                .should("have.text", "2")
                .should("be.visible");
        });

        it("can edit and save journal groups", () => {

            const JOURNAL_GROUP_N1 = "breakfast";
            const JOURNAL_GROUP_N1_NEW = "something before lunch";

            cy.intercept("POST", `${constants.CY_JOURNAL_API_PATH}/groups/update`, { statusCode: 201 }).as("updateGroups");

            // Edit group name
            cy.get(`[data-cy=${constants.CY_USER_JOURNAL_GROUP_INPUT}][value="${JOURNAL_GROUP_N1}"]`)
                .should("be.visible")
                .clear()
                .type(JOURNAL_GROUP_N1_NEW);

            // Save changes
            cy.get(`[data-cy=${constants.CY_BUTTON}]`)
                .contains(BUTTON_SAVE)
                .should("be.visible")
                .click();

            cy.wait("@updateGroups").then(interceptedRequest => {
                cy.wrap(interceptedRequest?.request?.body.find((group: JournalGroup) => group.ui_index === 1 ))
                    .its("name")
                    .should("eq", JOURNAL_GROUP_N1_NEW);
            });
        });
    });
});
