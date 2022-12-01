import * as constants from "@cypress/constants";

import { BUTTON_EDIT } from "@common/labels";
import { WeightUnit } from "@common/units";


describe("recipe_page", () => {

    describe("custom_units", () => {

        beforeEach(() => {
            cy.intercept(`${constants.CY_RECIPE_API_PATH}/29`, { fixture: "recipe.json" });

            cy.visit(`${constants.CY_RECIPE_PATH}/29`);
        });

        it("can create custom_unit", () => {

            const cuName = "test unit";
            const cuAmount = "1234.5";

            cy.get(`[data-cy=${constants.CY_BUTTON}]`).contains(BUTTON_EDIT)
                .should("be.visible")
                .click();

            cy.get(`[data-cy=${constants.CY_NEW_CUSTOM_UNIT_LINE}] [data-cy=${constants.CY_CUSTOM_UNIT_NAME}]`)
                .type(cuName);
            cy.get(`[data-cy=${constants.CY_NEW_CUSTOM_UNIT_LINE}] [data-cy=${constants.CY_CUSTOM_UNIT_AMOUNT}]`)
                .clear()
                .type(cuAmount);

            cy.get(`[data-cy=${constants.CY_NEW_CUSTOM_UNIT_LINE}] [data-cy=${constants.CY_SELECT_INPUT}]`)
                .as("selectInput")
                .get(`[data-cy=${constants.CY_SELECT_INPUT_OPTION}]`)
                .should("not.exist");

            cy.get("@selectInput").click();
            cy.get("@selectInput").get(`[data-cy=${constants.CY_SELECT_INPUT_OPTION}]`).should("be.visible");
            cy.get("@selectInput").contains(WeightUnit.oz).click();
            cy.get("@selectInput").get(`[data-cy=${constants.CY_SELECT_INPUT_OPTION}]`).should("not.exist");

            cy.get(`[data-cy=${constants.CY_NEW_CUSTOM_UNIT_LINE}] [data-cy=${constants.CY_CUSTOM_UNIT_BUTTON}]`)
                .click();


            cy.get(`[data-cy=${constants.CY_CUSTOM_UNIT_LINE}] [data-cy=${constants.CY_CUSTOM_UNIT_NAME}][value="${cuName}"]`)
                .parent()
                .within(() => {
                    cy.get(`[data-cy=${constants.CY_CUSTOM_UNIT_NAME}][value="${cuName}"]`).should("be.visible");
                    cy.get(`[data-cy=${constants.CY_CUSTOM_UNIT_AMOUNT}][value="${cuAmount}"]`).should("be.visible");
                    cy.get(`[data-cy=${constants.CY_SELECT_INPUT}]`).contains(WeightUnit.oz).should("be.visible");
                });
        });


        it("can update custom_unit", () => {

            const cuName = "package";
            const cuNameUpdated = "updated name";
            const cuAmountUpdated = "125.67";

            cy.get(`[data-cy=${constants.CY_BUTTON}]`).contains(BUTTON_EDIT)
                .should("be.visible")
                .click();

            cy.get(`[data-cy=${constants.CY_CUSTOM_UNIT_LINE}] [data-cy=${constants.CY_CUSTOM_UNIT_NAME}][value="${cuName}"]`)
                .parent()
                .within(() => {

                    // Update name

                    cy.get(`[data-cy=${constants.CY_CUSTOM_UNIT_NAME}][value="${cuName}"]`)
                        .should("be.visible")
                        .clear()
                        .type(cuNameUpdated);

                    cy.get(`[data-cy=${constants.CY_CUSTOM_UNIT_NAME}][value="${cuNameUpdated}"]`)
                        .should("be.visible");

                    // Update value

                    cy.get(`[data-cy=${constants.CY_CUSTOM_UNIT_AMOUNT}]`)
                        .should("be.visible")
                        .clear()
                        .type(cuAmountUpdated);

                    cy.get(`[data-cy=${constants.CY_CUSTOM_UNIT_AMOUNT}][value="${cuAmountUpdated}"]`)
                        .should("be.visible");

                    // Update unit

                    cy.get(`[data-cy=${constants.CY_SELECT_INPUT}] [data-cy=${constants.CY_SELECT_INPUT_OPTION}]`)
                        .should("not.exist");
                    cy.get(`[data-cy=${constants.CY_SELECT_INPUT}]`)
                        .click();
                    cy.get(`[data-cy=${constants.CY_SELECT_INPUT}] [data-cy=${constants.CY_SELECT_INPUT_OPTION}]`)
                        .should("be.visible");
                    cy.get(`[data-cy=${constants.CY_SELECT_INPUT}]`)
                        .contains(WeightUnit.oz)
                        .click();

                    cy.get(`[data-cy=${constants.CY_SELECT_INPUT}] [data-cy=${constants.CY_SELECT_INPUT_OPTION}]`)
                        .should("not.exist");
                    cy.get(`[data-cy=${constants.CY_SELECT_INPUT}]`).contains(WeightUnit.oz).should("be.visible");
                });
        });

        it("can remove custom_unit", () => {

            const cuName = "package";

            cy.get(`[data-cy=${constants.CY_BUTTON}]`).contains(BUTTON_EDIT)
                .should("be.visible")
                .click();

            cy.get(`[data-cy=${constants.CY_CUSTOM_UNIT_LINE}] [data-cy=${constants.CY_CUSTOM_UNIT_NAME}][value="${cuName}"]`)
                .should("be.visible")
                .parent()
                .parent()
                .within(() => {
                    cy.get(`[data-cy=${constants.CY_CUSTOM_UNIT_BUTTON}]`)
                        .should("be.visible")
                        .click();
                });

            cy.get(`[data-cy=${constants.CY_CUSTOM_UNIT_LINE}] [data-cy=${constants.CY_CUSTOM_UNIT_NAME}][value="${cuName}"]`)
                .should("not.exist");

        });
    });
});
