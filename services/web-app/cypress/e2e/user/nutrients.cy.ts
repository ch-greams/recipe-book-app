import * as constants from "@cypress/constants";

import { getCurrentDate } from "@common/date";
import { NUTRIENT_TYPE_LABEL_MAPPING, NutrientName } from "@common/nutrients";
import { USER_PATH } from "@common/routes";
import { NutrientUnit } from "@common/units";


describe("user", () => {

    describe("user nutrients", () => {

        beforeEach(() => {
            cy.intercept(
                `${constants.CY_PRODUCT_API_PATH}/favorite?limit=20`,
                { fixture: "foods_favorite.json" },
            );
            cy.intercept(
                `${constants.CY_PRODUCT_API_PATH}/created?limit=20`,
                { fixture: "foods_custom.json" },
            );
            cy.intercept(
                `${constants.CY_JOURNAL_API_PATH}/groups`,
                { fixture: "journal_groups_response.json" },
            );
            cy.intercept(
                `${constants.CY_JOURNAL_API_PATH}/entry?entry_date=${getCurrentDate()}`,
                { fixture: "journal_entries_response.json" },
            );
            cy.intercept(
                `${constants.CY_JOURNAL_API_PATH}/nutrients`,
                { fixture: "journal_nutrients_response.json" },
            );
            cy.intercept(
                `${constants.CY_META_API_PATH}/nutrients`,
                { fixture: "meta_nutrients_response.json" },
            );

            cy.visit(USER_PATH);
        });

        it("can see featured nutrients", () => {

            const NUTRIENT_INDEX = 3;
            const NUTRIENT_DEFAULT_AMOUNT = 28;
            const NUTRIENT_TARGET_AMOUNT = 31;
            const NUTRIENT_LABEL = NUTRIENT_TYPE_LABEL_MAPPING[NutrientName.DietaryFiber];
            const NUTRIENT_UNIT = NutrientUnit.g;

            // Slot index

            cy.get(`[data-cy=${constants.CY_USER_NUTRIENT_INDEX}]`)
                .contains(NUTRIENT_INDEX)
                .should("be.visible")
                .parents(`[data-cy=${constants.CY_USER_NUTRIENT_LINE}]`)
                .as("nutrientLine");

            // Nutrient name

            cy.get("@nutrientLine")
                .find(`[data-cy=${constants.CY_USER_NUTRIENT_NAME}]`)
                .contains(NUTRIENT_LABEL)
                .should("be.visible");

            // Nutrient amount and default amount

            cy.get("@nutrientLine")
                .find(`[data-cy=${constants.CY_USER_NUTRIENT_AMOUNT}]`)
                .should("have.attr", "placeholder", NUTRIENT_DEFAULT_AMOUNT)
                .should("have.value", NUTRIENT_TARGET_AMOUNT)
                .should("be.visible");

            // Nutrient unit

            cy.get("@nutrientLine")
                .find(`[data-cy=${constants.CY_USER_NUTRIENT_UNIT}]`)
                .contains(NUTRIENT_UNIT)
                .should("be.visible");
        });

        it("can replace featured nutrient", () => {

            const NUTRIENT_INDEX = 3;

            const BEFORE_NUTRIENT_LABEL = NUTRIENT_TYPE_LABEL_MAPPING[NutrientName.DietaryFiber];
            const BEFORE_NUTRIENT_UNIT = NutrientUnit.g;

            const AFTER_NUTRIENT_DEFAULT_AMOUNT = 300;
            const AFTER_NUTRIENT_LABEL = NUTRIENT_TYPE_LABEL_MAPPING[NutrientName.Cholesterol];
            const AFTER_NUTRIENT_UNIT = NutrientUnit.mg;

            cy.intercept(
                "POST", `${constants.CY_JOURNAL_API_PATH}/nutrient/upsert`,
                { fixture: "journal_nutrient_name_upsert_response.json" },
            )
                .as("upsertNutrient");

            cy.intercept("POST", `${constants.CY_JOURNAL_API_PATH}/nutrient/delete`, { statusCode: 204 })
                .as("deleteNutrient");

            // Save nutrientLine

            cy.get(`[data-cy=${constants.CY_USER_NUTRIENT_INDEX}]`)
                .contains(NUTRIENT_INDEX)
                .should("be.visible")
                .parents(`[data-cy=${constants.CY_USER_NUTRIENT_LINE}]`)
                .as("nutrientLine");

            // Check before change

            cy.get("@nutrientLine")
                .find(`[data-cy=${constants.CY_USER_NUTRIENT_UNIT}]`)
                .contains(BEFORE_NUTRIENT_UNIT)
                .should("be.visible");

            cy.get("@nutrientLine")
                .find(`[data-cy=${constants.CY_USER_NUTRIENT_NAME}]`)
                .contains(BEFORE_NUTRIENT_LABEL)
                .should("be.visible")
                .click();

            // Change nutrient

            const AMOUNT_OF_PX_TO_SCROLL_DOWN = 220;

            cy.get("@nutrientLine")
                .find(`[data-cy=${constants.CY_SELECT_INPUT_OPTION_LIST}]`)
                .scrollTo(0, AMOUNT_OF_PX_TO_SCROLL_DOWN)
                .find(`li[data-cy=${constants.CY_SELECT_INPUT_OPTION}]`)
                .contains(AFTER_NUTRIENT_LABEL)
                .should("be.visible")
                .click();

            // Check changes

            cy.get("@nutrientLine")
                .find(`[data-cy=${constants.CY_USER_NUTRIENT_UNIT}]`)
                .contains(AFTER_NUTRIENT_UNIT)
                .should("be.visible");

            cy.get("@nutrientLine")
                .find(`[data-cy=${constants.CY_USER_NUTRIENT_NAME}]`)
                .contains(AFTER_NUTRIENT_LABEL)
                .should("be.visible");

            cy.get("@nutrientLine")
                .find(`[data-cy=${constants.CY_USER_NUTRIENT_AMOUNT}]`)
                .should("have.attr", "placeholder", AFTER_NUTRIENT_DEFAULT_AMOUNT)
                .should("not.have.value")
                .should("be.visible");
        });

        it("can edit amount of featured nutrient", () => {

            const NUTRIENT_INDEX = 3;

            const NUTRIENT_DEFAULT_AMOUNT = 28;
            const NUTRIENT_TARGET_AMOUNT_OLD = 31;
            const NUTRIENT_TARGET_AMOUNT_NEW = 40;
            const NUTRIENT_LABEL = NUTRIENT_TYPE_LABEL_MAPPING[NutrientName.DietaryFiber];

            cy.intercept(
                "POST", `${constants.CY_JOURNAL_API_PATH}/nutrient/upsert`,
                { fixture: "journal_nutrient_amount_upsert_response.json" },
            )
                .as("upsertNutrient");

            cy.intercept("POST", `${constants.CY_JOURNAL_API_PATH}/nutrient/delete`, { statusCode: 204 })
                .as("deleteNutrient");

            // Save nutrientLine

            cy.get(`[data-cy=${constants.CY_USER_NUTRIENT_INDEX}]`)
                .contains(NUTRIENT_INDEX)
                .should("be.visible")
                .parents(`[data-cy=${constants.CY_USER_NUTRIENT_LINE}]`)
                .as("nutrientLine");


            // Check before change

            cy.get("@nutrientLine")
                .find(`[data-cy=${constants.CY_USER_NUTRIENT_NAME}]`)
                .contains(NUTRIENT_LABEL)
                .should("be.visible");

            cy.get("@nutrientLine")
                .find(`[data-cy=${constants.CY_USER_NUTRIENT_AMOUNT}]`)
                .should("have.attr", "placeholder", NUTRIENT_DEFAULT_AMOUNT)
                .should("have.value", NUTRIENT_TARGET_AMOUNT_OLD)
                .should("be.visible")
                .clear()
                .should("not.have.value")
                .type(String(NUTRIENT_TARGET_AMOUNT_NEW))
                .blur();

            cy.wait("@upsertNutrient").then(interceptedRequest => {
                cy.wrap(interceptedRequest?.request?.body)
                    .its("daily_target_amount")
                    .should("eq", NUTRIENT_TARGET_AMOUNT_NEW);
            });
        });

        it("can remove a featured nutrient", () => {

            const NUTRIENT_INDEX = 3;
            const NUTRIENT_LABEL = NUTRIENT_TYPE_LABEL_MAPPING[NutrientName.DietaryFiber];

            cy.intercept("POST", `${constants.CY_JOURNAL_API_PATH}/nutrient/delete`, { statusCode: 204 })
                .as("deleteNutrient");

            // Save nutrientLine

            cy.get(`[data-cy=${constants.CY_USER_NUTRIENT_INDEX}]`)
                .contains(NUTRIENT_INDEX)
                .should("be.visible")
                .parents(`[data-cy=${constants.CY_USER_NUTRIENT_LINE}]`)
                .as("nutrientLine");

            // Check before change

            cy.get("@nutrientLine")
                .find(`[data-cy=${constants.CY_USER_NUTRIENT_NAME}] [data-cy=${constants.CY_SELECT_INPUT_CURRENT_OPTION}]`)
                .should("have.text", NUTRIENT_LABEL)
                .should("be.visible");

            // Remove nutrient from current line

            cy.get("@nutrientLine")
                .find(`[data-cy=${constants.CY_TOGGLE}]`)
                .click();

            // Check after change

            cy.get("@nutrientLine")
                .find(`[data-cy=${constants.CY_USER_NUTRIENT_NAME}] [data-cy=${constants.CY_SELECT_INPUT_CURRENT_OPTION}]`)
                .should("be.empty")
                .should("be.visible");
        });
    });
});
