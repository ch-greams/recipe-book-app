import * as constants from "@cypress/constants";

import { BUTTON_EDIT } from "@common/labels";
import { RECIPE_PATH } from "@common/routes";
import { TemperatureUnit, TimeUnit, VolumeUnit, WeightUnit } from "@common/units";



describe("recipe_page", () => {

    describe("instructions - read-only", () => {

        beforeEach(() => {
            cy.intercept(`${constants.CY_RECIPE_API_PATH}/29`, { fixture: "recipe.json" });

            cy.visit(`${RECIPE_PATH}/29`);
        });

        it("can switch temperature unit", () => {

            const STEP_NAME = "test step";

            cy.get(`[data-cy=${constants.CY_INSTRUCTION}] [data-cy=${constants.CY_INSTRUCTION_LINE_DESCRIPTION_TEXT}]`)
                .contains(STEP_NAME)
                .should("be.visible")
                .parents(`[data-cy=${constants.CY_INSTRUCTION}]`)
                .find(`[data-cy=${constants.CY_INSTRUCTION_LINE_TEMPERATURE_MEASURE}] [data-cy=${constants.CY_SELECT_INPUT}]`)
                .as("temperatureSelect")
                .contains(TemperatureUnit.C)
                .should("be.visible");

            cy.get(`[data-cy=${constants.CY_SELECT_INPUT_OPTION}]`).should("not.exist");

            cy.get("@temperatureSelect").click();

            cy.get("@temperatureSelect")
                .find(`[data-cy=${constants.CY_SELECT_INPUT_OPTION}]`)
                .should("be.visible")
                .contains(TemperatureUnit.F)
                .click();

            cy.get(`[data-cy=${constants.CY_SELECT_INPUT_OPTION}]`).should("not.exist");

            cy.get("@temperatureSelect")
                .contains(TemperatureUnit.F)
                .should("be.visible");
        });

        it("can switch duration unit", () => {

            const STEP_NAME = "stir";

            cy.get(`[data-cy=${constants.CY_INSTRUCTION}] [data-cy=${constants.CY_INSTRUCTION_LINE_DESCRIPTION_TEXT}]`)
                .contains(STEP_NAME)
                .should("be.visible")
                .parents(`[data-cy=${constants.CY_INSTRUCTION}]`)
                .find(`[data-cy=${constants.CY_INSTRUCTION_LINE_DURATION_MEASURE}] [data-cy=${constants.CY_SELECT_INPUT}]`)
                .as("temperatureSelect")
                .contains(TimeUnit.min)
                .should("be.visible");

            cy.get(`[data-cy=${constants.CY_SELECT_INPUT_OPTION}]`).should("not.exist");

            cy.get("@temperatureSelect").click();

            cy.get("@temperatureSelect")
                .find(`[data-cy=${constants.CY_SELECT_INPUT_OPTION}]`)
                .should("be.visible")
                .contains(TimeUnit.h)
                .click();

            cy.get(`[data-cy=${constants.CY_SELECT_INPUT_OPTION}]`).should("not.exist");

            cy.get("@temperatureSelect")
                .contains(TimeUnit.h)
                .should("be.visible");
        });

        it("can complete instruction", () => {

            const STEP_NAME = "stir";

            const CHECKBOX_OFF = 0;
            const CHECKBOX_ON = 1;

            cy.get(`[data-cy=${constants.CY_INSTRUCTION}] [data-cy=${constants.CY_INSTRUCTION_LINE_DESCRIPTION_TEXT}]`)
                .contains(STEP_NAME)
                .should("be.visible")
                .parents(`[data-cy=${constants.CY_INSTRUCTION}]`)
                .find(`[data-cy=${constants.CY_INSTRUCTION_CHECKBOX}]`)
                .as("instructionLineCheckbox")
                .should("be.visible")
                .children()
                .should("have.length", CHECKBOX_OFF);

            cy.get("@instructionLineCheckbox")
                .click()
                .children()
                .should("have.length", CHECKBOX_ON);
        });

        it("can switch instruction_ingredient unit", () => {

            const INGREDIENT_NAME = "Sour Cream";

            cy.get(`[data-cy=${constants.CY_INSTRUCTION_INGREDIENT}] [data-cy=${constants.CY_INSTRUCTION_INGREDIENT_NAME}]`)
                .contains(INGREDIENT_NAME)
                .should("be.visible")
                .parents(`[data-cy=${constants.CY_INSTRUCTION_INGREDIENT}]`)
                .as("instructionPartLine")
                .find(`[data-cy=${constants.CY_SELECT_INPUT}]`)
                .contains(VolumeUnit.ml)
                .should("be.visible")
                .click();

            cy.get("@instructionPartLine")
                .find(`[data-cy=${constants.CY_SELECT_INPUT_OPTION}]`)
                .contains(WeightUnit.g)
                .should("be.visible")
                .click();

            cy.get("@instructionPartLine")
                .find(`[data-cy=${constants.CY_SELECT_INPUT}]`)
                .contains(WeightUnit.g)
                .should("be.visible");
        });
    });

    describe("instructions - edit", () => {

        beforeEach(() => {
            cy.intercept(`${constants.CY_RECIPE_API_PATH}/29`, { fixture: "recipe.json" });

            cy.visit(`${RECIPE_PATH}/29`);
            cy.get(`[data-cy=${constants.CY_BUTTON}]`).contains(BUTTON_EDIT).click();
        });

        it("can add instruction", () => {

            const NEW_INSTRUCTION_DESCRIPTION = "Some new action";

            const INSTRUCTION_COUNT_BEFORE = 2;
            const INSTRUCTION_COUNT_AFTER = 3;

            cy.get(`[data-cy=${constants.CY_INSTRUCTION}]`)
                .should("have.length", INSTRUCTION_COUNT_BEFORE);

            // STEP NUMBER & NAME

            cy.get(`[data-cy=${constants.CY_INSTRUCTION_LINE}]`).last()
                .should("be.visible")
                .as("newInstructionLine");

            cy.get("@newInstructionLine")
                .find(`[data-cy=${constants.CY_INSTRUCTION_LINE_DESCRIPTION_INPUT}]`)
                .should("be.visible")
                .type(NEW_INSTRUCTION_DESCRIPTION);

            // TEMPERATURE

            cy.get("@newInstructionLine")
                .find(`[data-cy=${constants.CY_INSTRUCTION_LINE_TEMPERATURE_INPUT}]`)
                .should("be.visible")
                .type("400");

            cy.get("@newInstructionLine")
                .find(`[data-cy=${constants.CY_INSTRUCTION_LINE_TEMPERATURE_MEASURE}]`)
                .as("temperatureMeasure")
                .find(`[data-cy=${constants.CY_SELECT_INPUT}]`)
                .contains(TemperatureUnit.C)
                .should("be.visible")
                .click();

            cy.get("@temperatureMeasure")
                .find(`[data-cy=${constants.CY_SELECT_INPUT_OPTION}]`)
                .contains(TemperatureUnit.F)
                .should("be.visible")
                .click();


            // DURATION

            cy.get("@newInstructionLine")
                .find(`[data-cy=${constants.CY_INSTRUCTION_LINE_DURATION_INPUT}]`)
                .should("be.visible")
                .type("25");

            cy.get("@newInstructionLine")
                .find(`[data-cy=${constants.CY_INSTRUCTION_LINE_DURATION_MEASURE}]`)
                .as("durationMeasure")
                .find(`[data-cy=${constants.CY_SELECT_INPUT}]`)
                .contains(TimeUnit.min)
                .should("be.visible")
                .click();

            cy.get("@durationMeasure")
                .find(`[data-cy=${constants.CY_SELECT_INPUT_OPTION}]`)
                .contains(TimeUnit.h)
                .should("be.visible")
                .click();

            // Create new instruction

            cy.get("@newInstructionLine")
                .find(`[data-cy=${constants.CY_INSTRUCTION_BUTTON}]`)
                .should("be.visible")
                .click();

            cy.get(`[data-cy=${constants.CY_INSTRUCTION}]`)
                .should("have.length", INSTRUCTION_COUNT_AFTER);
        });

        it("can remove instruction", () => {

            const INSTRUCTION_COUNT_BEFORE = 2;
            const INSTRUCTION_COUNT_AFTER = 1;

            cy.get(`[data-cy=${constants.CY_INSTRUCTION}]`)
                .should("have.length", INSTRUCTION_COUNT_BEFORE);

            cy.get(`[data-cy=${constants.CY_INSTRUCTION}] [data-cy=${constants.CY_INSTRUCTION_BUTTON}]`)
                .should("be.visible")
                .first()
                .click();

            cy.get(`[data-cy=${constants.CY_INSTRUCTION}]`)
                .should("have.length", INSTRUCTION_COUNT_AFTER);
        });

        it("can add instruction_ingredient", () => {

            const STEP_NAME = "test step";
            const INGREDIENT_NAME = "Sour Cream";

            const INSTRUCTION_INGREDIENT_COUNT_BEFORE = 0;
            const INSTRUCTION_INGREDIENT_COUNT_AFTER = 1;

            cy.get(`[data-cy=${constants.CY_INSTRUCTION_LINE_DESCRIPTION_INPUT}][value="${STEP_NAME}"]`)
                .should("be.visible")
                .parents(`[data-cy=${constants.CY_INSTRUCTION}]`)
                .as("instructionLine")
                .find(`[data-cy=${constants.CY_INSTRUCTION_INGREDIENT}]`)
                .should("have.length", INSTRUCTION_INGREDIENT_COUNT_BEFORE);

            cy.get("@instructionLine")
                .find(`[data-cy=${constants.CY_INSTRUCTION_INGREDIENT_NEW}] [data-cy=${constants.CY_SELECT_INPUT}]`)
                .click();

            cy.get("@instructionLine")
                .find(`[data-cy=${constants.CY_INSTRUCTION_INGREDIENT_NEW}] [data-cy=${constants.CY_SELECT_INPUT_OPTION}]`)
                .contains(INGREDIENT_NAME)
                .click();

            cy.get("@instructionLine")
                .find(`[data-cy=${constants.CY_INSTRUCTION_INGREDIENT_NEW_CREATE_BUTTON}]`)
                .click();

            cy.get("@instructionLine")
                .find(`[data-cy=${constants.CY_INSTRUCTION_INGREDIENT}]`)
                .should("have.length", INSTRUCTION_INGREDIENT_COUNT_AFTER);
        });

        it("can remove instruction_ingredient", () => {

            const STEP_NAME = "stir";

            const INSTRUCTION_INGREDIENT_COUNT_BEFORE = 2;
            const INSTRUCTION_INGREDIENT_COUNT_AFTER = 1;

            cy.get(`[data-cy=${constants.CY_INSTRUCTION_LINE_DESCRIPTION_INPUT}][value="${STEP_NAME}"]`)
                .should("be.visible")
                .parents(`[data-cy=${constants.CY_INSTRUCTION}]`)
                .as("instructionLine")
                .find(`[data-cy=${constants.CY_INSTRUCTION_INGREDIENT}]`)
                .should("have.length", INSTRUCTION_INGREDIENT_COUNT_BEFORE);

            cy.get("@instructionLine")
                .find(`[data-cy=${constants.CY_INSTRUCTION_INGREDIENT_REMOVE_BUTTON}]`)
                .first()
                .click();

            cy.get("@instructionLine")
                .find(`[data-cy=${constants.CY_INSTRUCTION_INGREDIENT}]`)
                .should("have.length", INSTRUCTION_INGREDIENT_COUNT_AFTER);
        });
    });
});
