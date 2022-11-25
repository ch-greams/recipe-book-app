import * as constants from "@cypress/constants";

import { getCurrentDate } from "@common/date";


describe("journal_page", () => {

    describe("page", () => {
        beforeEach(() => {
            cy.intercept(`${constants.CY_JOURNAL_API_PATH}/entry?entry_date=${getCurrentDate()}&user_id=1`, { fixture: "journal_entries_response.json" });
            cy.intercept(`${constants.CY_JOURNAL_API_PATH}/groups?user_id=1`, { fixture: "journal_groups_response.json" });
            cy.visit(`${constants.CY_JOURNAL_PATH}`);
        });

        it("can see journal page elements", () => {
            // can see date navigation
            cy.get(`[data-cy=${constants.CY_BUTTON}]`)
                .should("be.visible");
            // can see journal groups
            // can see search input
        });

        it("can locate provided journal entry data", () => {
            const FOOD_NAME = "Hamburger";
            // const INGREDIENT_PRODUCT_NAME = "Yogurt";

            cy.get(`[data-cy=${constants.CY_JOURNAL_BLOCK}]`)
                .contains(FOOD_NAME);
        });
    });
});
//     it("successfully loads", () => {

//         cy.visit("/journal");

//         cy.get(`a[href="${constants.CY_NEW_RECIPE_PATH}"]`).should("be.visible");
//         cy.get(`a[href="${constants.CY_NEW_FOOD_PATH}"]`).should("be.visible");
//     });
// });
