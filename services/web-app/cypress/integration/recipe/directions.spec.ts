import * as constants from "@cypress/constants";

import { TemperatureUnit, TimeUnit, VolumeUnit, WeightUnit } from "@common/units";
import { RBA_BUTTON_LABEL_EDIT } from "@views/shared/rba-button/labels";
import { DirectionPartType } from "@store/recipe/types";



describe("recipe_page", () => {

    describe("directions - read-only", () => {

        beforeEach(() => {
            cy.intercept(`${constants.CY_RECIPE_API_PATH}/29`, { fixture: "recipe.json" });

            cy.visit(`${constants.CY_RECIPE_PATH}/29`);
        });

        it("can switch temperature unit", () => {

            const STEP_NAME = "test step";

            cy.get(`[data-cy=${constants.CY_DIRECTION}] [data-cy=${constants.CY_DIRECTION_LINE_NAME_TEXT}]`)
                .contains(STEP_NAME.toUpperCase())
                .should("be.visible")
                .parents(`[data-cy=${constants.CY_DIRECTION}]`)
                .find(`[data-cy=${constants.CY_DIRECTION_LINE_TEMPERATURE_MEASURE}] [data-cy=${constants.CY_SELECT_INPUT}]`)
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

            cy.get(`[data-cy=${constants.CY_DIRECTION}] [data-cy=${constants.CY_DIRECTION_LINE_NAME_TEXT}]`)
                .contains(STEP_NAME.toUpperCase())
                .should("be.visible")
                .parents(`[data-cy=${constants.CY_DIRECTION}]`)
                .find(`[data-cy=${constants.CY_DIRECTION_LINE_DURATION_MEASURE}] [data-cy=${constants.CY_SELECT_INPUT}]`)
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

        it("can complete direction", () => {

            const STEP_NAME = "stir";

            const CHECKBOX_OFF = 0;
            const CHECKBOX_ON = 1;

            cy.get(`[data-cy=${constants.CY_DIRECTION}] [data-cy=${constants.CY_DIRECTION_LINE_NAME_TEXT}]`)
                .contains(STEP_NAME.toUpperCase())
                .should("be.visible")
                .parents(`[data-cy=${constants.CY_DIRECTION}]`)
                .find(`[data-cy=${constants.CY_DIRECTION_CHECKBOX}]`)
                .as("directionLineCheckbox")
                .should("be.visible")
                .children()
                .should("have.length", CHECKBOX_OFF);

            cy.get("@directionLineCheckbox")
                .click()
                .children()
                .should("have.length", CHECKBOX_ON);
        });

        it("can complete direction from children", () => {

            const STEP_NAME = "stir";

            const CHECKBOX_OFF = 0;
            const CHECKBOX_ON = 1;

            const SUB_DIRECTION_INGREDIENT_COUNT = 2;

            cy.get(`[data-cy=${constants.CY_DIRECTION}] [data-cy=${constants.CY_DIRECTION_LINE_NAME_TEXT}]`)
                .contains(STEP_NAME.toUpperCase())
                .should("be.visible")
                .parents(`[data-cy=${constants.CY_DIRECTION}]`)
                .as("directionLine")
                .find(`[data-cy=${constants.CY_DIRECTION_CHECKBOX}]`)
                .as("directionLineCheckbox")
                .should("be.visible")
                .children()
                .should("have.length", CHECKBOX_OFF);

            cy.get("@directionLine")
                .find(`[data-cy=${constants.CY_DIRECTION_PART_CHECKBOX}]`)
                .should("be.visible")
                .should("have.length", SUB_DIRECTION_INGREDIENT_COUNT)
                .each((checkbox) => cy.wrap(checkbox).click());

            cy.get("@directionLineCheckbox").children().should("have.length", CHECKBOX_ON);
        });

        it("can switch direction_part ingredient unit", () => {

            const INGREDIENT_NAME = "Sour Cream";

            cy.get(`[data-cy=${constants.CY_DIRECTION_PART}] [data-cy=${constants.CY_DIRECTION_PART_NAME}]`)
                .contains(INGREDIENT_NAME.toUpperCase())
                .should("be.visible")
                .parents(`[data-cy=${constants.CY_DIRECTION_PART}]`)
                .as("subDirectionLine")
                .find(`[data-cy=${constants.CY_SELECT_INPUT}]`)
                .contains(VolumeUnit.ml)
                .should("be.visible")
                .click();

            cy.get("@subDirectionLine")
                .find(`[data-cy=${constants.CY_SELECT_INPUT_OPTION}]`)
                .contains(WeightUnit.g)
                .should("be.visible")
                .click();

            cy.get("@subDirectionLine")
                .find(`[data-cy=${constants.CY_SELECT_INPUT}]`)
                .contains(WeightUnit.g)
                .should("be.visible");
        });
    });

    describe("directions - edit", () => {

        beforeEach(() => {
            cy.intercept(`${constants.CY_RECIPE_API_PATH}/29`, { fixture: "recipe.json" });

            cy.visit(`${constants.CY_RECIPE_PATH}/29`);
            cy.get(`[data-cy=${constants.CY_BUTTON}]`).contains(RBA_BUTTON_LABEL_EDIT).click();
        });

        it("can add direction", () => {

            const NEW_DIRECTION_NAME = "Some new action";

            const DIRECTION_COUNT_BEFORE = 2;
            const DIRECTION_COUNT_AFTER = 3;

            cy.get(`[data-cy=${constants.CY_DIRECTION}]`)
                .should("have.length", DIRECTION_COUNT_BEFORE);

            // STEP NUMBET & NAME

            cy.get(`[data-cy=${constants.CY_DIRECTION_LINE}]`).last()
                .should("be.visible")
                .as("newDirectionLine");

            cy.get("@newDirectionLine")
                .find(`[data-cy=${constants.CY_DIRECTION_LINE_STEP_INPUT}]`)
                .should("be.visible")
                .clear()
                .type("3");

            cy.get("@newDirectionLine")
                .find(`[data-cy=${constants.CY_DIRECTION_LINE_NAME_INPUT}]`)
                .should("be.visible")
                .type(NEW_DIRECTION_NAME);

            // TEMPERATURE

            cy.get("@newDirectionLine")
                .find(`[data-cy=${constants.CY_DIRECTION_LINE_TEMPERATURE_INPUT}]`)
                .should("be.visible")
                .type("400");

            cy.get("@newDirectionLine")
                .find(`[data-cy=${constants.CY_DIRECTION_LINE_TEMPERATURE_MEASURE}]`)
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

            cy.get("@newDirectionLine")
                .find(`[data-cy=${constants.CY_DIRECTION_LINE_DURATION_INPUT}]`)
                .should("be.visible")
                .type("25");

            cy.get("@newDirectionLine")
                .find(`[data-cy=${constants.CY_DIRECTION_LINE_DURATION_MEASURE}]`)
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

            // Create new direction

            cy.get("@newDirectionLine")
                .find(`[data-cy=${constants.CY_DIRECTION_BUTTON}]`)
                .should("be.visible")
                .click();

            cy.get(`[data-cy=${constants.CY_DIRECTION}]`)
                .should("have.length", DIRECTION_COUNT_AFTER);
        });

        it("can remove direction", () => {

            const DIRECTION_COUNT_BEFORE = 2;
            const DIRECTION_COUNT_AFTER = 1;

            cy.get(`[data-cy=${constants.CY_DIRECTION}]`)
                .should("have.length", DIRECTION_COUNT_BEFORE);

            cy.get(`[data-cy=${constants.CY_DIRECTION}] [data-cy=${constants.CY_DIRECTION_BUTTON}]`)
                .should("be.visible")
                .first()
                .click();

            cy.get(`[data-cy=${constants.CY_DIRECTION}]`)
                .should("have.length", DIRECTION_COUNT_AFTER);
        });

        it("can add direction_part - note - warning", () => {

            const STEP_NAME = "test step";

            const SUB_DIRECTION_COUNT_BEFORE = 0;
            const SUB_DIRECTION_COUNT_AFTER = 1;

            cy.get(`[data-cy=${constants.CY_DIRECTION_LINE_NAME_INPUT}][value="${STEP_NAME.toUpperCase()}"]`)
                .should("be.visible")
                .parents(`[data-cy=${constants.CY_DIRECTION}]`)
                .as("directionLine")
                .find(`[data-cy=${constants.CY_DIRECTION_PART}]`)
                .should("have.length", SUB_DIRECTION_COUNT_BEFORE);

            cy.get("@directionLine")
                .find(`[data-cy=${constants.CY_DIRECTION_PART_NEW}] [data-cy=${constants.CY_SELECT_INPUT}]`)
                .click();

            cy.get("@directionLine")
                .find(`[data-cy=${constants.CY_DIRECTION_PART_NEW}] [data-cy=${constants.CY_SELECT_INPUT_OPTION}]`)
                .contains(DirectionPartType.Warning)
                .click();

            cy.get("@directionLine")
                .find(`[data-cy=${constants.CY_DIRECTION_PART_NEW_CREATE_BUTTON}]`)
                .click();

            cy.get("@directionLine")
                .find(`[data-cy=${constants.CY_DIRECTION_PART}]`)
                .should("have.length", SUB_DIRECTION_COUNT_AFTER);
        });

        it("can add direction_part - ingredient", () => {

            const STEP_NAME = "test step";
            const INGREDIENT_NAME = "Sour Cream";

            const SUB_DIRECTION_COUNT_BEFORE = 0;
            const SUB_DIRECTION_COUNT_AFTER = 1;

            cy.get(`[data-cy=${constants.CY_DIRECTION_LINE_NAME_INPUT}][value="${STEP_NAME.toUpperCase()}"]`)
                .should("be.visible")
                .parents(`[data-cy=${constants.CY_DIRECTION}]`)
                .as("directionLine")
                .find(`[data-cy=${constants.CY_DIRECTION_PART}]`)
                .should("have.length", SUB_DIRECTION_COUNT_BEFORE);

            cy.get("@directionLine")
                .find(`[data-cy=${constants.CY_DIRECTION_PART_NEW}] [data-cy=${constants.CY_SELECT_INPUT}]`)
                .click();

            cy.get("@directionLine")
                .find(`[data-cy=${constants.CY_DIRECTION_PART_NEW}] [data-cy=${constants.CY_SELECT_INPUT_OPTION}]`)
                .contains(INGREDIENT_NAME.toUpperCase())
                .click();

            cy.get("@directionLine")
                .find(`[data-cy=${constants.CY_DIRECTION_PART_NEW_CREATE_BUTTON}]`)
                .click();

            cy.get("@directionLine")
                .find(`[data-cy=${constants.CY_DIRECTION_PART}]`)
                .should("have.length", SUB_DIRECTION_COUNT_AFTER);
        });

        it("can change order of direction_part", () => {

            const STEP_NAME = "stir";

            const FIRST_PART_COMMENT_TEXT = "Add Cottage Cheese first";
            const FIRST_PART_NEW_POSITION = "99";

            const SECOND_PART_INGREDIENT_NAME = "Sour Cream";

            const SUB_DIRECTION_COUNT_BEFORE = 3;
            const SUB_DIRECTION_COUNT_AFTER = 3;

            cy.get(`[data-cy=${constants.CY_DIRECTION_LINE_NAME_INPUT}][value="${STEP_NAME.toUpperCase()}"]`)
                .should("be.visible")
                .parents(`[data-cy=${constants.CY_DIRECTION}]`)
                .as("directionLine")
                .find(`[data-cy=${constants.CY_DIRECTION_PART}]`)
                .should("have.length", SUB_DIRECTION_COUNT_BEFORE);

            cy.get("@directionLine")
                .find(`[data-cy=${constants.CY_DIRECTION_PART}]`)
                .first()
                .as("directionPartComment")
                .find(`[data-cy=${constants.CY_DIRECTION_PART_COMMENT_INPUT}]`)
                .should("contain.value", FIRST_PART_COMMENT_TEXT);

            cy.get("@directionPartComment")
                .find(`[data-cy=${constants.CY_DIRECTION_LINE_STEP_INPUT}]`)
                .type(FIRST_PART_NEW_POSITION);

            cy.get("@directionLine")
                .find(`[data-cy=${constants.CY_DIRECTION_PART}]`)
                .first()
                .find(`[data-cy=${constants.CY_DIRECTION_PART_NAME}]`)
                .should("contain.text", SECOND_PART_INGREDIENT_NAME.toUpperCase());

            cy.get("@directionLine")
                .find(`[data-cy=${constants.CY_DIRECTION_PART}]`)
                .should("have.length", SUB_DIRECTION_COUNT_AFTER);
        });

        it("can remove direction_part", () => {

            const STEP_NAME = "stir";

            const SUB_DIRECTION_COUNT_BEFORE = 3;
            const SUB_DIRECTION_COUNT_AFTER = 2;

            cy.get(`[data-cy=${constants.CY_DIRECTION_LINE_NAME_INPUT}][value="${STEP_NAME.toUpperCase()}"]`)
                .should("be.visible")
                .parents(`[data-cy=${constants.CY_DIRECTION}]`)
                .as("directionLine")
                .find(`[data-cy=${constants.CY_DIRECTION_PART}]`)
                .should("have.length", SUB_DIRECTION_COUNT_BEFORE);

            cy.get("@directionLine")
                .find(`[data-cy=${constants.CY_DIRECTION_PART_REMOVE_BUTTON}]`)
                .first()
                .click();

            cy.get("@directionLine")
                .find(`[data-cy=${constants.CY_DIRECTION_PART}]`)
                .should("have.length", SUB_DIRECTION_COUNT_AFTER);
        });
    });
});
