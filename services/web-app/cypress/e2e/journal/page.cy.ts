import * as constants from "@cypress/constants";

import { changeDate, DEFAULT_TIME_DISPLAY_FORMAT, DEFAULT_TIME_FORMAT, formatTime, getCurrentDate } from "@common/date";


describe("journal_page", () => {

    describe("page", () => {

        const CURRENT_DATE = getCurrentDate();

        beforeEach(() => {

            cy.intercept(
                `${constants.CY_JOURNAL_API_PATH}/entry?entry_date=${CURRENT_DATE}&user_id=1`,
                { fixture: "journal_entries_response.json" },
            );
            cy.intercept(
                `${constants.CY_JOURNAL_API_PATH}/groups?user_id=1`,
                { fixture: "journal_groups_response.json" },
            );

            cy.visit(`${constants.CY_JOURNAL_PATH}`);
        });

        it("can see all page blocks", () => {
            cy.get(`[data-cy=${constants.CY_JOURNAL_DATE_BLOCK}]`).should("be.visible");
            cy.get(`[data-cy=${constants.CY_JOURNAL_BLOCK}]`).should("be.visible");
            cy.get(`[data-cy=${constants.CY_DETAILED_NUTRIENTS_BLOCK}]`).should("be.visible");
        });

        it("can see journal entries in groups", () => {
            const FOOD_NAME = "hamburger";
            const FOOD_GROUP = "lunch";

            cy.get(`[data-cy=${constants.CY_JOURNAL_GROUP}]`)
                .contains(FOOD_GROUP, { matchCase: false })
                .should("be.visible")
                .parents(`[data-cy=${constants.CY_JOURNAL_GROUP}]`)
                .find(`[data-cy=${constants.CY_JOURNAL_ENTRY}]`)
                .contains(FOOD_NAME, { matchCase: false })
                .should("be.visible");
        });

        it("can create a new journal entry", () => {

            const NEW_PRODUCT_NAME_SHORT = "chicken";
            const NEW_PRODUCT_NAME_FULL = "Chicken Thigh - Bone Out";
            const FOOD_GROUP = "unknown";

            cy.intercept(
                `${constants.CY_PRODUCT_API_PATH}?limit=10&user_id=1&filter=${NEW_PRODUCT_NAME_SHORT}`,
                { fixture: "products_response.json" },
            );
            cy.intercept(
                "POST", `${constants.CY_JOURNAL_API_PATH}/entry/create`,
                { fixture: "journal_entry_create_response.json" },
            );

            cy.get(`[data-cy=${constants.CY_JOURNAL_SEARCH_INPUT}] [data-cy=${constants.CY_SEARCH_INPUT}]`)
                .should("be.visible")
                .type(NEW_PRODUCT_NAME_SHORT);

            cy.get(`[data-cy=${constants.CY_JOURNAL_SEARCH_INPUT}]`)
                .contains(NEW_PRODUCT_NAME_FULL)
                .should("be.visible")
                .click();

            cy.get(`[data-cy=${constants.CY_JOURNAL_GROUP}]`)
                .contains(FOOD_GROUP, { matchCase: false })
                .should("be.visible")
                .parents(`[data-cy=${constants.CY_JOURNAL_GROUP}]`)
                .find(`[data-cy=${constants.CY_JOURNAL_ENTRY}]`)
                .contains(NEW_PRODUCT_NAME_FULL, { matchCase: false })
                .should("be.visible");
        });

        it("can change the time of the entry in a journal entry", () => {

            const FOOD_NAME = "hamburger";
            const FOOD_GROUP = "lunch";
            const OLD_ENTRY_TIME = "12:25";
            const NEW_ENTRY_TIME = "13:01";

            cy.intercept(
                "POST", `${constants.CY_JOURNAL_API_PATH}/entry/update`,
                { fixture: "journal_entry_update_response.json" },
            )
                .as("updateEntry");

            cy.get(`[data-cy=${constants.CY_JOURNAL_GROUP}]`)
                .contains(FOOD_GROUP, { matchCase: false })
                .should("be.visible")
                .parents(`[data-cy=${constants.CY_JOURNAL_GROUP}]`)
                .find(`[data-cy=${constants.CY_JOURNAL_ENTRY}]`)
                .contains(FOOD_NAME, { matchCase: false })
                .should("be.visible")
                .parents(`[data-cy=${constants.CY_JOURNAL_ENTRY}]`)
                .find(`[data-cy=${constants.CY_JOURNAL_ENTRY_TIME}]`)
                .should("be.visible")
                .as("entryTime");

            cy.get("@entryTime")
                .should("have.value", OLD_ENTRY_TIME)
                .clear()
                .type(NEW_ENTRY_TIME)
                .blur();

            cy.wait("@updateEntry").then(interceptedRequest => {
                cy.wrap(interceptedRequest?.request?.body)
                    .its("entry_time")
                    .should("eq", formatTime(NEW_ENTRY_TIME, DEFAULT_TIME_DISPLAY_FORMAT, DEFAULT_TIME_FORMAT));
            });

            cy.get("@entryTime")
                .should("have.value", NEW_ENTRY_TIME);
        });

        it("can change the amount of food in a journal entry", () => {

            const FOOD_NAME = "hamburger";
            const FOOD_GROUP = "lunch";
            const OLD_ENTRY_AMOUNT = "450.4";
            const NEW_ENTRY_AMOUNT = 300.5;

            cy.intercept(
                "POST", `${constants.CY_JOURNAL_API_PATH}/entry/update`,
                { fixture: "journal_entry_update_response.json" },
            )
                .as("updateEntry");

            cy.get(`[data-cy=${constants.CY_JOURNAL_GROUP}]`)
                .contains(FOOD_GROUP, { matchCase: false })
                .should("be.visible")
                .parents(`[data-cy=${constants.CY_JOURNAL_GROUP}]`)
                .find(`[data-cy=${constants.CY_JOURNAL_ENTRY}]`)
                .contains(FOOD_NAME, { matchCase: false })
                .should("be.visible")
                .parents(`[data-cy=${constants.CY_JOURNAL_ENTRY}]`)
                .find(`[data-cy=${constants.CY_JOURNAL_ENTRY_FOOD_AMOUNT}]`)
                .should("be.visible")
                .as("entryAmount");

            cy.get("@entryAmount")
                .should("have.value", OLD_ENTRY_AMOUNT)
                .clear()
                .type(String(NEW_ENTRY_AMOUNT))
                .blur();

            cy.wait("@updateEntry").then(interceptedRequest => {
                cy.wrap(interceptedRequest?.request?.body)
                    .its("amount")
                    .should("eq", NEW_ENTRY_AMOUNT);
            });

            cy.get("@entryAmount")
                .should("have.value", NEW_ENTRY_AMOUNT);
        });

        it("can change the unit of food in a journal entry", () => {

            const FOOD_NAME = "hamburger";
            const FOOD_GROUP = "lunch";
            const OLD_ENTRY_UNIT = "g";
            const NEW_ENTRY_UNIT = "oz";

            cy.intercept(
                "POST", `${constants.CY_JOURNAL_API_PATH}/entry/update`,
                { fixture: "journal_entry_update_response.json" },
            )
                .as("updateEntry");

            cy.get(`[data-cy=${constants.CY_JOURNAL_GROUP}]`)
                .contains(FOOD_GROUP, { matchCase: false })
                .should("be.visible")
                .parents(`[data-cy=${constants.CY_JOURNAL_GROUP}]`)
                .find(`[data-cy=${constants.CY_JOURNAL_ENTRY}]`)
                .contains(FOOD_NAME, { matchCase: false })
                .should("be.visible")
                .parents(`[data-cy=${constants.CY_JOURNAL_ENTRY}]`)
                .find(`[data-cy=${constants.CY_JOURNAL_ENTRY_FOOD_UNIT}]`)
                .should("be.visible")
                .as("entryUnit")
                .find(`[data-cy=${constants.CY_SELECT_INPUT_CURRENT_OPTION}]`)
                .should("be.visible")
                .should("have.text", OLD_ENTRY_UNIT);

            cy.get("@entryUnit")
                .click();

            cy.get("@entryUnit")
                .find(`li[data-cy=${constants.CY_SELECT_INPUT_OPTION}]`)
                .contains(NEW_ENTRY_UNIT)
                .should("be.visible")
                .click();

            cy.wait("@updateEntry").then(interceptedRequest => {
                cy.wrap(interceptedRequest?.request?.body)
                    .its("unit")
                    .should("eq", NEW_ENTRY_UNIT);
            });

            cy.get("@entryUnit")
                .find(`[data-cy=${constants.CY_SELECT_INPUT_CURRENT_OPTION}]`)
                .should("have.text", NEW_ENTRY_UNIT);
        });

        it("can change the current day (and go back) and see different entries", () => {

            const FOOD_NAME = "hamburger";
            const FOOD_GROUP = "lunch";

            const PREV_DATE_BUTTON_LABEL = "<";
            const NEXT_DATE_BUTTON_LABEL = ">";

            const NEXT_DAY = changeDate(CURRENT_DATE, 1);

            cy.intercept(
                `${constants.CY_JOURNAL_API_PATH}/entry?entry_date=${NEXT_DAY}&user_id=1`,
                { body: [] },
            );

            cy.get(`[data-cy=${constants.CY_JOURNAL_BLOCK}]`)
                .should("be.visible")
                .contains(FOOD_GROUP, { matchCase: false })
                .should("be.visible")
                .parents(`[data-cy=${constants.CY_JOURNAL_GROUP}]`)
                .as("journalGroup");

            cy.get("@journalGroup")
                .find(`[data-cy=${constants.CY_JOURNAL_ENTRY}]`)
                .contains(FOOD_NAME, { matchCase: false })
                .should("be.visible")
                .as("journalEntry");

            cy.get(`[data-cy=${constants.CY_BUTTON}]`)
                .contains(NEXT_DATE_BUTTON_LABEL)
                .should("be.visible")
                .click();

            cy.get("@journalGroup").should("be.visible");
            cy.get(`[data-cy=${constants.CY_JOURNAL_ENTRY}]`).should("not.exist");

            cy.get(`[data-cy=${constants.CY_BUTTON}]`)
                .contains(PREV_DATE_BUTTON_LABEL)
                .should("be.visible")
                .click();

            cy.get("@journalGroup").should("be.visible");
            cy.get("@journalEntry").should("be.visible");
        });
    });
});
