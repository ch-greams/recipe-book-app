import {
    CY_DIRECTION_INFO_LINE_NAME_INPUT, CY_DIRECTION_INFO_LINE_NAME_TEXT, CY_DIRECTION_LINE,
    CY_DIRECTION_LINE_CHECKBOX, CY_DIRECTION_LINE_REMOVE_BUTTON, CY_FOOD_API_PATH,
    CY_NEW_DIRECTION_INFO_LINE_DURATION_INPUT, CY_NEW_DIRECTION_INFO_LINE_DURATION_MEASURE,
    CY_NEW_DIRECTION_INFO_LINE_NAME_INPUT, CY_NEW_DIRECTION_INFO_LINE_STEP_INPUT,
    CY_NEW_DIRECTION_INFO_LINE_TEMPERATURE_INPUT, CY_NEW_DIRECTION_INFO_LINE_TEMPERATURE_MEASURE,
    CY_NEW_DIRECTION_LINE, CY_NEW_DIRECTION_LINE_CREATE_BUTTON, CY_NEW_SUB_DIRECTION_LINE,
    CY_NEW_SUB_DIRECTION_LINE_CREATE_BUTTON, CY_RECIPE_API_PATH, CY_RECIPE_PATH, CY_SELECT_INPUT,
    CY_SELECT_INPUT_OPTION, CY_SUB_DIRECTION_LINE, CY_SUB_DIRECTION_LINE_CHECKBOX,
    CY_SUB_DIRECTION_LINE_REMOVE_BUTTON,
} from "cypress/constants";

import { TemperatureUnit, TimeUnit } from "@common/units";
import { SubDirectionType } from "@store/recipe/types";



describe("recipe_page", () => {

    describe("directions - read-only", () => {

        beforeEach(() => {
            cy.intercept(`${CY_RECIPE_API_PATH}/29`, { fixture: "recipe_item.json" });
            cy.intercept(`${CY_FOOD_API_PATH}`, { fixture: "food_items.json" });

            cy.visit(`${CY_RECIPE_PATH}/29`);
        });

        it("can switch temperature unit", () => {

            // TODO: This test is fragile, and will fail if direction has both temperature and duration (fix it as a part of RBA-47)

            const STEP_NAME = "test step";

            cy.get(`[data-cy=${CY_DIRECTION_LINE}] [data-cy=${CY_DIRECTION_INFO_LINE_NAME_TEXT}]`)
                .contains(STEP_NAME.toUpperCase())
                .should("be.visible")
                .parents(`[data-cy=${CY_DIRECTION_LINE}]`)
                .find(`[data-cy=${CY_SELECT_INPUT}]`)
                .as("temperatureSelect")
                .contains(TemperatureUnit.C)
                .should("be.visible");

            cy.get(`[data-cy=${CY_SELECT_INPUT_OPTION}]`).should("not.exist");

            cy.get("@temperatureSelect").click();

            cy.get("@temperatureSelect")
                .find(`[data-cy=${CY_SELECT_INPUT_OPTION}]`)
                .should("be.visible")
                .contains(TemperatureUnit.F)
                .click();

            cy.get(`[data-cy=${CY_SELECT_INPUT_OPTION}]`).should("not.exist");

            cy.get("@temperatureSelect")
                .contains(TemperatureUnit.F)
                .should("be.visible");
        });

        it("can switch duration unit", () => {
            // TODO: This test is fragile, and will fail if direction has both temperature and duration (fix it as a part of RBA-47)

            const STEP_NAME = "stir";

            cy.get(`[data-cy=${CY_DIRECTION_LINE}] [data-cy=${CY_DIRECTION_INFO_LINE_NAME_TEXT}]`)
                .contains(STEP_NAME.toUpperCase())
                .should("be.visible")
                .click()    // FIXME: Close direction as a bit of a hack until rework related to RBA-47 will be done
                .parents(`[data-cy=${CY_DIRECTION_LINE}]`)
                .find(`[data-cy=${CY_SELECT_INPUT}]`)
                .as("temperatureSelect")
                .contains(TimeUnit.min)
                .should("be.visible");

            cy.get(`[data-cy=${CY_SELECT_INPUT_OPTION}]`).should("not.exist");

            cy.get("@temperatureSelect").click();

            cy.get("@temperatureSelect")
                .find(`[data-cy=${CY_SELECT_INPUT_OPTION}]`)
                .should("be.visible")
                .contains(TimeUnit.h)
                .click();

            cy.get(`[data-cy=${CY_SELECT_INPUT_OPTION}]`).should("not.exist");

            cy.get("@temperatureSelect")
                .contains(TimeUnit.h)
                .should("be.visible");
        });

        it("can complete sub_direction", () => {

            const STEP_NAME = "stir";

            const CHECKBOX_OFF = 0;
            const CHECKBOX_ON = 1;

            cy.get(`[data-cy=${CY_DIRECTION_LINE}] [data-cy=${CY_DIRECTION_INFO_LINE_NAME_TEXT}]`)
                .contains(STEP_NAME.toUpperCase())
                .should("be.visible")
                .parents(`[data-cy=${CY_DIRECTION_LINE}]`)
                .find(`[data-cy=${CY_DIRECTION_LINE_CHECKBOX}]`)
                .as("directionLineCheckbox")
                .should("be.visible")
                .children()
                .should("have.length", CHECKBOX_OFF);

            cy.get("@directionLineCheckbox")
                .click()
                .children()
                .should("have.length", CHECKBOX_ON);
        });

        it("can complete sub_direction from children", () => {

            const STEP_NAME = "stir";

            const CHECKBOX_OFF = 0;
            const CHECKBOX_ON = 1;

            const SUB_DIRECTION_INGREDIENT_COUNT = 2;

            cy.get(`[data-cy=${CY_DIRECTION_LINE}] [data-cy=${CY_DIRECTION_INFO_LINE_NAME_TEXT}]`)
                .contains(STEP_NAME.toUpperCase())
                .should("be.visible")
                .parents(`[data-cy=${CY_DIRECTION_LINE}]`)
                .as("directionLine")
                .find(`[data-cy=${CY_DIRECTION_LINE_CHECKBOX}]`)
                .as("directionLineCheckbox")
                .should("be.visible")
                .children()
                .should("have.length", CHECKBOX_OFF);

            cy.get("@directionLine")
                .find(`[data-cy=${CY_SUB_DIRECTION_LINE_CHECKBOX}]`)
                .should("be.visible")
                .should("have.length", SUB_DIRECTION_INGREDIENT_COUNT)
                .each((checkbox) => cy.wrap(checkbox).click());

            cy.get("@directionLineCheckbox").children().should("have.length", CHECKBOX_ON);
        });
    });

    describe("directions - edit", () => {

        beforeEach(() => {
            cy.intercept(`${CY_RECIPE_API_PATH}/29`, { fixture: "recipe_item.json" });
            cy.intercept(`${CY_FOOD_API_PATH}`, { fixture: "food_items.json" });

            cy.visit(`${CY_RECIPE_PATH}/29?edit=true`);
        });

        it("can add direction", () => {

            const NEW_DIRECTION_NAME = "Some new action";

            const DIRECTION_COUNT_BEFORE = 2;
            const DIRECTION_COUNT_AFTER = 3;

            cy.get(`[data-cy=${CY_DIRECTION_LINE}]`)
                .should("have.length", DIRECTION_COUNT_BEFORE);

            // STEP NUMBET & NAME

            cy.get(`[data-cy=${CY_NEW_DIRECTION_LINE}] [data-cy=${CY_NEW_DIRECTION_INFO_LINE_STEP_INPUT}]`)
                .should("be.visible")
                .clear()
                .type("3");

            cy.get(`[data-cy=${CY_NEW_DIRECTION_LINE}] [data-cy=${CY_NEW_DIRECTION_INFO_LINE_NAME_INPUT}]`)
                .should("be.visible")
                .type(NEW_DIRECTION_NAME);

            // TEMPERATURE

            cy.get(`[data-cy=${CY_NEW_DIRECTION_LINE}] [data-cy=${CY_NEW_DIRECTION_INFO_LINE_TEMPERATURE_INPUT}]`)
                .should("be.visible")
                .type("400");

            cy.get(`[data-cy=${CY_NEW_DIRECTION_LINE}] [data-cy=${CY_NEW_DIRECTION_INFO_LINE_TEMPERATURE_MEASURE}]`)
                .as("temperatureMeasure")
                .find(`[data-cy=${CY_SELECT_INPUT}]`)
                .contains(TemperatureUnit.C)
                .should("be.visible")
                .click();

            cy.get("@temperatureMeasure")
                .find(`[data-cy=${CY_SELECT_INPUT_OPTION}]`)
                .contains(TemperatureUnit.F)
                .should("be.visible")
                .click();


            // DURATION

            cy.get(`[data-cy=${CY_NEW_DIRECTION_LINE}] [data-cy=${CY_NEW_DIRECTION_INFO_LINE_DURATION_INPUT}]`)
                .should("be.visible")
                .type("25");

            cy.get(`[data-cy=${CY_NEW_DIRECTION_LINE}] [data-cy=${CY_NEW_DIRECTION_INFO_LINE_DURATION_MEASURE}]`)
                .as("durationMeasure")
                .find(`[data-cy=${CY_SELECT_INPUT}]`)
                .contains(TimeUnit.min)
                .should("be.visible")
                .click();

            cy.get("@durationMeasure")
                .find(`[data-cy=${CY_SELECT_INPUT_OPTION}]`)
                .contains(TimeUnit.h)
                .should("be.visible")
                .click();

            // Create new direction

            cy.get(`[data-cy=${CY_NEW_DIRECTION_LINE_CREATE_BUTTON}]`)
                .should("be.visible")
                .click();

            cy.get(`[data-cy=${CY_DIRECTION_LINE}]`)
                .should("have.length", DIRECTION_COUNT_AFTER);
        });

        it("can remove direction", () => {

            const DIRECTION_COUNT_BEFORE = 2;
            const DIRECTION_COUNT_AFTER = 1;

            cy.get(`[data-cy=${CY_DIRECTION_LINE}]`)
                .should("have.length", DIRECTION_COUNT_BEFORE);

            cy.get(`[data-cy=${CY_DIRECTION_LINE}] [data-cy=${CY_DIRECTION_LINE_REMOVE_BUTTON}]`)
                .should("be.visible")
                .first()
                .click();

            cy.get(`[data-cy=${CY_DIRECTION_LINE}]`)
                .should("have.length", DIRECTION_COUNT_AFTER);
        });

        it("can add sub_direction - note - warning", () => {

            const STEP_NAME = "test step";

            const SUB_DIRECTION_COUNT_BEFORE = 0;
            const SUB_DIRECTION_COUNT_AFTER = 1;

            cy.get(`[data-cy=${CY_DIRECTION_INFO_LINE_NAME_INPUT}][value="${STEP_NAME.toUpperCase()}"]`)
                .should("be.visible")
                .parents(`[data-cy=${CY_DIRECTION_LINE}]`)
                .as("directionLine")
                .find(`[data-cy=${CY_SUB_DIRECTION_LINE}]`)
                .should("have.length", SUB_DIRECTION_COUNT_BEFORE);

            cy.get("@directionLine")
                .find(`[data-cy=${CY_NEW_SUB_DIRECTION_LINE}] [data-cy=${CY_SELECT_INPUT}]`)
                .click();

            cy.get("@directionLine")
                .find(`[data-cy=${CY_NEW_SUB_DIRECTION_LINE}] [data-cy=${CY_SELECT_INPUT_OPTION}]`)
                .contains(SubDirectionType.Warning)
                .click();

            cy.get("@directionLine")
                .find(`[data-cy=${CY_NEW_SUB_DIRECTION_LINE_CREATE_BUTTON}]`)
                .click();

            cy.get("@directionLine")
                .find(`[data-cy=${CY_SUB_DIRECTION_LINE}]`)
                .should("have.length", SUB_DIRECTION_COUNT_AFTER);
        });

        it("can add sub_direction - ingredient", () => {

            const STEP_NAME = "test step";
            const INGREDIENT_NAME = "Sour Cream";

            const SUB_DIRECTION_COUNT_BEFORE = 0;
            const SUB_DIRECTION_COUNT_AFTER = 1;

            cy.get(`[data-cy=${CY_DIRECTION_INFO_LINE_NAME_INPUT}][value="${STEP_NAME.toUpperCase()}"]`)
                .should("be.visible")
                .parents(`[data-cy=${CY_DIRECTION_LINE}]`)
                .as("directionLine")
                .find(`[data-cy=${CY_SUB_DIRECTION_LINE}]`)
                .should("have.length", SUB_DIRECTION_COUNT_BEFORE);

            cy.get("@directionLine")
                .find(`[data-cy=${CY_NEW_SUB_DIRECTION_LINE}] [data-cy=${CY_SELECT_INPUT}]`)
                .click();

            cy.get("@directionLine")
                .find(`[data-cy=${CY_NEW_SUB_DIRECTION_LINE}] [data-cy=${CY_SELECT_INPUT_OPTION}]`)
                .contains(INGREDIENT_NAME.toUpperCase())
                .click();

            cy.get("@directionLine")
                .find(`[data-cy=${CY_NEW_SUB_DIRECTION_LINE_CREATE_BUTTON}]`)
                .click();

            cy.get("@directionLine")
                .find(`[data-cy=${CY_SUB_DIRECTION_LINE}]`)
                .should("have.length", SUB_DIRECTION_COUNT_AFTER);
        });

        it("can remove sub_direction", () => {

            const STEP_NAME = "stir";

            const SUB_DIRECTION_COUNT_BEFORE = 3;
            const SUB_DIRECTION_COUNT_AFTER = 2;

            cy.get(`[data-cy=${CY_DIRECTION_INFO_LINE_NAME_INPUT}][value="${STEP_NAME.toUpperCase()}"]`)
                .should("be.visible")
                .parents(`[data-cy=${CY_DIRECTION_LINE}]`)
                .as("directionLine")
                .find(`[data-cy=${CY_SUB_DIRECTION_LINE}]`)
                .should("have.length", SUB_DIRECTION_COUNT_BEFORE);

            cy.get("@directionLine")
                .find(`[data-cy=${CY_SUB_DIRECTION_LINE_REMOVE_BUTTON}]`)
                .first()
                .click();

            cy.get("@directionLine")
                .find(`[data-cy=${CY_SUB_DIRECTION_LINE}]`)
                .should("have.length", SUB_DIRECTION_COUNT_AFTER);
        });
    });
});
